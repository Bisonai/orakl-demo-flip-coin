export interface IEventResponse {
  transactionHash: string;
}

export enum FLIP_TYPE {
  HEAD = 0,
  TAIL = 1
}

export interface IRequestInfo {
  player: string;
  bet: number;
  betAmount: number;
  result: number;
  hasResult: boolean;
  txHash?: string;
}

export interface IFlipResponse {
  txHash: string;
  requestId: string;
}

export interface IPlayerInfo {
  winCount: number;
  total: number;
  balance: number;
}