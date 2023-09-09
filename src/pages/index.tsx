import { Inter } from 'next/font/google'
import {
  ConnectButton
} from '@suiet/wallet-kit';
import { useForm, useFieldArray } from 'react-hook-form';
import { moveCall } from '../utils/moveCall';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useWallet } from '@suiet/wallet-kit';

import { useState, useEffect } from 'react';
import { constCoins } from '@/utils/const';

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import type { CoinStruct } from '@mysten/sui.js/client';
const inter = Inter({ subsets: ['latin'] })


const blockDefaultValue = {
  method: "deposit",
  coinType: "0x2::sui::SUI",
  amount: 0
}

const Page = () => {

  const { register, handleSubmit, control } = useForm(
    {
      defaultValues: {
        blocks: [blockDefaultValue],
      }
    });
  const { fields, append, remove } = useFieldArray({
    name: 'blocks',
    control,
  });

  const {
    account, signAndExecuteTransactionBlock
  } = useWallet();

  const [coinBalances, setCoinBalances] = useState<CoinStruct[]>([]);

  useEffect(() => {
    const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
    if (!account?.address) return;
    constCoins.forEach(async (constCoin) => {
      const coins = await client.getCoins({
        owner: account.address,
        coinType: constCoin.coinType
      })
      setCoinBalances((prev) => [...prev, ...coins.data])
    })
  }, [account?.address])

  // console.log(coinBalances)


  const onSubmit = async (data: any) => {
    if (!account?.address) return;
    const tx = new TransactionBlock();
    for (const prop of data.blocks) {
      const { method, coinType, amount } = prop;
      console.log({ tx, method, balances: coinBalances, coinType, amount, recipient: account.address })
      moveCall({ tx, method, coinType, amount, balances: coinBalances, recipient: account.address })
    }
    try {
      await signAndExecuteTransactionBlock({
        transactionBlock: tx
      });
    } catch (e) {
      console.error(e)
    }
    console.log(data)
  }

  const TxBlocks = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {fields.map((field, index) => (
            <div key={field.id} className='my-5'>
              <div>
                <label>Method</label>
                <select
                  {...register(`blocks.${index}.method`)}
                >
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="borrow">Borrow</option>
                </select>
              </div>
              <div>
                <label>Token</label>
                <select
                  {...register(`blocks.${index}.coinType`)}
                >
                  {constCoins.map((constCoin) =>
                    <option key={constCoin.coinType} value={constCoin.coinType}>{constCoin.coinName}</option>
                  )}
                </select>
              </div>
              <div>
                <label>Amount</label>
                <input {...register(`blocks.${index}.amount`)} type="number" />
              </div>
            </div>
          ))}
        </div >
        <div>
          <button type="button" onClick={() => append(blockDefaultValue)} className="mr-6 my-2">
            Add
          </button>
          <button type="button" onClick={() => remove(fields.length - 1)}>
            Remove
          </button>
        </div>
        <div>
          <button type="submit">Send TX</button>
        </div>
      </form>
    )
  }

  return (
    <main
      className={`min-h-screen ${inter.className}`}
    >
      <ConnectButton>Connect Buton</ConnectButton>
      <TxBlocks />
      <div>
      </div>
    </main >
  )
}




export default Page;