import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider,WalletMultiButton,WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
// import {
//     GlowWalletAdapter,
//     PhantomWalletAdapter,
//     SlopeWalletAdapter,
//     SolflareWalletAdapter,
//     TorusWalletAdapter,
// } from '@solana/wallet-adapter-wallets';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { clusterApiUrl } from '@solana/web3.js';
import { AppProps } from 'next/app';
import { FC, useMemo } from 'react';
import { ThemeProvider } from "next-themes";
import Head from 'next/head';
import { SessionProvider } from "next-auth/react";
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
// Use require instead of import since order matters
import '@solana/wallet-adapter-react-ui/styles.css';
require('../styles/globals.css');

const App = ({ Component, pageProps }) => {

 // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            // new GlowWalletAdapter(),
            // new SlopeWalletAdapter(),
            // new SolflareWalletAdapter({ network }),
            // new TorusWalletAdapter(),
        ],
        [network]
    );


    return (
        <>
         <Head>
        <title>AURA</title>
         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/Aura_purple.png" /> {/* Replace with your logo file name and extension */}
      </Head>
      <SessionProvider session={pageProps.session}>
         
                    <ConnectionProvider endpoint={endpoint}>
                        <WalletProvider wallets={wallets} autoConnect>
                            <WalletModalProvider>
                                <ThemeProvider attribute="class">
                                    <div className="min-h-screen bg-purple-700">
                                        <Component {...pageProps} />
                                    </div>
                                </ThemeProvider>
                            </WalletModalProvider>
                        </WalletProvider>
                    </ConnectionProvider>
               
      </SessionProvider>
       
        </>
       
    );
};

export default App;
