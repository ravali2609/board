import factory from "../factory.js";
import { createUserHandlers, deleteUserByIdHandlers, getAllUsersHandlers, getUserByIdHandlers, updateUserByIdHandlers, } from "../handlers/user-handler.js";

const userRoutes = factory.createApp();

userRoutes.post("/users", ...createUserHandlers);
userRoutes.get("/users", ...getAllUsersHandlers);
userRoutes.get("/users/:user_id", ...getUserByIdHandlers);
userRoutes.delete("/users/:user_id", ... deleteUserByIdHandlers);
userRoutes.put("/users/:user_id", ...updateUserByIdHandlers)

export default userRoutes;
