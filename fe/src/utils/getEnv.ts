import { CHAIN_ID } from "../types";

export default function getChainIdFromEnv(): number {
  const env = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (!env) {
    return 1001;
  }
  return parseInt(env);
}

export const getApiEndpoint = (): string => {
  return process.env.NEXT_PUBLIC_API_ENDPOINT || "";
};

export const getRPC = () => {
  if (getChainIdFromEnv() === CHAIN_ID.MAINNET)
    return process.env.NEXT_PUBLIC_RPC_MAINNET;
  return process.env.NEXT_PUBLIC_RPC_TESTNET;
};

export const getExplorerUrl = () => {
  return process.env.NEXT_PUBLIC_EXPLORER;
};
