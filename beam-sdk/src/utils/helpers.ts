import { Signature } from "../params";
import { Hex, TypedDataDomain, zeroHash } from "viem";

export const emptySignature: Signature = {
  deadline: 0,
  v: BigInt(0),
  r: zeroHash,
  s: zeroHash,
};

export const buildDelegationWithSigParams = (
  chainId: number,
  token: Hex,
  revision: string,
  tokenName: string,
  delegatee: Hex,
  nonce: number,
  deadline: number,
  value: bigint
) => ({
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
    ],
    DelegationWithSig: [
      { name: "delegatee", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  },
  primaryType: "DelegationWithSig" as const,
  domain: {
    name: tokenName,
    version: revision,
    chainId: chainId,
    verifyingContract: token,
  } as TypedDataDomain,
  message: {
    delegatee,
    value,
    nonce,
    deadline,
  },
});
