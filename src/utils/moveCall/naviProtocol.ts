import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { coinTypeFromName } from '../const';

import type { CoinStruct } from '@mysten/sui.js/client';
export type NaviProps = {
  tx: TransactionBlock;
  balances?: CoinStruct[];
  coinType: string;
  amount: number;
}


export const deposit = ({ tx, coinType, balances, amount }: NaviProps) => {
  const coinObjectIds = balances?.filter((balance) => balance.coinType === coinType).map((balance) => balance.coinObjectId);
  if (!coinObjectIds || coinObjectIds.length === 0) throw new Error("No balances");
  const coinObject = coinType === coinTypeFromName("SUI") ? tx.splitCoins(tx.gas, [tx.pure(amount)])[0] : tx.object(coinObjectIds[0]) //後でmerge処理を追加する
  console.log(coinType === coinTypeFromName("SUI"))
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
      typeArguments: ["0x2::sui::SUI"]
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
      typeArguments: ["0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"]
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
      typeArguments: ["0x2::sui::SUI"]
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
      typeArguments: ["0x2::sui::SUI"]
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
      typeArguments: ["0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"]
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
      typeArguments: ["0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN"]
    });
  throw new Error("Invalid coinType");
}

export const withdraw = ({ tx, coinType, amount }: NaviProps) => {
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
        tx.object("0x1c1ff23813baa1655035c2b8fc814597813de1f4580f8fb06e96782cc265a22f"),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"),
      ],
      typeArguments: ["0x2::sui::SUI"]
    });
  if (coinType === coinTypeFromName("USDC"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::withdraw",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
        tx.pure(1),
        tx.pure(amount),
        tx.object("0x1c1ff23813baa1655035c2b8fc814597813de1f4580f8fb06e96782cc265a22f"),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"),
      ],
      typeArguments: ["0x2::sui::SUI"]
    });
  if (coinType === coinTypeFromName("USDT"))
    return tx.moveCall({
      target: "0xd92bc457b42d48924087ea3f22d35fd2fe9afdf5bdfe38cc51c0f14f3282f6d5::lending::withdraw",
      arguments: [
        tx.object("0x0000000000000000000000000000000000000000000000000000000000000006"),
        tx.object("0x1568865ed9a0b5ec414220e8f79b3d04c77acc82358f6e5ae4635687392ffbef"),
        tx.object("0xbb4e2f4b6205c2e2a2db47aeb4f830796ec7c005f88537ee775986639bc442fe"),
        tx.object("0x96df0fce3c471489f4debaaa762cf960b3d97820bd1f3f025ff8190730e958c5"),
        tx.pure(2),
        tx.pure(amount),
        tx.object("0x1c1ff23813baa1655035c2b8fc814597813de1f4580f8fb06e96782cc265a22f"),
        tx.object("0xaaf735bf83ff564e1b219a0d644de894ef5bdc4b2250b126b2a46dd002331821"),
      ],
      typeArguments: ["0x2::sui::SUI"]
    });
  throw new Error("Invalid coinType");
}

