import mongoose from "mongoose";
import env from "./env";

const connectDB = async () => {
  try {
    await mongoose.connect(env("MONGO_URL"), {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.log("Connected to the database!");
  } catch (err) {
    console.error("Database Error:", err);
    process.exit(1);
  }
};

export default connectDB;
