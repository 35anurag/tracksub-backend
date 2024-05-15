import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { UserModel } from "../models/Users.js";

const router = express.Router();

router.post("/register", async(req, res)=>{
    const {username,email, password} = req.body
    const userEmail = await UserModel.findOne({email})
    const userName = await UserModel.findOne({username})

    if(userEmail){
        return res.json({message: "Email already exist"})
    }

    if(userName){
        return res.json({message: "Username already exist"})
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

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;
  
    try {
      const user = await UserModel.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (username) {
        user.username = username;
      }
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      await user.save();
      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  

export {router as userRouter}