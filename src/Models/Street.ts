import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IStreet {
  name: string;
  creator: IUser;
  createdAt: string;
}

const street: Schema = new mongoose.Schema<IStreet>({
  name: {
    type: String,
    required: true
  },
  creator: {
    ref: mongoose.Schema.Types.ObjectId,
    type: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model<IStreet & Document>("Street", street);
