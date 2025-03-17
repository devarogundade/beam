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

## Create Recurrent Transaction
```ts
create(params: PrepareRecurrentTransaction): Promise<TransactionCallback>;
```

```ts
beamSdk.recurrentTransaction.create({
                merchant: subscription.value.merchant,
                subscriptionId: subscription.value.subsciptionId,
                description: 'Subscription',
                metadata: {
                    schemaVersion: 1,
                    value: JSON.stringify(form.value.metadata)
                }
            });
```
