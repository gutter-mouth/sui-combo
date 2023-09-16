import type { CoinStruct } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { coinTypeFromName, constCoinTypes } from "../const/coin";

export type MergeAllCoinsProps = {
  tx: TransactionBlock;
  balances?: CoinStruct[];
};

export const mergeAllCoins = ({ tx, balances }: MergeAllCoinsProps) => {
  const afterBalancesBatch = constCoinTypes.map((coinType) => {
    const filteredBalances = balances?.filter(
      (balance) => balance.coinType === coinType,
    );
    if (
      coinType === coinTypeFromName("SUI") ||
      !filteredBalances ||
      filteredBalances?.length < 2
    )
      return filteredBalances;
    const coinObjectIds = filteredBalances.map(
      (balance) => balance.coinObjectId,
    );
    tx.mergeCoins(
      tx.object(coinObjectIds[0]),
      coinObjectIds.slice(1).map((id) => tx.object(id)),
    );
    return filteredBalances[0];
  });
  const afterBalances = afterBalancesBatch
    .flat()
    .filter((balance) => balance) as CoinStruct[];
  return afterBalances;
};
