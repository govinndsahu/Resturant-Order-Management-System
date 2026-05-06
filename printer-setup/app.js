import "dotenv/config";
import { connectDB } from "./config/db.js";
import Order from "./models/orderModel.js";
import { printData } from "node-thermal-printer-js";

await connectDB();

const pollIntervalMs = 1000 * 2;
let lastPrintedOrderId = null;
let isPolling = false;

const formatItem = (item) =>
  `${item?.half_price ? "Half" : "Full"} ${item?.name ?? "Item"}`;

const initializeCursor = async () => {
  const latestOrder = await Order.findOne().sort({ _id: -1 });

  if (latestOrder) {
    lastPrintedOrderId = String(latestOrder._id);
  }
};

const getPendingOrders = async () => {
  const query = lastPrintedOrderId ? { _id: { $gt: lastPrintedOrderId } } : {};

  return Order.find(query).sort({ _id: 1 });
};

const pollForNewOrders = async () => {
  if (isPolling) {
    return;
  }

  isPolling = true;

  try {
    const pendingOrders = await getPendingOrders();

    if (!pendingOrders.length) {
      return;
    }

    for (const order of pendingOrders) {
      const items = Array.isArray(order.products)
        ? order.products.map(formatItem)
        : [];

      const data = [
        "New Order",
        `Table No: ${order.tableNumber}`,
        "",
        ...items,
      ].join("\n");

      const result = await printData(data, {
        transport: "ble",
        bleName: "PSF588",
        connectTimeout: 20,
        scanTimeout: 20,
      });

      lastPrintedOrderId = String(order._id);
    }
  } catch (error) {
    console.error("Failed to poll or print order:", error);
  } finally {
    isPolling = false;
    setTimeout(pollForNewOrders, pollIntervalMs);
  }
};

await initializeCursor();
await pollForNewOrders();
