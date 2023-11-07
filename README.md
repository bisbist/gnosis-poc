# Gnosis Safe Transaction Scripts
This repository contains a set of JavaScript scripts that interact with a Gnosis Safe multisignature wallet on the Goerli testnet. These scripts demonstrate various operations, including creating a Safe, deploying a contract, executing a transaction, and approving a transaction. They are built using the ethers.js library and the Gnosis Safe Protocol Kit.

# Prerequisites
Before running the scripts, ensure that you have:

- Node.js and npm installed on your machine.
- Alchemy API key or a similar Ethereum RPC provider.

# Setup
Clone this repository to your local machine.

Navigate to the project directory:
- cd gnosis-poc
  
Install the required dependencies:
- yarn install

# Add contract ABI's
- Put CreateCall and sample contract ABI's in a separate file.
  
Create a .env file in the root directory of the project and set your environment variables as described below.

# Environment Variables

Create a .env file in the root directory of the project with the following environment variables:
# PRIVATE_KEYS
    # Ethereum private keys for signers
    secret_key1=YOUR_PRIVATE_KEY_1
    secret_key2=YOUR_PRIVATE_KEY_2
    secret_key3=YOUR_PRIVATE_KEY_3
    secret_key4=YOUR_PRIVATE_KEY_4

# Gnosis Safe address
    SAFEADDRESS=YOUR_SAFE_ADDRESS
## Note:
If you don't already have a Safe address, create a new Safe address and add it to the .env file.

# Sample Contract address
    CONTRACTADDRESS=CONTRACT_ADDRESS_TO_INTERACT_WITH
# Running the Scripts
The repository includes the following scripts, each with a specific purpose:

## createSafe.js
Creates a new Gnosis Safe on the Goerli testnet.

To run this script, use the following command:
- node createSafe.js

## crossContractInteracton.js
Performs cross-contract interaction using the created Safe. This proposes a transaction.
Copy the safeTxHash from this step and provide it as an input for approveTxn and executeTx script.

To run this script, use the following command:
- node crossContractInteracton.js

## deployContract.js
Deploys a sample contract using the Safe.This proposes a transaction.
Copy the safeTxHash from this step and provide it as an input for approveTxn and executeTx script.

To run this script, use the following command:
- node deployContract.js

## approveTxn.js
Approves a pending transaction in the Safe.

To run this script, use the following command:
- node approveTxn.js

## executeTx.js
Executes a pending transaction in the Safe.

To run this script, use the following command:
- node executeTx.js
