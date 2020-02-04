import mongoose from "mongoose";

export interface User extends mongoose.Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

const user = new mongoose.Schema<User>({
  name: {
    type: String,
    maxlength: 30,
    required: true
  },
  phone: {
    type: String,
    minlength: 9,
    maxlength: 9,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});

export default mongoose.model<User>("User", user);
