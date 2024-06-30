import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const userEndpoints = process.env.USER || "http://localhost:3001/users";
const courseEndpoints = process.env.COURSE || "http://localhost:3002/courses";
const subjectsEndpoints =
  process.env.SUBJECT || "http://localhost:3003/subjects";

const paymentsEndpoints = process.env.PAYMENT || "http://localhost:3003/images";
const conversionMonetaria = process.env.DOLAR || "http://localhost:3004/dolar";
const assistantEndpoint = process.env.ASSISTANT || "http://localhost:3005";
app.use(
  "/users",
  createProxyMiddleware({
    target: userEndpoints,
    changeOrigin: true,
    pathRewrite: {
      "^/users": "",
    },
  })
);

app.use(
  "/courses",
  createProxyMiddleware({
    target: courseEndpoints,
    changeOrigin: true,
    pathRewrite: {
      "^/courses": "",
    },
  })
);

app.use(
  "/subjects",
  createProxyMiddleware({
    target: subjectsEndpoints,
    changeOrigin: true,
    pathRewrite: {
      "^/subjects": "",
    },
  })
);

app.use(
  "/images",
  createProxyMiddleware({
    target: paymentsEndpoints,
    changeOrigin: true,
    pathRewrite: {
      "^/images": "",
    },
  })
);

app.use(
  "/dolar",
  createProxyMiddleware({
    target: conversionMonetaria,
    changeOrigin: true,
    pathRewrite: {
      "^/dolar": "",
    },
  })
);
app.use(
  "/assistant",
  createProxyMiddleware({
    target: assistantEndpoint,
    changeOrigin: true,
    pathRewrite: {
      "^/assistant": "",
    },
  })
);
app.get("/", (req, res) => {
  res.send("API Gateway");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
