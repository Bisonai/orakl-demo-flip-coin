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
import { getExplorerUrl, showSortAddress, showTransactionHash } from "../utils";

interface IProps extends Omit<ModalProps, "children"> {
  isSuccess?: boolean;
  hash?: string;
}

export default function SuccessModal({
  hash,
  isSuccess = true,
  ...props
}: IProps) {
  const onNavigation = () => {
    if (window) {
      window.open(`${getExplorerUrl()}${hash}`, "_blank");
    }
  };

  const bgColor = isSuccess ? "#d8ae06" : "#806b17";
  const img = isSuccess ? "/congratulation.png" : "/sad.png";
  const sTitle = isSuccess ? "congratulation" : "oh!";
  const description = isSuccess
    ? "you have been doubled"
    : "maybe your luck next time";

  return (
    <Modal closeOnOverlayClick={false} {...props}>
      <ModalOverlay
        blur="2xl"
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent py="30px" bg={bgColor}>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            alignItems="center"
            justifyContent="center"
            w="full"
            direction="column"
          >
            <Image src={img} w="150px" mb="20px" />

            <Text
              variant="notoSan"
              fontFamily={fonts.STATE_WIDE}
              fontSize="20px"
              textTransform="uppercase"
            >
              {sTitle}
            </Text>

            <Text
              variant="notoSan"
              fontFamily={fonts.STATE_WIDE}
              fontSize="12px"
              mt="10px"
              textTransform="uppercase"
            >
              {description}
            </Text>

            <Button w="full" variant="primary" mt="20px" onClick={onNavigation}>
              {showTransactionHash(hash || "")}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
