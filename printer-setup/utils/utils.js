import Order from "../models/orderModel.js";

import { printData, startPrinterServer } from "node-thermal-printer-js";

const pollIntervalMs = 1000 * 2;
let lastPrintedOrderId = null;
let isPolling = false;

export const connectPrinter = async () => {
  try {
    return await startPrinterServer({
      bleName: process.env.BLE_NAME,
      chunkSize: 244,
      delayMs: 0,
      pair: false,
    });
  } catch (error) {
    console.log(error);
  }
};

export const formatItem = (item) =>
  `${item?.half_price ? "Half" : "Full"} ${item?.name ?? "Item"}`;

export const getPendingOrders = async () => {
  const query = lastPrintedOrderId ? { _id: { $gt: lastPrintedOrderId } } : {};

  return Order.find(query).sort({ _id: 1 });
};

export const pollForNewOrders = async () => {
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

      await printData(data, {
        autoStart: false,
        transport: process.env.TRANSPORT,
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

export const initializeCursor = async () => {
  const latestOrder = await Order.findOne().sort({ _id: -1 });

  if (latestOrder) {
    lastPrintedOrderId = String(latestOrder._id);
  }
};
