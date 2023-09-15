import { decimalsFromType, seacrhPool } from '@/utils/const/coin';
import CetusClmmSDK from '@cetusprotocol/cetus-sui-clmm-sdk'
import { clmmMainnet } from "@/utils/const/cetusConfig"


const SDK = new CetusClmmSDK(clmmMainnet)

export const preswap = async (coinType1: string, coinTypeOut: string, amount: number) => {
  const { pool: poolInfo, isAB } = seacrhPool(coinType1, coinTypeOut)
  if (!poolInfo) return
  const pool = await SDK.Pool.getPool(poolInfo.poolAddress)
  const { coinTypeA, coinTypeB } = pool;
  const decimalsA = decimalsFromType(coinTypeA);
  const decimalsB = decimalsFromType(coinTypeB);
  if (!decimalsA || !decimalsB) return
  const res = await SDK.Swap.preswap({
    pool: pool,
    currentSqrtPrice: pool.current_sqrt_price,
    coinTypeA: pool.coinTypeA,
    coinTypeB: pool.coinTypeB,
    decimalsA: decimalsA,
    decimalsB: decimalsB,
    a2b: isAB,
    byAmountIn: true,
    amount: amount.toString()
  })
  return res;
}