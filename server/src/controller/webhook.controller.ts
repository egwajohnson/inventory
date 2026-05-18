import { Response } from "express";
import crypto from "crypto";
import { IRequest } from "../middleware/auth.middleware";
import { ShopifyOrder } from "../interface/shopifyOrder";
``;
import {
  PAYSTACK_SECRET_KEY,
  SHOPIFY_WEBHOOK_SECRET,
} from "../config/system.variable";

class WebhookController {
  static paystackWebhook = async (
    req: IRequest,
    res: Response,
  ): Promise<void> => {
    try {
      /**
       * PAYSTACK SIGNATURE
       */

      const paystackSignature = req.headers["x-paystack-signature"] as string;

      /*
       * RAW BODY
       */

      const rawBody = JSON.stringify(req.body);

      if (!rawBody) {
        res.status(400).json({
          success: false,
          message: "Missing webhook body",
        });
      }

      /**
       * VERIFY WEBHOOK
       * Paystack uses HEX digest
       */

      const generatedHash = crypto
        .createHmac("sha512", PAYSTACK_SECRET_KEY as string)
        .update(rawBody)
        .digest("hex");

      /**
       * Prevent timing attacks
       */

      const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedHash),
        Buffer.from(paystackSignature),
      );

      if (!isValid) {
        console.log("❌ Invalid Paystack Signature");

        res.status(401).json({
          success: false,
          message: "Invalid signature",
        });
      }

      /**
       * EVENT DATA
       */

      const event = req.body;

      console.log("================================");
      console.log("✅ Paystack Webhook Received");
      console.log("📌 Event:", event.event);
      console.log("================================");

      /**
       * HANDLE EVENTS
       */

      switch (event.event) {
        /**
         * PAYMENT SUCCESS
         */

        case "charge.success": {
          const paymentData = event.data;

          console.log("💰 Payment Successful");
          console.log("Reference:", paymentData.reference);
          console.log("Amount:", paymentData.amount);
          console.log("Customer Email:", paymentData.customer.email);

          /**
           * Example:
           * Update order payment status
           */

          // await OrderModel.findOneAndUpdate(
          //   { reference: paymentData.reference },
          //   {
          //     paymentStatus: "paid",
          //     paidAt: new Date(),
          //   }
          // );

          break;
        }

        /**
         * TRANSFER SUCCESS
         */

        case "transfer.success": {
          console.log("✅ Transfer Successful");

          console.log(event.data);

          break;
        }

        /**
         * TRANSFER FAILED
         */

        case "transfer.failed": {
          console.log("❌ Transfer Failed");

          console.log(event.data);

          break;
        }

        /**
         * SUBSCRIPTION CREATED
         */

        case "subscription.create": {
          console.log("📦 Subscription Created");

          console.log(event.data);

          break;
        }

        /**
         * DEFAULT
         */

        default:
          console.log(`⚠️ Unhandled Paystack Event: ${event.event}`);
          break;
      }

      /**
       * SUCCESS RESPONSE
       */

      res.status(200).json({
        success: true,
        received: true,
      });
    } catch (error: any) {
      console.error("❌ Paystack Webhook Error");

      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message || "Internal Server Error",
      });
    }
  };

  //shopify webhooks

  static shopify = async (req: IRequest, res: Response) => {
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
}

export default WebhookController;
