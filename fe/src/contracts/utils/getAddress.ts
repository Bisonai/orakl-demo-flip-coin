import getChainIdFromEnv from "../../utils/getEnv";
import { AddressType, SMART_ADDRESS } from "./constants";

const getAddress = (address: AddressType) => {
  const CHAIN_ID = getChainIdFromEnv() as keyof AddressType;
  return address[CHAIN_ID];
};

export const getFlipCoinAddress = () => getAddress(SMART_ADDRESS.FLIP_COIN);
