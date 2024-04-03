# Flip Coin

This repository contains a simple Flip Coin game utilizing [Orakl Network Verifiable Random Function](https://orakl.network/).

## Development

### 1. Create Orakl Network Account

https://orakl.network/account

Add consumer

Send KLAY from faucet for deployed contract

### 2. Deploy Smart Contracts

Navigate to the `contracts` directory.

```shell
cd contracts
```

Install dependencies.

```shell
yarn install
```

Create an `.env` file and include `PRIV_KEY` environment variable representing private key that will be utilized for smart contract deployment.

Deploy smart contracts on [Baobab network](https://klaytn.foundation) by executing the command:

```shell
yarn deploy baobab
```

The newly deployed contracts can be found in `contracts/config.json`

### 3. Launch backend

Navigate to the `backend` directory.

```shell
cd backend
```

Create an `.env` file and specify the parameters below.
```shell
RPC_URL=
FLIPCOIN_ADDRESS=
```

Install dependencies and launch backend.

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

Next, you can start the website in a development mode

```shell
yarn dev
```

or build it first, and launch in a production mode.

```shell
yarn build
yarn start
```

# Docker

Ensure your Docker service is up and running on your local machine.

```shell
brew install docker
brew install docker-compose
```

Create a volume for storing backend data

```shell
docker volume create leadearboard
```

Build the Docker file for frontend

```shell
docker-compose -f docker-compose.yml build
```

Run the Docker file

```shell
docker-compose -f docker-compose.yml up
```

This will start the application using Docker containers.

## License

[MIT License](LICENSE)
