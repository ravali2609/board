import factory from "../factory.js";
import { createUserHandlers, getAllUsersHandlers, getUserByIdHandlers, updateUserByIdHandler } from "../handlers/user-handler.js";

const userRoutes = factory.createApp();

userRoutes.post("/users", ...createUserHandlers);
userRoutes.get("/users", ...getAllUsersHandlers);
userRoutes.get("/users/:user_id", ...getUserByIdHandlers);
userRoutes.delete("/users/:user_id", ...getUserByIdHandlers);
userRoutes.patch("/users/:user_id", ...updateUserByIdHandler);

export default userRoutes;
