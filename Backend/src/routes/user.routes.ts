// routes/user.routes.ts
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares";
import {
  changeUserPassword,
  loginUser,
  logOutUser,
  registerUser,
  getCurrentUser,
  updateAccountDetails,
  changeUserProfile,
  deleteUser,
} from "../controllers/users.controller";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

router.route("/register").post(upload.single("profile"), registerUser);
router.route("/login").post(loginUser);

// Secured Routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/change-password").post(verifyJWT, changeUserPassword);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/changeprofile")
  .patch(upload.single("profile"), verifyJWT, changeUserProfile);
router.route("/delete").delete(verifyJWT, deleteUser);

export default router;
