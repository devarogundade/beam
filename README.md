# Beam

## Init SDK

```ts
const beamSdk = new BeamSDK({
    network: Network.Testnet,
});
```

## Create One Time Transaction
```ts
create(params: PrepareOneTimeTransaction): Promise<TransactionCallback>;
```

```ts
beamSdk.oneTimeTransaction.create({
                merchant: address,
                payers: [address],
                amounts: [bigint] ,
                token: address,
                description: string,
                metadata: {
                    schemaVersion: number,
                    value: string
                },
                splitPayment: boolean
            })
```

## Fulfill One Time Transaction (Split Transaction)
```ts
fulfill(
    params: PrepareFulfillOneTimeTransaction
  ): Promise<TransactionCallback>;
```

## Create Recurrent Transaction
```ts
create(params: PrepareRecurrentTransaction): Promise<TransactionCallback>;
```

```ts
beamSdk.recurrentTransaction.create({
                merchant: address,
                subscriptionId: bytes32,
                description: string,
                metadata: {
                    schemaVersion: number,
                    value: string
                }
            });
```

## Fulfill/Renew Recurrent Transaction
```ts
fulfill(
    params: PrepareFulfillRecurrentTransaction
  ): Promise<TransactionCallback>;
```

## Cancel Recurrent Transaction
```ts
cancel(
    params: PrepareCancelRecurrentTransaction
  ): Promise<TransactionCallback>;
```

## Get Transaction
```ts
getTransaction(params: GetTransaction): Promise<Transaction | null>;
```

## Get Transactions
```ts
getTransactions(params: GetTransactions): Promise<Transaction[]>;
```

## Get Transactions From Hash
```ts
getTransactionsFromHash(params: GetTransactionHash): Promise<Transaction[]>;
```

## Get One Time Transactions
```ts
getOneTimeTransactions(params: GetTransactions): Promise<Transaction[]>;
```

## Get Recurrent Transactions
```ts
getRecurrentTransactions(params: GetTransactions): Promise<Transaction[]>;
```

## Get Subscription
```ts
getSubscription(params: GetSubscription): Promise<Subscription | null>;
```

## Get Subscriptions
```ts
getSubscriptions(params: GetSubscriptions): Promise<Subscription[]>;
```
