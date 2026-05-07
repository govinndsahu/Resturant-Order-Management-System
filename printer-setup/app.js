import "dotenv/config";
import mongoose from "mongoose";
import { stopPrinterServer } from "node-thermal-printer-js";
import { connectDB } from "./config/db.js";
import {
  connectPrinter,
  initializeCursor,
  pollForNewOrders,
} from "./utils/utils.js";

await connectDB();

await connectPrinter();

await initializeCursor();

await pollForNewOrders();

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  await stopPrinterServer();
  console.log("DB client disconnected!!");
  process.exit(0);
});
