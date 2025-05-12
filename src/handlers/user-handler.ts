import { z, ZodError, type ZodIssue } from "zod";
import { USER_CREATED, USER_DELETEED, USER_FETCHED, USER_FOUND, USER_ID_REQUIRED, USER_NOT_FOUND } from "../constants/app-messages.js";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http-status-codes.js";
import { users, type NewUser, type User, type UsersTable } from "../database/schemas/users.js";
import factory from "../factory.js";
import { deleteUserById, getAllUsers, getUserById, updateUserById, } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";
import { saverecord } from "../service/baseservices.js";
import { eq } from "drizzle-orm";
import db from "../database/db.js";

export const createUserHandlers = factory.createHandlers(async (c) => {
    try {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);  
     const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validUserReq.email));
      if (existingUser.length > 0) {
      throw new ZodError([
        {
          path: ["email"],
          message: "Email already exists",
        } as ZodIssue,
      ]);
    }

    const userData: NewUser = {
      ...validUserReq,
    }
    const user = await saverecord(users , userData);
    return sendResponse(c, CREATED, USER_CREATED, user);
    } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        400
      );
    }

    console.error("Unexpected error:", error);
      return c.json({msg:error},NOT_FOUND);
      
    }
  },
);

export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }
    const user = await getUserById(userId);
    return sendResponse(c, OK, USER_FETCHED, user);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
  

});


//get all users
export const getAllUsersHandlers = factory.createHandlers(async (c) => {
  try {
    const { result, totalCount}= await getAllUsers();
    return sendResponse(c, OK, USER_FOUND, {totalUsers : totalCount, users: result});
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }
});




//delete user by id
export const deleteUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param('user_id'));
    const deletedUser = await deleteUserById(userId);
    return sendResponse(c, OK, USER_DELETEED, deletedUser);
  } catch (error) {
    return sendResponse(c, INTERNAL_SERVER_ERROR, USER_NOT_FOUND);
  }

});
  
export const updateUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const userId = Number(c.req.param("user_id"));
    const reqBody = await c.req.json();
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    }

     
    const validUserReq= vCreateUser.parse(reqBody) as NewUser;

    const updatedUser = await updateUserById(userId, validUserReq);

    if (!updatedUser) {
      return sendResponse(c, NOT_FOUND, USER_NOT_FOUND);
    }

    return sendResponse(c, OK, "User updated successfully", updatedUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json(
        {
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        BAD_REQUEST
      );
    }

    console.error("Update error:", error);
    return sendResponse(c, INTERNAL_SERVER_ERROR, "Failed to update user");
  }
});
