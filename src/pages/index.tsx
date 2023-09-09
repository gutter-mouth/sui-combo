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

  const onSubmit = async (data: any) => {
    try {
      if (!account?.address) return;
      const tx = new TransactionBlock();
      for (const prop of data.blocks) {
        const { method, coinType, amount } = prop;
        moveCall({ tx, method, coinType, amount, balances: coinBalances, recipient: account.address })
      }
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
      <div className='w-96 rounded-xl bg-gray-700' >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col items-center py-5' >
            {fields.map((field, index) => (
              <div key={field.id} className='flex items-center'>
                <div key={field.id} className='my-3 p-4 rounded-xl bg-gray-400'>
                  <div>
                    <select className='rounded-xl bg-gray-100'
                      {...register(`blocks.${index}.method`)}
                    >
                      <option value="deposit">Deposit</option>
                      <option value="withdraw">Withdraw</option>
                      <option value="borrow">Borrow</option>
                    </select>
                  </div>
                  <div className='flex items-center'>
                    <input className='rounded-sm bg-gray-100 w-40 h-10 text-3xl p-2 mr-1' {...register(`blocks.${index}.amount`)} type="number" />
                    <select className='text-xl rounded-3xl w-20 h-10 bg-gray-100 text-center'
                      {...register(`blocks.${index}.coinType`)}
                    >
                      {constCoins.map((constCoin) =>
                        <option key={constCoin.coinType} value={constCoin.coinType}>{constCoin.coinName}</option>
                      )}
                    </select>
                  </div>
                </div>
                <button className='bg-gray-100 text-md ml-5 px-2 py-1 rounded-2xl' type="button" onClick={() => remove(index)}>
                  {"－"}
                </button>
              </div>
            ))}

            <button className='bg-gray-100 text-md my-3 px-2 py-1 rounded-3xl' type="button" onClick={() => append(blockDefaultValue)}>
              {"＋"}
            </button>
            <button type="submit" className='bg-gray-100 text-xl py-1 px-3 rounded-2xl mt-2'>Send TX</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <main
      className={`min-h-screen ${inter.className}  bg-gray-900`}
    >
      <div className='flex justify-end py-12 pr-12 mb-12'>
        <ConnectButton>Connect Buton</ConnectButton>
      </div>
      <div className='flex flex-col items-center'>
        <TxBlocks />
      </div>
    </main >
  )
}

export default Page;