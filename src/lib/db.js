import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected to: ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
  }
};

export default connectDB;
