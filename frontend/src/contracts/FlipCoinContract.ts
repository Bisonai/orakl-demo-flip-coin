import { TransactionResponse } from "@ethersproject/abstract-provider";
import { BigNumber, ethers } from "ethers";
import { BaseInterface } from "./interfaces";
import { FLIP_TYPE, IFlipResponse, IPlayerInfo, IRequestInfo } from "./types";
import { getFlipCoinAbi } from "./utils/getAbis";
import { getFlipCoinAddress } from "../utils/getEnv";

export class FlipCoinContract extends BaseInterface {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getFlipCoinAddress(), getFlipCoinAbi());
  }

  playerInfors = async (address: string): Promise<IPlayerInfo> => {
    const rs = await this._contract.players(address);
    return {
      winCount: this._toNumber(rs.winCount),
      total: this._toNumber(rs.totalCount),
      balance: this._toEther(rs.balance),
    };
  };

  claim = async () => {
    const tx = await this._contract.claim();
    return this._handleTransactionResponse(tx);
  };

  flip = async (flip: FLIP_TYPE, amount: number): Promise<IFlipResponse> => {
    const tx: TransactionResponse = await this._contract.flip(flip, {
      ...this._option,
      value: this._toWei(amount),
    });
    const event: ethers.utils.Result = (await this._handleTransactionResponse(
      tx,
      true,
      "Flip"
    )) as ethers.utils.Result;
    return { requestId: event.requestId.toString(), txHash: tx.hash };
  };
}

export class FlipCoinContractReadOnly {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    address: string,
    abi: ethers.ContractInterface
  ) {
    this._contract = new ethers.Contract(address, abi, provider);
  }

  _toNumber = (bigNumber: BigNumber) => {
    try {
      return bigNumber.toNumber();
    } catch (er) {
      return Number.parseFloat(ethers.utils.formatEther(bigNumber));
    }
  };

  requestInfors = async (requestId: string): Promise<IRequestInfo> => {
    const rs = await this._contract.requests(requestId);
    const rp: IRequestInfo = {
      player: rs.player,
      bet: this._toNumber(rs.bet),
      betAmount: this._toNumber(rs.betAmount),
      result: this._toNumber(rs.result),
      hasResult: rs.hasResult,
    };
    return rp;
  };
}
