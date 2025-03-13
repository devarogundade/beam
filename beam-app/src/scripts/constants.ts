import { zeroAddress } from "viem";
import type { Token } from "./types";

export const getTokens: Token[] = [
  {
    name: "USDC",
    symbol: "USDC",
    address: "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d",
    image: "/images/usdc.png",
    decimals: 6,
  },
  {
    name: "Bitcoin",
    symbol: "WBTC",
    address: "0x5ea79f3190ff37418d42f9b2618688494dbd9693",
    image: "/images/btc.png",
    decimals: 8,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: zeroAddress,
    image: "/images/eth.png",
    decimals: 18,
  },
  {
    name: "DAI",
    symbol: "DAI",
    address: "0x7984e363c38b590bb4ca35aed5133ef2c6619c40",
    image: "/images/dai.png",
    decimals: 18,
  },
  {
    name: "ChainLink",
    symbol: "LINK",
    address: "0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801",
    image: "/images/link.png",
    decimals: 18,
  },
];
