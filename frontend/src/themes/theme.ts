import { ComponentStyleConfig, extendTheme, ThemeConfig } from "@chakra-ui/react"
import type {GlobalStyleProps } from "@chakra-ui/theme-tools"
import { fonts } from "../configs/constants"

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const colors = {
  bg: {
    primary: "#0047B8",
    secondary: "#0E1E45",
    tertiary: "#151D14",
  },
  color: {  
    white: "#ffffff",
    primary: "#0047B8",
    secondary: '#B2B2B2',  
  },
}

const Text: ComponentStyleConfig = {
  variants: {
    "with-title": {
      fontFamily: fonts.STATE_WIDE,
      fontSize: "16px",
      lineHeight: "28px",
      color: 'color.white',      
    },
    notoSan: {
      fontFamily: fonts.NOTOSANS,
      fontSize: "48px",
      lineHeight: "25px",
      color: "color.white"      
    },
    dmSan: {
      fontFamily: fonts.DMSANS_MEDIUM,
      fontSize: "16px",
      fontWeight: '700',
      lineHeight: "32px",
      color: 'color.white'
    }
  }
}   

const Button: ComponentStyleConfig = {
  variants: {
    'primary': {
      bg: '#fedf56',
      borderRadius: "8px",
      color: "#6a5809",
      fontFamily: fonts.STATE_WIDE,
      fontWeight: 'bold',      
      padding: "25px 30px",
      border: "1px solid #fedf56",
      fontSize: "15px",
    },  
    'disable': {
      bg: '#352c04',
      borderRadius: "8px",
      color: "#6a5809",
      fontFamily: fonts.STATE_WIDE,
      fontWeight: 'bold',      
      padding: "25px 30px",
      border: "1px solid #6f632a",
      fontSize: "15px",
    },  
    'outline': {      
      borderRadius: "5px",
      color: "#fedf56",
      fontFamily: fonts.DMSANS_BOLD,
      fontWeight: 'bold',      
      padding: "12px 36px",
      border: "1px solid rgba(254,223,86,.6) !important", 
    },   
    solid: (props: GlobalStyleProps) => ({
      bg: props.colorMode === 'dark' ? 'red.300' : 'red.500'
    })
  }
}

const Input: ComponentStyleConfig = {
  variants: {
    'primary': {
      bgColor: '#0E1E45',
      color: 'color.white',
      padding: "16px 32px",
      fontFamily: fonts.DMSANS_MEDIUM,
      fontSize: "18px",      
    },  
  }
}

const components = {
  Button,
  Text,  
  Input, 
}

const theme = extendTheme({
  config,
  colors,
  components, 
})

export default theme;