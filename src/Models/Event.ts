import mongoose from "mongoose";

const event = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  maxParticipans: Number,
  participans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  date: {
    type: Number,
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now(),
    required: true
  }
});
export default mongoose.model("Event", event);
