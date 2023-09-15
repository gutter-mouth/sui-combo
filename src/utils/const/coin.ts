export const constCoins = [
  { coinName: "SUI", coinType: "0x2::sui::SUI", decimals: 9 },
  { coinName: "USDC", coinType: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN", decimals: 6 },
  { coinName: "USDT", coinType: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN", decimals: 6 },
]

export const constPool = [
  { poolAddress: "0xcf994611fd4c48e277ce3ffd4d4364c914af2c3cbb05f7bf6facd371de688630", coinTypeA: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN", coinTypeB: "0x2::sui::SUI" }, // USDC-SUI pool
  { poolAddress: "0x06d8af9e6afd27262db436f0d37b304a041f710c3ea1fa4c3a9bab36b3569ad3", coinTypeA: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN", coinTypeB: "0x2::sui::SUI" }, // USDT-SUI pool
  { poolAddress: "0xc8d7a1503dc2f9f5b05449a87d8733593e2f0f3e7bffd90541252782e4d2ca20", coinTypeA: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN", coinTypeB: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN" }, // USDT-USDC pool
]

export type ConstCoin = typeof constCoins[number]
export type ConstPool = typeof constPool[number]


export const constCoinNames = constCoins.map(({ coinName }) => coinName)
export const constCoinTypes = constCoins.map(({ coinType }) => coinType)
export const constCoinDecimals = constCoins.map(({ decimals }) => decimals)

export const coinTypeFromName = (coinName: typeof constCoinNames[number]) => {
  const coin = constCoins.find(({ coinName: name }) => name === coinName);
  return coin?.coinType;
}

export const decimalsFromType = (coinType: typeof constCoinTypes[number]) => {
  const coin = constCoins.find(({ coinType: type }) => type === coinType);
  return coin?.decimals;
}

export const seacrhPool = (coinTypeA: typeof constCoinTypes[number], coinTypeB: typeof constCoinTypes[number]) => {
  const poolAB = constPool.find(({ coinTypeA: typeA, coinTypeB: typeB }) => typeA === coinTypeA && typeB === coinTypeB);
  if (poolAB) return { pool: poolAB, isAB: true };
  const poolBA = constPool.find(({ coinTypeA: typeA, coinTypeB: typeB }) => typeB === coinTypeA && typeA === coinTypeB);
  if (poolBA) return { pool: poolBA, isAB: false };
  return { pool: undefined, isAB: undefined };
}