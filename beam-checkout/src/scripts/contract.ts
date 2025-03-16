import { config } from "./config";
import { readContract } from "@wagmi/core";
import { type Hex } from "viem";
import { oracleAbi } from "../abis/oracle";

const BeamOracleContract = {
  address: "0x2e009188D9277ac7b58537fe0eBEf5F4912e7a1B" as Hex,

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

  async getAmountFromUsd(
    token: Hex,
    amountInUsd: bigint,
    multiplier: number
  ): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: oracleAbi,
        address: this.address,
        functionName: "getAmountFromUsd",
        args: [token, amountInUsd, multiplier],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },
};

export { BeamOracleContract };
