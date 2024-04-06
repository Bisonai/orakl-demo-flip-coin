const fs = require("fs");
const web3 = require("web3");
require("dotenv").config();

const abi = require("./FlipCoin.json");
const blockLogPath = "coin-flip-block.txt";
const leaderboardPath = "leaderboard/data.json";
const listSize = 20;

const rpc = process.env.RPC_URL;
const contractAddress = process.env.FLIPCOIN_ADDRESS;
const rpcProvider = new web3.providers.HttpProvider(rpc);
const provider = new web3(rpcProvider);
const contract = new provider.eth.Contract(abi, contractAddress);

let blocking = false;

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.log(new Date().toISOString() + error);
  }
}

let fromBlock = 0;

try {
  fromBlock = readFile(blockLogPath);
} catch (error) {}

async function writeLog(content, logfile) {
  try {
    fs.writeFileSync(logfile, content.toString(), { flag: "w" });
  } catch (error) {
    console.log(new Date().toISOString() + error);
  }
}

async function run() {
  if (blocking) {
    return;
  }

  blocking = true;
  let toBlock;

  try {
    toBlock = await provider.eth.getBlockNumber();
    if (fromBlock == 0) {
      fromBlock = parseInt(toBlock) - 1000;
    }

    if (parseInt(toBlock) - parseInt(fromBlock) > 1000) {
      toBlock = parseInt(fromBlock) + 1000;
    }

    const options = {
      fromBlock: fromBlock,
      toBlock: toBlock,
    };

    let leaderboard = [];
    if (fs.existsSync(leaderboardPath)) {
      try {
        leaderboard = JSON.parse(readFile(leaderboardPath));
      } catch (error) {}
    }

    let events = await contract.getPastEvents("Flip", options);
    if (events.length > 0) {
      events.map(async (event) => {
        let req = {};
        req.player = event.returnValues.player;
        req.bet = parseInt(event.returnValues.bet);
        req.betAmount = Number(
          web3.utils.fromWei(event.returnValues.betAmount, "ether")
        );
        req.requestId = event.returnValues.requestId;
        req.transaction_id = event.transactionHash;
        req.playAt = (await provider.eth.getBlock(event.blockNumber)).timestamp;
        req.result = undefined;

        if (leaderboard.indexOf((q) => q.requestId == req.requestId) == -1) {
          leaderboard.push(req);
          console.log("Flip", req);
        }
      });
    }

    events = await contract.getPastEvents("Result", options);
    if (events.length > 0) {
      events.map(async (event) => {
        let req = {};
        req.player = event.returnValues.player;
        req.requestId = event.returnValues.requestId;
        req.result = parseInt(event.returnValues.result);

        let item = leaderboard.filter((q) => q.requestId == req.requestId)[0];
        if (item) {
          item.result = req.result;
          item.isWin = item.bet == item.result;
          console.log("Result", item);
        }
      });
    }

    leaderboard = leaderboard.slice(
      Math.max(leaderboard.length - listSize, 0),
      Math.min(leaderboard.length, listSize)
    );
    await writeLog(JSON.stringify(leaderboard), leaderboardPath);
  } catch (error) {
    console.log(new Date().toISOString() + error);
  }

  console.log(fromBlock, toBlock);
  fromBlock = toBlock + 1;
  await writeLog(fromBlock, blockLogPath);
  blocking = false;
}

setInterval(run, 900);
