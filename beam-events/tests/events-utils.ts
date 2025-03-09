import { newMockEvent } from "matchstick-as";
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  HookRegistered,
  HookUnRegistered,
  MerchantCreated,
  MerchantMetadataUpdated,
  OneTimeTransactionCreated,
  OneTimeTransactionFulfilled,
  TransactionReceived,
  RecurrentTransactionCancelled,
  RecurrentTransactionCreated,
  RecurrentTransactionFulfilled,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  SignersUpdated,
  SubsciptionDeleted,
  SubscriptionCreated,
  SubscriptionUpdated,
  TokensUpdated,
  WithdrawRequestApproved,
  WithdrawRequestCreated,
  WithdrawRequestExecuted,
} from "../generated/Events/Events";

export function createHookRegisteredEvent(
  merchant: Address,
  hook: Address
): HookRegistered {
  let hookRegisteredEvent = changetype<HookRegistered>(newMockEvent());

  hookRegisteredEvent.parameters = new Array();

  hookRegisteredEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  hookRegisteredEvent.parameters.push(
    new ethereum.EventParam("hook", ethereum.Value.fromAddress(hook))
  );

  return hookRegisteredEvent;
}

export function createHookUnRegisteredEvent(
  merchant: Address,
  hook: Address
): HookUnRegistered {
  let hookUnRegisteredEvent = changetype<HookUnRegistered>(newMockEvent());

  hookUnRegisteredEvent.parameters = new Array();

  hookUnRegisteredEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  hookUnRegisteredEvent.parameters.push(
    new ethereum.EventParam("hook", ethereum.Value.fromAddress(hook))
  );

  return hookUnRegisteredEvent;
}

export function createMerchantCreatedEvent(
  merchant: Address,
  metadata: ethereum.Tuple,
  wallet: Address,
  tokens: Array<Address>,
  signers: Array<Address>,
  minSigners: BigInt
): MerchantCreated {
  let merchantCreatedEvent = changetype<MerchantCreated>(newMockEvent());

  merchantCreatedEvent.parameters = new Array();

  merchantCreatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  merchantCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromTuple(metadata))
  );
  merchantCreatedEvent.parameters.push(
    new ethereum.EventParam("wallet", ethereum.Value.fromAddress(wallet))
  );
  merchantCreatedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  );
  merchantCreatedEvent.parameters.push(
    new ethereum.EventParam("signers", ethereum.Value.fromAddressArray(signers))
  );
  merchantCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "minSigners",
      ethereum.Value.fromUnsignedBigInt(minSigners)
    )
  );

  return merchantCreatedEvent;
}

export function createMerchantMetadataUpdatedEvent(
  merchant: Address,
  metadata: ethereum.Tuple
): MerchantMetadataUpdated {
  let merchantMetadataUpdatedEvent =
    changetype<MerchantMetadataUpdated>(newMockEvent());

  merchantMetadataUpdatedEvent.parameters = new Array();

  merchantMetadataUpdatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  merchantMetadataUpdatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromTuple(metadata))
  );

  return merchantMetadataUpdatedEvent;
}

export function createOneTimeTransactionCreatedEvent(
  transactionId: Bytes,
  payer: Address,
  payers: Array<Address>,
  merchant: Address,
  token: Address,
  amounts: Array<BigInt>,
  adjustedToken: Address,
  adjustedAmount: BigInt,
  timestamp: BigInt,
  description: string,
  metadata: ethereum.Tuple,
  status: i32
): OneTimeTransactionCreated {
  let oneTimeTransactionCreatedEvent =
    changetype<OneTimeTransactionCreated>(newMockEvent());

  oneTimeTransactionCreatedEvent.parameters = new Array();

  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "transactionId",
      ethereum.Value.fromFixedBytes(transactionId)
    )
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("payers", ethereum.Value.fromAddressArray(payers))
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    )
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedToken",
      ethereum.Value.fromAddress(adjustedToken)
    )
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedAmount",
      ethereum.Value.fromUnsignedBigInt(adjustedAmount)
    )
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromTuple(metadata))
  );
  oneTimeTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  );

  return oneTimeTransactionCreatedEvent;
}

