import mongoose, { Document, Schema, Model } from "mongoose";

export type TAdmin = Document & {
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
};

const adminSchema: Schema<TAdmin> = new Schema({
  firstName: { type: String, required: true, minlength: 3 },
  lastName: { type: String, required: true, minlength: 3 },
  username: {
    type: String,
    required: true,
    minlength: 5,
    unique: true,
    lowercase: true,
  },
  email: { type: String, required: true, lowercase: true, unique: true },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 15,
    unique: true,
  },
  password: { type: String, required: true, minlength: 8 },
  gender: { type: String, enum: ["M", "F", "O"] },
  role: { type: String, required: true, default: "admin" },
  address: { type: String },
  avatar: { type: String, required: true, default: "avatar.webp" },
});

const Admin: Model<TAdmin> = mongoose.model("Admin", adminSchema);

export default Admin;
