import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourseById,
  addStudentToCourse,
  removeStudentFromCourse,
  getCoursesByIds,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/:id", getCourseById);
router.post("/", createCourse);
router.put("/:id", updateCourseById);
router.get("/", getAllCourses);
router.post("/:id/add-student", addStudentToCourse);
router.post("/:id/remove-student", removeStudentFromCourse);
router.post("/get-by-ids", getCoursesByIds);
router.get("/", (req, res) => {
  res.send("Hello from courses");
});

export default router;
