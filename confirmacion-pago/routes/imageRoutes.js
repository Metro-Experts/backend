import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import PaymentConfirmation from "../models/PaymentConfirmation.js";
dotenv.config();
const router = express.Router();

// Configuración de Multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const addPending = async (id, idCurso) => {
  const url = `https://uniexpert-gateway-6569fdd60e75.herokuapp.com/users/${id}/add-pending `;
  const body = {
    item: idCurso,
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

// Endpoint para subir la imagen y datos
router.post("/upload", upload.single("image"), async (req, res) => {
  const {
    idcurso,
    idtutor,
    estudiante,
    nombreTutoria,
    referencia,
    bancoEmisor,
    telefono,
  } = req.body;
  console.log(req.body);
  const estudiante1 = JSON.parse(estudiante);

  const newPaymentConfirmation = new PaymentConfirmation({
    idcurso,
    idtutor,
    nombreTutoria,
    estudiante: JSON.parse(estudiante),
    img: {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    },
    status: "espera",
    referencia,
    bancoEmisor,
    telefono,
  });

  try {
    await newPaymentConfirmation.save();
    addPending(estudiante1.idstudiante, idcurso);
    console.log("Datos y comprobante subidos y guardados en la base de datos");
    res.status(201).send({
      message: "Datos y comprobante subidos y guardados en la base de datos",
      id: newPaymentConfirmation._id,
    });
  } catch (error) {
    console.log("Error al guardar los datos y la imagen:", error.message);
    res.status(500).send({
      message: "Error al guardar los datos y la imagen",
      error: error.message,
    });
  }
});

// Endpoint para obtener la imagen por su ID
router.get("/:id", async (req, res) => {
  try {
    const paymentConfirmation = await PaymentConfirmation.findById(
      req.params.id
    );
    if (!paymentConfirmation) {
      return res.status(404).send({
        message: "Datos no encontrados",
        error: "No se encontró la confirmación de pago con el ID proporcionado",
      });
    }
    res.contentType(paymentConfirmation.img.contentType);
    res.send(paymentConfirmation.img.data);
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    res.send("hola");
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener los datos",
      error: error.message,
    });
  }
});

// Endpoint para verificar la conexión
router.get("/check/connection", (req, res) => {
  res.status(200).send("Connection is successful");
});

// Endpoint para confirmar el pago y añadir al estudiante al curso
router.get("/confirm/:id", async (req, res) => {
  try {
    const paymentConfirmation = await PaymentConfirmation.findById(
      req.params.id
    );
    if (!paymentConfirmation) {
      return res.status(404).send({
        message: "Confirmación no encontrada",
        error: "No se encontró la confirmación de pago con el ID proporcionado",
      });
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
    console.error(
      "Error al confirmar el pago y añadir al estudiante al curso:",
      error.message
    );
    res.status(500).send({
      message: "Error al confirmar el pago y añadir al estudiante al curso",
      error: error.message,
    });
  }
});

router.get("/tutor/:idtutor", async (req, res) => {
  try {
    const paymentConfirmations = await PaymentConfirmation.find({
      idtutor: req.params.idtutor,
    });

    // Convertir los datos de la imagen a base64
    const confirmationsWithBase64 = paymentConfirmations.map((confirmation) => {
      return {
        ...confirmation._doc,
        img: {
          ...confirmation.img,
          data: confirmation.img.data.toString("base64"),
        },
      };
    });

    res.status(200).json(confirmationsWithBase64);
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener los datos por idtutor",
      error: error.message,
    });
  }
});

// Endpoint para obtener documentos por idcurso
router.get("/curso/:idcurso", async (req, res) => {
  try {
    const paymentConfirmations = await PaymentConfirmation.find({
      idcurso: req.params.idcurso,
    });
    res.status(200).json(paymentConfirmations);
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener los datos por idcurso",
      error: error.message,
    });
  }
});

export default router;
