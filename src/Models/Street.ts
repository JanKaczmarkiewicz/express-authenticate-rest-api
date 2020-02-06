import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IStreet {
  name: string;
  creator: any;
  createdAt: string;
}

const street: Schema = new mongoose.Schema<IStreet>({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model<IStreet & Document>("Street", street);
