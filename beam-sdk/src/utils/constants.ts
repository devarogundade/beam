import { zeroAddress, type Hex } from "viem";
import type { Token } from "../types";

export const SCHEMA_JSON = 1;
export const SCHEMA_URL = 2;

export const EIP712_REVISION = "1";

export const getTokens: Token[] = [
  {
    name: "USDC",
    symbol: "USDC",
    address: "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d",
    image: "/images/usdc.png",
    decimals: 6,
    aToken: "0x6E4A1BcBd3C3038e6957207cadC1A17092DC7ba3",
    price: 1,
  },
  {
    name: "Bitcoin",
    symbol: "WBTC",
    address: "0x5ea79f3190ff37418d42f9b2618688494dbd9693",
    image: "/images/btc.png",
    decimals: 8,
    aToken: "0x43AE2a14AD923915aa85d683D1b7d0d320ae87B2",
    price: 80_000,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    address: zeroAddress,
    image: "/images/eth.png",
    decimals: 18,
    aToken: "0x9E8CEC4F2F4596141B62e88966D7167E9db555aD",
    price: 2_400,
  },
  {
    name: "DAI",
    symbol: "DAI",
    address: "0x7984e363c38b590bb4ca35aed5133ef2c6619c40",
    image: "/images/dai.png",
    decimals: 18,
    aToken: "0x99Cb50E6bE36C8096e6731ED7738d93090B710DD",
    price: 0.998,
  },
  {
    name: "ChainLink",
    symbol: "LINK",
    address: "0x279cbf5b7e3651f03cb9b71a9e7a3c924b267801",
    image: "/images/link.png",
    decimals: 18,
    aToken: "0x55DD1cDFE13fCa68F6D14D452E2a20cABe191841",
    price: 5,
  },
];

export const getToken = (address: Hex | undefined): Token | undefined => {
  return getTokens.find((t) => t.address == address);
};

export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
};
