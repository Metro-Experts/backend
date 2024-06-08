// routes/imageRoutes.js
import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import PaymentConfirmation from "../models/PaymentConfirmation.js";
dotenv.config();
const router = express.Router();

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint para subir la imagen y datos
router.post("/upload", upload.single("image"), async (req, res) => {
  const { idcurso, idtutor, estudiante } = req.body;

  const newPaymentConfirmation = new PaymentConfirmation({
    idcurso,
    idtutor,
    estudiante: JSON.parse(estudiante),
    img: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
    status: "espera",
  });

  try {
    await newPaymentConfirmation.save();
    res.status(201).send({
      message: "Datos y comprobante subidos y guardados en la base de datos",
      id: newPaymentConfirmation._id,
    });
  } catch (error) {
    res.status(500).send("Error al guardar los datos y la imagen");
  }
});

// Endpoint para obtener la imagen por su ID
router.get("/:id", async (req, res) => {
  try {
    const paymentConfirmation = await PaymentConfirmation.findById(
      req.params.id
    );
    if (!paymentConfirmation) {
      return res.status(404).send("Datos no encontrados");
    }
    res.contentType(paymentConfirmation.img.contentType);
    res.send(paymentConfirmation.img.data);
  } catch (error) {
    res.status(500).send("Error al obtener los datos");
  }
});

// Endpoint para verificar la conexión
router.get("/check/connection", (req, res) => {
  res.status(200).send("Connection is successful");
});

// Endpoint para confirmar el pago y añadir al estudiante al curso
router.post("/confirm/:id", async (req, res) => {
  try {
    const paymentConfirmation = await PaymentConfirmation.findById(
      req.params.id
    );
    if (!paymentConfirmation) {
      return res.status(404).send("Confirmación no encontrada");
    }

    // Cambiar el estado a "confirmado"
    paymentConfirmation.status = "confirmado";
    await paymentConfirmation.save();

    // Realizar la solicitud POST al endpoint externo
    const { idcurso, estudiante } = paymentConfirmation;
    const response = await axios.post(
      `${process.env.GATEWAY_URL}/courses/${idcurso}/add-student`,
      {
        studentId: estudiante.idstudiante,
      }
    );

    res.status(200).send({
      message: "Estado cambiado a confirmado y estudiante añadido al curso",
      externalResponse: response.data,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("Error al confirmar el pago y añadir al estudiante al curso");
  }
});

export default router;
