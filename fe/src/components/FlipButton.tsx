import { Button, ButtonProps, Spinner } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { memo } from "react";

interface IProps extends ButtonProps {
  text: string;
  index?: number;
  isDisabled: boolean;
  isLoading?: boolean;
}

const ButtonMotion = motion(Button);
const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};


const FlipButton = React.forwardRef(({ text, isDisabled, index, isLoading,  ...props }: IProps, ref) => {
  return (
    <ButtonMotion
      key={index}
      initial="initial"
      variant={isDisabled ? "disable" : "primary"}    
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}    
      variants={item}
      {...props}
    >
      {isLoading ? <Spinner /> : text}
    </ButtonMotion>
  );
});
 
  

export default memo(FlipButton);
