# flip-coin-orakl

HOW TO RUN THE DAPP FROM YOUR LOCAL MACHINE


1. Deploying Smart Contracts:

Navigate to the contracts folder: `cd contracts`
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

2. Deploying  job for getting latest flips
Navigate to the jobs folder: `cd jobs`
Install dependencies by running either `yarn` or `npm install`.
start the job by running: `yarn start`

3. Run the Frontend
Navigate to the jobs folder: `cd fe`
Install dependencies by running either `yarn` or `npm install`.

Create a `.env` file and specify the following parameters:
```
NEXT_PUBLIC_EXPLORER=
NEXT_PUBLIC_RPC_TESTNET=
NEXT_PUBLIC_CHAIN_ID=
FLIPCOIN_ADDRESS=
```
Start the website in a development environment: `yarn dev`
For production environment: `yarn build` then `yarn start`

# HOW TO RUN THE DAPP WITH DOCKER

Ensure your Docker service is up and running on your local machine. For installing Docker on a Mac machine:
```
brew install docker
brew install docker-compose
```
create a volume for storing job data: `docker volume create leadearboard`
Build the Docker file for frontend: `docker-compose -f docker-compose.yml build`
Run the Docker file: `docker-compose -f docker-compose.yml up`

This will start the application using Docker containers.



