import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  ConnectButton
} from '@suiet/wallet-kit';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from "react"
import { depositSUI } from './utils/moveCall';

const inter = Inter({ subsets: ['latin'] })

const blockDefaultValue = {
  method: "Deposit",
  token: "SUI",
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

  const onSubmit = (data: any) => {
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
                  <option>Deposit</option>
                  <option>Withdraw</option>
                  <option>Borrow</option>
                  <option>Repay</option>
                </select>
              </div>
              <div>
                <label>Token</label>
                <select
                  {...register(`blocks.${index}.token`)}
                >
                  <option>SUI</option>
                  <option>USDT</option>
                  <option>USDC</option>
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
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ConnectButton>Connect Buton</ConnectButton>
      <TxBlocks />
      <div>
      </div>
    </main >
  )
}

export default Page;