import { clmmMainnet } from "@/utils/const/cetusConfig";
import { decimalsFromType, seacrhPool } from "@/utils/const/coin";
import CetusClmmSDK, {
  CoinAsset,
  Percentage,
  SwapParams,
  TransactionUtil,
  adjustForSlippage,
} from "@cetusprotocol/cetus-sui-clmm-sdk";
import type { CoinStruct } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import BN from "bn.js";
import Decimal from "decimal.js";
const SDK = new CetusClmmSDK(clmmMainnet);

export const preswap = async (
  coinType1: string,
  coinTypeOut: string,
  amount: number,
) => {
  const { pool: poolInfo, isAB } = seacrhPool(coinType1, coinTypeOut);
  if (!poolInfo) return;
  const pool = await SDK.Pool.getPool(poolInfo.poolAddress);
  const { coinTypeA, coinTypeB } = pool;
  const decimalsA = decimalsFromType(coinTypeA);
  const decimalsB = decimalsFromType(coinTypeB);
  if (!decimalsA || !decimalsB) return;
  const res = await SDK.Swap.preswap({
    pool: pool,
    currentSqrtPrice: pool.current_sqrt_price,
    coinTypeA: pool.coinTypeA,
    coinTypeB: pool.coinTypeB,
    decimalsA: decimalsA,
    decimalsB: decimalsB,
    a2b: isAB,
    byAmountIn: true,
    amount: amount.toString(),
  });
  return res;
};

export const swap = async (
  coinType1: string,
  coinTypeOut: string,
  amount: number,
  balance: CoinStruct[],
  tx: TransactionBlock,
) => {
  const res = await preswap(coinType1, coinTypeOut, amount);
  const toAmount = res?.byAmountIn
    ? res.estimatedAmountOut
    : res?.estimatedAmountIn;
  const bigToAmount = new BN(toAmount);
  const slippage = Percentage.fromDecimal(new Decimal(0.5));
  const amountLimit = adjustForSlippage(
    bigToAmount,
    slippage,
    !res?.byAmountIn,
  );
  const pool = await SDK.Pool.getPool(res?.poolAddress!);

  // tune
  const params: SwapParams = {
    coinTypeA: pool.coinTypeA,
    coinTypeB: pool.coinTypeB,
    pool_id: res?.poolAddress!,
    a2b: res?.aToB!,
    by_amount_in: res?.byAmountIn!,
    amount: res?.amount!,
    amount_limit: amountLimit.toString(),
  };

  const allCoinAsset: CoinAsset[] = balance.map((balance) => {
    return {
      coinAddress: balance.coinType,
      coinObjectId: balance.coinObjectId,
      balance: BigInt(balance.balance),
    };
  });
  const primaryCoinInputA = TransactionUtil.buildCoinInputForAmount(
    tx as any,
    allCoinAsset,
    params.a2b
      ? BigInt(params.by_amount_in ? params.amount : params.amount_limit)
      : BigInt(0),
    params.coinTypeA,
    false,
  );

  const primaryCoinInputB = TransactionUtil.buildCoinInputForAmount(
    tx as any,
    allCoinAsset,
    params.a2b
      ? BigInt(0)
      : BigInt(params.by_amount_in ? params.amount : params.amount_limit),
    params.coinTypeB,
    false,
  );

  TransactionUtil.buildSwapTransactionArgs(
    tx as any,
    params,
    SDK.sdkOptions,
    primaryCoinInputA,
    primaryCoinInputB,
  );
};
