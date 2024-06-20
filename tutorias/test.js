import moment from "moment";
import "moment/locale/es.js"; // Importa explícitamente el archivo es.js
moment.locale("es");

// Función para generar las fechas en el rango especificado
const generateDates = (startMonth, endMonth, daysOfWeek) => {
  const dates = [];
  let startDate = moment(startMonth, "MMMM");
  let endDate = moment(endMonth, "MMMM").endOf("month");

  // Iterar sobre los meses y días de la semana para generar las fechas
  while (startDate.isBefore(endDate)) {
    daysOfWeek.forEach((day) => {
      let current = startDate.clone().day(day);
      if (current.isBefore(startDate)) {
        current.add(7, "days");
      }
      while (current.isBefore(startDate.clone().add(1, "month"))) {
        if (current.isBetween(startDate, endDate, null, "[]")) {
          dates.push(current.format("YYYY-MM-DD"));
        }
        current.add(1, "week");
      }
    });
    startDate.add(1, "month");
  }

  return dates;
};

// Prueba de la función
const startMonth = "Febrero"; // February
const endMonth = "Marzo"; // March
const daysOfWeekInSpanish = ["Lunes", "Miércoles", "Viernes"];

// Convertir los días de la semana a inglés
const daysOfWeekInEnglish = daysOfWeekInSpanish.map((day) =>
  moment().day(day).format("dddd")
);

const dates = generateDates(startMonth, endMonth, daysOfWeekInEnglish);
console.log(dates);
