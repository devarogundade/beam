import hre from "hardhat";
import { expect } from "chai";
import {
  getAddress,
  parseEther,
  zeroAddress,
  parseSignature,
  parseUnits,
} from "viem";
import { MultiSigWallet } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import {
  buildDelegationWithSigParams,
  getSignatureFromTypedData,
} from "./helpers";
import { vars } from "hardhat/config";

const ETH = zeroAddress;
const AAVE_WETH = "0xb123dce044edf0a755505d9623fba16c0f41cae9";
const AAVE_USDC = "0x2c9678042d52b97d27f2bd2947f7111d93f3dd0d";
const AAVE_DAI = "0x7984e363c38b590bb4ca35aed5133ef2c6619c40";
const AAVE_BTC = "0x5ea79f3190ff37418d42f9b2618688494dbd9693";

const AAVE_WETH_GATEWAY = "0x57ce905CfD7f986A929A26b006f797d181dB706e";
const AAVE_ADDRESSES_PROVIDER = "0x52A27dC690F8652288194Dd2bc523863eBdEa236";

const UNISWAP_ROUTER = "0x0000000000000000000000000000000000000000";
const UNISWAP_QOUTER = "0x0000000000000000000000000000000000000000";

const EIP712_REVISION = "1";

describe("Signature", function () {
  it("Sign", async function () {
    const aaveV3 = await hre.viem.deployContract("AaveV3", [
      AAVE_WETH_GATEWAY,
      AAVE_ADDRESSES_PROVIDER,
    ]);

    const [owner] = await hre.viem.getWalletClients();
    const borrowAmount = parseUnits("0.001", 8);

    const deadline = Math.floor(Date.now() / 1000) + 3600;

    const debtTokenAddress = await aaveV3.read.getVariableDebtTokenAddresses([
      AAVE_BTC,
    ]);

    const debtToken = await hre.viem.getContractAt(
      "VariableDebtToken",
      debtTokenAddress
    );

    const tokenName = await debtToken.read.name();
    const nonce = Number(await debtToken.read.nonces([owner.account.address]));
    const delegatee = getAddress(aaveV3.address);

    const msgParams = buildDelegationWithSigParams(
      hre.network.config.chainId || 1,
      debtTokenAddress,
      EIP712_REVISION,
      tokenName,
      delegatee,
      nonce,
      deadline.toString(),
      borrowAmount.toString()
    );

    expect(
      (
        await debtToken.read.borrowAllowance([
          owner.account.address,
          aaveV3.address,
        ])
      ).toString()
    ).to.be.equal("0");

    const wallet = MultiSigWallet.fromPhrase(vars.get("MNEMONIC"));
    console.log("privateKey", wallet.privateKey);

    const { v, r, s } = getSignatureFromTypedData(wallet.privateKey, msgParams);

    console.log("v, r, s", v, r, s);

    expect(v).not.to.undefined;
    expect(r).not.to.undefined;
    expect(s).not.to.undefined;

    const requiredSupplyMin = await aaveV3.read.requiredSupplyMin([
      {
        payer: getAddress(owner.account.address),
        borrowAmount,
        borrowAsset: AAVE_BTC,
        supplyAsset: AAVE_USDC,
      },
    ]);

    console.log("requiredSupplyMin", requiredSupplyMin);

    const usdc = await hre.viem.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      AAVE_USDC
    );

    await usdc.write.approve([aaveV3.address, requiredSupplyMin]);

    const usdcBalance = await usdc.read.balanceOf([owner.account.address]);
    console.log("usdcBalance", usdcBalance);

    await aaveV3.write.execute([
      {
        payer: getAddress(owner.account.address),
        borrowAmount,
        borrowAsset: AAVE_BTC,
        supplyAsset: AAVE_USDC,
        requiredSupplyMin,
        signature: {
          deadline: BigInt(deadline),
          v,
          r: `0x${r.toString("hex")}`,
          s: `0x${s.toString("hex")}`,
        },
      },
    ]);
  });
});

