import { Request, Response } from "express";
import "dotenv/config";
import { PORT } from "./config";
import connectDb from "./db";
import { app } from "./app";

const port = PORT || 3001;

// Connect to DB & Start Listening on PORT
connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log(
        `Error!!! Application is not able to talk to Database: ${error}`
      );
      throw error;
    });
    app.listen(port, () => {
      console.log(`Learnopia Server is running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(`DATABASE Connection Failed !!: ${error}`);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Learnopia");
});
