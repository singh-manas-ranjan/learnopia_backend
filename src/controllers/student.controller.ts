import { CookieOptions, Request, Response } from "express";
import Student, { TStudent } from "../models/student.models";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { generateAccessAndRefreshToken } from "../utils/TokenCreation";

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
      "-password -refreshToken"
    );

    if (!resBody) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while registering student",
      });
    }

    res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
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

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      student?._id as string,
      "student"
    );
    const resBody = await Student.findById(
      student._id,
      "-password -username -refreshToken"
    );

    const cookiesOptions: CookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };

    return res
      .status(200)
      .cookie("accessToken", access_token, cookiesOptions)
      .cookie("refreshToken", refresh_token, cookiesOptions)
      .json({
        success: true,
        message: "Student Logged In Successfully",
        body: resBody,
        tokens: { access_token, refresh_token },
      });
  } catch (error) {
    console.log(`ERROR!! studentLogin: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      const { _id } = req.user;
      await Student.findByIdAndUpdate(
        _id,
        {
          $set: {
            refreshToken: "",
          },
        },
        {
          new: true,
        }
      );

      const cookiesOptions = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .clearCookie("accessToken", cookiesOptions)
        .clearCookie("refreshToken", cookiesOptions)
        .json({ success: true, message: "Logged Out Successfully" });
    }
  } catch (error) {
    console.error(`ERROR!! logout: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getStudentEnrolledCourses = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const student = await Student.findById(id, "enrolledCourses -_id")
      .populate("enrolledCourses")
      .exec();

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student does not exists" });
    }
    res.status(200).json({ success: true, body: student.enrolledCourses });
  } catch (error) {
    console.log(`ERROR!! getStudentEnrolledCourses: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getStudentList = async (req: Request, res: Response) => {
  try {
    const students = await Student.find()
      .populate({
        path: "enrolledCourses",
        select: "courseName",
      })
      .exec();
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
    const updatedStudent = await Student.findOneAndUpdate({ _id: id }, body, {
      new: true,
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
        username: 0,
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

const enrollCourses = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { courseId }: { courseId: string } = req.body;

  try {
    const student: TStudent | null = await Student.findById(id).exec();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student Not Found" });
    }

    if (student.enrolledCourses.includes(courseId)) {
      return res.status(409).json({
        success: false,
        message: "Course already enrolled by the student",
      });
    }

    student.enrolledCourses.push(courseId);
    await student.save();

    res
      .status(200)
      .json({ success: true, message: "Course enrolled successfully" });
  } catch (error) {
    console.error(`ERROR!! enrollCourses: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateAvatar = async (req: Request, res: Response) => {
  const id = req.params.id;
  const fileBuffer = req.file?.buffer;
  console.log(fileBuffer);

  if (!fileBuffer) {
    return res
      .status(400)
      .json({ success: false, message: "Avatar file is required" });
  }
  try {
    const student: TStudent | null = await Student.findById(id).exec();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student Not Found" });
    }
    const avatarUrl = await uploadOnCloudinary(fileBuffer);
    if (!avatarUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Avatar file is required" });
    }
    student.avatar = avatarUrl;
    const updatedUser = await student.save();
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      body: updatedUser,
    });
  } catch (error) {
    console.error(`ERROR!! updateAvatar: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  registerStudent,
  studentLogin,
  logout,
  getStudentEnrolledCourses,
  getStudentList,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  enrollCourses,
  updateAvatar,
};
