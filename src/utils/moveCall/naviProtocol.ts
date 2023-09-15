import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { coinTypeFromName } from '../const/coin';

import type { CoinStruct } from '@mysten/sui.js/client';
export type NaviProps = {
  tx: TransactionBlock;
  coinType: string;
  amount: number;
  balances?: CoinStruct[];
  recipient?: string;
}


export const deposit = ({ tx, coinType, balances, amount }: NaviProps) => {
  const coinObjectIds = balances?.filter((balance) => balance.coinType === coinType).map((balance) => balance.coinObjectId);
  if (!coinObjectIds || coinObjectIds.length === 0) throw new Error("No balances");
  const coinObject = coinType === coinTypeFromName("SUI") ? tx.splitCoins(tx.gas, [tx.pure(amount)])[0] : tx.object(coinObjectIds[0]) //後でmerge処理を追加する
  console.log(coinObject)
  if (coinType === coinTypeFromName("SUI"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::deposit",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
        tx.pure(0),
        coinObject,
        tx.pure(amount),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821")
      ],
      typeArguments: [coinType]
    });
  if (coinType === coinTypeFromName("USDC"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::deposit",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8"),
        tx.pure(1),
        coinObject,
        tx.pure(amount),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821")
      ],
      typeArguments: [coinType]
    });
  if (coinType === coinTypeFromName("USDT"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::deposit",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x0e060c3b5b8de00fb50511b7a45188c8e34b6995c01f69d98ea5a466fe10d103"),
        tx.pure(2),
        coinObject,
        tx.pure(amount),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821")
      ],
      typeArguments: [coinType]
    });
  throw new Error("Invalid coinType");
}

export const borrow = ({ tx, coinType, amount }: NaviProps) => {
  if (coinType === coinTypeFromName("SUI"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::borrow",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
        tx.pure(0),
        tx.pure(amount)
      ],
      typeArguments: [coinType]
    });

  if (coinType === coinTypeFromName("USDC"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::borrow",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8"),
        tx.pure(1),
        tx.pure(amount)
      ],
      typeArguments: [coinType]
    });
  if (coinType === coinTypeFromName("USDT"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::borrow",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x0e060c3b5b8de00fb50511b7a45188c8e34b6995c01f69d98ea5a466fe10d103"),
        tx.pure(2),
        tx.pure(amount)
      ],
      typeArguments: [coinType]
    });
  throw new Error("Invalid coinType");
}

export const withdraw = ({ tx, coinType, amount, recipient }: NaviProps) => {
  if (!recipient) throw new Error("No recipient");
  if (coinType === coinTypeFromName("SUI"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::withdraw",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
        tx.pure(0),
        tx.pure(amount),
        tx.object(recipient),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"),
      ],
      typeArguments: [coinType]
    });
  if (coinType === coinTypeFromName("USDC"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::withdraw",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0xa02a98f9c88db51c6f5efaaf2261c81f34dd56d86073387e0ef1805ca22e39c8"),
        tx.pure(1),
        tx.pure(amount),
        tx.object(recipient),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"),
      ],
      typeArguments: [coinType]
    });
  if (coinType === coinTypeFromName("USDT"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::withdraw",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x0e060c3b5b8de00fb50511b7a45188c8e34b6995c01f69d98ea5a466fe10d103"),
        tx.pure(2),
        tx.pure(amount),
        tx.object(recipient),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"),
      ],
      typeArguments: [coinType]
    });
  throw new Error("Invalid coinType");
}

