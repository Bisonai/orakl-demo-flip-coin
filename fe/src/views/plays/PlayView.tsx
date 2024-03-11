import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  ImageProps,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import { FlipButton, SuccessModal } from "../../components";
import InputAmountModal from "../../components/InputAmountModal";
import WaitingModal from "../../components/WaitingModal";
import { CHOOSE_BEST } from "../../configs/constants";
import { FLIP_TYPE } from "../../contracts/types";
import {
  flipCoinAction,
  generateContract,
} from "../../reduxs/accounts/account.actions";
import { useAppDispatch, useAppSelector } from "../../reduxs/hooks";
import { getToast, numberFormat } from "../../utils";
import FlippedList from "./FlippedList";

const ImageMotion = motion<ImageProps>(Image);

export default function PlayView() {
  const dispatch = useAppDispatch();
  const { walletInfo, flip, web3Provider } = useAppSelector(
    (state) => state.account
  );
  const [headTail, setHeadTail] = React.useState<FLIP_TYPE | undefined>();
  const [chooseBet, setChooseBet] = React.useState<number | undefined>();
  const [isOpenModal, setIsOpenModal] = React.useState<boolean>(false);

  const [isInputModal, setInputModal] = React.useState<boolean>(false);

  const [txHash, setTxHash] = React.useState<string>();
  const [isCongratulation, setCongratulation] = React.useState<boolean>(true);
  const toast = useToast();

  const reset = () => {
    setHeadTail(undefined);
    setChooseBet(undefined);
  };

  const handleFlipNow = async () => {
    if (headTail === undefined || chooseBet === undefined || !web3Provider)
      return;
    try {
      const rs = await dispatch(
        flipCoinAction({ type: headTail, amount: chooseBet })
      ).unwrap();
      setCongratulation(rs.result === headTail);
      setTxHash(rs.txHash);
      setIsOpenModal(true);
      dispatch(generateContract(web3Provider));
      reset();
    } catch (er: any) {
      toast(getToast(er));
    }
  };

  return (
    <>
      <Flex
        flex={1}
        w="100%"
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <VStack w={{ base: "100%", lg: "30%" }}>
          <ImageMotion
            src="/klay.png"
            alt="degen coin flip"
            w="150px"
            cursor="pointer"
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: [0.9, 1],
            }}
            // @ts-ignore no problem in operation, although type error appears.
            transition={{ duration: 1 }}
          />
          <SimpleGrid
            columns={2}
            margin="10px !important"
            spacingX="20px"
            w="full"
            mt="40px !important"
          >
            <FlipButton
              text="HEADS"
              w="full"
              isDisabled={headTail != FLIP_TYPE.HEAD}
              onClick={() => setHeadTail(FLIP_TYPE.HEAD)}
            />
            <FlipButton
              text="TAILS"
              isDisabled={headTail !== FLIP_TYPE.TAIL}
              w="full"
              onClick={() => setHeadTail(FLIP_TYPE.TAIL)}
            />
          </SimpleGrid>
          <HStack my="20px !important" w="full">
            <Divider w={{ base: "28%", lg: "31%" }} />
            <Text variant="with-title" textAlign="center">
              CHOOSE BET {chooseBet ? `(${numberFormat(chooseBet)}KLAY)` : ""}{" "}
            </Text>
            <Divider w={{ base: "28%", lg: "31%" }} colorScheme="red" />
          </HStack>
          <SimpleGrid columns={3} spacingX="20px" spacingY="20px" w="full">
            {CHOOSE_BEST.map((bet, index) => (
              <FlipButton
                text={`${bet} KLAY`}
                isDisabled={chooseBet !== bet}
                key={index}
                index={index}
                fontSize="12px"
                onClick={() => setChooseBet(bet)}
              />
            ))}
            <FlipButton
              text={`#`}
              isDisabled
              fontSize="12px"
              onClick={() => setInputModal(true)}
            />
          </SimpleGrid>
          <FlipButton
            w="full"
            text={!walletInfo.address ? "CONNECT YOUR WALLET" : "FLIP NOW"}
            mt="30px !important"
            isDisabled={
              !walletInfo.address ||
              chooseBet === undefined ||
              headTail === undefined ||
              flip.isLoading
            }
            onClick={handleFlipNow}
            disabled={
              !walletInfo.address ||
              chooseBet === undefined ||
              headTail === undefined ||
              flip.isLoading
            }
            isLoading={flip.isLoading}
          />
        </VStack>
        <FlippedList />
      </Flex>
      <SuccessModal
        isOpen={isOpenModal}
        hash={txHash}
        isSuccess={isCongratulation}
        onClose={() => setIsOpenModal(false)}
      />
      <WaitingModal isOpen={false} onClose={() => {}} />
      <InputAmountModal
        isOpen={isInputModal}
        onClose={() => setInputModal(false)}
        onSet={(v) => {
          setChooseBet(v);
          setInputModal(false);
        }}
      />
    </>
  );
}
