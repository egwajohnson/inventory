import { Request, Response } from "express";

const webHooks = async (req: Request, res: Response) => {
  try {
    const event = req.body;

    console.log("Webhook received:");
    console.log(event);

    // Example Shopify webhook topic
    const topic = req.headers["x-shopify-topic"];

    // Handle orders/create webhook
    if (topic === "orders/create") {
      console.log("New Shopify order created");

      const order = event;

      console.log(order.id);

      // Save order to database
    }

    // Handle app uninstall webhook
    if (topic === "app/uninstalled") {
      console.log("Shopify app uninstalled");
    }

    res.status(200).json({
      success: true,
      received: true,
    });
  } catch (error: any) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export default webHooks;
