import { ethers, Wallet } from "ethers";
import Safe from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import {ABI} from "./ABI.js";

import * as dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/fLCeKO4GA9Gc3js8MUt9Djy7WHCFxATq"
);

const safeAddress = process.env.SAFE_ADDRESS;

async function crossContractInteracton(safeAddress, senderAddress, signer) {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeService = new SafeApiKit.default({
    txServiceUrl: "https://safe-transaction-goerli.safe.global",
    ethAdapter,
  });

const contractAddress = process.env.CONTRACTADDRESS;
const abi = ABI;
  const iface = new ethers.utils.Interface(abi);
  const calldata = iface.encodeFunctionData("upgradeTo", ["0xDE15599fa2af6BFC7Bba7C651A8c4efEaB4c2668"]);
  const safeSdk = await Safe.default.create({
    ethAdapter: ethAdapter,
    safeAddress: safeAddress,
  });

  const txData = {
    to: ethers.utils.getAddress(contractAddress),
    value: "0",
    data: calldata,
  };

  const safeTx = await safeSdk.createTransaction({
    safeTransactionData: txData,
  });
  const safeTxHash = await safeSdk.getTransactionHash(safeTx);

  console.log("txn hash", safeTxHash);
  const signature = await safeSdk.signTypedData(safeTx);

  const transactionConfig = {
    safeAddress: safeAddress,
    safeTransactionData: safeTx.data,
    safeTxHash: safeTxHash,
    senderAddress: senderAddress,
    senderSignature: signature.data,
  };

  await safeService.proposeTransaction(transactionConfig);
}

crossContractInteracton(
  safeAddress,
  process.env.SENDER_ADDRESS,
  new Wallet(process.env.secret_key1, provider)
);