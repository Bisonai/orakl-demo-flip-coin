import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { FlipCoinContract } from "../../contracts/FipCoinContract";
import { IRequestInfo } from "../../contracts/types";
import { IFlipModel, IWalletInfo } from "../../types";
import { timer } from "../../utils";
import stores from "../store";

export const logoutAction = createAction("account/logoutAction");
export const setActiveMenu = createAction<string>("account/setActiveMenu");

export const setProvider = createAction<ethers.providers.Web3Provider>(
  "account/setProvider"
);

export const generateContract = createAsyncThunk<
  IWalletInfo,
  ethers.providers.Web3Provider
>("account/generateContract", async (provider) => {
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const bnb = Number.parseFloat(ethers.utils.formatEther(balance));
  return { address, bnbBalance: bnb };
});

export const flipCoinAction = createAsyncThunk<IRequestInfo, IFlipModel>(
  "account/flipCoinAction",
  async (model) => {
    const { web3Provider } = stores.getState().account;
    if (!web3Provider) throw new Error("Provider is null or undefined.");
    const flipContract = new FlipCoinContract(web3Provider);
    const flipResponse = await flipContract.flip(model.type, model.amount);
    const TIME_OUT = 5000;
    while (true) {      
      const rs: IRequestInfo = await flipContract.requestInfors(flipResponse.requestId);
      if (rs.hasResult) return {...rs, txHash: flipResponse.txHash};
      await timer(TIME_OUT);
    }
  }
);
