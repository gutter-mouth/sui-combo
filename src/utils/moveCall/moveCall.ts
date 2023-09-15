import { deposit, borrow, withdraw } from "./naviProtocol";
import type { NaviProps } from "./naviProtocol";

export type MoveCallProps = NaviProps & {
  method: "deposit" | "borrow" | "withdraw";
};

export const moveCall = ({
  method,
  tx,
  coinType,
  amount,
  balances,
  recipient,
}: MoveCallProps) => {
  if (method === "deposit") return deposit({ tx, coinType, amount, balances });
  if (method === "borrow") return borrow({ tx, coinType, amount });
  if (method === "withdraw")
    return withdraw({ tx, coinType, amount, recipient });
  throw new Error("Invalid method");
};
