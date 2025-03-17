[# Pitch Deck]()

# Contract Addresses
| Module | Address |
|--------|---------|
| [AaveV3Module#AaveV3](https://sepolia.scrollscan.com/address/0x0c4aB91eef4F9a3Db9179e9bF8421D64B5B4a35b#code) | 0x0c4aB91eef4F9a3Db9179e9bF8421D64B5B4a35b |
| [ChainlinkModule#Chainlink](https://sepolia.scrollscan.com/address/0xBAc706D7F29a2ba7DCfDAff3Da0B9f057EdF7c18#code) | 0xBAc706D7F29a2ba7DCfDAff3Da0B9f057EdF7c18 |
| [EventsModule#Events](https://sepolia.scrollscan.com/address/0xA10E3e1e1c574CAcFe18776834568Deb49d94b44#code) | 0xA10E3e1e1c574CAcFe18776834568Deb49d94b44 |
| [ReceiptModule#Receipt](https://sepolia.scrollscan.com/address/0xF9fBFE7ce569e4A9A64606A2296BdF4403AD0B12#code) | 0xF9fBFE7ce569e4A9A64606A2296BdF4403AD0B12 |
| [UniswapV2Module#UniswapV2](https://sepolia.scrollscan.com/address/0x54406D8748E8B0D930dEBEc11748768dcADC5eCC#code) | 0x54406D8748E8B0D930dEBEc11748768dcADC5eCC |
| [BeamOracleModule#BeamOracle](https://sepolia.scrollscan.com/address/0x2e009188D9277ac7b58537fe0eBEf5F4912e7a1B#code) | 0x2e009188D9277ac7b58537fe0eBEf5F4912e7a1B |
| [HookManagerModule#HookManager](https://sepolia.scrollscan.com/address/0x6bAaEdD503FcdF573E28a4a9Ea7d9CeF8C901e67#code) | 0x6bAaEdD503FcdF573E28a4a9Ea7d9CeF8C901e67 |
| [MerchantModule#Merchant](https://sepolia.scrollscan.com/address/0xc4Bf9Fe6A0E9104b03f290C80fC1C2058529bD6c#code) | 0xc4Bf9Fe6A0E9104b03f290C80fC1C2058529bD6c |
| [OneTimeTransactionModule#OneTimeTransaction](https://sepolia.scrollscan.com/address/0xEe3c254b0FebaF2984DE64849223eAb494319f86#code) | 0xEe3c254b0FebaF2984DE64849223eAb494319f86 |
| [RecurrentTransactionModule#RecurrentTransaction](https://sepolia.scrollscan.com/address/0xEF6ec3bAC878D746734A495eCceE655b7712C6e0#code) | 0xEF6ec3bAC878D746734A495eCceE655b7712C6e0 |
| [BeamModule#Beam](https://sepolia.scrollscan.com/address/0x31f73F44019328da4545d589a1f3e8A62C0a3e69#code) | 0x31f73F44019328da4545d589a1f3e8A62C0a3e69 |

# Beam SDK

```command
npm i beam-ts@latest
```

## Init

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

## Get Merchant
```ts
getMerchant(params: GetMerchant): Promise<Merchant | null>;
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
