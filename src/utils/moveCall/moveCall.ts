
import { deposit, borrow } from "./naviProtocol";
import type { NaviProps } from "./naviProtocol";


export type MoveCallProps =
  NaviProps & {
    method: "deposit" | "borrow";
  };

export const moveCall = ({ method, tx, token, amount }: MoveCallProps) => {
  if (method === "deposit")
    return deposit({ tx, token, amount });
  if (method === "borrow")
    return borrow({ tx, token, amount });
}