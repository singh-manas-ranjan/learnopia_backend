import { Router } from "express";
import {
  getAdmin,
  getAdminList,
  adminLogin,
  updateAdmin,
} from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.route("/login").post(adminLogin);
adminRouter.route("/").get(getAdminList);
adminRouter.route("/:id").get(getAdmin);
adminRouter.route("/:id").put(updateAdmin);

export { adminRouter };
