import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import App from "next/app";
import { SessionProvider } from "next-auth/react";
import KontentService from "../services/KentikoService";
import { useEffect } from "react";

const  MyApp = ({ Component, pageProps, session }) => {
  useEffect(() => new KontentService().initializeKontentSpotlight("default"));
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  return appProps;
}

export default MyApp;
