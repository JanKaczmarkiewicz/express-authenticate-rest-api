import mongoose, { Document } from "mongoose";

export interface Street extends Document {
  name: string;
  createdAt: string;
}

const street = new mongoose.Schema<Street>({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model<Street>("Street", street);
