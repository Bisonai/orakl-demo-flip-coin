import {
  Button,
  Flex,
  Spinner,
  Text,
  useBoolean,
  useToast,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { FlipCoinContract } from "../contracts/FipCoinContract";
import { IPlayerInfo } from "../contracts/types";
import {
  generateContract,
  setActiveMenu,
} from "../reduxs/accounts/account.actions";
import { useAppDispatch, useAppSelector } from "../reduxs/hooks";
import { getToast, numberFormat } from "../utils";

const Rewards: NextPage = () => {
  const dispatch = useAppDispatch();
  const { walletInfo, web3Provider } = useAppSelector((state) => state.account);
  const [info, setInfo] = React.useState<IPlayerInfo>();
  const [isProcess, setProcess] = React.useState<boolean>();
  const router = useRouter();
  const toast = useToast();

  const getPlayerInfo = React.useCallback(async () => {
    if (!walletInfo || !walletInfo.address || !web3Provider) return;
    const contract = new FlipCoinContract(web3Provider);
    const rs = await contract.playerInfors(walletInfo.address);
    setInfo(rs);
  }, [walletInfo, web3Provider]);

  React.useEffect(() => {
    getPlayerInfo();
  }, [getPlayerInfo]);

  React.useEffect(() => {
    if (router.pathname) {
      dispatch(setActiveMenu(router.pathname.toUpperCase().replace("/", "")));
    }
  }, [router.pathname]);

  const handleClaim = React.useCallback(async () => {
    try {
      if (!web3Provider) return;
      setProcess(true);
      const contract = new FlipCoinContract(web3Provider);
      await contract.claim();
      toast(getToast(`Claim success.`, "success", "CLAIM"));
      dispatch(generateContract(web3Provider));
      setInfo(undefined);
    } catch (er) {
      toast(getToast("something error!"));
    }
    setProcess(false);
  }, [web3Provider]);

  return (
    <>
      <Head>
        <title>Rewards - FlipCoin</title>
      </Head>

      <Flex flex={1} direction="column" alignItems="center">
        <Flex mb="20px">
          <Text variant="with-title" textAlign="center" lineHeight="30px">
            You have{" "}
            <span style={{ color: "#fedf56" }}>
              {numberFormat(info?.balance || 0)} KLAY
            </span>{" "}
            in winnings in fee rewards.
          </Text>
        </Flex>
        <Button
          variant="primary"
          w={{ base: "100%", lg: "30%" }}
          isDisabled={
            !walletInfo.address ||
            !web3Provider ||
            isProcess ||
            info?.balance === 0
          }
          disabled={
            !walletInfo.address ||
            !web3Provider ||
            isProcess ||
            info?.balance === 0
          }
          onClick={handleClaim}
        >
          {isProcess ? (
            <Spinner />
          ) : (
            `CLAIM ${numberFormat(info?.balance || 0)} REWARDS`
          )}
        </Button>
      </Flex>
    </>
  );
};

export default Rewards;
