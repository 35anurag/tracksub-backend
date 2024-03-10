import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async(req, res)=>{
    const {username,email, password} = req.body
    const userEmail = await UserModel.findOne({email})

    if(userEmail){
        return req.json({message: "Email already exist"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new UserModel({username, email, password: hashedPassword})
    await newUser.save()

    res.json({message: "User Registered Successfully"})
})

router.post("/login", async(req, res)=>{
    const {username, email, password} = req.body
    const user = await UserModel.findOne({email})
    const userName = await UserModel.findOne({username})
    
    if(!user){
        return res.json({message: "User Doesn't Exist"})
    }

    if(!userName){
        return res.json({message: "Username is incorrect"})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.json({message: "Username or Password is incorrect"})
    }

    const token = jwt.sign({id: user._id}, "secret")
    res.json({token, userID: user._id})
})

export {router as userRouter}