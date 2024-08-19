import { Router } from "express";
import { getStudentById } from "../controllers/student.controller";
import { verifyAdminOnly } from "../middlewares/auth.middleware";
import { getInstructorById } from "../controllers/instructor.controller";

export const adminAccessRouter = Router();

adminAccessRouter.route("/students/:id").get(verifyAdminOnly, getStudentById);
adminAccessRouter
  .route("/instructors/:id")
  .get(verifyAdminOnly, getInstructorById);
