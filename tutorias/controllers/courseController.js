import Course from "../models/Course.js";
import courseSchema from "../libs/validateCourse.js";
import dotenv from "dotenv";
import moment from "moment";
import "moment/locale/es.js";

moment.locale("es");
dotenv.config();

const fetchTutorData = async (tutorId) => {
  const gatewayUrl = "https://uniexpert-gateway-6569fdd60e75.herokuapp.com";
  const url = `${gatewayUrl}/users/${tutorId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching tutor data:", error);
    throw error;
  }
};

export const updateTutorCourses = async (req, res) => {
  const { tutorId } = req.params;
  const updatedFields = req.body;
  console.log(tutorId, updatedFields);

  try {
    const result = await Course.updateMany(
      { "tutor.id": tutorId },
      {
        $set: {
          "tutor.name": updatedFields.name,
          "tutor.lastName": updatedFields.lastName,
          "tutor.rating": updatedFields.rating,
        },
      }
    );

    if (result.nModified === 0) {
      return res.status(404).send("No se encontraron cursos para actualizar");
    }

    res.json({ message: "Cursos actualizados exitosamente" });
  } catch (error) {
    console.error("Error updating tutor courses:", error);
    res.status(500).send("Error actualizando los cursos del tutor");
  }
};

const generateDates = (startMonth, endMonth, daysOfWeek) => {
  const dates = [];
  let startDate = moment(startMonth, "MMMM");
  let endDate = moment(endMonth, "MMMM").endOf("month");

  // Iterar sobre los meses y días de la semana para generar las fechas
  while (startDate.isBefore(endDate)) {
    daysOfWeek.forEach((day) => {
      let current = startDate.clone().day(day);
      if (current.isBefore(startDate)) {
        current.add(7, "days");
      }
      while (current.isBefore(startDate.clone().add(1, "month"))) {
        if (current.isBetween(startDate, endDate, null, "[]")) {
          dates.push(current.format("YYYY-MM-DD"));
        }
        current.add(1, "week");
      }
    });
    startDate.add(1, "month");
  }

  return dates;
};

export const getCoursesByIds = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("IDs array is required");
  }

  // Validar los IDs

  try {
    const courses = await Course.find({ _id: { $in: ids } });
    res.json(courses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
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
    const tutorId = req.body.tutor.id;
    const tutorData = await fetchTutorData(tutorId);

    if (!tutorData) {
      return res.status(404).send("Tutor not found");
    }

    // Generar el calendario de fechas
    const daysOfWeek = req.body.date.map((d) => d.day);
    const calendario = generateDates(
      req.body.inicio,
      req.body.final,
      daysOfWeek
    );
    console.log(tutorData.email);
    const newCourseData = {
      ...req.body,
      calendario,
      tutor: {
        name: tutorData.name,
        lastName: tutorData.lastName,
        rating: tutorData.rating,
        id: tutorData._id,
        bankaccount: tutorData.bankaccount,
        email: tutorData.email,
        description: tutorData.description,
        carrer: tutorData.carrer,
      },
    };

    const newCourse = new Course(newCourseData);
    const savedCourse = await newCourse.save();

    console.log(savedCourse.tutor.id);
    console.log(savedCourse._id.toString());
    await addTutor(savedCourse.tutor.id, savedCourse._id.toString());

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
    const studentExists = await consultarId(studentId);
    if (!studentExists) {
      return res.status(404).send("Student not found");
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    const addStudentResult = await addStudent(studentId, req.params.id);
    const removePendingResult = await removePendingStudent(
      studentId,
      req.params.id
    );
    console.log(removePendingResult);

    if (addStudentResult === "Estudiante no encontrado") {
      return res.status(404).send("Student not found");
    }

    course.students.push(studentId);
    const updatedCourse = await course.save();

    // Actualizar el calendario del usuario
    await updateUserCalendar(studentId, req.params.id, course.calendario);

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const addTutor = async (id, idTuror) => {
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
      const errorBody = await response.text();
      console.log(errorBody);
      response.status(500).send(errorBody);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
const addStudent = async (id, idCurso) => {
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${id}/add-course-student `;
  const body = {
    courseId: idCurso,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.log(errorBody);
      throw new Error("Estudiante no encontrado");
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("An error occurred:", error);
    return "Estudiante no encontrado";
  }
};

const consultarId = async (id) => {
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${id}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      if (text === "User not found") {
        console.log("Estudiante no encontrado");
        return false;
      }
      console.log(text);
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("An error occurred:", error);
    return false;
  }
};

export const removeStudentFromCourse = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).send("Student ID is required");
  }

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    const removeStudentResult = await removeStudent(studentId, req.params.id);
    if (removeStudentResult === "Estudiante no encontrado") {
      return res.status(404).send("Student not found");
    }

    course.students = course.students.filter((id) => id !== studentId);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const removeStudent = async (id, courseId) => {
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${id}/delete-course-student`;
  const body = { courseId };

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.log(errorBody);
      throw new Error("Estudiante no encontrado");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    return "Estudiante no encontrado";
  }
};

const removePendingStudent = async (id, item) => {
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${id}/remove-pending`;
  const body = { item };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.log(errorBody);
      throw new Error("Estudiante no encontrado");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    return "Estudiante no encontrado";
  }
};
const updateUserCalendar = async (userId, courseId, dates) => {
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${userId}/update-calendar`;
  const body = { courseId, dates };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.log(errorBody);
      throw new Error("Failed to update user calendar");
    }

    const data = await response.json();
    console.log("User calendar updated:", data);
    return data;
  } catch (error) {
    console.error("An error occurred while updating user calendar:", error);
    throw error;
  }
};
