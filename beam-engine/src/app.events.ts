/* eslint-disable prettier/prettier */

export class AppEvents {
  static receiptMinted(logs: any) {
    console.log('receiptMinted', logs);
  }

  static oneTimePaymentCreated(logs: any) {
    console.log('oneTimePaymentCreated', logs);
  }

  static oneTimePaymentFulfilled(logs: any) {
    console.log('oneTimePaymentFulfilled', logs);
  }

  static recurrentPaymentCreated(logs: any) {
    console.log('recurrentPaymentCreated', logs);
  }

  static recurrentPaymentFulfilled(logs: any) {
    console.log('recurrentPaymentFulfilled', logs);
  }

  static recurrentPaymentCancelled(logs: any) {
    console.log('recurrentPaymentCancelled', logs);
  }
}
