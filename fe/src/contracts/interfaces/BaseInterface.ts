import {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { BigNumber, ethers, Overrides, ContractReceipt } from "ethers";

export default class BaseInterface {
  _provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider;
  _contractAddress: string;
  _abis: ethers.ContractInterface;
  _contract: ethers.Contract;
  _option: Overrides;

  constructor(
    provider: ethers.providers.Web3Provider | ethers.providers.JsonRpcProvider,
    address: string,
    abi: ethers.ContractInterface
  ) {
    this._provider = provider;
    this._contractAddress = address;
    this._abis = abi;
    this._option = { gasLimit: 300000 };
    this._contract = new ethers.Contract(address, abi, provider.getSigner());
  }

  _handleTransactionResponse = async (
    tx: TransactionResponse,
    getEvent?: boolean,
    eventName?: string
  ) => {
    try {
      if (!getEvent) {
        const recept: TransactionReceipt = await tx.wait();
        return recept.transactionHash;
      }
      const recept: ContractReceipt = await tx.wait();
      const event = recept.events?.find((p) => p.event === eventName);
      
      if (!event || !event.args) {  
        throw new Error (`event ${eventName} does not exist or args undefined.`);
      }                  
      return event.args;      
    } catch (er: any) {
      throw new Error(er?.reason || `${er}`);
    }
  };

  _toNumber = (bigNumber: BigNumber) => {
    try {
      return bigNumber.toNumber();
    } catch (er) {      
      return Number.parseFloat(ethers.utils.formatEther(bigNumber));
    }
  };

  _toEther = (bigNumber: BigNumber) => {
    return Number.parseFloat(ethers.utils.formatEther(bigNumber));  
  }

  _toWei = (amount: number) => {
    return ethers.utils.parseUnits(amount.toString());
  };
}
