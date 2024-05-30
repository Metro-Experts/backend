import express from "express";
import { getAllCourses } from "../controllers/coursesControllers.js";

const router = express.Router();

router.get("/", getAllCourses);

export default router;
