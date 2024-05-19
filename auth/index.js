import express from 'express';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import cors from 'cors';
import 'firebase/auth';

dotenv.config();
// Inicializa Firebase Admin SDK utilizando las variables de entorno
admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Reemplazar \n por saltos de línea reales
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    }),
    databaseURL: "https://your-database-name.firebaseio.com"
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
const verifyToken = async (req, res, next) => {
    const idToken = req.headers.authorization;

    if (!idToken) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Agrega el usuario decodificado al objeto de solicitud
        next(); // Permite el acceso a la ruta protegida
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid token');
    }
};

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });
        res.status(201).send({ uid: userRecord.uid });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Ruta para autenticar usuarios
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Firebase Admin SDK no soporta directamente la verificación de credenciales, por lo que utilizamos el Firebase Client SDK para obtener un idToken.
        const userCredential = await admin.auth().getUserByEmail(email);
        const idToken = await admin.auth().createCustomToken(userCredential.uid);
        res.send({ idToken });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Ruta protegida de ejemplo
app.get('/protected', verifyToken, async (req, res) => {
    res.send({ uid: req.user.uid, message: 'You have access to this protected route!' });
});



app.post('/logout', async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        await admin.auth().revokeRefreshTokens(decodedToken.uid);
        res.send({ message: 'User logged out and tokens revoked' });
    } catch (error) {
        res.status(400).send(error.message);
    }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
