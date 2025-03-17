# Beam

## Init SDK

```ts
const beamSdk = new BeamSDK({
    network: Network.Testnet,
});
```

## Create One Time Payment
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
