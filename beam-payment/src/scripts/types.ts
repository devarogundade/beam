export enum TransactionStatus {
  Pending = 0,
  Active = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum TransactionType {
  OneTime = 0,
  Recurrent = 1,
  Send = 2,
}

export enum TransactionRoute {
  None = 0,
  Uniswap = 1,
  Aave = 2,
}

export enum Network {
  Testnet = "Testnet",
}

export type Notification = {
  title: string;
  description: string;
  category: string;
  linkTitle?: string;
  linkUrl?: string;
};
