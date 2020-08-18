import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    allVariants: {
      fontFamily: ["Open Sans"].join(","),
    },
  },

  palette: {
    type: "light",
    primary: {
      main: "#2162D6",
    },

    background: {
      default: "#F5F5F5",
      paper: "#FFFFFF",
    },
  },

  overrides: {
    MuiToolbar: {
      root: {
        backgroundColor: "#FFFFFF",
      },
    },
  },
});
