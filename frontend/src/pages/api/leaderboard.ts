import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";

type Player = {
  player: string;
  bet: number;
  betAmount: number;
  requestId: number;
  result: number;
  transaction_id?: string;
  playAt: number;
  isWin: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Player[]>
) {
  const leaderboardDirectory = path.join(process.cwd(), "leaderboard");
  let leaderboard = [];
  try {
    leaderboard = JSON.parse(
      await fs.readFile(leaderboardDirectory + "/data.json", "utf8")
    );
  } catch (err) {}

  res.status(200).json(leaderboard);
}
