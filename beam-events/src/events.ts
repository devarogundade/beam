import {
  HookRegistered as HookRegisteredEvent,
  HookUnRegistered as HookUnRegisteredEvent,
  MerchantCreated as MerchantCreatedEvent,
  MerchantMetadataUpdated as MerchantMetadataUpdatedEvent,
  OneTimePaymentCreated as OneTimePaymentCreatedEvent,
  OneTimePaymentFulfilled as OneTimePaymentFulfilledEvent,
  PaymentReceived as PaymentReceivedEvent,
  RecurrentPaymentCancelled as RecurrentPaymentCancelledEvent,
  RecurrentPaymentCreated as RecurrentPaymentCreatedEvent,
  RecurrentPaymentFulfilled as RecurrentPaymentFulfilledEvent,
  SignersUpdated as SignersUpdatedEvent,
  SubsciptionDeleted as SubsciptionDeletedEvent,
  SubscriptionCreated as SubscriptionCreatedEvent,
  SubscriptionUpdated as SubscriptionUpdatedEvent,
  TokensUpdated as TokensUpdatedEvent,
  WithdrawRequestApproved as WithdrawRequestApprovedEvent,
  WithdrawRequestCreated as WithdrawRequestCreatedEvent,
  WithdrawRequestExecuted as WithdrawRequestExecutedEvent
} from "../generated/Events/Events";
import {
  Merchant,
  Payment,
  Subscription,
  WithdrawRequest,
  Transaction,
} from "../generated/schema";
import { Bytes, Value } from "@graphprotocol/graph-ts";

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
  merchant.signers = Value.fromAddressArray(event.params.signers).toBytesArray();
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

export function handleOneTimePaymentCreated(
  event: OneTimePaymentCreatedEvent
): void {
  let payment = new Payment(event.params.paymentId);

  payment.paymentId = event.params.paymentId;
  payment.payer = event.params.payer;
  payment.payers = Value.fromAddressArray(event.params.payers).toBytesArray();
  payment.merchant = event.params.merchant;
  payment.token = event.params.token;
  payment.amounts = event.params.amounts;
  payment.adjustedToken = event.params.adjustedToken;
  payment.adjustedAmount = event.params.adjustedAmount;
  payment.timestamp = event.params.timestamp;
  payment.description = event.params.description;
  payment.metadata_schemaVersion = event.params.metadata.schemaVersion;
  payment.metadata_value = event.params.metadata.value;
  payment.status = event.params.status;
  payment.type = 0;

  payment.blockNumber = event.block.number;
  payment.blockTimestamp = event.block.timestamp;
  payment.transactionHash = event.transaction.hash;

  payment.save();
}

export function handleOneTimePaymentFulfilled(
  event: OneTimePaymentFulfilledEvent
): void {
  let payment = Payment.load(event.params.paymentId);
  if (!payment) return;

  payment.fulfilleds.push(Value.fromAddress(event.params.payer).toBytes());
  payment.status = event.params.status;

  payment.save();

  let transaction = new Transaction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  transaction.paymentId = event.params.paymentId;
  transaction.from = event.params.payer;
  transaction.recipient = event.params.merchant;
  transaction.token = transaction.token;
  transaction.amount = event.params.amount;
  transaction.adjustedToken = event.params.adjustedToken;
  transaction.adjustedAmount = event.params.adjustedAmount;
  transaction.description = payment.description;
  transaction.type = 0;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.save();
}

export function handlePaymentReceived(event: PaymentReceivedEvent): void {
  let transaction = new Transaction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  transaction.paymentId = event.params.paymentId;
  transaction.from = event.params.payer;
  transaction.recipient = event.params.merchant;
  transaction.token = event.params.token;
  transaction.amount = event.params.amount;
  transaction.type = 1;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.save();
}

export function handleRecurrentPaymentCancelled(
  event: RecurrentPaymentCancelledEvent
): void {
  let payment = Payment.load(event.params.paymentId);
  if (!payment) return;

  payment.paymentId = event.params.paymentId;
  payment.status = 3;

  payment.save();
}

