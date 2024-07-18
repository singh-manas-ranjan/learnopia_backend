import Admin, { TAdmin } from "../models/admin.models";
import { Request, Response } from "express";

const registerAdmin = async (req: Request, res: Response) => {
  const { firstName, lastName, email, username, password, phone }: TAdmin =
    req.body;
  if (
    [firstName, lastName, email, username, password, phone].some(
      (field) => field.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All Fields are required" });
  }

  const isAdminExists = await Admin.findOne({
    $or: [{ email }, { username }, { phone }],
  });

  if (isAdminExists) {
    return res
      .status(409)
      .json({ success: false, message: "Admin already exists" });
  }

  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({
      success: true,
      message: "Admin Created Successfully",
      body: admin,
    });
  } catch (error) {
    console.log(`ERROR!! registerAdmin ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const loginAdmin = async (req: Request, res: Response) => {
  const body: TAdmin = req.body;
  const username = body.username;
  const password = body.password;
  try {
    const admin = await Admin.findOne(
      {
        username,
        password,
      },
      { username: 0, password: 0 }
    ).exec();
    if (admin) {
      res.status(200).json({
        success: true,
        message: "Admin Logged In Successfully",
        body: admin,
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(`ERROR!! loginAdmin ${error}`);
    res.status(500).json({ success: false, message: "Failed To Login Admin" });
  }
};

const getAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const admin = await Admin.find({ _id: id }).exec();
    res
      .status(200)
      .json({ success: true, message: "Admin Found", body: admin });
  } catch (error) {
    console.log(`ERROR!! getAdmin ${error}`);
    res.status(404).json({ success: false, message: "Admin Not Found" });
  }
};

const getAdminList = async (req: Request, res: Response) => {
  try {
    const adminList = await Admin.find().exec();
    if (adminList.length > 0) {
      res
        .status(200)
        .json({ success: true, message: "Admin Found", body: adminList });
    } else {
      res
        .status(200)
        .json({ success: true, message: "No Admin Found", body: adminList });
    }
  } catch (error) {
    console.log(`ERROR!! getAdminList ${error}`);
    res.status(404).json({ success: false, message: "Admin Not Found" });
  }
};

const updateAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body: TAdmin = req.body;

  try {
    const admin = await Admin.updateOne({ _id: id }, body, {
      runValidators: true,
    }).exec();
    res
      .status(200)
      .json({ success: true, message: "Admin Updated", body: admin });
  } catch (error) {
    console.log(`ERROR!! updateAdmin ${error}`);
    res.status(404).json({ success: false, message: "Admin Not Found" });
  }
};

const deleteAdmin = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await Admin.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admin Not Found" });
    }
    res.status(200).json({ success: true, message: "Admin Deleted" });
  } catch (error) {
    console.log(`ERROR!! deleteAdmin ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  registerAdmin,
  getAdmin,
  getAdminList,
  loginAdmin,
  updateAdmin,
  deleteAdmin,
};
