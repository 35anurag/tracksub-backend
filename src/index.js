import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { subsRouter } from "./routes/subdetail.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", //https://track-sub.onrender.com http://localhost:3000
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", userRouter);
app.use("/subscription", subsRouter);

app.options('*', cors());

mongoose.connect(process.env.MONGO_DB_URI);
app.listen(process.env.PORT || 3001, () => console.log("Server Started"));
