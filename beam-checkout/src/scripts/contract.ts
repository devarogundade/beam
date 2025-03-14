import { config } from "./config";
import { readContract } from "@wagmi/core";
import { type Hex } from "viem";
import { oracleAbi } from "../abis/oracle";

const BeamOracleContract = {
  address: "0xa319d230048aAE3c681d7898d71800d92605C80e" as Hex,

  async getAmountInUsd(token: Hex, amountIn: bigint): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: oracleAbi,
        address: this.address,
        functionName: "getAmountInUsd",
        args: [token, amountIn],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },

  async getAmountFromUsd(token: Hex, amountInUsd: bigint): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: oracleAbi,
        address: this.address,
        functionName: "getAmountFromUsd",
        args: [token, amountInUsd],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },
};

export { BeamOracleContract };
