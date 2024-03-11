import { TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import { BaseInterface } from "./interfaces";
import { FLIP_TYPE, IFlipResponse, IPlayerInfo, IRequestInfo } from "./types";
import { getFlipCoinAbi } from "./utils/getAbis";
import { getFlipCoinAddress } from "./utils/getAddress";

export class FlipCoinContract extends BaseInterface {
  constructor(provider: ethers.providers.Web3Provider) {
    super(provider, getFlipCoinAddress(), getFlipCoinAbi());
  }

  playerInfors = async (address: string): Promise<IPlayerInfo> => {
    const rs = await this._contract.playerInfors(address);
    return {
      winCount: this._toNumber(rs.winCount),
      balance: this._toEther(rs.balance),
      total: this._toNumber(rs.total),
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

  requestInfors = async (requestId: string): Promise<IRequestInfo> => {
    const rs = await this._contract.requestInfors(requestId);
    const rp: IRequestInfo = {
      bet: this._toNumber(rs.bet),
      betAmount: this._toNumber(rs.betAmount),
      hasResult: rs.hasResult,
      player: rs.player,
      result: this._toNumber(rs.result),
    };
    return rp;
  };
}
