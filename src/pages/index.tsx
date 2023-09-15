import { constCoins, decimalsFromType } from "@/utils/const/coin";
import type { CoinStruct } from "@mysten/sui.js/client";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { moveCall } from "../utils/moveCall";

import { TxCoiainer } from "@/components/TxContainer";
const inter = Inter({ subsets: ["latin"] });

const blockDefaultValue = {
  method: "deposit",
  coinType: "0x2::sui::SUI",
  coinTypeOut:
    "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
  amount: 0,
};

const client = new SuiClient({ url: getFullnodeUrl("mainnet") });
const Page = () => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      blocks: [blockDefaultValue],
    },
  });
  const { fields, append, remove } = useFieldArray({ name: "blocks", control });
  const { account, signAndExecuteTransactionBlock } = useWallet();

  const [coinBalances, setCoinBalances] = useState<CoinStruct[]>([]);

  useEffect(() => {
    if (!account?.address) return;
    constCoins.forEach(async (constCoin) => {
      const coins = await client.getCoins({
        owner: account.address,
        coinType: constCoin.coinType,
      });
      setCoinBalances((prev) => [...prev, ...coins.data]);
    });
  }, [account?.address]);

  const onSubmit = async (data: any) => {
    try {
      if (!account?.address) return;
      const tx = new TransactionBlock();
      for (const prop of data.blocks) {
        const { method, coinType, amount } = prop;
        const decimals = decimalsFromType(coinType);
        if (!decimals) throw new Error("decimals not found");
        moveCall({
          tx,
          method,
          coinType,
          amount: amount * 10 ** decimals,
          balances: coinBalances,
          recipient: account.address,
        });
      }
      await signAndExecuteTransactionBlock({
        transactionBlock: tx,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const TxBlocks = () => {
    return (
      <div className="w-96 rounded-xl bg-gray-700">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center py-5">
            {fields.map((field, index) => (
              <TxCoiainer
                key={field.id}
                index={index}
                control={control}
                register={register}
                remove={remove}
              />
            ))}
            <button
              className="bg-gray-100 text-md my-3 px-2 py-1 rounded-3xl"
              type="button"
              onClick={() => append(blockDefaultValue)}
            >
              {"＋"}
            </button>
            <button
              type="submit"
              className="bg-gray-100 text-xl py-1 px-3 rounded-2xl mt-2"
            >
              Send TX
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <main className={`min-h-screen ${inter.className}  bg-gray-900`}>
      <div className="flex justify-end py-12 pr-12 mb-12">
        <ConnectButton>Connect Buton</ConnectButton>
      </div>
      <div className="flex flex-col items-center">
        <TxBlocks />
      </div>
    </main>
  );
};

export default Page;
