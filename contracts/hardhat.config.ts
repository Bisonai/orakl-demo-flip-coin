import "hardhat-typechain";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.16",
      },
    ],
  },
  // defaultNetwork: "dev",
  networks: {
    dev: {
      url: "http://localhost:7545",
      gasPrice: 20,
      accounts: {
        mnemonic: process.env.MNEMONIC,
        count: 10,
      },
      saveDeployments: true,
    },
    baobab: {
      url: "https://api.baobab.klaytn.net:8651",
      accounts: [process.env.PRIV_KEY],
      gasPrice: 250_000_000_000,
      chainId: 1001,
    },
  },

  etherscan: {
    apiKey: process.env.API_KEY,
  },
};
