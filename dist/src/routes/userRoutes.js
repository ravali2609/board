import factory from "../factory.js";
import { createUserHandlers, uploadProfilePictureHandler, updateProfilePictureUrlHandler } from "../handlers/user-handler.js";
const userRoutes = factory.createApp();
// Create user
userRoutes.post('/users', ...createUserHandlers);
// Upload profile picture (file upload)
userRoutes.post('/users/:id/upload-profile-picture', ...uploadProfilePictureHandler);
// Update profile picture URL (JSON)
userRoutes.patch('/users/:id/profile-picture', ...updateProfilePictureUrlHandler);
export default userRoutes;
