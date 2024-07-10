import express, { Request, Response, NextFunction, Router } from "express";
import Student, { TStudent } from "../models/students/student.models";

const router: Router = express.Router();

//============= POST - Create new student =============
router.post("/students", async (req: Request, res: Response) => {
  const body: TStudent = req.body;
  const student = new Student(body);
  try {
    const savedStudent = await student.save();
    res
      .status(201)
      .json({ message: "Student Created Successfully", body: savedStudent });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Bad Request" });
  }
});

//============= GET - Get all students =============
router.get("/students", async (req: Request, res: Response) => {
  try {
    const students = await Student.find({}).exec();
    res.status(200).json(students);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Bad Request" });
  }
});

//============= GET - Get student by _id =============
router.get(
  "/students/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const student = await Student.find(
        { _id: id },
        { username: 0, password: 0 }
      )
        .populate("enrolledCourses")
        .exec();
      res.status(200).json(student);
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "Student not found." });
    }
  }
);

//============= PATCH - Update student avatar =============

router.patch(
  "/students/:id/profile/avatar",
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const body = req.body;
    try {
      await Student.updateOne(
        { _id: id },
        { $set: body },
        { runValidators: true }
      ).exec();
      res.status(200).json({ message: "Student Updated Successfully" });
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: "No User Found!" });
    }
  }
);

export default router;
