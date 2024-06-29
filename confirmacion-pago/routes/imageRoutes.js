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
    console.log(error);
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

router.get("/", async (req, res) => {
  try {
    res.send("hola");
  } catch (error) {
    res.status(500).send("Error al obtener los datos");
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
    res.status(500).send("Error al obtener los datos por idtutor");
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
    res.status(500).send("Error al obtener los datos por idcurso");
  }
});

export default router;
