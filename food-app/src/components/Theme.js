import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#424242',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#c2c2c2',
      main: '#36B37B',
      dark: '#ba000d',
      contrastText: '#000',
    },
    slimeGreen:{
      main:'#36B37B'
    },
    greyShade:{
      main:"#c2c2c2"
    }
  },
});

theme.typography.h3 = {
  fontSize: '1.2rem',
  '@media (min-width:600px)': {
    fontSize: '1.5rem',
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.4rem',
  },
};

