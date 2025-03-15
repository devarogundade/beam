import {
  HookRegistered as HookRegisteredEvent,
  HookUnRegistered as HookUnRegisteredEvent,
  MerchantCreated as MerchantCreatedEvent,
  MerchantMetadataUpdated as MerchantMetadataUpdatedEvent,
  OneTimeTransactionCreated as OneTimeTransactionCreatedEvent,
  OneTimeTransactionFulfilled as OneTimeTransactionFulfilledEvent,
  TransactionReceived as TransactionReceivedEvent,
  RecurrentTransactionCancelled as RecurrentTransactionCancelledEvent,
  RecurrentTransactionCreated as RecurrentTransactionCreatedEvent,
  RecurrentTransactionFulfilled as RecurrentTransactionFulfilledEvent,
  SignersUpdated as SignersUpdatedEvent,
  SubsciptionDeleted as SubsciptionDeletedEvent,
  SubscriptionCreated as SubscriptionCreatedEvent,
  SubscriptionUpdated as SubscriptionUpdatedEvent,
  TokensUpdated as TokensUpdatedEvent,
  WithdrawRequestApproved as WithdrawRequestApprovedEvent,
  WithdrawRequestCreated as WithdrawRequestCreatedEvent,
  WithdrawRequestExecuted as WithdrawRequestExecutedEvent,
} from "../generated/Events/Events";
import {
  Merchant,
  Transaction,
  SubscriptionPlan,
  Confirmation,
} from "../generated/schema";
import { BigInt, Bytes, Value } from "@graphprotocol/graph-ts";

export function handleHookRegistered(event: HookRegisteredEvent): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.hook = event.params.hook;

  merchant.save();
}

export function handleHookUnRegistered(event: HookUnRegisteredEvent): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.hook = Bytes.empty();

  merchant.save();
}

export function handleMerchantCreated(event: MerchantCreatedEvent): void {
  let merchant = new Merchant(event.params.merchant);

  merchant.merchant = event.params.merchant;
  merchant.metadata_schemaVersion = event.params.metadata.schemaVersion;
  merchant.metadata_value = event.params.metadata.value;
  merchant.wallet = event.params.wallet;
  merchant.tokens = Value.fromAddressArray(event.params.tokens).toBytesArray();
  merchant.hook = Bytes.empty();
  merchant.signers = Value.fromAddressArray(
    event.params.signers
  ).toBytesArray();
  merchant.minSigners = event.params.minSigners;

  merchant.blockNumber = event.block.number;
  merchant.blockTimestamp = event.block.timestamp;
  merchant.transactionHash = event.transaction.hash;

  merchant.save();
}

export function handleMerchantMetadataUpdated(
  event: MerchantMetadataUpdatedEvent
): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.metadata_schemaVersion = event.params.metadata.schemaVersion;
  merchant.metadata_value = event.params.metadata.value;

  merchant.save();
}

export function handleOneTimeTransactionCreated(
  event: OneTimeTransactionCreatedEvent
): void {
  let transaction = new Transaction(event.params.transactionId);

  transaction.transactionId = event.params.transactionId;
  transaction.payer = event.params.payer;
  transaction.payers = Value.fromAddressArray(
    event.params.payers
  ).toBytesArray();
  transaction.fulfilleds = [Value.fromAddress(event.params.payer).toBytes()];
  transaction.merchant = event.params.merchant;
  transaction.token = event.params.token;
  transaction.amounts = event.params.amounts;
  transaction.adjustedToken = event.params.adjustedToken;
  transaction.adjustedAmount = event.params.adjustedAmount;

  transaction.timestamp = event.params.timestamp;
  transaction.description = event.params.description;
  transaction.metadata_schemaVersion = event.params.metadata.schemaVersion;
  transaction.metadata_value = event.params.metadata.value;
  transaction.status = event.params.status;
  transaction.type = 0;

  transaction.signers = [];

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  let amount = new BigInt(0);

  for (let index = 0; index < event.params.payers.length; index++) {
    if (event.params.payers[index] == event.params.payer) {
      amount = event.params.amounts[index];
      break;
    }
  }

  confirmation.transactionId = event.params.transactionId;
  confirmation.from = event.params.payer;
  confirmation.recipient = event.params.merchant;
  confirmation.token = transaction.token;
  confirmation.amount = amount;
  confirmation.adjustedToken = event.params.adjustedToken;
  confirmation.adjustedAmount = event.params.adjustedAmount;
  confirmation.description = transaction.description;
  confirmation.type = 0;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.transactionId;

  confirmation.save();
}

