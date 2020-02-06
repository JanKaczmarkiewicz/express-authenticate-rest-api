import mongoose, { Schema, Document } from "mongoose";
import { IStreet } from "./Street";
import { IUser } from "./User";

export interface IHouse extends Document {
  number: string;
  street: IStreet;
  creator: IUser;
  createdAt: string;
}

const house: Schema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  street: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Street"
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
export default mongoose.model<IHouse>("House", house);
