import { ethers, Wallet } from "ethers";
import Safe from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import * as dotenv from "dotenv";
dotenv.config();

const provider = new ethers.providers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/fLCeKO4GA9Gc3js8MUt9Djy7WHCFxATq"
);

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

const safeTxHash =
  "0xf0bce1e1bcd7dddbd0145e2d14ddddfacf9be683a5affa746b61ae2e31ecd7a4";
const signer = new Wallet(process.env.secret_key3, provider);
const safeAddress = "0xD3B71D33e515355646E8837481A9A7b1d9a61918";

(async () => {
  try {
    const receipt = await executeTx(safeTxHash, signer, safeAddress);
    console.log("Transaction Executed. Receipt:", receipt);
  } catch (error) {
    console.error("Error executing transaction:", error);
  }
})();
