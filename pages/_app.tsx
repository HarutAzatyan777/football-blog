import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.css"; // կամ քո CSS ֆայլը

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
