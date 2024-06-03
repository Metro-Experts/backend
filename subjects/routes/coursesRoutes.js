import express from "express";
import { getAllCourses } from "../controllers/coursesControllers.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/test", (req, res) => {
  res.send("test route");
});

export default router;
