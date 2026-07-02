import express from "express";
// import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users.js";
// import mongoose from "mongoose";
import {generateAccessToken,
  generateRefreshToken} from "../utils/token.js"

const router = express.Router();
const SALT_ROUND = 12;

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Email, password, and username are required",
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUND);

    const user = await UserModel.create({
      username,
      email: email.toLowerCase(),
      password: passwordHash,
    });

    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Something is wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email or password is required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = await generateRefreshToken(user.id)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 7*24*60*60*1000,
      path: "/auth/refresh",
    })

    res.json({
      accessToken,
      message: "Login Successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error message from login", error);
    return res.status(400).json({ error: "Error while logging" });
  }
});

export {router as userRouter}












// router.post("/register", async(req, res)=>{
//     const {username,email, password} = req.body
//     const userEmail = await UserModel.findOne({email})
//     const userName = await UserModel.findOne({username})

//     if(userEmail){
//         return res.json({message: "Email already exist"})
//     }

//     if(userName){
//         return res.json({message: "Username already exist"})
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)
//     const newUser = new UserModel({username, email, password: hashedPassword})
//     await newUser.save()

//     res.json({message: "User Registered Successfully"})
// })

// router.post("/login", async(req, res)=>{
//     const {username, email, password} = req.body
//     const user = await UserModel.findOne({email})
//     const userName = await UserModel.findOne({username})

//     if(!user){
//         return res.json({message: "User Doesn't Exist"})
//     }

//     if(!userName){
//         return res.json({message: "Username is incorrect"})
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password)

//     if(!isPasswordValid){
//         return res.json({message: "Username or Password is incorrect"})
//     }

//     const token = jwt.sign({id: user._id}, "secret")
//     res.json({token, userID: user._id})
// })

// router.put("/:id", async (req, res) => {
//     const { id } = req.params;
//     const { username, password } = req.body;

//     try {
//       const user = await UserModel.findById(id);

//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       if (username) {
//         user.username = username;
//       }

//       if (password) {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         user.password = hashedPassword;
//       }

//       await user.save();
//       res.json({ message: "User updated successfully" });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Server Error" });
//     }
//   });

// export {router as userRouter}
