import mongoose from "mongoose";

async function dbConnect(): Promise<void> {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;

    if (!MONGODB_URL) {
      throw new Error("mongoUrl is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URL);
    console.log("Database connected successfully");
  } catch (error: any) {
    console.log("unable to connected to database", error);
  }
}

export default dbConnect;