export function createOneTimeTransactionFulfilledEvent(
  transactionId: Bytes,
  payer: Address,
  merchant: Address,
  token: Address,
  amount: BigInt,
  adjustedToken: Address,
  adjustedAmount: BigInt,
  timestamp: BigInt,
  status: i32
): OneTimeTransactionFulfilled {
  let oneTimeTransactionFulfilledEvent =
    changetype<OneTimeTransactionFulfilled>(newMockEvent());

  oneTimeTransactionFulfilledEvent.parameters = new Array();

  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "transactionId",
      ethereum.Value.fromFixedBytes(transactionId)
    )
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedToken",
      ethereum.Value.fromAddress(adjustedToken)
    )
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedAmount",
      ethereum.Value.fromUnsignedBigInt(adjustedAmount)
    )
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  );
  oneTimeTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  );

  return oneTimeTransactionFulfilledEvent;
}

export function createTransactionReceivedEvent(
  merchant: Address,
  token: Address,
  payer: Address,
  amount: BigInt,
  transactionId: Bytes
): TransactionReceived {
  let paymentReceivedEvent = changetype<TransactionReceived>(newMockEvent());

  paymentReceivedEvent.parameters = new Array();

  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  );
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  paymentReceivedEvent.parameters.push(
    new ethereum.EventParam(
      "transactionId",
      ethereum.Value.fromFixedBytes(transactionId)
    )
  );

  return paymentReceivedEvent;
}

export function createRecurrentTransactionCancelledEvent(
  transactionId: Bytes
): RecurrentTransactionCancelled {
  let recurrentTransactionCancelledEvent =
    changetype<RecurrentTransactionCancelled>(newMockEvent());

  recurrentTransactionCancelledEvent.parameters = new Array();

  recurrentTransactionCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "transactionId",
      ethereum.Value.fromFixedBytes(transactionId)
    )
  );

  return recurrentTransactionCancelledEvent;
}

export function createRecurrentTransactionCreatedEvent(
  transactionId: Bytes,
  payer: Address,
  merchant: Address,
  dueDate: BigInt,
  token: Address,
  amount: BigInt,
  adjustedToken: Address,
  adjustedAmount: BigInt,
  timestamp: BigInt,
  description: string,
  metadata: ethereum.Tuple,
  status: i32
): RecurrentTransactionCreated {
  let recurrentTransactionCreatedEvent =
    changetype<RecurrentTransactionCreated>(newMockEvent());

  recurrentTransactionCreatedEvent.parameters = new Array();

  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "transactionId",
      ethereum.Value.fromFixedBytes(transactionId)
    )
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "dueDate",
      ethereum.Value.fromUnsignedBigInt(dueDate)
    )
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedToken",
      ethereum.Value.fromAddress(adjustedToken)
    )
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedAmount",
      ethereum.Value.fromUnsignedBigInt(adjustedAmount)
    )
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromTuple(metadata))
  );
  recurrentTransactionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  );

  return recurrentTransactionCreatedEvent;
}

export function createRecurrentTransactionFulfilledEvent(
  transactionId: Bytes,
  payer: Address,
  merchant: Address,
  dueDate: BigInt,
  token: Address,
  amount: BigInt,
  adjustedToken: Address,
  adjustedAmount: BigInt,
  timestamp: BigInt,
  status: i32
): RecurrentTransactionFulfilled {
  let recurrentTransactionFulfilledEvent =
    changetype<RecurrentTransactionFulfilled>(newMockEvent());

  recurrentTransactionFulfilledEvent.parameters = new Array();

  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "transactionId",
      ethereum.Value.fromFixedBytes(transactionId)
    )
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("payer", ethereum.Value.fromAddress(payer))
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "dueDate",
      ethereum.Value.fromUnsignedBigInt(dueDate)
    )
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedToken",
      ethereum.Value.fromAddress(adjustedToken)
    )
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "adjustedAmount",
      ethereum.Value.fromUnsignedBigInt(adjustedAmount)
    )
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  );
  recurrentTransactionFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  );

  return recurrentTransactionFulfilledEvent;
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent());

  roleAdminChangedEvent.parameters = new Array();

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  );
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  );

  return roleAdminChangedEvent;
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent());

  roleGrantedEvent.parameters = new Array();

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  );

  return roleGrantedEvent;
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent());

  roleRevokedEvent.parameters = new Array();

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  );
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  );
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  );

  return roleRevokedEvent;
}

export function createSignersUpdatedEvent(
  merchant: Address,
  signers: Array<Address>,
  minSigners: BigInt
): SignersUpdated {
  let signersUpdatedEvent = changetype<SignersUpdated>(newMockEvent());

  signersUpdatedEvent.parameters = new Array();

  signersUpdatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  signersUpdatedEvent.parameters.push(
    new ethereum.EventParam("signers", ethereum.Value.fromAddressArray(signers))
  );
  signersUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "minSigners",
      ethereum.Value.fromUnsignedBigInt(minSigners)
    )
  );

  return signersUpdatedEvent;
}

