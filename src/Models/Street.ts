import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IStreet extends Document {
  name: string;
  creator: IUser;
  createdAt: string;
}

const street: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model<IStreet>("Street", street);
