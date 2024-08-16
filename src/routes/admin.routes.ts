import { Router } from "express";
import {
  registerAdmin,
  getAdmin,
  getAdminList,
  adminLogin,
  updateAdmin,
  logout,
  updatePassword,
  refreshAccessToken,
} from "../controllers/admin.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const adminRouter = Router();

adminRouter.route("/auth/register").post(registerAdmin);
adminRouter.route("/login").post(adminLogin);
adminRouter.route("/").get(getAdminList);
adminRouter.route("/:id").get(getAdmin);
adminRouter.route("/:id").put(updateAdmin);

adminRouter.route("refresh-token").post(refreshAccessToken);

adminRouter.route("/logout").post(verifyJWT, logout);
adminRouter.route("/password").post(verifyJWT, updatePassword);

export { adminRouter };
