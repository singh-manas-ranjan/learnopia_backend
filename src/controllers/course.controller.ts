import { Request, Response } from "express";
import Course, { TCourse } from "../models/course.models";

const createCourse = async (req: Request, res: Response) => {
  const body: TCourse = req.body;
  try {
    const course = await Course.create(body);
    res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      body: course,
    });
  } catch (error) {
    console.log(`ERROR!! createCourse: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getCourse = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const course = await Course.findById(id).exec();
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course Not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Course Found Successfully",
      body: course,
    });
  } catch (error) {
    console.log(`ERROR!! getCourse: ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getCourseList = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({}).exec();
    if (courses.length > 0) {
      res.status(200).json({
        success: true,
        message: "Courses found successfully",
        body: courses,
      });
    } else {
      res
        .status(200)
        .json({ success: true, message: "Courses Not Found", body: courses });
    }
  } catch (error) {
    console.log(`ERROR !! getCourseList ${error}`);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const updateCourse = async (req: Request, res: Response) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const updatedCourse = await Course.updateOne({ _id: id }, body, {
      runValidators: true,
    }).exec();
    res.status(200).json({
      success: true,
      message: "Course Updated Successfully",
      body: updatedCourse,
    });
  } catch (error) {
    console.log(`ERROR !! updateCourse: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const deleteCourse = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await Course.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Course Not Found" });
    }
    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    console.log(`ERROR !! deleteCourse: ${error} `);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { createCourse, getCourse, getCourseList, updateCourse, deleteCourse };
