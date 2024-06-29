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
export const updateUserCalendar = async (req, res) => {
  const { id } = req.params;
  const { courseId, dates } = req.body;

  if (!courseId || !dates || !Array.isArray(dates)) {
    return res.status(400).send("Course ID and dates array are required");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Si el usuario no tiene un calendario, inicializarlo
    if (!user.calendar) {
      user.calendar = [];
    }

    // Añadir las nuevas fechas al calendario del usuario
    dates.forEach((date) => {
      user.calendar.push({
        courseId,
        date: new Date(date),
        event: `Clase del curso ${courseId}`,
      });
    });

    // Guardar el usuario actualizado
    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rateUser = async (req, res) => {
  const { id } = req.params;
  const { raterId, score } = req.body;

  if (!raterId || !score || score < 1 || score > 5) {
    return res
      .status(400)
      .send("Se requiere un ID de calificador y una puntuación válida (1-5)");
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Inicializar el array ratings si no existe
    if (!user.ratings) {
      user.ratings = [];
    }

    // Buscar si ya existe una calificación del mismo raterId
    const existingRatingIndex = user.ratings.findIndex(
      (rating) => rating.userId === raterId
    );

    if (existingRatingIndex !== -1) {
      // Actualizar la calificación existente
      user.ratings[existingRatingIndex].score = score;
    } else {
      // Añadir la nueva calificación
      user.ratings.push({ userId: raterId, score });
    }

    // Calcular el nuevo promedio y contar las calificaciones
    const sum = user.ratings.reduce((acc, curr) => acc + curr.score, 0);
    user.rating = parseFloat((sum / user.ratings.length).toFixed(2));
    user.ratingCount = user.ratings.length;

    // Guardar los cambios
    await user.save();

    res.json({
      message: "Calificación añadida/actualizada con éxito",
      newRating: user.rating,
      ratingCount: user.ratingCount,
      ratings: user.ratings,
    });
  } catch (error) {
    console.error("Error al calificar usuario:", error);
    res
      .status(500)
      .send("Error interno del servidor al procesar la calificación");
  }
};

export const getUserRatings = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json({
      averageRating: user.rating,
      ratingCount: user.ratingCount,
      ratings: user.ratings,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
