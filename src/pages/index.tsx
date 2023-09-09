import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  ConnectButton
} from '@suiet/wallet-kit';
import { useForm, useFieldArray } from 'react-hook-form';
import { moveCall } from '../utils/moveCall';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useWallet } from '@suiet/wallet-kit';


const inter = Inter({ subsets: ['latin'] })

const blockDefaultValue = {
  method: "deposit",
  token: "SUI",
  amount: 0
}

const Page = () => {
  const {
    signAndExecuteTransactionBlock
  } = useWallet();
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

  const onSubmit = async (data: any) => {
    const tx = new TransactionBlock();
    for (const prop of data.blocks) {
      const { method, token, amount } = prop;

      console.log({ tx, method, token, amount })
      moveCall({ tx, method, token, amount })
    }
    try {
      await signAndExecuteTransactionBlock({ transactionBlock: tx });
    } catch (e) {
      console.error(e)
    }
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
                  {/* <option value="withdraw">Withdraw</option> */}
                  <option value="borrow">Borrow</option>
                  {/* <option value="repay">Repay</option> */}
                </select>
              </div>
              <div>
                <label>Token</label>
                <select
                  {...register(`blocks.${index}.token`)}
                >
                  <option>SUI</option>
                  {/* <option>USDT</option>
                  <option>USDC</option> */}
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