export function handleRecurrentPaymentCreated(
  event: RecurrentPaymentCreatedEvent
): void {
  let payment = new Payment(event.params.paymentId);

  payment.paymentId = event.params.paymentId;
  payment.payer = event.params.payer;
  payment.merchant = event.params.merchant;
  payment.dueDate = event.params.dueDate;
  payment.token = event.params.token;
  payment.amount = event.params.amount;
  payment.timestamp = event.params.timestamp;
  payment.description = event.params.description;
  payment.metadata_schemaVersion = event.params.metadata.schemaVersion;
  payment.metadata_value = event.params.metadata.value;
  payment.status = event.params.status;
  payment.type = 1;

  payment.blockNumber = event.block.number;
  payment.blockTimestamp = event.block.timestamp;
  payment.transactionHash = event.transaction.hash;

  payment.save();
}

export function handleRecurrentPaymentFulfilled(
  event: RecurrentPaymentFulfilledEvent
): void {
  let payment = Payment.load(event.params.paymentId);
  if (!payment) return;

  payment.dueDate = event.params.dueDate;
  payment.status = event.params.status;

  payment.save();

  let transaction = new Transaction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  transaction.paymentId = event.params.paymentId;
  transaction.from = event.params.payer;
  transaction.recipient = event.params.merchant;
  transaction.token = event.params.token;
  transaction.amount = event.params.amount;
  transaction.adjustedToken = event.params.adjustedToken;
  transaction.adjustedAmount = event.params.adjustedAmount;
  transaction.description = payment.description;
  transaction.type = 0;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.save();
}

export function handleSignersUpdated(
  event: SignersUpdatedEvent
): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.signers = Value.fromAddressArray(event.params.signers).toBytesArray();
  merchant.minSigners = event.params.minSigners;

  merchant.save();
}

export function handleSubsciptionDeleted(
  event: SubsciptionDeletedEvent
): void {
  let subscription = Subscription.load(event.params.subsciptionId);
  if (!subscription) return;

  subscription.trashed = true;

  subscription.save();
}

export function handleSubscriptionCreated(
  event: SubscriptionCreatedEvent
): void {
  let subscription = new Subscription(event.params.subsciptionId);

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
  let subscription = Subscription.load(event.params.subsciptionId);
  if (!subscription) return;

  subscription.amount = event.params.amount;
  subscription.gracePeriod = event.params.gracePeriod;
  subscription.description = event.params.description;

  subscription.save();
}

export function handleTokensUpdated(
  event: TokensUpdatedEvent
): void {
  let merchant = Merchant.load(event.params.merchant);
  if (!merchant) return;

  merchant.tokens = Value.fromAddressArray(event.params.tokens).toBytesArray();

  merchant.save();
}

export function handleWithdrawRequestApproved(
  event: WithdrawRequestApprovedEvent
): void {
  let request = WithdrawRequest.load(
    event.params.merchant.concatI32(event.params.requestId.toI32())
  );
  if (!request) return;

  request.fulfilleds.push(Value.fromAddress(event.params.signer).toBytes());

  request.save();
}

export function handleWithdrawRequestCreated(
  event: WithdrawRequestCreatedEvent
): void {
  let request = new WithdrawRequest(
    event.params.merchant.concatI32(event.params.requestId.toI32())
  );

  request.merchant = event.params.merchant;
  request.requestId = event.params.requestId;
  request.token = event.params.token;
  request.amount = event.params.amount;
  request.recipient = event.params.recipient;
  request.signers = Value.fromAddressArray(event.params.signers).toBytesArray();
  request.executed = event.params.executed;

  request.blockNumber = event.block.number;
  request.blockTimestamp = event.block.timestamp;
  request.transactionHash = event.transaction.hash;

  request.save();
}

export function handleWithdrawRequestExecuted(
  event: WithdrawRequestExecutedEvent
): void {
  let request = WithdrawRequest.load(
    event.params.merchant.concatI32(event.params.requestId.toI32())
  );
  if (!request) return;

  request.executed = true;

  request.save();

  let transaction = new Transaction(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  transaction.from = event.params.merchant;
  transaction.recipient = request.recipient;
  transaction.token = request.token;
  transaction.amount = request.amount;
  transaction.type = 2;

  transaction.blockNumber = event.block.number;
  transaction.blockTimestamp = event.block.timestamp;
  transaction.transactionHash = event.transaction.hash;

  transaction.save();
}
