import { config } from "./config";
import {
  readContract,
  signTypedData,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { parseSignature, type Hex } from "viem";
import { beamAbi } from "../abis/beam";
import { uniswapAbi } from "../abis/uniswap";
import { aaveV3Abi } from "../abis/aave";
import { variableDebtTokenAbi } from "../abis/variable-debt-token";
import type {
  CancelRecurrentTransaction,
  CreateOneTimeTransaction,
  CreateRecurrentTransaction,
  FulfillOneTimeTransaction,
  FulfillRecurrentTransaction,
  MintReceipt,
  RequiredSupplyMin,
  RequiredAmountIn,
  Signature,
} from "../../../beam-sdk/src/params";
import { buildDelegationWithSigParams } from "./../../../beam-sdk/src/utils/helpers";
import { EIP712_REVISION } from "../../../beam-sdk/src/utils/constants";

const DelegationContract = {
  async getBorrowAllowance(payer: Hex, debtToken: Hex): Promise<bigint> {
    try {
      const delegatee = AaveV3Contract.address;

      return (await readContract(config, {
        abi: variableDebtTokenAbi,
        address: debtToken,
        functionName: "borrowAllowance",
        args: [payer, delegatee],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },

  async signBorrowAllowance(
    payer: Hex,
    debtToken: Hex,
    borrowAmount: bigint
  ): Promise<Signature | null> {
    try {
      const delegatee = AaveV3Contract.address;

      const tokenName: string = await readContract(config, {
        abi: variableDebtTokenAbi,
        address: debtToken,
        functionName: "name",
      });

      const nonce: number = await readContract(config, {
        abi: variableDebtTokenAbi,
        address: debtToken,
        functionName: "nonces",
        args: [payer],
      });

      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const msgParams = buildDelegationWithSigParams(
        config.chains[0].id,
        debtToken,
        EIP712_REVISION,
        tokenName,
        delegatee,
        nonce,
        deadline,
        borrowAmount
      );

      const signature = await signTypedData(config, {
        domain: msgParams.domain as any,
        types: msgParams.types,
        primaryType: msgParams.primaryType,
        message: msgParams.message,
      });

      const { v, r, s } = parseSignature(signature);

      if (!v) return null;

      return { v, r, s, deadline };
    } catch (error) {
      return null;
    }
  },
};

const UniswapContract = {
  address: "0xE229A3bC3FFBAf5c2ad02fd3f459E3D52ce32CEA" as Hex,

  async requiredAmountIn(params: RequiredAmountIn): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: uniswapAbi,
        address: this.address,
        functionName: "requiredAmountIn",
        args: [params],
      })) as bigint;
    } catch (error) {
      return BigInt(0);
    }
  },
};

const AaveV3Contract = {
  address: "0xE229A3bC3FFBAf5c2ad02fd3f459E3D52ce32CEA" as Hex,

  async getVariableDebtTokenAddresses(token: Hex): Promise<Hex | null> {
    try {
      return (await readContract(config, {
        abi: aaveV3Abi,
        address: this.address,
        functionName: "getVariableDebtTokenAddresses",
        args: [token],
      })) as Hex;
    } catch (error) {
      return null;
    }
  },

  async requiredSupplyMin(params: RequiredSupplyMin): Promise<bigint> {
    try {
      return (await readContract(config, {
        abi: aaveV3Abi,
        address: this.address,
        functionName: "requiredSupplyMin",
        args: [params],
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

  async fulfillOneTimeTransaction(
    params: FulfillOneTimeTransaction
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "fulfillOneTimeTransaction",
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

  async recurrentTransaction(
    params: CreateRecurrentTransaction
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "recurrentTransaction",
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

  async fulfillRecurrentTransaction(
    params: FulfillRecurrentTransaction
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "fulfillRecurrentTransaction",
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

  async cancelRecurrentTransaction(
    params: CancelRecurrentTransaction
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "cancelRecurrentTransaction",
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

  async mintOneTimeTransactionReceipt(
    params: MintReceipt
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "mintOneTimeTransactionReceipt",
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

  async mintRecurrentTransactionReceipt(
    params: MintReceipt
  ): Promise<Hex | null> {
    try {
      const result = await writeContract(config, {
        abi: beamAbi,
        address: this.address,
        functionName: "mintRecurrentTransactionReceipt",
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

export { DelegationContract, UniswapContract, AaveV3Contract, BeamContract };
