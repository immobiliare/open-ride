import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#0094F0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FF008A",
      dark: "#da0b7a",
      contrastText: "#ffffff",
    },
    border: "#d5d5d5",
  },
  typography: {
    fontFamily: "Nunito",
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
});

theme = createTheme(theme, {
  components: {
    // the default container
    MuiContainer: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      },
    },
    // my large button
    MuiButton: {
      variants: [
        {
          props: { size: "large" },
          style: {
            borderColor: "transparent",
            boxShadow: theme.shadows[3],
            height: theme.spacing(7),
            fontSize: theme.typography.h6.fontSize,
            "&:hover, &:focus, &:active": {
              borderColor: "transparent",
            },
          },
        },
      ],
    },
    // reset margin on inner text-fields
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "0",
        },
      },
    },
    // set default margin on form-fields
    MuiFormControl: {
      styleOverrides: {
        root: {
          marginBottom: theme.spacing(2),
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: theme.spacing(6),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
      },
    },
  },
});

export default theme;
