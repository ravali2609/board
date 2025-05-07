import factory from "../factory.js";
import { createUserHandlers } from "../handlers/user-handler.js";


const userRoutes = factory.createApp();

userRoutes.post("/",...createUserHandlers);


export default userRoutes;
