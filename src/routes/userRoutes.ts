import factory from "../factory.js";
import { createUserHandlers } from "../handlers/user-handler.js";


const userRoutes = factory.createApp();

userRoutes.post('/users',...createUserHandlers);



export default userRoutes;
