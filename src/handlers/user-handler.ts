import { OK } from "zod";
import { USER_CREATED, USER_FOUND, USER_ID_REQUIRED } from "../constants copy/app-messages.js";
import { BAD_REQUEST, CREATED } from "../constants/http-status-codes.js";
import factory from "../factory.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";
import { createUser } from "../service/user-service.js";



export const createUserHandlers = factory.createHandlers(async (c) => {
   
    const reqBody = await c.req.json();

    const validUserReq = vCreateUser.parse(reqBody);
   
    const user = await createUser(validUserReq);

    return sendResponse(c, CREATED, USER_CREATED, user);
  },
);

