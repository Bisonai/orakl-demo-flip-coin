import type { NextPage } from "next";
import Head from "next/head";
import PlayView from "../views/plays/PlayView";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Play - FlipCoin</title>
      </Head>
      <PlayView />
    </>
  );
};

export default Home;
