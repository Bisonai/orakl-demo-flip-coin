# Flip Coin

This repository contains a simple flip coin game utilizing [Orakl Network Verifiable Randomness Function (VRF)](https://orakl.network/).
VRF is deployed on Kaia mainnet and testnet (Kairos), and this repository is compatible with both.

<img width="864" alt="image" src="https://github.com/Bisonai/orakl-demo-flip-coin/assets/2312761/3ff7a81d-5ca3-4e28-a1d2-876fe092042d">

## What is Flip Coin Game?

"Flip Coin" is a betting game implemented as a Solidity smart contract.
Users can bet any amount of $KAIA on the outcome of a random coin flip, with a 50% chance for heads and a 50% chance for tails.
Randomness is generated using the [Verifiable Randomness Function (VRF)](https://docs.orakl.network/developers-guide/vrf) provided by [Orakl Network](https://orakl.network/).
If the bet is correct, the user is rewarded with twice the amount bet, otherwise, the smart contract retains the user's bet.
After the user ends the game, all $KAIA can be claimed at once.

## Development

### 1. Create Orakl Network Account

[FlipCoin.sol](contracts/src/FlipCoin.sol) requires Orakl Network [Permanent Account](https://docs.orakl.network/developers-guide/prepayment).
You can create one through https://orakl.network/account.
Once you have successfully created an account, you will be prompted to "Add Consumer" (which will be possible after the `FlipCoin` smart contract is deployed) and to "Deposit $KAIA" into your account.
The $KAIA in your account will be used as payment for VRF requests.
If you do not have $KAIA in your account, you won't be able to request VRF, and the Flip Coin game will not function.
$KAIA tokens can be requested through [Kairos faucet](https://www.kaia.io/faucet).

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

Deploy smart contracts on [Kairos network](https://www.kaia.io) by executing the command below.

```shell
yarn deploy kairos
```

After successfull execution you should be able to see output similar to the following.

```
$ hardhat run scripts/deploy.ts --network kairos
Creating Typechain artifacts in directory typechain for target ethers-v5
Successfully generated Typechain artifacts!
Deployer 0xa37AcA2eaf7dcc199820Dc17689a17839B7510e9
FlipCoin 0x0458E0244E23B4663B4a28671EC4bfA3BbD3628F
```

Finally, you need to add the address of your deployed `FlipCoin` contract as a consumer to your Orakl Network account, and deposit $KAIA tokens into the `FlipCoin` contract to make it possible to win.

### 3. Launch Backend (optional)

Backend is used for event data collection of players' bets.
Collected bet information are displayed in frontend leaderboard.

Navigate to the `backend` directory.

```shell
cd backend
```

Create an `.env` file and specify the parameters below.

```shell
RPC_URL=
FLIPCOIN_ADDRESS=
```

* `RPC_URL` - JSON-RPC url that is used to communicate with Kaia blockchain ([Mainnet JSON-RPC](https://public-en.node.kaia.io), [Kairos JSON-RPC](https://public-en-kairos.node.kaia.io))
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

* `NEXT_PUBLIC_EXPLORER` - url of Kaia blockchain explorer ([Mainnet block explorer](https://kaiascan.io/), [Kairos block explorer](https://kairos.kaiascan.io/))
* `NEXT_PUBLIC_RPC_URL` - JSON-RPC url that is used to communicate with Kaia blockchain ([Mainnet JSON-RPC](https://public-en.node.kaia.io), [Kairos JSON-RPC](https://public-en-kairos.node.kaia.io))
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

Ensure Docker service is installed and running on your local machine.

```shell
brew install docker
brew install docker-compose
```

Create a volume for storing backend data.

```shell
docker volume create leaderboard
```

Build images (frontend + backend).

```shell
docker-compose -f docker-compose.yml build
```

Launch containers (frontend + backend).

```shell
docker-compose -f docker-compose.yml up
```

## License

[MIT License](LICENSE)
