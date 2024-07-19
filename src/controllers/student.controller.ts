import { Request, Response } from "express";
import Student, { TStudent } from "../models/student.models";

const registerStudent = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password, phone }: TStudent =
    req.body;
  if (
    [firstName, lastName, email, username, password, phone].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const isStudentExists = await Student.findOne({
    $or: [{ username }, { email }, { phone }],
  }).exec();

  if (isStudentExists) {
    return res
      .status(409)
      .json({ success: false, message: "Student already exists" });
  }

  try {
    const createdStudent = await Student.create({
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
    });
    const resBody = await Student.findById(createdStudent._id).select(
      "-password"
    );

    if (!resBody) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while registering student",
      });
    }

    res.status(201).json({
      success: true,
      message: "Student Created Successfully",
      body: resBody,
    });
  } catch (error) {
    console.log(`ERROR!! registerStudent: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const studentLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const student = await Student.findOne({ username }).exec();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student does not exists" });
    }

    const isPasswordCorrect = await student.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const resBody = await Student.findById(student._id);

    res.status(200).json({
      success: true,
      message: "Student Logged In Successfully",
      body: resBody,
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

const getStudentProfile = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const student = await Student.find(
      { _id: id },
      {
        createdAt: 0,
        updatedAt: 0,
        enrolledCourses: 0,
        password: 0,
      }
    ).exec();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student Not Found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Student Profile", body: student });
  } catch (error) {
    console.log(`ERROR !! getStudentProfile: ${error} `);
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
  getStudentProfile,
};
