import express, { Application } from "express";
import cors from "cors";
import { CORS_ORIGIN } from "./config";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//express built-in middlewares

// to parse request.body to json format mainly for POST, PUT, PATCH requests
app.use(
  express.json({
    limit: "100kb",
  })
);

// to parse data from url or html form data coming as content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// to serve static files like img,favicon,pdf, which are same for every client
app.use(express.static("public"));

// to perform CRUD operations on client-cookies like storing/updating/deleting secure-cookies which can only read by servers
app.use(cookieParser());

// routes import
import { adminRouter } from "./routes/admin.routes";
import { courseRouter } from "./routes/course.routes";
import { studentRouter } from "./routes/student.routes";
import { instructorRouter } from "./routes/instructor.routes";

//routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/admin/access", studentRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/instructors", instructorRouter);

export { app };
