import * as dotenv from "dotenv";
import { ethers, Wallet } from "ethers";
import Safe, { SafeFactory } from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import {CreateCallAbi, implementationABI, proxyABI} from "./ABI.js";

dotenv.config();

const SAFE_ADDRESS = process.env.SAFE_ADDRESS;
const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/fLCeKO4GA9Gc3js8MUt9Djy7WHCFxATq"
);
const deployerSigner = new ethers.Wallet(process.env.secret_key1, provider);

const newImplementationAddress = "0x6408a1a308cbB163Eff3A6FF8C916a54036C327D";
const proxyAddress = "0x39B7A54F1402EBf1e00B1B3852949b860aE5EbC3";

// Encode deployment
const deployerInterface = new ethers.utils.Interface(implementationABI);
const deployCallData = deployerInterface.encodeFunctionData("upgradeTo", [
    newImplementationAddress
]);

const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deployerSigner,
});
const safeService = new SafeApiKit.default({
    txServiceUrl: "https://safe-transaction-goerli.safe.global",
    ethAdapter,
});

const txData = {
    to: proxyAddress,
    value: "0",
    data: deployCallData,
};

const safeSdk = await Safe.default.create({
    ethAdapter: ethAdapter,
    safeAddress: SAFE_ADDRESS,
});
const safeTx = await safeSdk.createTransaction({
    safeTransactionData: txData,
});
const safeTxHash = await safeSdk.getTransactionHash(safeTx);
const signature = await safeSdk.signTypedData(safeTx);

const transactionConfig = {
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTx.data,
    safeTxHash: safeTxHash,
    senderAddress: process.env.SENDER_ADDRESS,
    senderSignature: signature.data,
};

await safeService.proposeTransaction(transactionConfig);