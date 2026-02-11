import { PaystackRepository } from "../repository/paystack.repository";
import { throwCustomError } from "../middleware/errorHandle.middleware";
import { Paystack } from "../util/paystack";
export class PaystackService {
  static async initializePayment(
    amount: number,
    email: string,
    userId: string,
    orderId: string,
  ) {
    if (!amount || !email || !userId || !orderId) {
      throwCustomError("Amount, email, userId, and orderId are required", 400);
    }
    try {
      const paystackResponse = await Paystack.initializeTransaction({
        email,
        amount: amount * 100,
        callback_url: "https://yourdomain.com/callback",
        metadata: {
          order_id: orderId,
          user_id: userId,
        },
      });
      let payment;
      if (paystackResponse.status === true) {
        const { reference, access_code, authorization_url } =
          paystackResponse.data;
        payment = await PaystackRepository.createPaystackTransaction({
          userId,
          orderId,
          amount: amount,
          reference,
          accessCode: access_code,
          authorizationUrl: authorization_url,
          status: "paid",
        });
        return payment;
      }
      return paystackResponse;
    } catch (error) {
      throwCustomError("Failed to initialize payment", 500);
    }
  }
  static async createTransaction(transactionData: any) {
    const response =
      await PaystackRepository.createPaystackTransaction(transactionData);
    return response;
  }
}
