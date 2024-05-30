import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import coursesRoutes from './routes/coursesRoutes.js';
import cors from 'cors';

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;
app.use(cors());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error(error));

// Middleware
app.use(bodyParser.json());

// Rutas
app.use('/subjects', coursesRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
