import express from "express";
import  { createProxyMiddleware } from "http-proxy-middleware"

const app = express();


app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://localhost:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/serviceA": "",
    },
  })
);


app.use(
  "/serviceB",
  createProxyMiddleware({
    target: "http://localhost:3002",
    changeOrigin: true,
    pathRewrite: {
      "^/serviceB": "",
    },
  })
);

// Puerto en el que el API Gateway escuchará
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en el puerto ${PORT}`);
});
