const palette = {
  text: {
    primary: "#000000",
    secondary: "#828282",
    third: "#6cd5fa",
  },
};
const theme = {
  palette: {
    common: {
      black: "#000",
      white: "#fff",
    },
    background: {
      paper: "rgba(250, 243, 252, 1)",
      default: "#ECEFF1"
    },
    primary: {
      light: "rgba(158, 170, 210, 1)",
      main: "rgba(120, 129, 183, 1)",
      dark: "rgba(77, 89, 172, 1)",
      contrastText: "rgba(208, 207, 240, 1)",
    },
    secondary: {
      light: "rgba(232, 101, 145, 1)",
      main: "rgba(202, 71, 117, 1)",
      dark: "rgba(207, 34, 113, 1)",
      contrastText: "rgba(240, 205, 208, 1)",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
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
    fontFamily: ["Tahoma", "-apple-system"],
    fontSize: 12,
    fontWeightRegular: 16,
    fontWeightBold: 10,
    fontWeightMedium: 10,
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          fontFamily: "Tahoma",
        },
      },
    },
    MuiCardActions: {
      root: {
        paddingTop: "7vh",
      },
    },
    MuiCard: {
      root: {
        height: "57vh",
        background: "#ECEFF1",
        boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.12)",
        overflow: "inherit",
      },
    },
    MuiCardHeader: {
      root: {
        backgroundColor: "#F1F3F3",
        paddingLeft: "10%",
        width: "auto",
        height: "6vh",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.04)",
        display: "flex",
      },
      title: {
        //fontFamily: "Tahoma",
        fontSize: "35px",
        lineHeight: "43px",
        display: "flex",
        justifyContent: "center",
      },
      action: {
        alignSelf: "center",
      },
      avatar: {
        "& .MuiAvatar-root": {
          width: 75,
          height: 75,
        },
      },
      content: {
        "& .MuiTypography-h6": {
          fontWeight: "500px",
          fontSize: "23px",
          lineHeight: "28px",
        },
        "& .MuiTypography-body2": {
          fontSize: "18px",
          lineHeight: "22px",
        },
      },
    },
   /* MuiInputLabel: {
      root: {
        fontFamily: "Tahoma",
        fontSize: "25px",
        lineHeight: "30px",
      },
      formControl: {
        left: "auto",
        right: 0,
      },
    },*/
    MuiInputBase: {
      root: {
        flexDirection: "row-reverse",
      },
    },
    MuiButton: {
      containedSecondary: {
        backgroundColor: "#F35D53",
        color: "#000",
      },
      containedPrimary: {
        backgroundColor: "#D1F3FF",
        color: "#000",
      },
      root: {
        display: "flex",
        flexDirection: "row",
        padding: "24px 46px",
        background: "#FEFEFF",
        boxShadow: "2px 4px 4px rgba(0, 0, 0, 0.12)",
        borderRadius: "9px",
      },
      label: {
        fontSize: "28px",
        lineHeight: "34px",
        fontFamily: "Tahoma",
        textTransform: "none",
      },
    },
    MuiIcon: {
      root: {
        margin: "10px",
      },
      colorError: {
        background: "#F1F3F3",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
        borderRadius: "9px",
        color: "black",
      },
    },
    MuiIconButton: {
      colorSecondary: {
        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
      },
    },
    MuiDrawer: {
      paper: {
        background: "#fff",
      },
    },
    MuiTreeView: {
      root: {
        // marginLeft: 10,
      },
    },
    MuiTreeItem: {
      root: {
        display: "flex",
        flexDirection: "column",
        padding: 0,
        "&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover": {
          backgroundColor: "#00000000",
        },
        "&.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label": {
          backgroundColor: "#00000000",
        },
        "&.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label": {
          backgroundColor: "#00000000",
        },
      },
      content: {
        flexDirection: "row-reverse",
        width: "fit-content",
        "&:hover": {
          backgroundColor: "#d1f3ff50",
        },
        marginBottom: 5,
      },
      label: {
        backgroundColor: "#00000000",
        paddingLeft: 0,
        "&:hover": {
          backgroundColor: "#00000000",
        },
      },
      iconContainer: {
        width: "fit-content",
        marginRight: 0,
      },
    },
    MuiAppBar: {
      root: {
        position: "fixed",
        height: "12.77vh",
        backgroundColor: "#f1f3f3",
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: "#f1f3f3",
        boxShadow: "0px 8px 10px rgba(0,0,0,0.04)",
        height: "12.78vh",
      },
    },
    MuiInputAdornment: {
      root: {
        "&:first-child": {
          marginBottom: 20,
        },
      },
      positionEnd: {
        marginLeft: 0,
      },
    },
    MuiInput: {
      formControl: {
        "label + &": {
          marginTop: 30,
        },
      },
      underline: {
        "&:before": {
          borderBottom: "2px solid rgba(0,0,0,0.42)",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottom: "2px solid #000000",
        },
        "&:after": {
          borderBottom: "2px solid" + palette.text.primary,
        },
      },
    },
    MuiFormLabel: {
      root: {
        "&.Mui-focused": {
          color: palette.text.primary,
        },
      },
    },
    MuiTypography: {
      root: {
        fontFamily: "Tahoma",
        fontStyle: "normal",
        fontWeight: "normal",
      },
      h4: {
        fontFamily: "Tahoma",
        fontStyle: "normal",
        fontWeight: "normal",
      },
      body1: {
        fontFamily: "Tahoma",
        fontStyle: "normal",
        fontWeight: "normal",
      },
      subtitle1: {
        fontFamily: "Tahoma",
        fontStyle: "normal",
        fontWeight: "normal",
      },
      subtitle2: {
        fontFamily: "Tahoma",
        fontStyle: "normal",
        fontWeight: "normal",
      },
      body2: {
        fontFamily: "Roboto",
        fontStyle: "normal",
        fontWeight: "normal",
        color: "#5f6368",
      },
      h6: {
        fontFamily: "Roboto",
        color: "#5f6368",
        fontStyle: "normal",
        fontWeight: "normal",
      },
    },
    MuiDialog: {
      paper: {
        minWidth: "40%",
        minHeight: "69%",
      },
    },
    MuiFormControl: {
      root: {
        marginBottom: 40,
      },
    },
    MuiButtonBase: {},
    MuiTableRow: {
      root: {
        backgroundColor: "rgba(255,255,255,0.9)",
      },
    },
    MuiFab: {},
    MuiTablePagination: {
      toolbar: {
        backgroundColor: "rgba(0,0,0,0)",
      },
    },
    MuiCircularProgress: {
      colorSecondary: {
        color: "#6cd5fa",
      },
    },
    MuiPickersStaticWrapper: {
      staticWrapperRoot: {
        backgroundColor: "transparent",
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: "#1a73e8",
      },
    },
    MuiPickersCalendarHeader: {
      iconButton: {
        backgroundColor: "transparent",
      },
      switchHeader: {
        justifyContent: "space-evenly",
      },
      transitionContainer: {
        display: "none",
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
  },
  MuiPickersCalendarHeader: {
    iconButton: {
      backgroundColor: "transparent",
    },
    switchHeader: {
      justifyContent: "space-evenly",
    },
    transitionContainer: {
      display: "none",
    },
  },
};
export default theme;
