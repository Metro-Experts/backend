import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  tutor: {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    id: { type: String, required: true },
    bankaccount: {
      cedula: { type: String, default: 0 },
      numcell: { type: String, default: "0" },
      bank: { type: String, default: "mercantil" },
    },
  },
  date: [
    {
      day: { type: String, required: true },
      hour: { type: String, required: true },
    },
  ],
  students: [{ type: String, default: [] }],
  price: { type: Number, required: true, min: 0 },
  modality: { type: String, required: true },
  category: { type: String, default: "NA" },
  inicio: { type: String, required: true },
  final: { type: String, required: true },
  calendario: [{ type: String }],
});

const Course = mongoose.model("materia", courseSchema);

export default Course;
