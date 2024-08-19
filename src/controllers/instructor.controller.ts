import { CookieOptions, Request, Response } from "express";
import Instructor, { TInstructor } from "../models/instructor.models";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { generateAccessAndRefreshToken } from "../utils/TokenCreation";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { HTTP_ONLY_COOKIE, SAME_SITE, SECURE_COOKIE } from "../config";

const registerInstructor = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password, phone }: TInstructor =
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

  const isInstructorExists = await Instructor.findOne({
    $or: [{ username }, { email }, { phone }],
  }).exec();

  if (isInstructorExists) {
    return res
      .status(409)
      .json({ success: false, message: "Instructor already exists" });
  }

  try {
    const createdInstructor = await Instructor.create({
      firstName,
      lastName,
      email,
      phone,
      username,
      password,
    });
    const resBody = await Instructor.findById(createdInstructor._id).select(
      "-password"
    );

    if (!resBody) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong while registering Instructor",
      });
    }

    res.status(201).json({
      success: true,
      message: "Instructor Registered Successfully",
      body: resBody,
    });
  } catch (error) {
    console.log(`ERROR!! registerInstructor: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const instructorLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const instructor = await Instructor.findOne({ username }).exec();
    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor does not exists" });
    }

    const isPasswordCorrect = await instructor.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      instructor?._id as string,
      "instructor"
    );
    const resBody = await Instructor.findById(
      instructor._id,
      "-password -username -refreshToken"
    );

    const cookiesOptions: CookieOptions = {
      httpOnly: HTTP_ONLY_COOKIE === "true",
      secure: SECURE_COOKIE === "true",
      sameSite: SAME_SITE as "lax" | "strict" | "none" | undefined,
    };

    return res
      .status(200)
      .cookie("accessToken", access_token, cookiesOptions)
      .cookie("refreshToken", refresh_token, cookiesOptions)
      .json({
        success: true,
        message: "Instructor Logged In Successfully",
        body: resBody,
        tokens: { access_token, refresh_token },
      });
  } catch (error) {
    console.log(`ERROR!! instructorLogin: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      const { _id } = req.user;
      await Instructor.findByIdAndUpdate(
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

      const cookiesOptions: CookieOptions = {
        httpOnly: HTTP_ONLY_COOKIE === "true",
        secure: SECURE_COOKIE === "true",
        sameSite: SAME_SITE as "lax" | "strict" | "none" | undefined,
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

const getPublishedCourses = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const instructor = await Instructor.findById(id, "publishedCourses -_id")
      .populate("publishedCourses")
      .exec();

    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor does not exists" });
    }

    res.status(200).json({ success: true, body: instructor.publishedCourses });
  } catch (error) {
    console.log(`ERROR!! getPublishedCourses: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getInstructorsList = async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.find().exec();
    if (instructor.length > 0) {
      res.status(200).json({
        success: true,
        message: "Instructors found successfully",
        body: instructor,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Instructors Not Found",
        body: instructor,
      });
    }
  } catch (error) {
    console.log(`ERROR !! getInstructorsList ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const updateInstructor = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const updatedInstructor = await Instructor.findOneAndUpdate(
      { _id: id },
      body,
      {
        new: true,
      }
    ).exec();
    res.status(200).json({
      success: true,
      message: "Instructor Updated Successfully",
      body: updatedInstructor,
    });
  } catch (error) {
    console.log(`ERROR !! updateInstructor: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const deleteInstructor = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await Instructor.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Instructor Deleted Successfully",
    });
  } catch (error) {
    console.log(`ERROR !! deleteInstructor: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getInstructorProfile = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const instructor = await Instructor.findOne(
      { _id: id },
      {
        createdAt: 0,
        updatedAt: 0,
        password: 0,
        username: 0,
      }
    )
      .populate("publishedCourses")
      .exec();
    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Fetched Instructor Profile Successfully",
      body: instructor,
    });
  } catch (error) {
    console.log(`ERROR !! getInstructorProfile: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateAvatar = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log("InstructorId: ", id);

  const fileBuffer = req.file?.buffer;
  console.log(fileBuffer);

  if (!fileBuffer) {
    return res
      .status(400)
      .json({ success: false, message: "Avatar file is required" });
  }
  try {
    const instructor: TInstructor | null = await Instructor.findById(id).exec();
    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "Instructor Not Found" });
    }
    const avatarUrl = await uploadOnCloudinary(fileBuffer);
    if (!avatarUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Avatar file is required" });
    }
    instructor.avatar = avatarUrl;
    const updatedInstructor = await instructor.save();
    console.log(updateInstructor);

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      body: updatedInstructor,
    });
  } catch (error) {
    console.error(`ERROR!! updateAvatar: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const instructor = await Instructor.findById(req.user?._id).exec();
    const isPasswordMatch = await instructor!.isPasswordCorrect(oldPassword);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    instructor!.password = newPassword;
    instructor!.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json({ success: true, message: "Password Updated Successfully" });
  } catch (error) {
    console.log(`Error!! in updatePassword ${error}`);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }
};

const getInstructorById = async (req: AuthenticatedRequest, res: Response) => {
  console.log("Control Inside getInstructorById");

  const id = req.params.id;
  try {
    const instructor = await Instructor.findById(id)
      .select("-password -accessToken -username")
      .populate("publishedCourses")
      .exec();
    if (!instructor) {
      return res
        .status(404)
        .json({ success: false, message: "instructor Not Found" });
    }
    return res.status(200).json({
      success: true,
      message: "instructor found successfully",
      body: instructor,
    });
  } catch (error) {
    console.error(`ERROR!! getInstructorById: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  registerInstructor,
  instructorLogin,
  getInstructorProfile,
  getInstructorsList,
  updateInstructor,
  updateAvatar,
  getPublishedCourses,
  deleteInstructor,
  logout,
  updatePassword,
  getInstructorById,
};
