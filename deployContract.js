import * as dotenv from "dotenv";
import { ethers, Wallet } from "ethers";
import Safe, { SafeFactory } from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

dotenv.config();

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

const CreateCallAbi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "newContract",
				"type": "address"
			}
		],
		"name": "ContractCreation",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "deploymentData",
				"type": "bytes"
			}
		],
		"name": "performCreate",
		"outputs": [
			{
				"internalType": "address",
				"name": "newContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "deploymentData",
				"type": "bytes"
			},
			{
				"internalType": "bytes32",
				"name": "salt",
				"type": "bytes32"
			}
		],
		"name": "performCreate2",
		"outputs": [
			{
				"internalType": "address",
				"name": "newContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const SAFE_ADDRESS = "0xD3B71D33e515355646E8837481A9A7b1d9a61918";
const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/fLCeKO4GA9Gc3js8MUt9Djy7WHCFxATq"
);
const deployerSigner = new ethers.Wallet(process.env.secret_key1, provider);

// Encode deployment
const deployerInterface = new ethers.utils.Interface(CreateCallAbi);
const deployCallData = deployerInterface.encodeFunctionData("performCreate", [
    0,
    "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea2646970667358221220aba066ce7ff178ebbdcab0dcb51f035dd1c2ae031bfc575ff7763d3bb8b259d364736f6c63430008110033",
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
    to: "0x8BE892bdDaDb80182108Cc58e74Fece9fc159841",
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

console.log("txn hash", safeTxHash);
const signature = await safeSdk.signTypedData(safeTx);

const transactionConfig = {
    safeAddress: SAFE_ADDRESS,
    safeTransactionData: safeTx.data,
    safeTxHash: safeTxHash,
    senderAddress: "0x70cF923879F7e46551A999D84527a525554CCA01",
    senderSignature: signature.data,
};

await safeService.proposeTransaction(transactionConfig);

approveTxn(
    safeTxHash,
    new Wallet(process.env.secret_key2, provider),
    SAFE_ADDRESS
);

executeTx(
    safeTxHash,
    new Wallet(process.env.secret_key3, provider),
    SAFE_ADDRESS
);