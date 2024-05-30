import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  matematicas: [{ type: String, default: [] }],
  programacion: [{ type: String, default: [] }],
  fisica: [{ type: String, default: [] }],
  quimica: [{ type: String, default: [] }],
});

const Subject = mongoose.model("subject", subjectSchema);

export default Subject;
