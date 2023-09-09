export const constCoins = [
  { coinName: "SUI", coinType: "0x2::sui::SUI" },
  { coinName: "USDC", coinType: "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN" },
  { coinName: "USDT", coinType: "0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN" },
]

export const constCoinNames = constCoins.map(({ coinName }) => coinName)
export const constCoinTypes = constCoins.map(({ coinType }) => coinType)

export const coinTypeFromName = (coinName: typeof constCoinNames[number]) => {
  const coin = constCoins.find(({ coinName: name }) => name === coinName);
  return coin?.coinType;
}

