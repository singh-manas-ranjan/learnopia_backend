import express, { Router, Request, Response, NextFunction } from "express";
import {
  registerStudent,
  deleteStudent,
  getStudent,
  getStudentList,
  updateStudent,
  studentLogin,
  getStudentProfile,
} from "../controllers/student.controller";

const studentRouter: Router = express.Router();

studentRouter.route("/register").post(registerStudent);
studentRouter.route("/login").post(studentLogin);
studentRouter.route("/").get(getStudentList);
studentRouter.route("/:id").get(getStudent);
studentRouter.route("/profile/:id").get(getStudentProfile);
studentRouter.route("/:id").put(updateStudent);
studentRouter.route("/:id").delete(deleteStudent);

export { studentRouter };