// describe("Main", function () {
//   // We define a fixture to reuse the same setup in every test.
//   // We use loadFixture to run this setup once, snapshot that state,
//   // and reset Hardhat Network to that snapshot in every test.
//   async function deployMainFixture() {
//     // Contracts are deployed using the first signer/account by default
//     const [owner, otherAccount] = await hre.viem.getWalletClients();

//     const hashLib = await hre.viem.deployContract("HashLib");
//     const boolLib = await hre.viem.deployContract("BoolLib");
//     const addressLib = await hre.viem.deployContract("AddressLib");
//     const integerLib = await hre.viem.deployContract("IntegerLib");

//     const receipt = await hre.viem.deployContract("SimpleReceipt", [
//       "https://beam.netlify.app/receipts",
//     ]);

//     const merchant = await hre.viem.deployContract("Merchant", undefined, {
//       libraries: {
//         HashLib: hashLib.address,
//       },
//     });

//     const oneTimePayment = await hre.viem.deployContract(
//       "OneTimePayment",
//       [receipt.address],
//       {
//         libraries: {
//           HashLib: hashLib.address,
//           BoolLib: boolLib.address,
//         },
//       }
//     );

//     const recurrentPayment = await hre.viem.deployContract(
//       "RecurrentPayment",
//       [receipt.address, merchant.address],
//       {
//         libraries: {
//           HashLib: hashLib.address,
//         },
//       }
//     );

//     const oneTimePayment = await hre.viem.deployContract(
//       "OneTimePayment",
//       [receipt.address],
//       {
//         libraries: {
//           HashLib: hashLib.address,
//         },
//       }
//     );

//     const aaveV3 = await hre.viem.deployContract("AaveV3", [
//       AAVE_WETH_GATEWAY,
//       AAVE_ADDRESSES_PROVIDER,
//     ]);

//     const uniswapV3 = await hre.viem.deployContract("UniswapV3", [
//       UNISWAP_ROUTER,
//       UNISWAP_QOUTER,
//     ]);

//     const beam = await hre.viem.deployContract(
//       "Beam",
//       [
//         merchant.address,
//         oneTimePayment.address,
//         oneTimePayment.address,
//         recurrentPayment.address,
//         aaveV3.address,
//         uniswapV3.address,
//       ],
//       {
//         libraries: {
//           AddressLib: addressLib.address,
//           IntegerLib: integerLib.address,
//         },
//       }
//     );

//     const publicClient = await hre.viem.getPublicClient();

//     return {
//       beam,
//       merchant,
//       oneTimePayment,
//       oneTimePayment,
//       recurrentPayment,
//       aaveV3,
//       uniswapV3,
//       owner,
//       otherAccount,
//       publicClient,
//     };
//   }

//   describe("Initialization", function () {
//     it("Set admins", async function () {
//       const { beam, oneTimePayment, oneTimePayment, recurrentPayment } =
//         await loadFixture(deployMainFixture);

//       await oneTimePayment.write.transferOwnership([getAddress(beam.address)]);
//       await oneTimePayment.write.transferOwnership([getAddress(beam.address)]);
//       await recurrentPayment.write.transferOwnership([
//         getAddress(beam.address),
//       ]);

//       expect(await oneTimePayment.read.owner()).to.equal(
//         getAddress(beam.address)
//       );
//       expect(await oneTimePayment.read.owner()).to.equal(
//         getAddress(beam.address)
//       );
//       expect(await recurrentPayment.read.owner()).to.equal(
//         getAddress(beam.address)
//       );
//     });
//   });

//   describe("Merchant", function () {
//     it("Min ETH deposit should be zero", async function () {
//       const { merchant } = await loadFixture(deployMainFixture);

//       expect(await merchant.read.getMinETHdeposit()).to.equal(BigInt(0));
//     });

//     it("Should set the right owner", async function () {
//       const { merchant, owner } = await loadFixture(deployMainFixture);

//       expect(await merchant.read.owner()).to.equal(
//         getAddress(owner.account.address)
//       );
//     });

