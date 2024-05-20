import User from '../models/User.js';
import userSchema from "../libs/validate.js";

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Actualizar un usuario por ID
export const updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).send('User not found');
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