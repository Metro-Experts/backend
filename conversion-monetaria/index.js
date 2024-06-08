const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = process.env.PORT || 3000;

// URL de la página del Banco Central de Venezuela
const url = "https://www.bcv.org.ve/";

app.get("/dolar", async (req, res) => {
  try {
    // Realiza la solicitud HTTP a la URL
    const { data } = await axios.get(url);

    // Carga la página HTML en cheerio
    const $ = cheerio.load(data);

    // Extrae el valor del dólar utilizando selectores de cheerio
    const dolarValue = $("#dolar .col-sm-6.col-xs-6.centrado strong")
      .text()
      .trim();

    if (dolarValue) {
      res.json({ dolar: dolarValue });
    } else {
      res.status(404).json({ error: "No se encontró el valor del dólar" });
    }
  } catch (error) {
    console.error("Error al realizar el scraping:", error);
    res.status(500).json({ error: "Error al realizar el scraping" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
