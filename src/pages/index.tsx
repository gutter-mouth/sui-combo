import { constCoins, decimalsFromType } from "@/utils/const/coin";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { Inter } from "next/font/google";
import { useFieldArray, useForm } from "react-hook-form";

import { TxCoiainer } from "@/components/TxContainer";
import { swap } from "@/utils/cetus";
import {
  borrow,
  deposit,
  repay,
  withdraw,
} from "@/utils/moveCall/naviProtocol";
import { mergeAllCoins } from "@/utils/moveCall/preProcess";
import { ReactSVG } from "react-svg";

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

  const fetchCoinBalances = async (address: string) => {
    const balancesBatch = await Promise.all(
      constCoins.map(async (constCoin) => {
        const coins = await client.getCoins({
          owner: address,
          coinType: constCoin.coinType,
        });
        return coins.data;
      }),
    );
    return balancesBatch.flat();
  };

  const onSubmit = async (data: any) => {
    try {
      if (!account?.address) return;
      let tx = new TransactionBlock();
      let currentCoinBalances = await fetchCoinBalances(account.address);
      mergeAllCoins({ tx, balances: currentCoinBalances });
      for (let i = 0; i < data.blocks.length; i++) {
        const { method, coinType, coinTypeOut, amount } = data.blocks[i];

        const decimals = decimalsFromType(coinType);
        if (!decimals) throw new Error("decimals not found");
        const amountDecimal = Number(amount) * 10 ** decimals;
        if (method === "swap") {
          await swap(
            coinType,
            coinTypeOut,
            amountDecimal,
            currentCoinBalances,
            tx,
          );
        } else if (method === "deposit")
          deposit({
            tx,
            coinType,
            amount: amountDecimal,
            balances: currentCoinBalances,
          });
        else if (method === "repay")
          repay({
            tx,
            coinType,
            amount: amountDecimal,
            balances: currentCoinBalances,
          });
        else if (method === "borrow")
          borrow({ tx, coinType, amount: amountDecimal });
        else if (method === "withdraw")
          withdraw({
            tx,
            coinType,
            amount: amountDecimal,
            recipient: account.address,
          });
        else throw new Error("method not found");

        if (
          method == "withdraw" ||
          method == "borrow" ||
          method == "swap" ||
          i == data.blocks.length - 1
        ) {
          await signAndExecuteTransactionBlock({
            transactionBlock: tx,
          });
          if (i < data.blocks.length - 1) {
            tx = new TransactionBlock();
            currentCoinBalances = await fetchCoinBalances(account.address);
            mergeAllCoins({ tx, balances: currentCoinBalances });
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const TxContainers = () => {
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
      <div className="flex justify-end py-12 pr-12">
        <ConnectButton>Connect Buton</ConnectButton>
      </div>
      <div className={"flex justify-center"}>
        <ReactSVG src="uzushio.svg" className="w-36 mb-8 fill-gray-900" />
      </div>
      <div className="flex flex-col items-center">
        <TxContainers />
      </div>
    </main>
  );
};

export default Page;
