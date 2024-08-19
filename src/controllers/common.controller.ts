import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CookieOptions } from "express";
import {
  REFRESH_TOKEN_SECRET,
  HTTP_ONLY_COOKIE,
  SECURE_COOKIE,
  SAME_SITE,
  COOKIE_DOMAIN,
} from "../config";
import Admin from "../models/admin.models";
import Instructor from "../models/instructor.models";
import Student from "../models/student.models";
import { generateAccessAndRefreshToken } from "../utils/TokenCreation";
import { isJwtPayloadWithIdAndRole } from "../middlewares/auth.middleware";

type UserRole = "student" | "instructor" | "admin";

const modelMapping: { [key in UserRole]: any } = {
  student: Student,
  instructor: Instructor,
  admin: Admin,
};

const refreshAccessToken = async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken ||
    req.body.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Request" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      REFRESH_TOKEN_SECRET as string
    );

    if (!isJwtPayloadWithIdAndRole(decodedToken)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Access Token" });
    }

    const { _id, role } = decodedToken;

    const userRole = role as UserRole;

    const Model = modelMapping[userRole];

    if (!Model) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid role in token" });
    }

    const user = await Model.findById(_id).exec();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized Access" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Refresh Access" });
    }

    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      _id.toString(),
      userRole
    );

    const cookiesOptions: CookieOptions = {
      httpOnly: HTTP_ONLY_COOKIE === "true",
      secure: SECURE_COOKIE === "true",
      sameSite: SAME_SITE as "lax" | "strict" | "none" | undefined,
      partitioned: true,
    };

    return res
      .status(200)
      .cookie("accessToken", access_token, cookiesOptions)
      .cookie("refreshToken", refresh_token, cookiesOptions)
      .json({
        status: true,
        body: { accessToken: access_token, refreshToken: refresh_token },
        message: "Access Token Refreshed",
      });
  } catch (error) {
    console.log(`ERROR!! refreshAccessToken: ${error}`);
    return res
      .status(401)
      .json({ status: false, message: "Invalid Refresh Token" });
  }
};

export { refreshAccessToken };
