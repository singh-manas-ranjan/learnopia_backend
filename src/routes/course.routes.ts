import express, { Router, Request, Response, NextFunction } from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourseList,
  updateCourse,
} from "../controllers/course.controller";

const courseRouter: Router = express.Router();

courseRouter.route("/create").post(createCourse);
courseRouter.route("/").get(getCourseList);
courseRouter.route("/:id").get(getCourse);
courseRouter.route("/:id").put(updateCourse);
courseRouter.route("/:id").delete(deleteCourse);

export { courseRouter };
