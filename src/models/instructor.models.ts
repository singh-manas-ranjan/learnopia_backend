import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { TCourse } from "./course.models";
import { BCRYPT_SALT } from "../config";

type TEducation = {
  degree: string;
  institution: string;
  passingYear: string;
};

export type TExperience = {
  organization: string;
  role: string;
  years: string;
};

export type TAchievement = {
  title: string;
  year: string;
};

export type TInstructor = Document & {
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
  aboutMe: string;
  domain: string;
  languages: string[];
  services: string[];
  education: TEducation[];
  experience: TExperience[];
  achievements: TAchievement[];
  publishedCourses: TCourse["_id"][];
  isPasswordCorrect(password: string): Promise<boolean>;
};

const instructorSchema: Schema<TInstructor> = new Schema(
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
    role: { type: String, required: true, default: "instructor" },
    address: { type: String, required: true, default: "NA" },
    aboutMe: { type: String, default: "I'am an Instructor" },
    languages: [{ type: String }],
    services: [{ type: String }],
    domain: { type: String },
    education: {
      type: [
        {
          degree: { type: String },
          institution: { type: String },
          passingYear: { type: String },
        },
      ],
    },
    experience: {
      type: [
        {
          organization: { type: String },
          role: { type: String },
          years: { type: String },
        },
      ],
    },
    achievements: {
      type: [
        {
          title: { type: String },
          year: { type: String },
        },
      ],
    },
    avatar: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/learnopia/image/upload/v1722231314/285655_user_icon_jeqpxe.png",
    },
    publishedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

instructorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT);
});

instructorSchema.methods.isPasswordCorrect = async function (params: string) {
  return await bcrypt.compare(params, this.password);
};

const Instructor: Model<TInstructor> = mongoose.model(
  "Instructor",
  instructorSchema
);

export default Instructor;
