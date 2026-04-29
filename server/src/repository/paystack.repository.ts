import { payoutModel } from "../models/paystack.model";
export class PaystackRepository {
  static async createPaystackTransaction(transactionData: any) {
    const response = await payoutModel.create(transactionData);
    return response;
  }
  static async updatePaymentStatus(reference: string, status: string) {
    const response = payoutModel.findOneAndUpdate(
      { reference },
      { status, updatedAt: new Date() },
      { new: true },
    );
    return response;
  }

  static async updateRefundAmount(reference: string, refundAmount: number) {
    const response = payoutModel.findOneAndUpdate(
      { reference },
      { refund: refundAmount },
      { new: true },
    );
    return response;
  }

  static async paymentRefund(reference: string, refundAmount: number) {
    const response = payoutModel.findOneAndUpdate(
      { reference },
      { refund: refundAmount },
      { new: true },
    );
    return response;
  }

  static async paymeentReference(reference: string) {
    const response = payoutModel.findOne({ reference });
    return response;
  }
}
