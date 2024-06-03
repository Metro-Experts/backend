import Course from "../models/Course.js";
import courseSchema from "../libs/validateCourse.js";
import dotenv from "dotenv";
dotenv.config();
// Obtener un curso por ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");
    res.json(course);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Crear un nuevo curso
export const createCourse = async (req, res) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();
    console.log(savedCourse.tutor.id);
    console.log(savedCourse._id.toString());
    callApi(savedCourse.tutor.id, savedCourse._id.toString());
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Actualizar un curso por ID
export const updateCourseById = async (req, res) => {
  const { error } = courseSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).send("Course not found");
    res.json(course);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addStudentToCourse = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).send("Student ID is required");
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    course.students.push(studentId);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const callApi = async (id, idTuror) => {
  const url2 = `http://localhost:3001/users/${id}/add-course-tutor `;
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${id}/add-course-tutor `;
  const body = {
    courseId: idTuror,
  };
  console.log(id, idTuror);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text(); // o response.json() si esperas JSON
      console.log(errorBody);
      throw new Error(` ${errorBody}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
