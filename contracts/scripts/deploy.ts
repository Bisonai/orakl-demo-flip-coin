import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";
import * as dotenv from "dotenv";
dotenv.config(".env");

const ACCOUNT_ID = process.env.ACCOUNT_ID;

// The latest VRF Coordinator address and key hash can be found at
// https://orakl.network/account
const VRF_COORDINATOR = "0xDA8c0A00A372503aa6EC80f9b29Cc97C454bE499";
const KEY_HASH =
  "0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "local";
  const [deployer] = await ethers.getSigners();

  const contract = await ethers.getContractFactory("FlipCoin");
  const flipCoin = await contract.deploy(ACCOUNT_ID, VRF_COORDINATOR, KEY_HASH);

  console.log("Deployer", deployer.address);
  console.log("FlipCoin", flipCoin.address);

  Config.setConfig(network + ".flipCoin", flipCoin.address);
  await Config.updateConfig();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
