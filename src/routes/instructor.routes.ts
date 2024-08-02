import express, { Router } from "express";
import {
  registerInstructor,
  instructorLogin,
  getInstructorsList,
  deleteInstructor,
  getInstructorProfile,
  getPublishedCourses,
  updateAvatar,
  updateInstructor,
} from "../controllers/instructor.controller";

import { upload } from "../middlewares/multer.middleware";

const instructorRouter: Router = express.Router();

instructorRouter.post("/register", registerInstructor);
instructorRouter.post("/login", instructorLogin);
instructorRouter.route("/").get(getInstructorsList);
instructorRouter.route("/:id").delete(deleteInstructor);
instructorRouter.route("/profile/:id").get(getInstructorProfile);
instructorRouter.route("/courses").get(getPublishedCourses);
instructorRouter.route("/:id").patch(updateInstructor);
instructorRouter
  .route("/avatar/:id")
  .get(upload.single("avatar"), updateAvatar);

export { instructorRouter };
