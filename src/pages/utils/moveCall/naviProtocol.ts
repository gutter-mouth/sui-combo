import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from "@mysten/sui.js/transactions";


export const depositSUI = (tx: TransactionBlock, amount: number) => {
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)])
  tx.moveCall({
    target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::deposit",
    arguments: [
      tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
      tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
      tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
      tx.pure(0),
      coin,
      tx.pure(amount),
      tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821")
    ],
    typeArguments: ["0x2::sui::SUI"]
  });
}

export const borrowSUI = (tx: TransactionBlock, amount: number) => {
  tx.moveCall({
    target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::borrow",
    arguments: [
      tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
      tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
      tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
      tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
      tx.pure(0),
      tx.pure(amount)
    ],
    typeArguments: ["0x2::sui::SUI"]
  });
}