export function handleOneTimeTransactionFulfilled(
  event: OneTimeTransactionFulfilledEvent
): void {
  let transaction = Transaction.load(event.params.transactionId);
  if (!transaction) return;

  transaction.fulfilleds.push(Value.fromAddress(event.params.payer).toBytes());

  transaction.status = event.params.status;

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.transactionId;
  confirmation.from = event.params.payer;
  confirmation.recipient = event.params.merchant;
  confirmation.token = transaction.token;
  confirmation.amount = event.params.amount;
  confirmation.adjustedToken = event.params.adjustedToken;
  confirmation.adjustedAmount = event.params.adjustedAmount;
  confirmation.description = transaction.description;
  confirmation.type = 0;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.transactionId;

  confirmation.save();
}

// export function handleTransactionReceived(
//   event: TransactionReceivedEvent
// ): void {
//   let confirmation = new Confirmation(
//     event.transaction.hash.concatI32(event.logIndex.toI32())
//   );

//   confirmation.transactionId = event.params.transactionId;
//   confirmation.from = event.params.payer;
//   confirmation.recipient = event.params.merchant;
//   confirmation.token = event.params.token;
//   confirmation.amount = event.params.amount;
//   confirmation.type = 1;

//   confirmation.blockNumber = event.block.number;
//   confirmation.blockTimestamp = event.block.timestamp;
//   confirmation.transactionHash = event.transaction.hash;

//   confirmation.transaction = event.params.transactionId;

//   confirmation.save();
// }

export function handleRecurrentTransactionCancelled(
  event: RecurrentTransactionCancelledEvent
): void {
  let transaction = Transaction.load(event.params.transactionId);
  if (!transaction) return;

  transaction.transactionId = event.params.transactionId;
  transaction.status = 3;

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.transactionId;
  confirmation.token = transaction.token;
  confirmation.description = transaction.description;
  confirmation.type = 3;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.transactionId;

  confirmation.save();
}

export function handleRecurrentTransactionCreated(
  event: RecurrentTransactionCreatedEvent
): void {
  let transaction = new Transaction(event.params.transactionId);

  transaction.transactionId = event.params.transactionId;
  transaction.payer = event.params.payer;
  transaction.merchant = event.params.merchant;
  transaction.token = event.params.token;
  transaction.adjustedToken = event.params.adjustedToken;
  transaction.adjustedAmount = event.params.adjustedAmount;
  transaction.dueDate = event.params.dueDate;
  transaction.amount = event.params.amount;
  transaction.timestamp = event.params.timestamp;
  transaction.description = event.params.description;
  transaction.metadata_schemaVersion = event.params.metadata.schemaVersion;
  transaction.metadata_value = event.params.metadata.value;
  transaction.status = event.params.status;
  transaction.type = 1;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.payers = [];
  transaction.signers = [];

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.transactionId;
  confirmation.from = event.params.payer;
  confirmation.recipient = event.params.merchant;
  confirmation.token = transaction.token;
  confirmation.amount = event.params.amount;
  confirmation.adjustedToken = event.params.adjustedToken;
  confirmation.adjustedAmount = event.params.adjustedAmount;
  confirmation.description = transaction.description;
  confirmation.type = 0;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.transactionId;

  confirmation.save();
}

export function handleRecurrentTransactionFulfilled(
  event: RecurrentTransactionFulfilledEvent
): void {
  let transaction = Transaction.load(event.params.transactionId);
  if (!transaction) return;

  transaction.dueDate = event.params.dueDate;
  transaction.status = event.params.status;

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.transactionId;
  confirmation.from = event.params.payer;
  confirmation.recipient = event.params.merchant;
  confirmation.token = event.params.token;
  confirmation.amount = event.params.amount;
  confirmation.adjustedToken = event.params.adjustedToken;
  confirmation.adjustedAmount = event.params.adjustedAmount;
  confirmation.description = transaction.description;
  confirmation.type = 1;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.transactionId;

  confirmation.save();
}

