import mongoose, { Document, Model, Schema } from "mongoose";
import { TCourse } from "./course.models";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import { BCRYPT_SALT } from "../config";

export type TStudent = Document & {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  role: string;
  address: string;
  avatar: string;
  qualification: string;
  enrolledCourses: TCourse["_id"][];
  isPasswordCorrect(password: string): Promise<boolean>;
};

const studentSchema: Schema<TStudent> = new Schema(
  {
    firstName: { type: String, required: true, minlength: 3, trim: true },
    lastName: { type: String, required: true, minlength: 3, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      maxlength: 15,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    gender: {
      type: String,
      required: true,
      enum: ["M", "F", "O", "NA"],
      default: "NA",
    },
    role: { type: String, required: true, default: "student" },
    avatar: { type: String, required: true, default: "avatar.webp" },
    address: { type: String, required: true, default: "NA" },
    qualification: {
      type: String,
      enum: ["X", "XII", "UG", "PG"],
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT);
  next();
});

studentSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const Student: Model<TStudent> = mongoose.model("Student", studentSchema);

export default Student;
