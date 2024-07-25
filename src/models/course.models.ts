import mongoose, { Document, Schema, Model } from "mongoose";
import { TReview } from "./review.models";

export type TCourseContent = {
  sectionName: string;
  chapterNames: string[];
  videoLinks: string[];
};

export type TCourseResource = {
  resourceName: string;
  resourceLink: string;
};

export type TCourse = Document & {
  courseName: string;
  author: string;
  courseRating: string;
  courseImg: string;
  coursePrice: number;
  isPaidCourse: Boolean;
  aboutCourse: string;
  description: string;
  courseLink: string;
  courseIndex: TCourseContent[];
  courseResources: TCourseResource[];
  reviews?: TReview["_id"][];
};

const courseSchema: Schema<TCourse> = new Schema(
  {
    courseName: { type: String, required: true },
    author: { type: String, required: true },
    courseRating: { type: String, required: true },
    courseImg: { type: String, required: true },
    coursePrice: { type: Number, required: true, default: 0 },
    isPaidCourse: { type: Boolean, required: true, default: true },
    description: { type: String, required: true },
    aboutCourse: { type: String, required: true },
    courseLink: { type: String, required: true },
    courseIndex: {
      type: [
        {
          sectionName: { type: String, required: true },
          chapterNames: { type: [String], required: true, default: [] },
          videoLinks: { type: [String], required: true, default: [] },
        },
      ],
      required: true,
      default: [],
    },
    courseResources: {
      type: [
        {
          resourceName: { type: String },
          resourceLink: { type: String },
        },
      ],
      required: true,
      default: [],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const Course: Model<TCourse> = mongoose.model("Course", courseSchema);

export default Course;
