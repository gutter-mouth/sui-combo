import { constCoins, decimalsFromType } from "@/utils/const/coin";
import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { BsFillArrowDownCircleFill } from "react-icons/bs";

import { preswap } from "@/utils/cetus";
import {
  calcStepFromCoinType,
  decimalsToFloat,
  floatToDecimals,
} from "@/utils/tools/tools";

import { CoinStruct } from "@mysten/sui.js/client";

type TxCointerProps = {
  index: number;
  control: any;
  register: any;
  remove: any;
  balances: CoinStruct[] | undefined;
};

export const TxCoiainer = ({
  index,
  control,
  register,
  remove,
  balances,
}: TxCointerProps) => {
  const watchMethod = useWatch({ name: `blocks.${index}.method`, control });
  const watchAmount = useWatch({ name: `blocks.${index}.amount`, control });
  const watchCoinType = useWatch({ name: `blocks.${index}.coinType`, control });
  const watchCoinTypeOut = useWatch({
    name: `blocks.${index}.coinTypeOut`,
    control,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [amountOut, setAmountOut] = useState<number>(0);
  const [selectedBalance, setselectedBalance] = useState<string | undefined>(
    undefined,
  );

  const coinBalance = () => {
    if (!balances) return;
    balances.map((balance: CoinStruct) => {
      if (balance.coinType === watchCoinType) {
        const decimal = decimalsFromType(watchCoinType);
        const adujstedBalance =
          Math.round((Number(balance.balance) / 10 ** decimal!) * 100) / 100;
        setselectedBalance(adujstedBalance.toString());
      }
    });
  };

  useEffect(() => {
    coinBalance();
  }, [watchCoinType]);

  useEffect(() => {
    if (watchMethod != "swap") return;
    if (watchCoinType == watchCoinTypeOut) return;
    if (loading) return;
    setLoading(true);
    const amountIn = floatToDecimals(watchAmount, watchCoinType);
    preswap(watchCoinType, watchCoinTypeOut, amountIn)
      .then((res) => {
        const amountOut = decimalsToFloat(
          res?.estimatedAmountOut ?? 0,
          watchCoinTypeOut,
        );
        setAmountOut(amountOut);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [watchMethod, watchAmount, watchCoinType, watchCoinTypeOut]);

  return (
    <div className="flex items-center">
      <div className="my-3 p-4 rounded-xl bg-gray-400">
        <div className="flex flex-flow">
          <select
            className="rounded-xl bg-gray-100 p-1 m-1 flex-grow h-8"
            {...register(`blocks.${index}.method`)}
          >
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
            <option value="borrow">Borrow</option>
            <option value="repay">Repay</option>
            <option value="swap">Swap</option>
          </select>
          <div className="flex items-center m-2">
            balance:
            {selectedBalance}
          </div>
        </div>

        <div className="flex items-center">
          <input
            className="rounded-sm bg-gray-100 w-40 h-10 text-2xl p-3 mr-2"
            {...register(`blocks.${index}.amount`)}
            type="number"
            step={calcStepFromCoinType(watchCoinType)}
            min="0"
          />
          <select
            className="text-xl rounded-3xl w-20 h-10 bg-gray-100 text-center"
            {...register(`blocks.${index}.coinType`)}
          >
            {constCoins.map((constCoin) => (
              <option key={constCoin.coinType} value={constCoin.coinType}>
                {constCoin.coinName}
              </option>
            ))}
          </select>
        </div>
        {watchMethod === "swap" && (
          <div>
            <BsFillArrowDownCircleFill
              fontSize="24px"
              className="my-2 ml-16 text-gray-100"
            />
            <div className="flex items-center">
              <input
                className="rounded-sm bg-gray-100 w-40 h-10 text-2xl p-2 mr-1"
                type="text"
                min="0"
                readOnly
                value={loading ? "..." : amountOut}
              />
              <select
                className="text-xl rounded-3xl w-20 h-10 bg-gray-100 text-center"
                {...register(`blocks.${index}.coinTypeOut`)}
              >
                {constCoins
                  .filter((constCoin) => constCoin.coinType != watchCoinType)
                  .map((constCoin) => (
                    <option key={constCoin.coinType} value={constCoin.coinType}>
                      {constCoin.coinName}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        )}
      </div>
      <button
        className="bg-gray-100 text-md ml-5 px-2 py-1 rounded-2xl"
        type="button"
        onClick={() => remove(index)}
      >
        {"－"}
      </button>
    </div>
  );
};
