import moment from "moment";

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
const startMonth = "january"; // January
const endMonth = "june"; // June
const daysOfWeek = ["Monday", "Wednesday"]; // Example days

const dates = generateDates(startMonth, endMonth, daysOfWeek);
console.log(dates);
