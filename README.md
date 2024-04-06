# Flip Coin

This repository contains a simple flip coin game utilizing [Orakl Network Verifiable Random Function (VRF)](https://orakl.network/).
VRF is deployed on Klaytn mainnet (Cypress) and testnet (Baobab), and this repository is compatible with both.

<img width="864" alt="image" src="https://github.com/Bisonai/flip-coin-orakl/assets/2312761/3ff7a81d-5ca3-4e28-a1d2-876fe092042d">


## What is Flip Coin Game?

"Flip Coin" is a betting game implemented as a Solidity smart contract.
Users can bet any amount of $KLAY on the outcome of a random coin flip, with a 50% chance for heads and a 50% chance for tails.
Randomness is generated using the [Verifiable Random Function (VRF)](https://docs.orakl.network/developers-guide/vrf) provided by [Orakl Network](https://orakl.network/).
If the bet is correct, the user is rewarded with twice the amount bet, otherwise, the smart contract retains the user's bet.
After the user ends the game, all $KLAY can be claimed at once.

## Development

### 1. Create Orakl Network Account

[FlipCoin.sol](contracts/contracts/FlipCoin.sol) requires Orakl Network [Permanent Account](https://docs.orakl.network/developers-guide/prepayment).
You can create one through https://orakl.network/account.
Once you have successfully created an account, you will be prompted to "Add Consumer" (which will be possible after the `FlipCoin` smart contract is deployed) and to "Deposit $KLAY" into your account.
The $KLAY in your account will be used as payment for VRF requests.
If you do not have $KLAY in your account, you won't be able to request VRF, and the Flip Coin game will not function.
$KLAY tokens can be obtained from the [Baobab faucet](https://baobab.wallet.klaytn.foundation/faucet).

### 2. Deploy Smart Contracts

Navigate to the `contracts` directory.

```shell
cd contracts
```

Install dependencies.

```shell
yarn install
```

Create an `.env` file and specify the environment variables below.

```
PRIV_KEY=
ACCOUNT_ID=
```

* `PRIV_KEY` - private key that will be utilized for smart contract deployment
* `ACCOUNT_ID` - Orakl Network account ID (can be found at https://orakl.network/account)

Deploy smart contracts on [Baobab network](https://klaytn.foundation) by executing the command below.

```shell
yarn deploy baobab
```

After successfull execution you should be able to see output similar to the following.

```
$ hardhat run scripts/deploy.ts --network baobab
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!
Deployer 0xa37AcA2eaf7dcc199820Dc17689a17839B7510e9
FlipCoin 0x0458E0244E23B4663B4a28671EC4bfA3BbD3628F
```

Now, you need to add address of your deployed `FlipCoin` contract as consumer to your Orakl Network account.

### 3. Launch backend (optional)

Navigate to the `backend` directory.

```shell
cd backend
```

Create an `.env` file and specify the parameters below.

```shell
RPC_URL=
FLIPCOIN_ADDRESS=
```

* `RPC_URL` - JSON-RPC url that is used to communicate with klaytn blockchain (Cypress: https://klaytn-mainnet-rpc.allthatnode.com:8551, Baobab: https://klaytn-baobab-rpc.allthatnode.com:8551)
* `FLIPCOIN_ADDRESS` - address of deployed `FlipCoin` smart contract

Install dependencies, and launch backend.

```shell
yarn install
yarn start
```

### 4. Launch Frontend

Navigate to the `frontend` directory.

```shell
cd frontend
```

Install dependencies.

```shell
yarn install
```

Create an `.env` file and specify the parameters below.

```shell
NEXT_PUBLIC_EXPLORER=
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_FLIPCOIN_ADDRESS=
```

* `NEXT_PUBLIC_EXPLORER` - url of klaytn blockchain explorer (Cypress: https://klaytnfinder.io/, Baobab: https://baobab.klaytnfinder.io/)
* `NEXT_PUBLIC_RPC_URL` - JSON-RPC url that is used to communicate with klaytn blockchain (Cypress: https://klaytn-mainnet-rpc.allthatnode.com:8551, Baobab: https://klaytn-baobab-rpc.allthatnode.com:8551)
* `NEXT_PUBLIC_FLIPCOIN_ADDRESS` - address of deployed `FlipCoin` smart contract

Next, you can start the website in a development mode.

```shell
yarn dev
```

Or you can build it first, and then launch in a production mode.

```shell
yarn build
yarn start
```

## Docker

Ensure your Docker service is installed and running on your local machine.

```shell
brew install docker
brew install docker-compose
```

Create a volume for storing backend data.

```shell
docker volume create leadearboard
```

Build the Docker images (frontend + backend).

```shell
docker-compose -f docker-compose.yml build
```

Launch the containers (frontend + backend).

```shell
docker-compose -f docker-compose.yml up
```

## License

[MIT License](LICENSE)
