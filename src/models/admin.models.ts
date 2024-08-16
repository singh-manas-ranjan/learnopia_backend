import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  BCRYPT_SALT,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config";
import jwt from "jsonwebtoken";

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
  refreshToken: string;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
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
    refreshToken: {
      type: String,
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

adminSchema.methods.generateAccessToken = function () {
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

adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, role: this.role },
    REFRESH_TOKEN_SECRET as jwt.Secret,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    }
  );
};

const Admin: Model<TAdmin> = mongoose.model("Admin", adminSchema);

export default Admin;
