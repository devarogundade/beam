/* eslint-disable prettier/prettier */

export class AppEvents {
  static receiptMinted(logs: any) {
    console.log('receiptMinted', logs);
  }

  static oneTimeTransactionCreated(logs: any) {
    console.log('oneTimeTransactionCreated', logs);
  }

  static oneTimeTransactionFulfilled(logs: any) {
    console.log('oneTimeTransactionFulfilled', logs);
  }

  static recurrentTransactionCreated(logs: any) {
    console.log('recurrentTransactionCreated', logs);
  }

  static recurrentTransactionFulfilled(logs: any) {
    console.log('recurrentTransactionFulfilled', logs);
  }

  static recurrentTransactionCancelled(logs: any) {
    console.log('recurrentTransactionCancelled', logs);
  }
}
