const fs = require("fs");
const web3 = require("web3");
const abi = require("./smcAbi.json");
const block_log_path = "block_flip_log.txt";
const flip_list_path = "../fe/json/data.json";

const listSize = 20;
let last_block = 0;
let apiurl = "";
let rpc = "";
let contract_address;
let provider;
let web3bsc;
let contract;
let isBlock = false;
let mode = "";

if (mode == "PRODUCTION") {
  rpc = "https://api.baobab.klaytn.net:8651";
  contract_address = "0x0210B31aA5Ce547cC399E52D7d40770cB65AF323";
  provider = new web3.providers.HttpProvider(rpc);
  web3bsc = new web3(provider);
  contract = new web3bsc.eth.Contract(abi, contract_address);
  console.log("production");
} else {
  rpc = "https://api.baobab.klaytn.net:8651";
  contract_address = "0x0210B31aA5Ce547cC399E52D7d40770cB65AF323";
  provider = new web3.providers.HttpProvider(rpc);
  web3bsc = new web3(provider);
  contract = new web3bsc.eth.Contract(abi, contract_address);
  console.log("dev");
}
function getlastblock() {
  try {
    last_block = fs.readFileSync(block_log_path, "utf8");
  } catch {}
}

getlastblock();

async function writelog(content, logfile) {
  try {
    fs.writeFileSync(logfile, content.toString(), { flag: "w" });
  } catch (error) {
    console.log(error);
  }
}

async function run() {
  if (isBlock) {
    return;
  }
  isBlock = true;
  let lastest_block;
  try {
    lastest_block = await web3bsc.eth.getBlockNumber();
    if (last_block == 0) {
      last_block = parseInt(lastest_block) - 1000;
    }
    if (parseInt(lastest_block) - parseInt(last_block) > 1000) {
      lastest_block = parseInt(last_block) + 1000;
    }
    let options = {
      fromBlock: last_block, //Number || "earliest" || "pending" || "latest"
      toBlock: lastest_block,
    };
    let lst = [];

    if (fs.existsSync(flip_list_path)) {
      lst = JSON.parse(fs.readFileSync(flip_list_path));
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
        req.playAt = Math.floor(Date.now() / 1000);
        req.result = undefined;
        if (lst.indexOf((q) => q.requestId == req.requestId) == -1) {
          lst.push(req);
        }
      });
    }

    events = await contract.getPastEvents("Result", options);
    if (events.length > 0) {
      events.map(async (event) => {
        let req = {};
        req.player = event.returnValues.player;
        req.requestId = event.returnValues.requestid;
        req.result = parseInt(event.returnValues.result);

        let item = lst.filter((q) => q.requestId == req.requestId)[0];
        item.result = req.result;
        item.isWin = req.bet == item.result;
      });
      console.log("event Result", events);
    }
    lst = lst.slice(
      Math.max(lst.length - listSize, 0),
      Math.min(lst.length, listSize)
    );
    await writelog(JSON.stringify(lst), flip_list_path);
  } catch (error) {
    console.log(new Date().toISOString() + " catch error:" + error);
  }
  console.log(last_block, lastest_block);
  last_block = lastest_block + 1;
  await writelog(last_block, block_log_path);
  isBlock = false;
}

setInterval(run, 1000 * 3);
