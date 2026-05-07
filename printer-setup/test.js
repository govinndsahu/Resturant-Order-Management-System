import "dotenv/config";
import mongoose from "mongoose";
import {
  printData,
  startPrinterServer,
  stopPrinterServer,
} from "node-thermal-printer-js";
import { connectDB } from "./config/db.js";
import Order from "./models/orderModel.js";

const shouldPrint = process.env.CHANGE_STREAM_PRINT === "true";
let stream;

const formatItem = (item) =>
  `${item?.half_price ? "Half" : "Full"} ${item?.name ?? "Item"}`;

const printOrder = async (order) => {
  const items = Array.isArray(order.products)
    ? order.products.map(formatItem)
    : [];
  const data = [
    "New Order",
    `Table No: ${order.tableNumber}`,
    "",
    ...items,
  ].join("\n");

  await printData(data, {
    autoStart: false,
    transport: process.env.TRANSPORT,
  });
};

const shutdown = async (signal) => {
  console.log(`Received ${signal}. Closing change stream...`);

  try {
    if (stream) {
      await stream.close();
    }

    if (shouldPrint) {
      await stopPrinterServer();
    }

    await mongoose.disconnect();
    console.log("Change stream stopped. DB disconnected.");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
};

const run = async () => {
  await connectDB();

  if (shouldPrint) {
    await startPrinterServer({
      bleName: process.env.BLE_NAME,
      chunkSize: 244,
      delayMs: 0,
      pair: false,
    });
    console.log("Printer server started");
  } else {
    console.log(
      "Running in dry mode (CHANGE_STREAM_PRINT=false): no print commands will be sent.",
    );
  }

  stream = Order.watch([{ $match: { operationType: "insert" } }], {
    fullDocument: "updateLookup",
  });

  stream.on("change", async (change) => {
    const order = change.fullDocument;

    if (!order) {
      return;
    }

    console.log(`New order detected: ${order._id}`);

    if (!shouldPrint) {
      console.log("Dry mode event payload:", {
        orderId: String(order._id),
        tableNumber: order.tableNumber,
        productsCount: Array.isArray(order.products)
          ? order.products.length
          : 0,
      });
      return;
    }

    try {
      await printOrder(order);
      console.log(`Printed order: ${order._id}`);
    } catch (error) {
      console.error("Failed to print order from change stream:", error);
    }
  });

  stream.on("error", (error) => {
    console.error("Change stream error:", error);
  });

  console.log("Listening for new order inserts via MongoDB change stream...");
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

run().catch((error) => {
  console.error("Failed to start change stream test:", error);
  process.exit(1);
});
