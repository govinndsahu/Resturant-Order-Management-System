import express from "express";
import { isLogedIn, isStaff } from "../middlewares/validateMiddleware.js";
import {
  savePushSubscription,
  sendPushNotification,
} from "../controllers/pushsubscriptionController.js";

const router = express.Router();

router.post("/subscribe", isLogedIn, isStaff, savePushSubscription);

router.post("/send-notification", sendPushNotification);

export default router;
