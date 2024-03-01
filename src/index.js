import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { subsRouter } from "./routes/subdetail.js";

dotenv.config();

const app = express();
//updated code
// const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", userRouter);
app.use("/subscription", subsRouter);
// updated code
// app.use(express.static(path.resolve(__dirname, "/client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

mongoose.connect(process.env.MONGO_DB_URI);
app.listen(process.env.PORT, () => console.log("Server Started"));
