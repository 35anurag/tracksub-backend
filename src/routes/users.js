import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/Users.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET

router.post("/register", async(req, res)=>{
    const {username, password} = req.body
    const user = await UserModel.findOne({username})

    if(user){
        return req.json({message: "User already exist"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({username, password: hashedPassword})
    await newUser.save()

    res.json({message: "User Registered Successfully"})
})

router.post("/login", async(req, res)=>{
    const {username, password} = req.body
    const user = await UserModel.findOne({username})

    if(!user){
        return res.json({message: "User Doesn't Exist"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.json({message: "Username or Password is incorrect"})
    }

    const token = jwt.sign({id: user._id}, JWT_SECRET)
    res.json({token, userID: user._id})
})

export {router as userRouter}