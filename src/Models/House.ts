import mongoose, { Schema, Document } from "mongoose";
import { IStreet } from "./Street";

export interface IHouse {
  number: string;
  street: IStreet;
  createdAt: string;
}

const street: Schema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  street: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Street"
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model<IHouse & Document>("House", street);
