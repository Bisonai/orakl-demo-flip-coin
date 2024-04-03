//SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {Ownable} from "openzeppelin-solidity/contracts/access/Ownable.sol";
import {VRFConsumerBase} from "@bisonai/orakl-contracts/src/v0.1/VRFConsumerBase.sol";
import {IVRFCoordinator} from "@bisonai/orakl-contracts/src/v0.1/interfaces/IVRFCoordinator.sol";

contract FlipCoin is VRFConsumerBase, Ownable {
    IVRFCoordinator COORDINATOR;

    uint64 public accId;
    bytes32 public keyHash;
    uint32 public callbackGasLimit = 300_000;

    uint256 public tax = 350; // basis points (3.5%)
    uint256 public taxMax = 10_000; // basis points (100%)
    uint256 public unclaimed = 0;

    struct Player {
        uint256 winCount;
        uint256 totalCount;
        uint256 balance;
    }

    struct Request {
        address player;
        uint256 bet;
        uint256 betAmount;
        uint result;
        bool hasResult;
    }
    mapping(uint256 => Request) public requests;
    mapping(address => Player) public players;
    mapping(address => uint256[]) public bets;

    event SetCoordinator(address setter, address newCoordinator);
    event SetTax(address setter, uint256 tax);
    event SetAccountId(uint64 accId);
    event SetKeyHash(bytes32 keyHash);
    event SetGasLimit(uint32 callbackGasLimit);
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
        uint64 _accountId,
        address _coordinator,
        bytes32 _keyHash
    ) VRFConsumerBase(_coordinator) {
        COORDINATOR = IVRFCoordinator(_coordinator);
        accId = _accountId;
        keyHash = _keyHash;
    }

    function setAccountId(uint64 _accId) public onlyOwner {
        accId = _accId;
        emit SetAccountId(_accId);
    }

    function setTax(uint256 _tax) public onlyOwner {
        require(_tax <= taxMax, "FlipCoin: Tax fee out of range");
        tax = _tax;
        emit SetTax(msg.sender, _tax);
    }

    function setKeyHash(bytes32 _keyHash) public onlyOwner {
        keyHash = _keyHash;
	emit SetKeyHash(_keyHash);
    }

    function setGasLimit(uint32 _callbackGasLimit) public onlyOwner {
        callbackGasLimit = _callbackGasLimit;
	emit SetGasLimit(_callbackGasLimit);
    }

    function flip(uint256 _bet) public payable {
	uint256 fee_ = (msg.value * tax) / taxMax;
	uint256 betAmount_ = msg.value - fee_;

	unclaimed += betAmount_ * 2;
        uint256 requiredBalance_ = unclaimed + fee_;
        require(
            address(this).balance >= requiredBalance_,
            "FlipCoin: Insufficient contract balance"
        );

        uint256 requestId_ = requestRandomWords();
        requests[requestId_].player = msg.sender;
        requests[requestId_].bet = _bet;
        requests[requestId_].betAmount = betAmount_;
        players[msg.sender].totalCount += 1;
	bets[msg.sender].push(requestId_);

        emit Flip(msg.sender, _bet, betAmount_, requestId_);
    }

    function requestRandomWords() internal returns (uint256) {
        return COORDINATOR.requestRandomWords(
            keyHash,
            accId,
            callbackGasLimit,
            1
        );
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        uint256 result_ = _randomWords[0] % 2;
        requests[_requestId].result = result_;
        requests[_requestId].hasResult = true;

        uint256 bet_ = requests[_requestId].bet;
        uint256 betAmount_ = requests[_requestId].betAmount;
        address player_ = requests[_requestId].player;

        if (bet_ == result_) {
	    // won
            players[player_].winCount += 1;
            players[player_].balance += betAmount_ * 2;
        } else {
	    // lost
	    unclaimed -= betAmount_;
	}

        emit Result(player_, _requestId, result_, _randomWords[0]);
    }

    function claim() public {
        Player storage player_ = players[msg.sender];
        uint256 amount_ = player_.balance;
        require(amount_ > 0, "FlipCoin: Insufficient player balance");
        require(
            unclaimed >= amount_,
            "FlipCoin: Insufficient contract balance"
        );

	unclaimed -= amount_;
        player_.balance = 0;
        emit Claim(msg.sender, amount_);

        payable(msg.sender).transfer(amount_);
    }

    function withdraw(uint256 _amount) public onlyOwner {
        uint256 treasuryBalance_ = address(this).balance - unclaimed;
        require(
            treasuryBalance_ >= _amount,
            "FlipCoin: Insufficient balance in contract"
        );
        payable(msg.sender).transfer(_amount);
    }

    // Receive remaining payment from requestRandomWordsPayment
    receive() external payable {}
}
