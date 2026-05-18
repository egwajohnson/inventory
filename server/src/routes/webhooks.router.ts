import { Response } from "express";
import crypto from "crypto";
import { IRequest } from "../middleware/auth.middleware";
import { ShopifyOrder } from "../interface/shopifyOrder";
import { SHOPIFY_WEBHOOK_SECRET } from "../config/system.variable";

const webHooks = async (req: IRequest, res: Response) => {
  try {
    //  * SHOPIFY WEBHOOK HEADERS

    const shopifyHmac = req.headers["x-shopify-hmac-sha256"] as string;

    const topic = req.headers["x-shopify-topic"] as string;

    const shopDomain = req.headers["x-shopify-shop-domain"] as string;

    //  * RAW BODY
    //  * Must use express.raw()

    const rawBody = req.body;

    if (!rawBody) {
      return res.status(400).json({
        success: false,
        message: "Missing webhook body",
      });
    }

    /**
     * VERIFY SHOPIFY WEBHOOK
     */

    const generatedHash = crypto
      .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET as string)
      .update(rawBody)
      .digest("base64");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedHash),
      Buffer.from(shopifyHmac),
    );

    if (!isValid) {
      console.log("❌ Invalid Shopify webhook signature");

      return res.status(401).json({
        success: false,
        message: "Unauthorized webhook",
      });
    }

    /**
     * PARSE EVENT
     */

    const event = JSON.parse(rawBody.toString());

    console.log("====================================");
    console.log("✅ Shopify Webhook Received");
    console.log("📌 Topic:", topic);
    console.log("🏪 Shop:", shopDomain);
    console.log("====================================");

    /**
     * HANDLE EVENTS
     */

    switch (topic) {
      /**
       * ORDER CREATED
       */

      case "orders/create": {
        const order: ShopifyOrder = event;

        console.log("🛒 New Order Created");
        console.log("Order ID:", order.id);
        console.log("Customer Email:", order.email);
        console.log("Total Price:", order.total_price);

        /**
         * SAVE TO DATABASE
         */

        // await OrderModel.create({
        //   shopifyOrderId: order.id,
        //   email: order.email,
        //   totalPrice: order.total_price,
        //   customer: order.customer,
        // });

        break;
      }

      /**
       * APP UNINSTALLED
       */

      case "app/uninstalled": {
        console.log("⚠️ Shopify App Uninstalled");

        /**
         * REMOVE STORE FROM DATABASE
         */

        // await ShopModel.deleteOne({
        //   shop: shopDomain,
        // });

        break;
      }

      /**
       * PRODUCTS UPDATE
       */

      case "products/update": {
        console.log("📦 Product Updated");

        console.log(event);

        break;
      }

      /**
       * DEFAULT
       */

      default:
        console.log(`⚠️ Unhandled topic: ${topic}`);
        break;
    }

    /**
     * SUCCESS RESPONSE
     */

    return res.status(200).json({
      success: true,
      received: true,
    });
  } catch (error: any) {
    console.error("❌ Shopify Webhook Error");

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export default webHooks;
