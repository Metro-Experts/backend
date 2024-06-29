// models/PaymentConfirmation.js
import mongoose from "mongoose";

const paymentConfirmationSchema = new mongoose.Schema({
  idcurso: { type: String, required: true },
  idtutor: { type: String, required: true },
  nombreTutoria: { type: String, required: true },
  estudiante: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    idstudiante: { type: String, required: true },
  },
  status: { type: String, default: "espera" },
  img: {
    data: Buffer,
    contentType: String,
  },
  referencia: { type: String, required: true },
  bancoEmisor: { type: String, required: true },
  telefono: { type: String, required: true },
});

export default mongoose.model("PaymentConfirmation", paymentConfirmationSchema);
