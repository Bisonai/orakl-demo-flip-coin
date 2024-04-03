import "../../styles/fonts.css";
import "../../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme";
import MainLayout from "../layouts";
import { Provider } from "react-redux";
import store from "../reduxs/store";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any;

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="keywords" content="Flip, coin, deget" />
        <meta name="author" content="Flip Coin" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
        <MainLayout>
          <AnyComponent {...pageProps} />
        </MainLayout>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
