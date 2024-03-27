# flip-coin-orakl

HOW TO RUN THE DAPP FROM YOUR LOCAL MACHINE


1. Deploying Smart Contracts:

Navigate to the contracts folder:

`cd contracts`
Install dependencies by running either `yarn` or `npm install`.

Create a `.env` file and specify the following parameters:

`PRIV_KEY`: Deployer wallet private key
`MNEMONIC`: Deployer Mnemonic
Deploy the smart contracts on Baobab network by executing the command:

`yarn deploy baobab`
The newly deployed contracts can be found in `contracts/config.json`

Additionally, you can utilize the following commands:

`yarn test`: Run test cases.
`yarn compile`: Compile contracts.
2. Config and run the frontend



