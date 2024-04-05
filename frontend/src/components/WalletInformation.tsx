import {
  Flex,
  HStack,
  Text,
  StackProps,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useMediaQuery,
  Image,
  ButtonProps,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { fonts } from "../configs/constants";
import { disconnectMetaMask } from "../contracts/interfaces/EthersConnect";
import { logoutAction } from "../reduxs/accounts/account.actions";
import { useAppDispatch, useAppSelector } from "../reduxs/hooks";
import { numberFormat, showSortAddress } from "../utils";

export interface IProps extends ButtonProps {}

const WalletInformation = ({ ...props }: IProps) => {
  const dispatch = useAppDispatch();
  const { walletInfo } = useAppSelector((state) => state.account);

  const handleSignOut = async () => {
    try {
      await disconnectMetaMask();
      dispatch(logoutAction());
    } catch (er) {}
  };

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            as={Button}
            variant="outline"
            fontSize="10px"
            fontFamily={fonts.STATE_WIDE}
            _hover={{ color: "#000", bg: "#fedf56" }}
            px="25px !important"
            {...props}
          >
            <HStack w="full">
              <Text>{showSortAddress(walletInfo.address)}</Text>
              <HStack
                borderLeft="1px solid rgba(254,223,86,.6)"
                px="5px"
                ml="5px"
              >
                <Text
                  _hover={{ color: "#000 !important" }}
                  variant="with-title"
                  fontSize="10px"
                >
                  {numberFormat(walletInfo.bnbBalance)}
                </Text>
                <Image src="/klay.png" alt="klay" w="16px" />
              </HStack>
            </HStack>
          </MenuButton>
          <MenuList
            mt="5px"
            border="1px solid rgba(254,223,86,.6)"
            bg="#fedf56"
            w="50px !important"
            position="relative"
          >
            <Box
              w="15px"
              h="15px"
              bg="#fedf56"
              position="absolute"
              transform="rotate(45deg)"
              left="15px"
              top="-9px"
            />
            <MenuItem
              padding="2px 10px"
              fontFamily={fonts.STATE_WIDE}
              fontSize="12px"
              color="#444"
              onClick={handleSignOut}
            >
              Sign out
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default WalletInformation;
