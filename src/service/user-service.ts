import type { NewUser, UsersTable } from "../database/schemas/users.js";

import { DB_RECORD_NOT_FOUND } from "../constants/app-messages.js";
import { users } from "../database/schemas/users.js";
import NotFoundException from "../exceptions/not-found-exception.js";
import { getAllRecords, getRecordByPrimaryKey, saveRecord, updateRecordById } from "../service/baseservices.js";

const columnsToSelect = ["id", "first_name", "last_name", "email", "dob", "doj", "phone", "designation", "is_active", "created_at", "updated_at"] as const;

export async function createUser(userData: NewUser) {
  console.log(userData);

  const user = await saveRecord<UsersTable>(users, userData);
  console.log(user);
  return user;
}

export async function getUserById(id: number) {
  const user = await getRecordByPrimaryKey<UsersTable, typeof columnsToSelect[number]>(users, id, columnsToSelect);
  console.log(user);
  if (!user) {
    throw new NotFoundException(DB_RECORD_NOT_FOUND);
  }
  return user;
}
export async function getAllUsers(limit?: number, offset?: number) {
  const allUsers = await getAllRecords<UsersTable, typeof columnsToSelect[number]>(users, columnsToSelect, limit, offset);
  return allUsers;
}

export async function updateUserById(id: number, updateData: Partial<NewUser>) {
  const updatedUser = await updateRecordById<UsersTable>(users, id, { ...updateData, updated_at: new Date() });

  if (!updatedUser) {
    throw new NotFoundException(DB_RECORD_NOT_FOUND);
  }

  return updatedUser;
}
