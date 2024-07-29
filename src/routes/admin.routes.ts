import { Router } from "express";
import {
  registerAdmin,
  getAdmin,
  getAdminList,
  adminLogin,
  updateAdmin,
} from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.route("/auth/register").post(registerAdmin);
adminRouter.route("/login").post(adminLogin);
adminRouter.route("/").get(getAdminList);
adminRouter.route("/:id").get(getAdmin);
adminRouter.route("/:id").put(updateAdmin);

export { adminRouter };
