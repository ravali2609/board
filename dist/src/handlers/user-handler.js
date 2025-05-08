import { USER_CREATED } from "../constants copy/app-messages.js";
import { CREATED } from "../constants/http-status-codes.js";
import factory from "../factory.js";
import { createUser } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";
export const createUserHandlers = factory.createHandlers(async (c) => {
    const reqBody = await c.req.json();
    const validUserReq = vCreateUser.parse(reqBody);
    const user = await createUser(validUserReq);
    return sendResponse(c, CREATED, USER_CREATED, user);
});
