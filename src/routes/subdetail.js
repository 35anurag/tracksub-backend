import express from "express";
import { SubsModel } from "../models/SubsDetail.js";

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const response = await SubsModel.find({});
    res.json(response);
  } catch (error) {
    res.json(error);
  }
});

router.post("/dashboard", async (req, res) => {
    const subscription = new SubsModel(req.body)
    try {
      const response = await subscription.save();
      res.json(response);
    } catch (error) {
      res.json(error);
    }
  });

  router.delete("/dashboard/:id", async(req, res)=>{
    const id = req.params.id;
    await SubsModel.findByIdAndDelete(id).exec();
    res.send("items deleted")
  } )

export { router as subsRouter };
