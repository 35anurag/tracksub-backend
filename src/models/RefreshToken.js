import mongoose from "mongoose"

const RefreshTokenSchema = new mongoose.Schema({
   userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      // default: Date.now,
    },
    revoked:{
      type: Boolean,
      default: false,
    }
})

export const RefreshTokenModel = mongoose.model("refreshtokens", RefreshTokenSchema)