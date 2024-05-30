import Subject from "../models/subject.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Subject.find();
    res.json(courses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
