import { USER_CREATED } from "../constants copy/app-messages.js";
import { CREATED, NOT_FOUND, OK, BAD_REQUEST } from "../constants/http-status-codes.js";
import { type NewUser, type User, users } from "../database/schemas/users.js";
import factory from "../factory.js";
import { saverecord, updateRecord, findRecordById } from "../service/baseservices.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser, vUpdateUserProfilePicture } from "../validations/user-validations.js";
import { eq } from "drizzle-orm";

export const createUserHandlers = factory.createHandlers(async (c) => {
    try {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);  
    console.log("validated data: ",validUserReq);
    const userData: NewUser = {
      ...validUserReq,
    }
    const user = await saverecord<User>(users , userData);
    return sendResponse(c, CREATED, USER_CREATED, user);
    } catch (error) {
      return c.json({msg:error},NOT_FOUND);
    }
  },
);

export const uploadProfilePictureHandler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.param('id');
    
    if (!userId) {
      return c.json({ message: "User ID is required" }, BAD_REQUEST);
    }

    // Check if user exists
    const existingUser = await findRecordById(users, parseInt(userId));
    if (!existingUser) {
      return c.json({ message: "User not found" }, NOT_FOUND);
    }

    const body = await c.req.parseBody();
    const file = body['profile_picture'] as File;
    
    if (!file) {
      return c.json({ message: "No file uploaded" }, BAD_REQUEST);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ 
        message: "Invalid file type. Only JPEG, PNG, and GIF are allowed" 
      }, BAD_REQUEST);
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({ 
        message: "File size too large. Maximum size is 5MB" 
      }, BAD_REQUEST);
    }

    // In a real application, you would upload to a cloud storage service
    // For now, we'll simulate by creating a URL
    const fileName = `profile_${userId}_${Date.now()}_${file.name}`;
    const profilePictureUrl = `https://your-storage-service.com/uploads/${fileName}`;

    // Update user with profile picture URL
    const updatedUser = await updateRecord(
      users, 
      { profile_picture_url: profilePictureUrl, updated_at: new Date() },
      eq(users.id, parseInt(userId))
    );

    return sendResponse(c, OK, "Profile picture uploaded successfully", updatedUser[0]);
    
  } catch (error) {
    console.error("Upload error:", error);
    return c.json({ message: "Failed to upload profile picture", error }, 500);
  }
});

export const updateProfilePictureUrlHandler = factory.createHandlers(async (c) => {
  try {
    const userId = c.req.param('id');
    
    if (!userId) {
      return c.json({ message: "User ID is required" }, BAD_REQUEST);
    }

    // Check if user exists
    const existingUser = await findRecordById(users, parseInt(userId));
    if (!existingUser) {
      return c.json({ message: "User not found" }, NOT_FOUND);
    }

    const reqBody = await c.req.json();
    const validatedData = vUpdateUserProfilePicture.parse(reqBody);

    // Update user with new profile picture URL
    const updatedUser = await updateRecord(
      users,
      { 
        profile_picture_url: validatedData.profile_picture_url,
        updated_at: new Date()
      },
      eq(users.id, parseInt(userId))
    );

    return sendResponse(c, OK, "Profile picture URL updated successfully", updatedUser[0]);
    
  } catch (error) {
    console.error("Update error:", error);
    return c.json({ message: "Failed to update profile picture URL", error }, BAD_REQUEST);
  }
});