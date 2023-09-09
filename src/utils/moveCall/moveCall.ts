
import { deposit, borrow, withdraw } from "./naviProtocol";
import type { NaviProps } from "./naviProtocol";


export type MoveCallProps =
  NaviProps & {
    method: "deposit" | "borrow" | "withdraw";
  };

export const moveCall = ({ method, tx, balances, coinType, amount }: MoveCallProps) => {
  if (method === "deposit")
    return deposit({ tx, balances, coinType, amount });
  if (method === "borrow")
    return borrow({ tx, coinType, amount });
  if (method === "withdraw")
    return withdraw({ tx, coinType, amount });
}