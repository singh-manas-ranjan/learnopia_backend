import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../config";

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(`MONGODB Connection Error: ${err}`);
    process.exitCode = 1;
  }
};

export default connectDb;
