import z from "zod";
export const vCreateUser = z.object({
    first_name: z.string({ required_error: "Name is required", invalid_type_error: "First Name must be a string", }).min(3, { message: "first_name must be 3 or more characters" }),
    last_name: z.string({ invalid_type_error: "Last Name must be a string" }).min(3, { message: "first_name must be 3 or more characters" }).optional(),
    email: z.string({ required_error: "email is required", invalid_type_error: "email must be a string", }).email({ message: "Invalid email address" }),
    phone: z.string({ invalid_type_error: "phone number must be a string" }).min(10).max(15).optional(),
    dob: z.string({ required_error: "dob is required", invalid_type_error: "dob must be a string", }).transform(val => new Date(val)),
    doj: z.string({ required_error: "doj is required", invalid_type_error: "doj must be a string", }).transform(val => new Date(val)),
    designation: z.string({ required_error: "designation is required", invalid_type_error: "designation must be a string", }).min(3, { message: "designation must be 3 or more characters" }),
    profile_picture_url: z.string().url().optional(),
});
export const vUpdateUserProfilePicture = z.object({
    profile_picture_url: z.string().url({ message: "Invalid URL format" }),
});
