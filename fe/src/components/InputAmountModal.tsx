import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalBody,
  Button,
  Input,
  HStack,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { convertNumberTextInput, numberFormat } from "../utils";

interface IProps extends Omit<ModalProps, "children"> {
  onSet?: (val: number) => void;
}
 const InputAmountModal = ({onSet, ...props }: IProps) => {
  const [amount, setAmount] = React.useState<string>('0');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value.replace(/[^\d.]|\.(?=.*\.)/g, "");
    setAmount(value);
  }

  const handleSet = () => {
    if (!onSet) return;
    return onSet(convertNumberTextInput(amount));
  }

  return (
    <Modal closeOnOverlayClick={false} isCentered {...props}>
      <ModalOverlay
        blur="2xl"
        bg="blackAlpha.300"
        backdropFilter="blur(10px)"
      />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
          py="50px"        
        >
          <HStack w="full">
          <Input
            value={amount} 
            onChange={onChange} />
          <Button variant="outline" onClick={handleSet}>SET</Button>
         </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default memo(InputAmountModal);
