import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL!;

const connect = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      dbName: "db-event",
    });

    return Promise.resolve("Database connected");
  } catch (error) {
    return Promise.reject(error);
  }
};

export default connect;
