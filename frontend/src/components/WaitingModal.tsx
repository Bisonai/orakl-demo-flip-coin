import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Flex,
  ModalCloseButton,
  Image,
} from "@chakra-ui/react";
import { fonts } from "../configs/constants";

interface IProps extends Omit<ModalProps, "children"> {}

export default function WaitingModal({ ...props }: IProps) {
  return (
    <Modal closeOnOverlayClick={false} {...props}>
      <ModalOverlay
        blur="2xl"
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent bg="#fad05a">
        <ModalBody
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
          px="-40px"
        >
          <Image src="/waiting.gif" w="250px" my="-30px" />
          <Text
            variant="notoSan"
            fontSize="14px"
            textTransform="uppercase"
            fontFamily={fonts.STATE_WIDE}
            color="#ddab1d"
            fontStyle="italic"
          >
            please wait a moment ...
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
