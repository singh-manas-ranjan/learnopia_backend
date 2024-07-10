import express, { Router, Request, Response, NextFunction } from "express";
import Course, { TCourse } from "../models/courses/course.modules";

const router: Router = express.Router();

router.post(
  "/courses",
  async (req: Request, res: Response, next: NextFunction) => {
    const body: TCourse = req.body;
    try {
      const newCourse = new Course(body);
      const savedCourse = await newCourse.save();
      res.status(201).json(savedCourse);
    } catch (error) {
      console.log(error);

      res.status(200).json({ message: "No Courses Available" });
    }
  }
);

router.get("/courses", async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({}).exec();
    res.status(200).json(courses);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad Request" });
  }
});

router.get("/courses/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const course = await Course.find({ _id: id }).exec();
    res.status(200).json(course);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Invalid Course Id" });
  }
});

router.delete("/courses/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await Course.deleteOne({ _id: id }).exec();
    res.status(200).json({ message: "Course Deleted" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Invalid Course Id" });
  }
});

router.patch("/courses/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const body: TCourse = req.body;
  try {
    const course = await Course.updateOne(
      { _id: id },
      { $set: body },
      {
        runValidators: true,
      }
    ).exec();
    res.status(200).json(course);
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Invalid Course Id" });
  }
});

export default router;
