import {
  Flex,
  Image,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  Text,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { ConnectWallet, WalletInformation } from "../components";
import { fonts, menus } from "../configs/constants";
import { useWindowSize } from "../hooks/useWindowSize";
import { useAppSelector } from "../reduxs/hooks";

const MobileMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  const { walletInfo } = useAppSelector((state) => state.account);

  const btnRef = React.useRef(null);

  React.useEffect(() => {
    if (isLargerThan1280) {
      onClose();
    }
  }, [isLargerThan1280, onClose]);

  return (
    <Flex display={{ base: "flex", lg: "none" }}>
      <Image
        src="/menu.png"
        alt="mobile menu"
        cursor="pointer"
        ref={btnRef}
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg="bg.tertiary">
          <DrawerCloseButton />
          <DrawerBody pt="20px">
            {menus.map((m) => (
              <Flex key={m.name}>
                <Link href={`${m.url}`}>
                  <a>
                    <Text py="10px" variant="with-title" fontSize="12px">
                      {m.name}
                    </Text>
                  </a>
                </Link>
              </Flex>
            ))}
            {!walletInfo.address && <ConnectWallet />}
            {walletInfo.address && (
              <WalletInformation display={{ base: "flex", lg: "none" }} />
            )}

            <Button mt="10px"
              variant="outline"
              fontSize="10px"
              fontFamily={fonts.STATE_WIDE}
              _hover={{ color: "#000", bg: "#fedf56" }}
              px="20px !important"
              w="70%"
            >
              Disconnect
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default MobileMenu;
