import "@/styles/globals.css";
import "@suiet/wallet-kit/style.css";

import { WalletProvider } from "@suiet/wallet-kit";
import type { AppProps } from "next/app";
// eslint-disable-next-line no-restricted-imports
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
