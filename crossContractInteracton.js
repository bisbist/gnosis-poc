import { ethers, Wallet } from "ethers";
import Safe from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

import * as dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/fLCeKO4GA9Gc3js8MUt9Djy7WHCFxATq"
);

const safeAddress = "0xD3B71D33e515355646E8837481A9A7b1d9a61918";
const ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "demo",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "returnMany",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const CONTRACT = "0x8e55806132de674273c10b08e2034eb0cc620d76";

async function addSafe(safeAddress, senderAddress, signer) {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeService = new SafeApiKit.default({
    txServiceUrl: "https://safe-transaction-goerli.safe.global",
    ethAdapter,
  });

  const contractAddress = CONTRACT;
  const abi = ABI;
  const iface = new ethers.utils.Interface(abi);
  const calldata = iface.encodeFunctionData("returnMany");
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

async function executeTx(safeTxHash, signer, safeAddress) {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeService = new SafeApiKit.default({
    txServiceUrl: "https://safe-transaction-goerli.safe.global",
    ethAdapter,
  });
  const safeTransaction = await safeService.getTransaction(safeTxHash);
  const safeSdk = await Safe.default.create({
    ethAdapter: ethAdapter,
    safeAddress: safeAddress,
  });
  const execute = await safeSdk.executeTransaction(safeTransaction);
  const receipt = await execute.transactionResponse?.wait();
  return receipt;
}

async function approveTxn(safeTxHash, signer, safeAddress) {
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer,
  });

  const safeSdk = await Safe.default.create({
    ethAdapter: ethAdapter,
    safeAddress: safeAddress,
  });
  const execute = await safeSdk.approveTransactionHash(safeTxHash);
  const receipt = await execute.transactionResponse?.wait();
  return receipt;
}

addSafe(
  safeAddress,
  "0x70cF923879F7e46551A999D84527a525554CCA01",
  new Wallet(process.env.secret_key1, provider)
);

approveTxn(
  "0x1a5f1a3e77b5e41f4215b71aa4b471164fe367afc6114df38eb2191580a008da",
  new Wallet(process.env.secret_key2, provider),
  safeAddress
);

executeTx(
  "0x1a5f1a3e77b5e41f4215b71aa4b471164fe367afc6114df38eb2191580a008da",
  new Wallet(process.env.secret_key3, provider),
  safeAddress
);
