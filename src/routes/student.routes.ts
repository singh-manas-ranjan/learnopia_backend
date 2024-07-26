import express, { Router } from "express";
import {
  registerStudent,
  deleteStudent,
  getStudentEnrolledCourses,
  getStudentList,
  updateStudent,
  studentLogin,
  getStudentProfile,
  enrollCourses,
  updateAvatar,
} from "../controllers/student.controller";
import { upload } from "../middlewares/multer.middleware";

const studentRouter: Router = express.Router();

studentRouter.route("/register").post(registerStudent);
studentRouter.route("/login").post(studentLogin);
studentRouter.route("/").get(getStudentList);
studentRouter.route("/courses/:id").get(getStudentEnrolledCourses);
studentRouter.route("/courses/:id").patch(enrollCourses);
studentRouter.route("/profile/:id").get(getStudentProfile);
studentRouter.route("/avatar/:id").patch(upload.single("avatar"), updateAvatar);
studentRouter.route("/:id").put(updateStudent);
studentRouter.route("/:id").delete(deleteStudent);

export { studentRouter };
