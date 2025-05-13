import { sql } from "drizzle-orm";
import { ZodError } from "zod";

import type { NewUser } from "../database/schemas/users.js";

import { USER_CREATED, USER_FOUND, USER_ID_REQUIRED } from "../constants/app-messages.js";
import { BAD_REQUEST, CREATED, OK } from "../constants/http-status-codes.js";
import db from "../database/db.js";
import { users } from "../database/schemas/users.js";
import factory from "../factory.js";
import { createUser, getAllUsers, getUserById, updateUserById } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";

export const createUserHandlers = factory.createHandlers(
  async (c) => {
    try {
      const reqBody = await c.req.json();
      const validUserReq = vCreateUser.parse(reqBody);
      const userData: NewUser = {
        ...validUserReq,
      };
      const user = await createUser(userData);
      console.log(user, "user controller");

      return sendResponse(c, CREATED, USER_CREATED, user);
    }
    catch (error) {
      if (error instanceof ZodError) {
        return sendResponse(c, 400, "validation failed", error.errors);
      }
      console.error(error);
      return sendResponse(c, 500, "Internal Server Error");
    }
  },
);

export const getUserByIdHandlers = factory.createHandlers(
  async (c) => {
    const userId = c.req.param("user_id");
    console.log(userId, "user_id");
    if (!userId) {
      return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
    };
    const user = await getUserById(+userId);
    return sendResponse(c, OK, USER_FOUND, user);
  },
);
export const getAllUsersHandlers = factory.createHandlers(
  async (c) => {
    const query = c.req.query();
    const pageSize = query.limit ? Number.parseInt(query.limit) : 10;
    const page = query.page ? Number.parseInt(query.page) : 1;
    const offset = (page - 1) * pageSize;

    // Fetch paginated users
    const usersData = await getAllUsers(pageSize, offset);

    // Get total user count using PostgreSQL
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const totalItems = Number(totalCountResult[0]?.count || 0);
    const totalPages = Math.ceil(totalItems / pageSize);

    // Calculate next and previous page
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return sendResponse(c, OK, USER_FOUND, { data: usersData, pagination: { totalItems, totalPages, page, pageSize, prevPage ,nextPage} });
  },
);

export const updateUserByIdHandler = factory.createHandlers(
  async (c) => {
    try {
      const userId = c.req.param("user_id");

      if (!userId) {
        return sendResponse(c, BAD_REQUEST, USER_ID_REQUIRED);
      }

      const reqBody = await c.req.json();
      const validUpdateData = vCreateUser.partial().parse(reqBody);
      const updatedData = {
        ...validUpdateData,
        updated_at: new Date(),
      };

      const updatedUser = await updateUserById(+userId, updatedData);

      return sendResponse(c, OK, USER_FOUND, updatedUser);
    }
    catch (error) {
      if (error instanceof ZodError) {
        return sendResponse(c, 400, "validation failed", error.errors);
      }
      console.error(error);
      return sendResponse(c, 500, "Internal Server Error");
    }
  },
);
