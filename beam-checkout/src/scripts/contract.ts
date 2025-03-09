import { config } from "./config";
import { readContract } from "@wagmi/core";
import { type Hex } from "viem";
import { oracleAbi } from "../abis/oracle";

export const OracleContract = {
  async getAmountInUsd(
    oracle: Hex,
    token: Hex,
    amountIn: bigint
  ): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: oracleAbi,
        address: oracle,
        functionName: "getAmountInUsd",
        args: [token, amountIn],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },

  async getAmountFromUsd(
    oracle: Hex,
    token: Hex,
    amountInUsd: bigint
  ): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: oracleAbi,
        address: oracle,
        functionName: "getAmountFromUsd",
        args: [token, amountInUsd],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },
};
