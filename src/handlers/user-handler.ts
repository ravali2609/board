import { USER_CREATED, USER_NOT_FOUND } from "../constants copy/app-messages.js";
import { CREATED, NOT_FOUND } from "../constants/http-status-codes.js";
import factory from "../factory.js";
import { createUser } from "../service/user-service.js";
import { sendResponse } from "../utils/send-response.js";
import { vCreateUser } from "../validations/user-validations.js";



export const createUserHandlers = factory.createHandlers(async (c) => {

   console.log("inside save method");
   
    try {

    const reqBody = await c.req.json();

    
    
    const validUserReq = vCreateUser.parse(reqBody);
    console.log("validated data: ",validUserReq);
    const user = await createUser(validUserReq);

    return sendResponse(c, CREATED, USER_CREATED, user);

    } catch (error) {

      return c.json({msg:error},NOT_FOUND);
      
    }
  },
);



 
  
