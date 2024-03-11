import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("deploy from address: ", deployer.address);

  const FlipCoin = await ethers.getContractFactory("FlipCoin");
  const accountId = 34;
  const vrfCoodinator = "0x6B4c0b11bd7fE1E9e9a69297347cFDccA416dF5F";
  const keyHash =
    "0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c";
  const flipCoin = await FlipCoin.deploy(accountId, vrfCoodinator, keyHash);
  console.log("FlipCoin address: ", flipCoin.address);
  Config.setConfig(network + ".flipCoin", flipCoin.address);

  await Config.updateConfig();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
