import Student from "../models/student.models";
import Instructor from "../models/instructor.models";
import Admin from "../models/admin.models";

type TTokens = {
  access_token: string;
  refresh_token: string;
};

// Role-to-model mapping
const roleModelMap: { [key: string]: any } = {
  student: Student,
  instructor: Instructor,
  admin: Admin,
};

export const generateAccessAndRefreshToken = async (
  userId: string,
  role: "admin" | "instructor" | "student"
): Promise<TTokens> => {
  try {
    const user = await roleModelMap[role].findById(userId);
    const access_token = user!.generateAccessToken();
    const refresh_token = user!.generateRefreshToken();
    user!.refreshToken = refresh_token;
    await user!.save({ validateBeforeSave: false });

    return { access_token, refresh_token };
  } catch (error) {
    console.log(`ERROR!! in generateAccessAndRefreshToken: ${error} `);
    return { access_token: "", refresh_token: "" };
  }
};
