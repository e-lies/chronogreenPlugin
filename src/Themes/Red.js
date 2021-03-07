export default {
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paper: "rgba(251, 241, 241, 0.9)",
      default: "#EAEBF2",
    },
    primary: {
      light: "#336b64",
      main: "#285b54",//"#235b54",
      dark: "#134a44",
      contrastText: "rgba(245, 250, 250, 1)",
    },
    secondary: {
      light: "#74c3a0",
      main: "#5baa71",//"#64b390",
      dark: "#54a380",
      contrastText: "rgba(240, 255, 240, 1)",
    },
    error: {
      light: "#F18787",
      main: "#f44336",
      dark: "#c31f1f",
      contrastText: "rgba(236, 230, 240, 1)",
    },
    text: {
      primary: "rgba(20, 20, 20, 0.87)",
      secondary: "rgba(50, 50, 50, 0.54)",
      disabled: "rgba(200, 200, 200, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
  typography: {
    fontFamily: ["Tahoma", "Roboto", "Arial", "-apple-system"],
    fontSize: 12,
    fontWeightRegular: 400,
    fontWeightBold: 600,
    fontWeightMedium: 400,
  },
  overrides: {
   /* MuiPickersStaticWrapper: {
      staticWrapperRoot: {
        backgroundColor: "transparent",
      },
    },

    MuiPickersSlideTransition: {
      "slideExitActiveLeft-left": {
        transform: "none",
        "& > * > * > *": { color: "#eceff1", transition: "color 350ms" },
      },
      "slideEnter-right": {
        transform: "none",
      },
    },
    MuiPickerDTToolbar: {
      toolbar: {
        backgroundColor: "#f1f3f3",
        boxShadow: "none",
      },
    },
    MuiPickerDTTabs: {
      tabs: {
        color: "#000",
        backgroundColor: "#f1f3f3",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.04)",
      },
    },
    MuiPickersToolbarButton: {
      toolbarBtn: {
        background: "inherit",
        boxShadow: "none",
      },
    },
    MuiPickersToolbarText: {
      toolbarBtnSelected: {
        color: "#000",
      },
      toolbarTxt: {
        color: "#000",
      },
    },
    PrivateTabIndicator: {
      colorSecondary: {
        backgroundColor: "#fff",
        height: 5,
      },
    },
    MuiPickersModal: {
      dialog: {
        display: "flex",
        flexDirection: "column",
      },
      dialogRoot: { backgroundColor: "#eceff1" },
      withAdditionalAction: {
        "& > *": {
          backgroundColor: "#eceff1",
          boxShadow: "none",
          "& > *": {
            color: "#828282",
            fontFamily: "Montserrat",
            fontStyle: "normal",
            fontWeight: 500,
            fontSize: "23px",
            lineHeight: "28px",
            margin: "30px 0px",
          },
        },
      },
    },*/
    MuiPickersBasePicker: {
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        flexGrow: 1,
      },
      pickerView: {
        alignSelf: "center",
        flexGrow: 1,
      },
    },
  },
};
