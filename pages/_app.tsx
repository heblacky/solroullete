import type { AppProps } from "next/app";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import "../styles/globals.css";
import WalletContextProvider from "../components/wallet-provider";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextThemeProvider attribute="class">
      <Head>
        {/* Root directory favicon references */}
        <link rel="icon" href="/lgsol.png?v=123456789" type="image/png" />
        <link rel="shortcut icon" href="/lgsol.png?v=123456789" type="image/png" />
        <link rel="apple-touch-icon" href="/lgsol.png?v=123456789" type="image/png" />
        
        {/* Images directory favicon references */}
        <link rel="icon" href="/images/lgsol.png?v=123456789" type="image/png" />
        <link rel="shortcut icon" href="/images/lgsol.png?v=123456789" type="image/png" />
        <link rel="apple-touch-icon" href="/images/lgsol.png?v=123456789" type="image/png" />
        
        <meta name="msapplication-TileImage" content="/lgsol.png?v=123456789" />
        <script src="/cache-buster.js" type="text/javascript"></script>
      </Head>
      <WalletContextProvider>
        <Component {...pageProps} />
      </WalletContextProvider>
    </NextThemeProvider>
  );
}
