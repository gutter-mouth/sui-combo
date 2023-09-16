import type { CoinStruct } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { constCoinTypes } from "../const/coin";

export type MergeAllCoinsProps = {
  tx: TransactionBlock;
  balances?: CoinStruct[];
};

export const mergeAllCoins = ({ tx, balances }: MergeAllCoinsProps) => {
  constCoinTypes.forEach((coinType) => {
    const coinObjectIds = balances
      ?.filter((balance) => balance.coinType === coinType)
      .map((balance) => balance.coinObjectId);
    if (coinObjectIds && coinObjectIds.length > 1)
      tx.mergeCoins(
        tx.object(coinObjectIds[0]),
        coinObjectIds.slice(1).map((id) => tx.object(id)),
      );
  });
};
