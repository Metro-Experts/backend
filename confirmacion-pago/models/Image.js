// models/Image.js
import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: {
    data: Buffer,
    contentType: String,
  },
});

// Usar la colección 'confirmaciones' en la base de datos 'uniconfirm'
export default mongoose.model("Image", imageSchema, "confirmaciones");
