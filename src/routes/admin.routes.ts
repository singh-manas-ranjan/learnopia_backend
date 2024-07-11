import { Router } from "express";
import {
  deleteAdmin,
  getAdmin,
  getAdminList,
  loginAdmin,
  registerAdmin,
  updateAdmin,
} from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.route("/register").post(registerAdmin);
adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/").get(getAdminList);
adminRouter.route("/:id").get(getAdmin);
adminRouter.route("/:id").put(updateAdmin);
adminRouter.route("/:id").delete(deleteAdmin);

export { adminRouter };
