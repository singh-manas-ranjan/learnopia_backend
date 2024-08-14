import { Router } from "express";
import {
  registerAdmin,
  getAdmin,
  getAdminList,
  adminLogin,
  updateAdmin,
  logout,
} from "../controllers/admin.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const adminRouter = Router();

adminRouter.route("/auth/register").post(registerAdmin);
adminRouter.route("/login").post(adminLogin);
adminRouter.route("/").get(getAdminList);
adminRouter.route("/:id").get(getAdmin);
adminRouter.route("/:id").put(updateAdmin);

adminRouter.route("/logout").post(verifyJWT, logout);

export { adminRouter };
