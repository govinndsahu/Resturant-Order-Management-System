import PushSubscription from "../models/pushsubscriptionModel.js";
import webpush from "web-push";

export const savePushSubscription = async (req, res) => {
  try {
    console.log("Hello World!");

    const subscription = req.body.subscription ?? req.body;

    if (!subscription) {
      return res
        .status(400)
        .json({ message: "Push subscription payload is required" });
    }

    const { endpoint, expirationTime, keys } = subscription;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({
        message: "Invalid push subscription payload",
        missing: {
          endpoint: !endpoint,
          p256dh: !keys?.p256dh,
          auth: !keys?.auth,
        },
      });
    }

    const subscriptions = await PushSubscription.find({
      userId: req.user._id,
      endpoint,
    }).lean();

    if (!subscriptions) {
      await PushSubscription.deleteMany({
        userId: req.user._id,
      });
    }

    if (subscriptions.length > 0) {
      return res
        .status(200)
        .json({ message: "Push subscription already exists" });
    }

    const pushSubscription = new PushSubscription({
      userId: req.user._id,
      endpoint,
      expirationTime: expirationTime ? new Date(expirationTime) : null,
      keys: {
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    await pushSubscription.save();

    return res
      .status(201)
      .json({ message: "Push subscription saved successfully" });
  } catch (error) {
    console.error("Error saving push subscription:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendPushNotification = async (req, res, next) => {
  try {
    const payload = JSON.stringify({
      title: "New Order",
      body: "You have a new order.",
      url: "/",
    });

    const subscriptions = await PushSubscription.find()
      .lean()
      .select("endpoint keys -_id expirationTime");

    await Promise.allSettled(
      subscriptions.map((sub) => webpush.sendNotification(sub, payload)),
    );

    return res.status(200).json({ message: "Push notifications sent" });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return res
      .status(500)
      .json({ message: "Failed to send push notification" });
  }
};
