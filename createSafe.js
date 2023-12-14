const RPC_URL = "https://eth-goerli.public.blastapi.io/";
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

import * as dotenv from "dotenv";
import { ethers } from "ethers";
import { SafeFactory } from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";

dotenv.config();

// Initialize signers
const owner1Signer = new ethers.Wallet(process.env.secret_key1, provider);
const owner2Signer = new ethers.Wallet(process.env.secret_key2, provider);
const owner3Signer = new ethers.Wallet(process.env.secret_key3, provider);
const owner4Signer = new ethers.Wallet(process.env.secret_key4, provider);

const ethAdapterOwner1 = new EthersAdapter({
    ethers,
    signerOrProvider: owner1Signer,
});

const txServiceUrl = "https://safe-transaction-goerli.safe.global/";
const safeService = new SafeApiKit.default({
    txServiceUrl,
    ethAdapter: ethAdapterOwner1,
});

async function main() {
    const safeFactory = await SafeFactory.create({
        ethAdapter: ethAdapterOwner1,
    });
    const safeAccountConfig = {
        owners: [
            await owner1Signer.getAddress(),
            await owner2Signer.getAddress(),
            await owner3Signer.getAddress(),
            await owner4Signer.getAddress(),
        ],
        threshold: 1,
    };
    
    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig });
    const safeAddress = await safeSdkOwner1.getAddress();

    console.log("Your Safe has been deployed:");
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`);
    console.log(`https://app.safe.global/gor:${safeAddress}`);
    return safeAddress;
}

main();
