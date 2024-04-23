import "hardhat-typechain";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config(".env");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
      },
    ],
  },
  paths: {
    sources: "./src",
  },
  networks: {
    local: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIV_KEY],
      saveDeployments: true,
    },
    baobab: {
      url: "https://api.baobab.klaytn.net:8651",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 250_000_000_000,
      chainId: 1001,
    },
  },
};
