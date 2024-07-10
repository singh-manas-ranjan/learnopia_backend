import express, { Application, NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MONGOOSE_URL, PORT } from "./config";
import courseRoutes from "./routes/course.routes";
import studentRoutes from "./routes/student.routes";

const app: Application = express();
const port = PORT || 3001;
const db_URI = MONGOOSE_URL || "";

mongoose
  .connect(`${db_URI}`)
  .then(() => console.log("DB Connected Successfully"))
  .catch((err) => console.log(err));

//express built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Learnopia");
});

app.use("/api", studentRoutes);

app.use("/api", courseRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
