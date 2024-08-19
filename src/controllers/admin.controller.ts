import Admin, { TAdmin } from "../models/admin.models";
import { CookieOptions, Request, Response } from "express";
import { generateAccessAndRefreshToken } from "../utils/TokenCreation";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  COOKIE_DOMAIN,
  HTTP_ONLY_COOKIE,
  SAME_SITE,
  SECURE_COOKIE,
} from "../config";

const registerAdmin = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password, phone }: TAdmin =
    req.body;
  if (
    [firstName, lastName, email, username, password, phone].some(
      (field) => field.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields are required" });
  }

  const isAdminExists = await Admin.findOne({
    $or: [{ email }, { username }, { phone }],
  });

  if (isAdminExists) {
    return res
      .status(409)
      .json({ success: false, message: "Admin already exists" });
  }

  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({
      success: true,
      message: "Admin Created Successfully",
      body: admin,
    });
  } catch (error) {
    console.log(`ERROR!! registerAdmin ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const admin = await Admin.findOne({ username }).exec();
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin does not exists" });
    }

    const isPasswordCorrect = await admin.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      admin?._id as string,
      "admin"
    );
    const resBody = await Admin.findById(admin._id).select(
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
        message: "Admin Logged In Successfully",
        body: resBody,
        tokens: { access_token, refresh_token },
      });
  } catch (error) {
    console.log(`ERROR!! adminLogin: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user) {
      const { _id } = req.user;
      await Admin.findByIdAndUpdate(
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

const getAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const admin = await Admin.find({ _id: id }).exec();
    res
      .status(200)
      .json({ success: true, message: "Admin Found", body: admin });
  } catch (error) {
    console.log(`ERROR!! getAdmin ${error}`);
    res.status(404).json({ success: false, message: "Admin Not Found" });
  }
};

const getAdminList = async (req: Request, res: Response) => {
  try {
    const adminList = await Admin.find().exec();
    if (adminList.length > 0) {
      res
        .status(200)
        .json({ success: true, message: "Admin Found", body: adminList });
    } else {
      res
        .status(200)
        .json({ success: true, message: "No Admin Found", body: adminList });
    }
  } catch (error) {
    console.log(`ERROR!! getAdminList ${error}`);
    res.status(404).json({ success: false, message: "Admin Not Found" });
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body: TAdmin = req.body;

  try {
    const admin = await Admin.updateOne({ _id: id }, body, {
      runValidators: true,
    }).exec();
    res
      .status(200)
      .json({ success: true, message: "Admin Updated", body: admin });
  } catch (error) {
    console.log(`ERROR!! updateAdmin ${error}`);
    res.status(404).json({ success: false, message: "Admin Not Found" });
  }
};

const updatePassword = async (req: AuthenticatedRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.user?._id).exec();
    const isPasswordMatch = await admin!.isPasswordCorrect(oldPassword);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    admin!.password = newPassword;
    admin!.save({ validateBeforeSave: false });
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

export {
  registerAdmin,
  getAdmin,
  getAdminList,
  adminLogin,
  updateAdmin,
  logout,
  updatePassword,
};
