import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import Student from "../models/student.models";
import Admin from "../models/admin.models";
import Instructor from "../models/instructor.models";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

// Role-to-model mapping
const roleModelMap: { [key: string]: any } = {
  student: Student,
  instructor: Instructor,
  admin: Admin,
};

// Type guard to check if decoded token has _id & role property
export function isJwtPayloadWithIdAndRole(
  payload: JwtPayload | string
): payload is JwtPayload & { _id: string; role: string } {
  return typeof payload === "object" && "_id" in payload && "role" in payload;
}

export const verifyJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("Inside verifyJWT Middleware");
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Request: No Token Provided",
    });
  }

  try {
    const decodedToken = Jwt.verify(token, ACCESS_TOKEN_SECRET as string);
    if (!isJwtPayloadWithIdAndRole(decodedToken)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Access Token" });
    }

    const { _id, role } = decodedToken;
    const Model = roleModelMap[role];

    console.log(_id, role);

    if (!Model) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Access Token" });
    }

    const user = await Model.findById(_id).select("-password -refreshToken");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Request" });
  }
};

export const verifyAdminOnly = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("verifyAdminOnly Middleware Triggered");

  // Print entire cookies and headers for debugging
  console.log("Cookies: ", req.cookies);
  console.log("Headers: ", req.headers);

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  console.log(`Token: ${token}`);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized Request: No Token Provided",
    });
  }

  try {
    const decodedToken = Jwt.verify(token, ACCESS_TOKEN_SECRET as string);
    if (!isJwtPayloadWithIdAndRole(decodedToken)) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Access Token" });
    }

    const { role } = decodedToken;
    const Model = roleModelMap[role];

    console.log(`Role: ${role}`);

    if (!Model) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Access Token" });
    }

    if (Model !== Admin) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden Request" });
    }

    next();
  } catch (error) {
    console.log(error);

    return res
      .status(401)
      .json({ success: false, message: "Unauthorized Request" });
  }
};
