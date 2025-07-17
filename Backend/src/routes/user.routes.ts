// routes/user.routes.ts
import { Router } from "express";
import { upload } from "../middlewares/multer.middlewares";
import {
  changeUserPassword,
  loginUser,
  logOutUser,
  registerUser,
  updateAccountDetails,
  changeUserProfile,
  deleteUser,
  getUser,
} from "../controllers/users.controller";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

router.route("/register").post(upload.single("profile"), registerUser);
router.route("/login").post(loginUser);

// // Secured Routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/change-password").patch(verifyJWT, changeUserPassword);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/changeprofile")
  .patch(upload.single("profile"), verifyJWT, changeUserProfile);
router.route("/delete").delete(verifyJWT, deleteUser);
router.route("/getuser").get(verifyJWT, getUser);

export default router;
