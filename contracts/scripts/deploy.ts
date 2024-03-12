import { ethers, hardhatArguments } from "hardhat";
import * as Config from "./config";

async function main() {
  await Config.initConfig();
  const network = hardhatArguments.network ? hardhatArguments.network : "dev";
  const [deployer] = await ethers.getSigners();
  console.log("deploy from address: ", deployer.address);

  const FlipCoin = await ethers.getContractFactory("FlipCoin");
  const accountId = 751;
  const vrfCoodinator = "0xDA8c0A00A372503aa6EC80f9b29Cc97C454bE499";
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
