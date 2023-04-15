import { AppProps } from 'next/app';
import React from 'react';

import '@/styles/globals.css';
import '@/styles/colors.css';

import WalletContextProvider from '../contexts/WalletContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WalletContextProvider>
        {/* <header className="relative inset-x-0 top-0 z-50 border-2 border-pink-500">
          <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <WalletMultiButton className='!bg-[#9e80ff] hover:!bg-[#b29cfb] transition-all duration-200 !rounded-lg' />
          </nav>
        </header> */}
        <Component {...pageProps} />;
      </WalletContextProvider>
    </>
  );
}

export default MyApp;
