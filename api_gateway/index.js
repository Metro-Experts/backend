import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const userEndpoints = process.env.USER || 'http://localhost:3001/users';
const courseEndpoints = process.env.COURSE || 'http://localhost:3002/courses';
console.log(userEndpoints);
console.log(courseEndpoints);
app.use(
    '/users',
    createProxyMiddleware({
        target: userEndpoints,
        changeOrigin: true,
        pathRewrite: {
            '^/users': '',
        },
    })
);

app.use(
    '/courses',
    createProxyMiddleware({
        target: courseEndpoints,
        changeOrigin: true,
        pathRewrite: {
            '^/courses': '',
        },
    })
);

app.get('/', (req, res) => {
    res.send('API Gateway');
});

const PORT = process.env.PORT|| 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