//     it("Update Min ETH deposit", async function () {
//       const { merchant } = await loadFixture(deployMainFixture);

//       const newMinETH = parseEther("0.001");

//       await merchant.write.updateMinETHDeposit([newMinETH]);

//       expect(await merchant.read.getMinETHdeposit()).to.equal(newMinETH);
//     });

//     it("Create", async function () {
//       const { merchant, owner } = await loadFixture(deployMainFixture);

//       const minETH = await merchant.read.getMinETHdeposit();

//       await merchant.write.create(
//         [
//           {
//             metadata: {
//               schemaVersion: 1,
//               value: JSON.stringify({
//                 name: "Test ",
//                 description: "Test",
//               }),
//             },
//             tokens: [ETH, AAVE_WETH, AAVE_USDC, AAVE_DAI],
//             recurrentExpiryInterval: BigInt(0),
//           },
//         ],
//         { value: minETH }
//       );

//       const wallet = await merchant.read.getWallet([
//         getAddress(owner.account.address),
//       ]);
//       console.log("wallet", wallet);

//       expect(wallet).not.to.equal(zeroAddress);

//       const account = await merchant.read.getMerchant([
//         getAddress(owner.account.address),
//       ]);
//       console.log("account", account);
//     });

//     it("Reject multiple Create", async function () {
//       const { merchant, owner } = await loadFixture(deployMainFixture);

//       console.log("min eth", await merchant.read.getMinETHdeposit());

//       const wallet = await merchant.read.getWallet([
//         getAddress(owner.account.address),
//       ]);
//       console.log("wallet", wallet);

//       expect(wallet).not.to.equal(zeroAddress);

//       const account = await merchant.read.getMerchant([
//         getAddress(owner.account.address),
//       ]);
//       console.log("account", account);

//       // const minETH = await merchant.read.getMinETHdeposit();

//       // await merchant.write.create(
//       //   [
//       //     {
//       //       metadata: {
//       //         schemaVersion: 1,
//       //         value: JSON.stringify({
//       //           name: "Test ",
//       //           description: "Test",
//       //         }),
//       //       },
//       //       tokens: [ETH, AAVE_WETH, AAVE_USDC, AAVE_DAI],
//       //       recurrentExpiryInterval: BigInt(0),
//       //     },
//       //   ],
//       //   { value: minETH }
//       // );
//     });

//     it("Update", async function () {
//       const { merchant, owner } = await loadFixture(deployMainFixture);

//       await merchant.write.update([
//         {
//           metadata: {
//             schemaVersion: 1,
//             value: JSON.stringify({
//               name: "Test ",
//               description: "Test business",
//             }),
//           },
//           recurrentExpiryInterval: BigInt(10),
//         },
//       ]);

//       const account = await merchant.read.getMerchant([
//         getAddress(owner.account.address),
//       ]);

//       expect(account.recurrentExpiryInterval).equal(BigInt(10));
//     });
//   });

//   // describe("AaveV3", function () {
//   //   it("Required collateral", async function () {
//   //     const { aaveV3, owner } = await loadFixture(deployMainFixture);

//   //     const borrowAmount = parseEther("10"); // 10 USDC

//   //     const additionalCollateral = await aaveV3.read.requiredSupplyMin([
//   //       {
//   //         payer: getAddress(owner.account.address),
//   //         borrowAmount: borrowAmount,
//   //         borrowAsset: AAVE_USDC,
//   //         supplyAsset: ETH,
//   //       },
//   //     ]);

//   //     console.log("additionalCollateral", additionalCollateral);

//   //     await aaveV3.write.execute(
//   //       [
//   //         {
//   //           payer: getAddress(owner.account.address),
//   //           borrowAmount: borrowAmount,
//   //           borrowAsset: AAVE_USDC,
//   //           supplyAsset: ETH,
//   //           requiredSupplyMin: additionalCollateral,
//   //         },
//   //       ],
//   //       { value: additionalCollateral }
//   //     );
//   //   });
//   // });
// });
