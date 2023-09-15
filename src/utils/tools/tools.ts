import { decimalsFromType } from '@/utils/const/coin';

export const floatToDecimals = (amount: number, coinType: string) => {
  const decimals = decimalsFromType(coinType);
  if (!decimals) return 0;
  return amount * 10 ** decimals
}
export const decimalsToFloat = (amount: number, coinType: string) => {
  const decimals = decimalsFromType(coinType);
  if (!decimals) return 0;
  return amount / 10 ** decimals
}

export const calcStepFromCoinType = (coinType: string) => {
  const decimals = decimalsFromType(coinType) ?? 9;
  return "0." + "0".repeat(decimals - 1) + "1";
}