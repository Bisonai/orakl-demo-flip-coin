//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import {VRFConsumerBase} from "@bisonai/orakl-contracts/src/v0.1/VRFConsumerBase.sol";
import {IVRFCoordinator} from "@bisonai/orakl-contracts/src/v0.1/interfaces/IVRFCoordinator.sol";

contract FlipCoin is VRFConsumerBase, Ownable {
    using SafeERC20 for IERC20;
    IVRFCoordinator COORDINATOR;
    // Your subscription ID.
    uint64 public sAccountId;

    bytes32 public sKeyHash;

    // function.
    uint32 sCallbackGasLimit = 300000;

    // For this example, retrieve 2 random values in one request.
    uint32 sNumWords = 1;

    // random number is 0: head, 1: tail
    uint256 public taxFee = 35; // 3,5 %
    uint256 public taxFeeMax = 50; // 10 %
    uint256 public totalRequest = 0;
    uint256 public totalWinCount = 0;
    uint256 public totalRemainBalance = 0;

    struct playerInfor {
        uint256 winCount;
        uint256 total;
        uint256 balance;
    }

    struct requestInfor {
        address player;
        uint256 bet;
        uint256 betAmount;
        uint result;
        bool hasResult;
    }
    mapping(uint256 => requestInfor) public requestInfors;
    mapping(address => playerInfor) public playerInfors;
    // uint256[]: list request id
    mapping(address => uint256[]) public players;

    event SetCoordinator(address setter, address newCoordinator);
    event SetTaxFee(address setter, uint256 newFee);
    event SetAccountId(uint64 accId);
    event Flip(
        address player,
        uint256 bet,
        uint256 betAmount,
        uint256 requestId
    );
    event Result(
        address player,
        uint256 requestid,
        uint256 result,
        uint256 randomResult
    );
    event Claim(address player, uint256 amount);

    constructor(
        uint64 accountId,
        address coordinator,
        bytes32 keyHash
    ) VRFConsumerBase(coordinator) {
        COORDINATOR = IVRFCoordinator(coordinator);
        sAccountId = accountId;
        sKeyHash = keyHash;
    }

    function setAccountId(uint64 accId) public onlyOwner {
        sAccountId = accId;
        emit SetAccountId(accId);
    }

    function setTaxFee(uint256 newFee) public onlyOwner {
        require(newFee <= taxFeeMax, "Fee out of range");
        taxFee = newFee;
        emit SetTaxFee(msg.sender, newFee);
    }

    function setKeyHash(bytes32 newHash) public onlyOwner {
        sKeyHash = newHash;
    }

    function setGasLimit(uint32 newGas) public onlyOwner {
        sCallbackGasLimit = newGas;
    }

    function flip(uint256 bet) public payable {
        uint256 amount = msg.value;
        require(msg.sender.balance >= amount, "Insufficient account balance");
        uint256 betAmount = (msg.value / (1000 + taxFee)) * 1000;
        uint256 fee = betAmount * (taxFee / 1000);
        uint256 neededBalance = (betAmount * 2 + fee + totalRemainBalance); // balance need to pay for player
        require(
            address(this).balance >= neededBalance,
            "FlipCoin: Insufficient account balance"
        );
        uint256 requestid = requestRandomWords();
        //uint256 requestid =1;
        players[msg.sender].push(requestid);
        requestInfors[requestid].player = msg.sender;
        requestInfors[requestid].bet = bet;
        requestInfors[requestid].betAmount = betAmount;

        totalRequest += 1;
        playerInfors[msg.sender].total += 1;

        emit Flip(msg.sender, bet, betAmount, requestid);
    }

    function requestRandomWords() internal returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(
            sKeyHash,
            sAccountId,
            sCallbackGasLimit,
            sNumWords
        );
    }

    function fulfillRandomWords(
        uint256 requestId /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        uint result = randomWords[0] % 2;
        requestInfors[requestId].result = result;
        requestInfors[requestId].hasResult = true;
        uint bet = requestInfors[requestId].bet;
        uint256 betAmount = requestInfors[requestId].betAmount;
        address player = requestInfors[requestId].player;
        //
        if (bet == result) //win
        {
            playerInfors[player].winCount += 1;
            playerInfors[player].balance += betAmount * 2;
            totalWinCount += 1;
            totalRemainBalance += betAmount * 2;
        }
        emit Result(player, requestId, result, randomWords[0]);
    }

    function claim() public {
        playerInfor storage playerinfor = playerInfors[msg.sender];
        uint256 amount = playerinfor.balance;
        require(amount > 0, "Insufficient account balance");
        require(
            address(this).balance >= amount,
            "FlipCoin: Insufficient account balance"
        );
        playerinfor.balance = 0;
        totalRemainBalance -= amount;
        payable(msg.sender).transfer(amount);
        emit Claim(msg.sender, amount);
    }

    function withdraw(uint256 amount) public onlyOwner {
        uint256 availableBalance = address(this).balance - totalRemainBalance;
        require(
            availableBalance >= amount,
            "FlipCoin: Insufficient account balance"
        );
        payable(msg.sender).transfer(amount);
    }

    // Receive remaining payment from requestRandomWordsPayment
    receive() external payable {}

}
