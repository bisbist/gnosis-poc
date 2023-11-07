import { ethers, Wallet } from "ethers";
import { EthersAdapter } from "@safe-global/protocol-kit";
import Safe from "@safe-global/protocol-kit";
import * as dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/fLCeKO4GA9Gc3js8MUt9Djy7WHCFxATq"
);

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

const safeTxHash = "0xf0bce1e1bcd7dddbd0145e2d14ddddfacf9be683a5affa746b61ae2e31ecd7a4";
const signer = new Wallet(process.env.secret_key2, provider);
const safeAddress = "0xD3B71D33e515355646E8837481A9A7b1d9a61918";

(async () => {
  try {
    const receipt = await approveTxn(safeTxHash, signer, safeAddress);
    console.log("Transaction Approved. Receipt:", receipt);
  } catch (error) {
    console.error("Error approving transaction:", error);
  }
})();