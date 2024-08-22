import mongoose, { Document, Model, Schema } from "mongoose";
import { TCourse } from "./course.models";
import bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  BCRYPT_SALT,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config";
import jwt from "jsonwebtoken";
import { TEducation } from "./instructor.models";

export type TAddress = {
  addressLine1: string;
  addressLine2: string;
  state: string;
  country: string;
};

export type TStudent = Document & {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  gender: string;
  role: string;
  address: TAddress;
  avatar: string;
  qualification: string;
  education: TEducation[];
  refreshToken: string;
  aboutMe: string;
  socialLinks: string[];
  enrolledCourses: TCourse["_id"][];
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
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
      enum: ["M", "F", "O", "-NA-"],
      default: "-NA-",
    },
    role: { type: String, required: true, default: "student" },
    avatar: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/learnopia/image/upload/v1722231314/285655_user_icon_jeqpxe.png",
    },
    address: {
      type: {
        addressLine1: { type: String, default: "" },
        addressLine2: { type: String, default: " " },
        state: { type: String, default: " " },
        country: { type: String, default: " " },
      },
      required: true,
      default: {},
    },
    aboutMe: { type: String, required: true, default: "I'am a student" },
    qualification: {
      type: String,
      enum: ["X", "XII", "UG", "PG", "-NA-"],
      default: "-NA-",
    },
    education: {
      type: [
        {
          degree: { type: String },
          institution: { type: String },
          passingYear: { type: String },
        },
      ],
      default: [],
    },
    socialLinks: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: String,
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

studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
      avatar: this.avatar,
      email: this.email,
      username: this.username,
    },
    ACCESS_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    }
  );
};

studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

const Student: Model<TStudent> = mongoose.model("Student", studentSchema);

export default Student;
