import mongoose, { Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: string;
}

const user: Schema = new mongoose.Schema({
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

export default mongoose.model<IUser & Document>("User", user);
