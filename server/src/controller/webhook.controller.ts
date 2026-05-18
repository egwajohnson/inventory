import { Response } from "express";
import crypto from "crypto";
import { IRequest } from "../middleware/auth.middleware";
import { PAYSTACK_SECRET_KEY } from "../config/system.variable";

const webHooks = async (req: IRequest, res: Response) => {
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
      return res.status(400).json({
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

      return res.status(401).json({
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

    return res.status(200).json({
      success: true,
      received: true,
    });
  } catch (error: any) {
    console.error("❌ Paystack Webhook Error");

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};

export default webHooks;
