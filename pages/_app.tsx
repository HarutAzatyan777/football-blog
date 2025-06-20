import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
}
