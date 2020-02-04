import mongoose from "mongoose";
import config from "./default.json";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    console.error("Connected to the database!");
  } catch (err) {
    console.error("Database Error:", err);
    process.exit(1);
  }
};

export default connectDB;
