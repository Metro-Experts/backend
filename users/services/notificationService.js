/* eslint-disable no-undef */
import twilio from "twilio";
import User from "../models/User.js";
import cron from "node-cron";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const GATEWAY_URL = process.env.GATEWAY_URL;

const sendNotification = async (to, body) => {
  try {
    await client.messages.create({
      body: body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(`Notification sent to ${to}: ${body}`);
    return true;
  } catch (error) {
    console.error(`Error sending notification to ${to}:`, error);
    return false;
  }
};
//cd
const getCourseInfo = async (courseId) => {
  try {
    const response = await fetch(`${GATEWAY_URL}/courses/${courseId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const course = await response.json();
    return course;
  } catch (error) {
    console.error(`Error fetching course info for ID ${courseId}:`, error);
    return null;
  }
};

const checkTomorrowClasses = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  console.log(
    `Checking for classes between ${tomorrow.toISOString()} and ${dayAfterTomorrow.toISOString()}`
  );

  try {
    const users = await User.find({
      "calendar.date": { $gte: tomorrow, $lt: dayAfterTomorrow },
    });

    console.log(`Found ${users.length} users with classes tomorrow`);

    for (const user of users) {
      const tomorrowClasses = user.calendar.filter(
        (event) =>
          new Date(event.date) >= tomorrow &&
          new Date(event.date) < dayAfterTomorrow
      );

      console.log(
        `User ${user._id} has ${tomorrowClasses.length} classes tomorrow`
      );

      if (tomorrowClasses.length > 0) {
        let message = `Hola ${user.name}, recuerda que mañana tienes las siguientes clases:\n`;

        for (const classEvent of tomorrowClasses) {
          const course = await getCourseInfo(classEvent.courseId);
          const courseName = course ? course.name : "curso no especificado";
          const classTime = new Date(classEvent.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          message += `- "${courseName}" a las ${classTime}\n`;
        }

        await sendNotification(user.cellphone, message);
      }
    }
  } catch (error) {
    console.error("Error checking tomorrow's classes:", error);
  }
};

// Programar la tarea para que se ejecute una vez al día
cron.schedule("0 0 * * *", checkTomorrowClasses);

export const startNotificationService = () => {
  console.log("Daily notification service started");
  console.log(
    "Notifications will be sent once daily for the next day's classes"
  );
  checkTomorrowClasses(); // Ejecutar inmediatamente al iniciar el servicio
};