export function handleSignersUpdated(event: SignersUpdatedEvent): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.signers = Value.fromAddressArray(
    event.params.signers
  ).toBytesArray();
  merchant.minSigners = event.params.minSigners;

  merchant.save();
}

export function handleSubsciptionDeleted(event: SubsciptionDeletedEvent): void {
  let subscription = SubscriptionPlan.load(event.params.subsciptionId);
  if (!subscription) return;

  subscription.trashed = true;

  subscription.save();
}

export function handleSubscriptionCreated(
  event: SubscriptionCreatedEvent
): void {
  let subscription = new SubscriptionPlan(event.params.subsciptionId);

  subscription.subsciptionId = event.params.subsciptionId;
  subscription.merchant = event.params.merchant;
  subscription.interval = event.params.interval;
  subscription.amount = event.params.amount;
  subscription.gracePeriod = event.params.gracePeriod;
  subscription.description = event.params.description;
  subscription.trashed = false;

  subscription.blockNumber = event.block.number;
  subscription.blockTimestamp = event.block.timestamp;
  subscription.transactionHash = event.transaction.hash;

  subscription.save();
}

export function handleSubscriptionUpdated(
  event: SubscriptionUpdatedEvent
): void {
  let subscription = SubscriptionPlan.load(event.params.subsciptionId);
  if (!subscription) return;

  subscription.amount = event.params.amount;
  subscription.gracePeriod = event.params.gracePeriod;
  subscription.description = event.params.description;

  subscription.save();
}

export function handleTokensUpdated(event: TokensUpdatedEvent): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.tokens = Value.fromAddressArray(event.params.tokens).toBytesArray();

  merchant.save();
}

export function handleWithdrawRequestApproved(
  event: WithdrawRequestApprovedEvent
): void {
  let transaction = Transaction.load(
    event.params.merchant.concatI32(event.params.requestId.toI32())
  );
  if (!transaction) return;

  transaction.signers.push(Value.fromAddress(event.params.signer).toBytes());

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );
  confirmation.from = event.params.merchant;
  confirmation.recipient = transaction.recipient;
  confirmation.token = transaction.token;
  confirmation.amount = transaction.amount;
  confirmation.type = 1;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );

  confirmation.save();
}

export function handleWithdrawRequestCreated(
  event: WithdrawRequestCreatedEvent
): void {
  let transaction = new Transaction(
    event.params.merchant.concatI32(event.params.requestId.toI32())
  );

  transaction.transactionId = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );
  transaction.merchant = event.params.merchant;
  transaction.token = event.params.token;
  transaction.amount = event.params.amount;
  transaction.recipient = event.params.recipient;
  transaction.signers = Value.fromAddressArray(
    event.params.signers
  ).toBytesArray();
  transaction.executed = event.params.executed;
  transaction.type = 2;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.payers = [];

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );
  confirmation.from = event.params.merchant;
  confirmation.recipient = transaction.recipient;
  confirmation.token = transaction.token;
  confirmation.amount = transaction.amount;
  confirmation.type = 0;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );

  confirmation.save();
}

export function handleWithdrawRequestExecuted(
  event: WithdrawRequestExecutedEvent
): void {
  let transaction = Transaction.load(
    event.params.merchant.concatI32(event.params.requestId.toI32())
  );
  if (!transaction) return;

  transaction.executed = true;

  transaction.save();

  let confirmation = new Confirmation(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  confirmation.transactionId = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );
  confirmation.from = event.params.merchant;
  confirmation.recipient = transaction.recipient;
  confirmation.token = transaction.token;
  confirmation.amount = transaction.amount;
  confirmation.type = 2;

  confirmation.blockNumber = event.block.number;
  confirmation.blockTimestamp = event.block.timestamp;
  confirmation.transactionHash = event.transaction.hash;

  confirmation.transaction = event.params.merchant.concatI32(
    event.params.requestId.toI32()
  );

  confirmation.save();
}
