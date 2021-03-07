import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Draggable from "react-draggable-component";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useSize } from "../reducers/Hooks";

const useStyles = makeStyles(theme => ({
  info: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.background.paper,
    fontWeight: "bold"
  },
  avertissement: {
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.background.paper,
    fontWeight: "bold"
  },
  confirm: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    fontWeight: "bold"
  },
  actions: {
    display: "flex",
    justifyContent: "space-around",
    borderTop: "2px solid gray",
    backgroundColor: theme.palette.background.default
  },
  title: {
    margin: 10,
    whiteSpace: "nowrap"
  }
}));

function PaperComponent(props) {
  return (
    <Draggable style={{ position: "relative" }}>
      <Paper {...props} />
    </Draggable>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//si type n'est pas défini (info,avertissement,confirm), les icon, title, classes seront transmis par headerFooterFormat
const Alerts = props => {
  const {
    type,
    open,
    headerFooterFormat,
    hasCloseButton,
    handleClose,
    onOk,
    icon,
    title,
    width,
    fullScreen,
    draggable
  } = props;
  const classes = useStyles();
  const { isMobile } = useSize();
  const [frmt,setFormat] = React.useState({})
  React.useEffect(()=>{
    load()
  },[])
  React.useEffect(()=>{
    load()
  },[headerFooterFormat])

  const load = () =>{
    
    let format = new Object()
    if (type === "info") {
        format["icon"] = icon || "info";
        format["title"] = title || "Message";
        format["classes"] = classes.info;
        format["footer"] = [
          <Button onClick={e => clickOk(e)} color="primary">
            {" "}
            Ok{" "}
          </Button>
        ];
    } else if (type === "avertissement") {
        format["icon"] = icon || "warning";
        format["title"] = title || "Avertissement";
        format["classes"] = classes.avertissement;
        format["footer"] = [
          <Button onClick={e => clickOk(e)} color="primary">
            {" "}
            Ok{" "}
          </Button>
        ];
    } else if (type === "confirm") {
        format["icon"] = icon || "help";
        format["title"] = title || "Confirmation";
        format["classes"] = classes.confirm;
        format["footer"] = [
          <Button onClick={e => clickOk(e)} color="primary">
            {" "}
            Ok{" "}
          </Button>,
          <Button onClick={e => clickCancel(e)} color="secondary">
            {" "}
            Annuler{" "}
          </Button>
        ];
    }
    setFormat({...format,...headerFooterFormat})
  }
  const clickOk = () => {
    onOk && onOk();
  };
  const clickCancel = () => {
    handleClose && handleClose();
  };
  let pc = draggable ? { PaperComponent: PaperComponent } : {};
  return (
    <div>
      <Dialog
        {...pc}
        open={open}
        fullScreen={fullScreen}
        //fullWidth={true}
        maxWidth={width || "sm"}
        TransitionComponent={Transition}
        onClose={handleClose}
        //PaperComponent={draggable ? PaperComponent : Alerts}
      >
        <DialogTitle
         //style={headerFooterFormat && headerFooterFormat.headerStyle ? headerFooterFormat.headerStyle : {}} className={headerFooterFormat.classes}
          className={frmt.classes}
         >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Icon> {frmt.icon} </Icon>
            <Typography className={classes.title} variant={isMobile ? "h6" : "h5"}>
              {frmt.title}
            </Typography>
            {hasCloseButton && (
              <IconButton
                color="inherit"
                //style={headerFooterFormat && headerFooterFormat.headerStyle ? headerFooterFormat.headerStyle : {}}
                aria-label="close"
                onClick={e => clickCancel(e)}
              >
                <Icon> close </Icon>
              </IconButton>
            )}
          </div>
        </DialogTitle>
        <DialogContent>
          {props.children}
        </DialogContent>
        <DialogActions className={classes.actions}>
          {frmt["footer"] ? frmt.footer.map(bout => bout) : <span> </span>}
        </DialogActions>
      </Dialog>
    </div>
  );
};
Alerts.propTypes = {
  hasCloseButton: PropTypes.bool,
  headerFooterFormat: PropTypes.shape({
    classes: PropTypes.shape({}),
    icon: PropTypes.string,
    title: PropTypes.string,
    footer: PropTypes.arrayOf(PropTypes.element)
  })
};
Alerts.defaultProps = {
  hasCloseButton: true,
  headerFooterFormat: {}
};
export default Alerts;