export function createSubsciptionDeletedEvent(
  subsciptionId: Bytes
): SubsciptionDeleted {
  let subsciptionDeletedEvent = changetype<SubsciptionDeleted>(newMockEvent());

  subsciptionDeletedEvent.parameters = new Array();

  subsciptionDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "subsciptionId",
      ethereum.Value.fromFixedBytes(subsciptionId)
    )
  );

  return subsciptionDeletedEvent;
}

export function createSubscriptionCreatedEvent(
  subsciptionId: Bytes,
  merchant: Address,
  interval: BigInt,
  amount: BigInt,
  gracePeriod: BigInt,
  description: string
): SubscriptionCreated {
  let subscriptionCreatedEvent =
    changetype<SubscriptionCreated>(newMockEvent());

  subscriptionCreatedEvent.parameters = new Array();

  subscriptionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "subsciptionId",
      ethereum.Value.fromFixedBytes(subsciptionId)
    )
  );
  subscriptionCreatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  subscriptionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "interval",
      ethereum.Value.fromUnsignedBigInt(interval)
    )
  );
  subscriptionCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  subscriptionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "gracePeriod",
      ethereum.Value.fromUnsignedBigInt(gracePeriod)
    )
  );
  subscriptionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  );

  return subscriptionCreatedEvent;
}

export function createSubscriptionUpdatedEvent(
  subsciptionId: Bytes,
  amount: BigInt,
  gracePeriod: BigInt,
  description: string,
  active: boolean
): SubscriptionUpdated {
  let subscriptionUpdatedEvent =
    changetype<SubscriptionUpdated>(newMockEvent());

  subscriptionUpdatedEvent.parameters = new Array();

  subscriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "subsciptionId",
      ethereum.Value.fromFixedBytes(subsciptionId)
    )
  );
  subscriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  subscriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "gracePeriod",
      ethereum.Value.fromUnsignedBigInt(gracePeriod)
    )
  );
  subscriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  );
  subscriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam("active", ethereum.Value.fromBoolean(active))
  );

  return subscriptionUpdatedEvent;
}

export function createTokensUpdatedEvent(
  merchant: Address,
  tokens: Array<Address>
): TokensUpdated {
  let tokensUpdatedEvent = changetype<TokensUpdated>(newMockEvent());

  tokensUpdatedEvent.parameters = new Array();

  tokensUpdatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  tokensUpdatedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  );

  return tokensUpdatedEvent;
}

export function createWithdrawRequestApprovedEvent(
  merchant: Address,
  requestId: BigInt,
  signer: Address
): WithdrawRequestApproved {
  let withdrawRequestApprovedEvent =
    changetype<WithdrawRequestApproved>(newMockEvent());

  withdrawRequestApprovedEvent.parameters = new Array();

  withdrawRequestApprovedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  withdrawRequestApprovedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  );
  withdrawRequestApprovedEvent.parameters.push(
    new ethereum.EventParam("signer", ethereum.Value.fromAddress(signer))
  );

  return withdrawRequestApprovedEvent;
}

export function createWithdrawRequestCreatedEvent(
  merchant: Address,
  requestId: BigInt,
  token: Address,
  amount: BigInt,
  recipient: Address,
  signers: Array<Address>,
  executed: boolean
): WithdrawRequestCreated {
  let withdrawRequestCreatedEvent =
    changetype<WithdrawRequestCreated>(newMockEvent());

  withdrawRequestCreatedEvent.parameters = new Array();

  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  );
  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  );
  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  );
  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  );
  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("signers", ethereum.Value.fromAddressArray(signers))
  );
  withdrawRequestCreatedEvent.parameters.push(
    new ethereum.EventParam("executed", ethereum.Value.fromBoolean(executed))
  );

  return withdrawRequestCreatedEvent;
}

export function createWithdrawRequestExecutedEvent(
  merchant: Address,
  requestId: BigInt
): WithdrawRequestExecuted {
  let withdrawRequestExecutedEvent =
    changetype<WithdrawRequestExecuted>(newMockEvent());

  withdrawRequestExecutedEvent.parameters = new Array();

  withdrawRequestExecutedEvent.parameters.push(
    new ethereum.EventParam("merchant", ethereum.Value.fromAddress(merchant))
  );
  withdrawRequestExecutedEvent.parameters.push(
    new ethereum.EventParam(
      "requestId",
      ethereum.Value.fromUnsignedBigInt(requestId)
    )
  );

  return withdrawRequestExecutedEvent;
}
