import { Request, Response } from "express";
import Student, { TStudent } from "../models/student.models";

const registerStudent = async (req: Request, res: Response) => {
  const body: TStudent = req.body;
  try {
    const newStudent = await Student.create(body);
    res.status(201).json({
      success: true,
      message: "Student Created Successfully",
      body: newStudent,
    });
  } catch (error) {
    console.log(`ERROR!! registerStudent: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const studentLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const student = await Student.findOne(
      { username, password },
      { username: 0, password: 0 }
    ).exec();
    if (!student) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    res.status(200).json({
      success: true,
      message: "Student Logged In Successfully",
      body: student,
    });
  } catch (error) {
    console.log(`ERROR!! studentLogin: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const student = await Student.findById(id).exec();
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Student Found Successfully",
      body: student,
    });
  } catch (error) {
    console.log(`ERROR!! getStudent: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getStudentList = async (req: Request, res: Response) => {
  try {
    const students = await Student.find({}).exec();
    if (students.length > 0) {
      res.status(200).json({
        success: true,
        message: "Students found successfully",
        body: students,
      });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Students Not Found", body: students });
    }
  } catch (error) {
    console.log(`ERROR !! getStudentList ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const updateStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const updatedStudent = await Student.updateOne({ _id: id }, body, {
      runValidators: true,
    }).exec();
    res.status(200).json({
      success: true,
      message: "Student Updated Successfully",
      body: updatedStudent,
    });
  } catch (error) {
    console.log(`ERROR !! updateStudent: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const deleteStudent = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await Student.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Student Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
    });
  } catch (error) {
    console.log(`ERROR !! deleteStudent: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  registerStudent,
  studentLogin,
  getStudent,
  getStudentList,
  updateStudent,
  deleteStudent,
};
