import mongoose from "mongoose";

const SubsSchema = new mongoose.Schema({
  appID: { type: Number, required: true },
  accName: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

export const SubsModel = mongoose.model("subscription", SubsSchema);
