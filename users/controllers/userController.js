import User from "../models/User.js";
import userSchema from "../libs/validate.js";
import dotenv from "dotenv";
dotenv.config();

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Actualizar un usuario por ID
export const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
//Crear usuario
export const createUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addPendingItem = async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $push: { pending: item } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para quitar un elemento del array "pending"
export const removePendingItem = async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { pending: item } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersByIds = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).send("Invalid input: Expected an array of user IDs");
  }

  try {
    const users = await User.find({ _id: { $in: ids } });
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addCourseToStudent = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).send("Course ID is required");
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    user.courses_student.push(courseId);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addCourseToTutor = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).send("Course ID is required");
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    user.courses_tutor.push(courseId);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteCourseFromStudent = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).send("Course ID is required");
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    user.courses_student = user.courses_student.filter(
      (course) => course !== courseId
    );
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteCourseFromTutor = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).send("Course ID is required");
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");

    user.courses_tutor = user.courses_tutor.filter(
      (course) => course !== courseId
    );
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
