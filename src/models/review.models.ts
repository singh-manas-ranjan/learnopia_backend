import mongoose, { Document, Schema, Model } from "mongoose";
import { TStudent } from "./student.models";

export type TReview = Document & {
  body: string;
  student: TStudent["_id"][];
};

const reviewSchema: Schema<TReview> = new Schema(
  {
    body: { type: String, required: true },
    student: [{ type: Schema.Types.ObjectId, ref: "Student", required: true }],
  },
  { timestamps: true }
);

const Review: Model<TReview> = mongoose.model("Review", reviewSchema);

export default Review;
