import { config } from "./config";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { type Hex } from "viem";
import { beamAbi } from "../abis/beam";
import { oracleAbi } from "../abis/oracle";
import type { CreateOneTimeTransaction, MintReceipt } from "./params";

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

const BeamContract = {
  address: "0xE229A3bC3FFBAf5c2ad02fd3f459E3D52ce32CEA" as Hex,

  async oneTimeTransaction(
    params: CreateOneTimeTransaction
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "oneTimeTransaction",
        args: [params],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: result,
      });

      return receipt.transactionHash;
    } catch (error) {
      console.log(error);

      return null;
    }
  },

  async onFulfill(
    transactionId: Hex,
    payer: Hex,
    mintReceipt: boolean
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "onFulfill",
        args: [transactionId, payer, mintReceipt],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: result,
      });

      return receipt.transactionHash;
    } catch (error) {
      return null;
    }
  },

  async mintReceipt(params: MintReceipt): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "mintReceipt",
        args: [params],
      });

      const receipt = await waitForTransactionReceipt(config, {
        hash: result,
      });

      return receipt.transactionHash;
    } catch (error) {
      return null;
    }
  },
};

export { BeamContract, BeamOracleContract };
