export const FONT_WEIGHT = {
  BOLD: 'bold',
  MEDIUM: 500,
  SEMI: 700,
  NORMAL: 'normal',
};

export const FONT_SIZE = {
  HEADER: "60px",
  SUB_HEADER: "40px",
  BODY: "16px"
}

const textStyles = {
  titleBold: {
    fontSize: FONT_SIZE.HEADER,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: '110%',
    fontFamily: `'Manrope', sans-serif`
  },
  titleSemi: {
    fontSize: FONT_SIZE.SUB_HEADER,
    fontWeight: FONT_WEIGHT.BOLD,
    lineHeight: '110%',
    fontFamily: `'Manrope', sans-serif`
  },
  bodyBold: {
    fontWeight: FONT_WEIGHT.BOLD,
    fontSize: FONT_SIZE.BODY,
    fontFamily: `'Manrope', sans-serif`
  },
  bodyNormal:  {
    fontWeight: FONT_WEIGHT.NORMAL,
    fontSize: FONT_SIZE.BODY,
    fontFamily: 'Manrope'
  },
  bodyMedium: {
    fontWeight: FONT_WEIGHT.MEDIUM,
    fontSize: FONT_SIZE.BODY,
    fontFamily: 'Manrope'
  }
}

export type TextStyles = typeof textStyles;

export default textStyles;