import mongoose, { Document, Model, Schema } from "mongoose";
import { TCourse } from "../courses/course.modules";

export type TStudent = Document & {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  address: string;
  avatar: string;
  enrolledCourses: TCourse["_id"][];
};

const studentSchema: Schema<TStudent> = new Schema(
  {
    firstName: { type: String, required: true, minlength: 3 },
    lastName: { type: String, required: true, minlength: 3 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      minlength: 5,
    },
    email: { type: String, required: true, unique: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 15,
    },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, required: true, default: "student" },
    avatar: { type: String, required: true, default: "avatar.webp" },
    address: { type: String, required: true },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const Student: Model<TStudent> = mongoose.model("Student", studentSchema);

export default Student;
