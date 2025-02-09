export enum PaymentStatus {
  Pending = 0, // The payment has been created but not yet processed.
  Active = 1, // The payment is currently in progress or being executed.
  Completed = 2, // The payment has been successfully completed.
  Cancelled = 3, // The payment was cancelled before completion.
}

/**
 * @enum PaymentType
 * @dev Enum representing the type of payment.
 * @notice Categorizes payments based on their structure and recurrence.
 */
export enum PaymentType {
  OneTime = 0, // A single, non-recurring payment.
  Recurrent = 1, // A recurring payment (e.g., subscriptions or periodic payments).
}

export enum Network {
  Testnet = "Testnet",
}
