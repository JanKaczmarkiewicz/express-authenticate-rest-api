import mongoose from "mongoose";
import { Street } from "./Street";

export interface House {
  number: string;
  street: Street;
  createdAt: string;
}

const street = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model("Event", street);
