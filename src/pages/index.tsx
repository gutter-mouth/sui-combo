import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  ConnectButton
} from '@suiet/wallet-kit';

const inter = Inter({ subsets: ['latin'] })

const Page = () => {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ConnectButton>Connect Buton</ConnectButton>
      <div>

      </div>
    </main>
  )
}

export default Page;