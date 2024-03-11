import {
  Button,
  ButtonProps,
  HStack,
  Menu,
  MenuButton,
  Text,
  Image,
  MenuList,
  Box,
  MenuItem,
  Flex,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { fonts, menus } from "../configs/constants";


export interface IProps extends ButtonProps {}
export default function Mobile({ ...props }: IProps) {
  return (
    <Flex display={{base: 'block', lg: 'none'}}>
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton isActive={isOpen} as={Text} {...props}>
            <HStack w="full">
              <Text
                variant="with-title"
                fontSize={{ base: "12px", lg: "25px" }}
                fontWeight="bold"
                ml="10px"
                color="#f6e6b7"
              >
                FLIP COIN
              </Text>
              <Image src="/down.svg" color="white" w="30px" />
            </HStack>
          </MenuButton>
          <MenuList position="relative" w="30%">
            {menus.map((menu) => (
              <MenuItem
                key={menu.name}
                padding="10px -10px"
                fontFamily={fonts.STATE_WIDE}
                fontSize="10px"
                my="5px"
              >
                <Link href={menu.url}>
                  <a>{menu.name}</a>
                </Link>
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
    </Flex>
  );
}
