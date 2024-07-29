import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import { BCRYPT_SALT } from "../config";

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
  isPasswordCorrect(password: string): Promise<boolean>;
};

const adminSchema: Schema<TAdmin> = new Schema(
  {
    firstName: { type: String, required: true, minlength: 3, trim: true },
    lastName: { type: String, required: true, minlength: 3, trim: true },
    username: {
      type: String,
      required: true,
      minlength: 5,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    gender: {
      type: String,
      required: true,
      enum: ["M", "F", "O", "NA"],
      default: "NA",
    },
    role: { type: String, required: true, default: "admin" },
    address: { type: String, required: true, default: "NA" },
    avatar: {
      type: String,
      required: true,
      default:
        "https://res.cloudinary.com/learnopia/image/upload/v1722231314/285655_user_icon_jeqpxe.png",
    },
  },
  { versionKey: false, timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, BCRYPT_SALT);
  next();
});

adminSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const Admin: Model<TAdmin> = mongoose.model("Admin", adminSchema);

export default Admin;
