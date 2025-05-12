import db from "../database/db.js";
import { users, type NewUser, type UsersTable } from "../database/schemas/users.js";
import { getRecordById , getAllRecords, deleteRecordById, updateRecordById} from "./baseservices.js";
//save user 
export async function createUser(userData: NewUser) {
  const user = await db.insert(users).values(userData).returning();
  return user[0];
}
//get user by id
  export const getUserById = async (userId: number) => {
    return await getRecordById(users, userId);
  };
  //get all users 
export const getAllUsers = async () => {
  return await getAllRecords(users);
}

//delete user by id
export const deleteUserById = async (userId: number) => {
  return await deleteRecordById(users, userId);
};

//update user
  export const updateUserById = async (userId: number,data:NewUser) => {
  return await updateRecordById(users, userId,data);
};