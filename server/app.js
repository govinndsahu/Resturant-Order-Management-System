import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import pushsubscriptionRoutes from "./routes/pushsubscriptionRoutes.js";

import { pushNotificationSetup } from "./config/webpush.js";
import { globalError, handleCors } from "./utils/utils.js";

const app = express();

const port = process.env.PORT;

const whitelist = [process.env.CLIENT_URL, "http://192.168.1.2:5173"];

pushNotificationSetup();

app.use(handleCors());

app.use(helmet());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_PARSER_SESSION_KEY));

app.get("/health", (req, res) => res.end("ok"));

app.use("/users", userRoutes);

app.use("/categories", categoryRoutes);

app.use("/products", productRoutes);

app.use("/orders", orderRoutes);

app.use("/histories", historyRoutes);

app.use("/push-subscriptions", pushsubscriptionRoutes);

app.use(globalError());

if (!process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;
