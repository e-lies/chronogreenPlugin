import React, { useReducer, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
// import { DisplayCols, Pagination, TableauHeader, TableauBody } from "./Tableaux/Tableau";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TablePagination,
  Checkbox,
  IconButton,
  Icon,
  Tooltip,
  Avatar,
  Typography,
  Popover,
  Badge,
  Collapse,
} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CircularProgress from "@material-ui/core/CircularProgress";
import { globalType, filt, displayFilter, extractAddress } from "../../reducers/Functions";
import Filtres from "../Filtres";
import FilterElement from "../FilterElement";
import SpeedDials from "./SpeedDials";
import { useSize, SwipeRevealItem } from "../../reducers/Hooks";

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginRight: "70%",
    // theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  table: {
    //width: '100%',
    overflow: "scroll",
  },
  toolbar: {
    maxWidth: "100%",
    maxHeight: 40,
    padding: 4,
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    //position: 'relative',
    color: theme.palette.secondary.main,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    //height: '20px',
  },
  th: {
    //maxWidth: '100%',
    color: theme.palette.text.secondary,
    flex: 5,
    display: "flex",
    justifyContent: "center",
    borderBottom: "1px solid gray",
  },
  thSel: {
    //maxWidth: '100%',
    color: theme.palette.primary.main,
    flex: 5,
    display: "flex",
    justifyContent: "center",
    fontWeight: "bold",
    borderBottom: "1px solid gray",
  },
  checkedCell: { padding: 0, display: "flex" },
  checkb: {
    color: theme.palette.secondary.light,
  },
  tooltipTitle: {
    //fontSize: "1.25em",
    whiteSpace: "nowrap",
    marginRight: 16,
    marginLeft: 16,
    //fontWeight: "bold",
  },
  oddRows: {
    backgroundColor: theme.palette.background.default, //theme.palette.action.hover,
  },
  evenRows: {
    backgroundColor: theme.palette.background.paper, //theme.palette.action.hover,
  },
  headerTypography: {
    //color: theme.palette.secondary.light,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
    //fontSize: isMobile ? "0.56875rem" : "0.875rem",
  },
}));
function reducer(state, action) {
  switch (action.type) {
    case "order":
      let ord = [...state.order];
      if (state.order.length > 0 && state.order[0].col === action.col) {
        // existe déjà un ordre (est un array pour pouvoir ajouter le tri multi-colonnes + tard)
        if (state.order[0].ordre === "asc") {
          ord[0].ordre = "desc";
        } else {
          ord = state.order.filter((r) => r.col !== ord[0].col);
        }
      } else {
        ord = [{ ordre: "asc", col: action.col }];
      }
      return { ...state, page: 0, order: ord };
    case "visibleFilter":
      return {
        ...state,
        visibleFilter: state.visibleFilter.includes(action.col)
          ? state.visibleFilter.filter((v) => v !== action.col)
          : state.visibleFilter.concat(action.col),
      };
    case "filter":
      let fil = state.filters.filter((f) => f.label !== action.col);
      return { ...state, filters: [...fil, ...action.filters] };
    case "inverseFilter":
      return {...state, inverseFilter: !state.inverseFilter}
    case "cols":
      return {
        ...state,
        cols: colDistribution(
          widthLevel(action.width),
          action.columns,
          action.hidden
        ),
      };
    case "colStep":
      return { ...state, colStep: action.colStep };
    case "rows":
      return { ...state, rpp: action.rpp };
    case "page":
      return { ...state, page: action.page };
    case "checked":
      return { ...state, checked: action.checked };
    case "reset":
      return {
        ...state,
        page: 0,
        filters: [],
        order: [],
        checked: [],
        inverseFilter: false
      };
      break;
    case "open":
      let isOpen = state.open.filter(
        (op) => op.index !== action.index || op.key !== action.key
      );
      return {
        ...state,
        open:
          state.open.length > isOpen.length
            ? isOpen
            : state.open.concat({ key: action.key, index: action.index }),
      };
      break;
    default: {
      console.log("Action inconnue");
      return state;
    }
  }
}
const sorting = (type, order, orderBy) => {
  if (type === "text") {
    return order === "desc"
      ? (a, b) =>
          b[orderBy] === null ||
          a[orderBy] === null ||
          b[orderBy].toString().toLowerCase() <
            a[orderBy].toString().toLowerCase()
            ? -1
            : 1
      : (a, b) =>
          b[orderBy] === null ||
          a[orderBy] === null ||
          a[orderBy].toString().toLowerCase() <
            b[orderBy].toString().toLowerCase()
            ? -1
            : 1;
  }
  return order === "desc"
    ? (a, b) =>
        b[orderBy] === null || a[orderBy] === null || b[orderBy] < a[orderBy]
          ? -1
          : 1
    : (a, b) =>
        b[orderBy] === null || a[orderBy] === null || a[orderBy] < b[orderBy]
          ? -1
          : 1;
};
const baseWidth = (width) => {
  return width > 400 ? (width > 760 ? (width > 1024 ? 80 : 70) : 60) : 50;
};
const widthLevel = (width) => {
  return Math.floor(width / baseWidth(width));
  /* if(width < 380){
    return Math.floor(width/ba)
  }
  else if(width < 760){
    return 9
  }
  else if(width < 1024){
    return 12
  }
  else{
    return 15
  }*/
};
const colDistribution = (coef, columns, hidden = []) => {
  let t = 0;
  return Object.keys(columns).reduce((acc, col) => {
    let length = columns[col]["length"] || 2;
    if (!hidden.includes(col)) {
      if (acc.length < 1 || parseInt(t + length) >= coef) {
        acc.push([col]);
        t = length;
      } else {
        acc[acc.length - 1] = acc[acc.length - 1].concat(col);
        t += length;
      }
    }
    return acc;
  }, []);
};

const ClientTab = (props) => {
  const {
    id,
    title, // titre du tableau
    caption, // un petit descriptif en fin de tableau
    headerStyle, // fonction qui donne le style du header du tableau (Theme en paramètre d'entrée)
    paddings,
    checkColor, // couleur à appliquer aux checks
    data, // données d'origine
    expressions, // array qui contient le titre et les expressions pour ajouter de nouvelles colonnes à celles qui existent
    schema, // schema de type schema.select.rule
    tools, // éléments JSX à ajouter devant le titre
    hidden, // array de colonnes à cacher
    filterKeys, // les colonnes qu'on utilisera pour le filtrage
    filterConfirmation,
    defaultFilter,
    defaultChecked,
    defaultRpp,
    onChangeRowsPerPage,
    lineFunctions, // fonctions appliquées à chaque ligne [{label:'Détails',icon:'zoom',cond:r=>r.id>10,fct:r=>{console.log(r[id])}},{...}...]
    checkedFunctions, // fonctions appliquées aux lignes cochées [{label:'Détails',icon:'zoom',fct:r=>{console.log(r[id])}},...]
    stripped, //1 ligne sur 2 aura 1 background
    cellFunctions, //objet avec les keys de data, et comme value, un fct qui prend en paramètres la column schema, la value de la cell, et tout le json de la ligne pour fabriquer un render dans la cell
    collapses, //Array avec titre, icon et fct de render JSX qui si elle rend 1 rslt non null, déclenche la création des collapse, l'argument est le JSON de la ligne
    speedFct,
    dbClickFilter,
  } = props;
  const theme = useTheme();
  const [state, dispatch] = useReducer(reducer, {
    page: 0,
    rpp: defaultRpp,
    cols: [[]],
    colStep: 0,
    visibleFilter: [],
    filters: [],
    inverseFilter: false,
    order: [],
    checked: defaultChecked,
    open: [],
  });
  const classes = useStyles();
  const { width } = useSize(id);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const tableComponent = useRef(null);

  useEffect(() => {
    if (schema.columns) {
      let w =
        width -
        (checkedFunctions ? baseWidth(width) : 0) -
        (collapses.length || 0) * baseWidth(width) -
        (lineFunctions.length > 0 ? (speedFct ? 0.5 : (lineFunctions.length/2)) : 0) *
          baseWidth(width);
      dispatch({ type: "cols", columns: schema.columns, width: w, hidden });
    }
  }, [width, JSON.stringify(schema.columns), JSON.stringify(hidden)]);
  useEffect(() => {
    dispatch({ type: "colStep", colStep: 0 });
  }, [JSON.stringify(state.cols)]);
  useEffect(() => {
    if (defaultFilter) {
      dispatch({ type: "filter", filters: defaultFilter });
    }
  }, [JSON.stringify(defaultFilter)]);
  useEffect(() => {
    dispatch({ type: "reset" });
  }, [JSON.stringify(props[schema]), JSON.stringify(props[filterKeys])]);
  useEffect(() => {
    dispatch({ type: "checked", checked: [] });
  }, [state.filters, state.order]);
  useEffect(() => {
    onChangeRowsPerPage && onChangeRowsPerPage(state.rpp);
  }, [state.rpp]);
  useEffect(() => {
    dispatch({ type: "rows", rpp: defaultRpp });
  }, [defaultRpp]);
  const selectAll = (long) => {
    const checked = [];
    if (state.checked.length < long) {
      for (let i = 0; i < long; i++) {
        checked.push(i);
      }
    }
    dispatch({ type: "checked", checked });
  };
  const setFilterAnchor = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const selectLine = (i) => {
    let checked = [...state.checked];
    if (state.checked.indexOf(i) < 0) {
      checked.push(i);
    } else {
      checked = checked.filter((c) => c !== i);
    }
    dispatch({ type: "checked", checked });
  };
  const fcts = (d, f) => {
    const rows = state.checked.map((c) => d[c]);
    f(rows);
  };
  const lf = lineFunctions || [];
  const tabHeader = (visible) => (
    <TableRow
      style={
        headerStyle
          ? headerStyle(theme)
          : { color: theme.palette.primary.main, height: "20px" }
      }
      className="swapBar"
    >
      {checkedFunctions && checkedFunctions.length > 0 && (
        <TableCell
          style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
          component="td"
        >
          <Checkbox
            color={checkColor || "secondary"}
            checked={state.checked.length === dt.length}
            className={classes.checkb}
            onChange={() => selectAll(dt.length)}
            inputProps={{ "aria-label": "select all" }}
          />
        </TableCell>
      )}
      {collapses &&
        collapses.map((clp) => (
          <TableCell
            style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
            component="td"
          >
            <div
              style={{
                color: theme.palette.secondary.light,
                fontSize: 8,
                width: 40,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2"> {clp.title} </Typography>
            </div>
          </TableCell>
        ))}
      {speedFct ? (
        <TableCell
          style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
          component="th"
        >
          <Typography
            style={{
              color: theme.palette.secondary.light,
              width: 40,
              display: "flex",
              justifyContent: "space-between",
            }}
            variant="body2"
          >
            Fonctions
          </Typography>
        </TableCell>
      ) : (
        lf.map((f) => (
          <TableCell
            component="th"
            style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
          >
            <div
              style={{
                color: theme.palette.secondary.light,
                fontSize: 8,
                width: 40,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2"> {f.label} </Typography>
            </div>
          </TableCell>
        ))
      )}
      {// les labels de colonnes avec tri
      Object.keys(schema.columns).map((col) => {
        let length = schema.columns[col].length || 2;
        if (visible.includes(col)) {
          const or = state.order.filter((ord) => ord.col === col);
          const design =
            or.length > 0
              ? or[0].ordre === "desc"
                ? { icon: "arrow_downward", classe: "thSel" }
                : { icon: "arrow_upward", classe: "thSel" }
              : { icon: "import_export", classe: "th" };
          return (
            <TableCell component="th" style={{ width: baseWidth(width) * length, padding: paddings }}>
              <Tooltip title={schema.columns[col].label}>
                <div
                  className={classes[design.classe]}
                >
                  {width > 500 && (
                    <Icon style={{ flex: 1 }}>
                      {schema.columns[col].icon}
                    </Icon>
                  )}
                  <IconButton
                    onClick={(e) => {
                      dispatch({ type: "order", col });
                    }}
                    color="inherit"
                    style={{ flex: 3, display: "flex", padding: 0 }}
                  >
                    <Typography
                      variant="subtitle2"
                      style={{
                        maxWidth: (baseWidth(width)-15) * length
                      }}
                      className={classes.headerTypography}
                    >
                      {schema.columns[col].label || col}
                    </Typography>
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      dispatch({ type: "order", col });
                    }}
                    color="inherit"
                    style={{ flex: 1, display: "flex", padding: 0 }}
                  >
                    <Icon> {design.icon} </Icon>
                  </IconButton>
                  {filterKeys &&
                    (filterKeys.length === 0 || filterKeys.includes(col)) &&
                    !["color", "image", "images", "file", "files"].includes(
                      schema.columns[col].type
                    ) && (
                      <div style={{ flex: 1 }}>
                        <IconButton
                          style={{ padding: paddings }}
                          color={
                            state.visibleFilter.includes(col)
                              ? "primary"
                              : state.filters.filter((f) => f.label === col)
                                  .length > 0
                              ? "secondary"
                              : "inherit"
                          }
                          onClick={(e) => {
                            setFilterAnchor(e);
                            dispatch({ type: "visibleFilter", col });
                          }}
                        >
                          <Icon> filter_list </Icon>
                        </IconButton>
                        <Popover
                          id={`popover_${title}`}
                          open={state.visibleFilter.includes(col)}
                          anchorEl={anchorEl}
                          onClose={(e) =>
                            dispatch({ type: "visibleFilter", col })
                          }
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                        >
                          <FilterElement
                            ind={0} //pour l'autofocus
                            column={schema.columns[col]}
                            label={col}
                            value={state.filters.filter((f) => f.label === col)}
                            extension={(k, c, v) => {
                              return (
                                <IconButton
                                  color="secondary"
                                  onClick={() => {
                                    dispatch({
                                      type: "filter",
                                      col,
                                      filters: [],
                                    });
                                    dispatch({ type: "visibleFilter", col });
                                  }}
                                >
                                  <Icon>refresh</Icon>
                                </IconButton>
                              );
                            }}
                            onChange={(v) =>
                              dispatch({ type: "filter", col, filters: v })
                            }
                          />
                        </Popover>
                      </div>
                    )}
                </div>
              </Tooltip>
              <Tooltip
                title={state.filters
                  .filter((f) => f.label === col)
                  .map((exp) => displayFilter(exp))
                  .join(" et ")}
              >
                <div>
                  {state.filters.filter((f) => f.label === col).length > 0 && (
                    <Typography
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: baseWidth(width) * length,
                      }}
                      color="secondary"
                      variant="subtitle2"
                    >
                      {state.filters
                        .filter((f) => f.label === col)
                        .map((exp) => displayFilter(exp))
                        .join(" et ")}
                    </Typography>
                  )}
                </div>
              </Tooltip>
            </TableCell>
          );
        }
        return false;
      })}
    </TableRow>
  );
  let dt = [];
  const { order, filters, rpp, page, checked } = state;
  if (data !== undefined) {
    dt =
      state.order.length > 0
        ? filt(data, filters, schema.columns,state.inverseFilter).sort(
            sorting(
              globalType(schema.columns[order[0].col].type),
              order[0].ordre,
              order[0].col
            )
          )
        : filt(data, filters, schema.columns,state.inverseFilter);
  }
  const dispData = dt.slice(
    parseInt(page) * rpp,
    parseInt(parseInt(page) * rpp) + parseInt(rpp)
  );
  if (expressions && expressions.length > 0) {
    dispData.map((d) => {
      expressions.map((exp) => {
        d[exp.title] = eval(exp.exp);
        return false;
      });
      return false;
    });
  }
  const cf = checkedFunctions || [];
  const possiblePage =
    dt.length < 6
      ? [dt.length]
      : dt.length < 21
      ? [5, dt.length]
      : dt.length < 101
      ? [5, 10, 20, dt.length]
      : [5, 10, 20, 100];
  // if(data && schema && schema.columns && data.length > 0){
  const swipeCallback = useCallback((direction) => {
    if (
      state.colStep - direction[0] >= 0 &&
      state.colStep - direction[0] < state.cols.length &&
      direction[0]
    ) {
      const element = document.querySelector(".MuiTable-root") || document.body;
      element.style.transition = "all 150ms ease-out 0s;";
      element.style.transform = `translateX(${direction[0] === -1 ? "-" : ""}${
        element.clientWidth
      }px)`;
      element.style.opacity = 0;
      setTimeout(
        () => {
          dispatch({
            colStep: state.colStep - direction[0],
            type: "colStep",
          });
          setTimeout(() => {
            element.style.opacity = 1;
            element.style.transform = "none";
          }, 150);
          element.style.transform = `translateX(${
            direction[0] === -1 ? "" : "-"
          }${element.clientWidth}px)`;
        },

        150
      );
    }
  });
  useEffect(() => {
    if (tableComponent.current) {
      const swiper = new SwipeRevealItem(
        tableComponent,
        `.swapBar`,
        `#${id}`,
        swipeCallback,
        [120,120],
        [true, false],
        [false, false],
        [true, true],
        [false, false],
        false
      );
      return () => {
        swiper.remove();
      };
    }
  }, [
    tableComponent,
    swipeCallback,
    state.colStep,
    state.page,
    state.cols.length,
  ]);
  const actualCols = state.cols[state.colStep] || state.cols[0];
  return (
    <div /*style={{overflowX:'scroll'}}*/>
        <div id="toolbar" className={classes.toolbar}>
          <div style={{ display: "flex", justifyContent: "start" }}>
            <Tooltip
              title={caption || title || schema['name']}
              classes={{ tooltip: classes.tooltipTitle }}
            >
              <Typography className={classes.tooltipTitle} variant={width < 500 ? "h6" : "h6"}>
                {title || schema['name'] || ""}
              </Typography>
            </Tooltip>
            <div
              id="tools"
              style={{ display: "flex", flexWrap: "no-wrap", marginRight: 24 }}
            >
              {" "}
              {tools &&
                tools.map((t) => {
                  return t()
                })}{" "}
            </div>
          </div>
          {state.checked.length > 0 && (
            <div
              style={{
                maxWidth: "75%",
                display: "flex",
                justifyContent: "space-around",
                flexWrap:'wrap',
                //overflowX:'scroll'
              }}
            >
              <Typography variant="button">
                {`${state.checked.length} sélection${
                  state.checked.length > 1 ? "s" : ""
                }`}
              </Typography>
              {cf.map((c) => (
                <Tooltip title={c.label}>
                  <IconButton
                    key={`cf${c.label}`}
                    color="inherit"
                    onClick={(e) => fcts(dt, c.fct)}
                  >
                    <Icon fontSize={width > 600 ? "large" : "medium"}> {c.icon} </Icon>
                  </IconButton>
                </Tooltip>
              ))}
          </div>
        )}
        </div>
      {schema && schema.columns ? (
        <div className={classes.tableContainer} ref={tableComponent}>
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="swapBar"
          >
            {state.cols.length > 1 &&
            (<div
                style={{
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {state.cols.map((c,i)=>{
                  return(<IconButton 
                    onClick={e=>dispatch({type:'colStep',colStep:i})} 
                    color={state.colStep === i ? "primary" : "default"}
                  >
                    <Icon style={state.colStep === i ? {fontSize:"0.8em",opacity:0.75} : {fontSize:"0.6em",opacity:0.6} }>
                      fiber_manual_record
                    </Icon>
                  </IconButton>)
                })}
              </div>)}
          </div> 
          <Table id={id} className={classes.table}>
            <TableHead className="swapBar">
              {tabHeader(actualCols || [])}
            </TableHead>
            {data !== undefined ? (
              <TableBody
                style={{ backgroundColor: theme.palette.background.paper }}
              >
                {dispData.map((row, i) => (
                  // lignes du tabelaux
                  <React.Fragment>
                    <TableRow
                      className={stripped && i % 2 === 1 ? classes.evenRows : classes.oddRows}
                      hover
                      key={`row${i}`}
                    >
                      {checkedFunctions && checkedFunctions.length > 0 && (
                        <TableCell
                          style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
                          component="td"
                        >
                          <Checkbox
                            color={checkColor || "secondary"}
                            checked={checked.includes(
                              parseInt(parseInt(state.page * state.rpp) + i)
                            )}
                            className={classes.checkb}
                            onChange={(e) =>
                              selectLine(
                                parseInt(parseInt(state.page * state.rpp) + i)
                              )
                            }
                            inputProps={{ "aria-label": `select${i}` }}
                          />
                        </TableCell>
                      )}
                      {collapses &&
                        collapses.map((clp) => (
                          <TableCell
                            style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
                            component="td"
                          > { (!clp.cond || clp.cond(row)) &&
                            (<Tooltip title={clp.title}>
                              <IconButton
                                aria-label="expand row"
                                onClick={(e) =>
                                  dispatch({
                                    type: "open",
                                    key: clp.title,
                                    index: i,
                                  })
                                }
                              >
                                {state.open.filter(
                                  (op) => op.key === clp.title && op.index === i
                                ).length > 0 ? (
                                  <Icon size="large">arrow_drop_down</Icon>
                                ) : (
                                  <Icon size="large">arrow_right</Icon>
                                )}
                              </IconButton>
                            </Tooltip>)}
                          </TableCell>
                        ))}
                      {speedFct ? (
                        <TableCell
                          style={{ maxWidth: parseInt(baseWidth(width)*0.5), padding: 0 }}
                          size="small"
                          align="center"
                        >
                          <SpeedDials
                            direction="right"
                            label="Fonctions"
                            icon="build"
                            speedProps={{
                              FabProps: {
                                size: "small",
                                color: "default",
                                style: { position: "relative", opacity: 0.8, left: 12 },
                              },
                            }}
                            actions={lf.map((f) => {
                              return {
                                label: f.label,
                                color: f.color || "secondary",
                                icon: f.icon,
                                fct: () => f.fct(row),
                              };
                            })}
                          />
                        </TableCell>
                      ) : (
                        lf.map((f) => (
                          <TableCell
                            size="small"
                            style={{ width: parseInt(baseWidth(width)*0.5), padding: 0 }}
                          >
                            {f.cond === undefined || f.cond(row) ? (
                              <IconButton
                                color={f.color || "secondary"}
                                onClick={(e) => {
                                  f.fct(row);
                                }}
                              >
                                <Tooltip title={f.label || "Fonction"}>
                                  <Icon fontSize="large">{f.icon}</Icon>
                                </Tooltip>
                              </IconButton>
                            ) : (
                              <IconButton disabled>
                                <Tooltip title="Indisponible pour cette ligne">
                                  <Icon>{f.icon}</Icon>
                                </Tooltip>
                              </IconButton>
                            )}
                          </TableCell>
                        ))
                      )}

                      {Object.keys(schema.columns).map((col) => {
                        let length = schema.columns[col].length || 2;
                        if (
                          actualCols &&
                          actualCols.includes(col) &&
                          schema.columns[col]
                        ) {
                          return (
                            <TableCell
                              //className={(cellClasses && cellClasses[col]) || null}
                              align="center"
                              size="small"
                              style={{
                                width: baseWidth(width) * length,
                                padding: paddings,
                                height: 10,
                              }}
                              //style={bodyStyle ? bodyStyle(theme) : {}}
                              onDoubleClick={(e) => {
                                if (
                                  dbClickFilter &&
                                  filterKeys && (filterKeys.length === 0 || filterKeys.includes(col)) &&
                                  ["text", "number", "date"].includes(
                                    globalType(schema.columns[col].type)
                                  )
                                ) {
                                  dispatch({
                                    type: "filter",
                                    col: col,
                                    filters:
                                      globalType(schema.columns[col].type) ===
                                      "text"
                                        ? [
                                            {
                                              label: col,
                                              operator: schema.columns[
                                                col
                                              ].type.includes("foreign")
                                                ? "in"
                                                : "like",
                                              value: row[col],
                                            },
                                          ]
                                        : [
                                            {
                                              label: col,
                                              operator: "<=",
                                              value: row[col],
                                            },
                                            {
                                              label: col,
                                              operator: ">=",
                                              value: row[col],
                                            },
                                          ],
                                  });
                                }
                                return false;
                              }}
                              component="td"
                            >
                              {cellFunctions[col] ? (
                                cellFunctions[col](
                                  row[col],
                                  row,
                                  schema.columns[col]
                                )
                              ) : globalType(schema.columns[col].type) ===
                                "color" ? (
                                <Avatar style={{ backgroundColor: row[col] }} />
                              ) : globalType(schema.columns[col].type) ===
                                "image" ? (
                                <Avatar
                                  alt={`img ${col}${i}`}
                                  src={row[col] && row[col].split(",")[0]}
                                />
                              ) : (
                                <Typography variant="body2">
                                  {schema.columns[col].type.includes("foreign") 
                                  ? schema.columns[col].possibles.find(p=>p.value===row[col])['label']
                                  :( schema.columns[col].type === "address" 
                                    ? extractAddress(row[col]) 
                                    : row[col]+(schema.columns[col].suffixe || '')
                                  )}
                                </Typography>
                              )}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                    {collapses &&
                      collapses.map((clp) =>{
                        if(state.open.filter( (op) => op.key === clp.title && op.index === i).length > 0){
                          return (<TableRow
                          className={stripped && i % 2 === 1 ? classes.evenRows : classes.oddRows}
                          hover
                        >
                          {/*<TableCell style={{ padding: paddings }}></TableCell>*/}
                          <TableCell
                            style={{ padding: paddings }}
                            colSpan={parseInt(
                              (checkedFunctions ? 1 : 0) + (lf && lf.length > 0 ? (speedFct ? 1 : lf.length) : 0) + state.cols[state.colStep].length + 1
                            )}
                          >
                            <Collapse
                              in={
                                state.open.filter(
                                  (op) => op.key === clp.title && op.index === i
                                ).length > 0
                              }
                              timeout="auto"
                              unmountOnExit
                            >
                              {clp.fct(row,schema)}
                            </Collapse>
                          </TableCell>
                        </TableRow>)
                        }
                    })}
                  </React.Fragment>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow className={stripped && classes.rows}>
                  <TableCell
                    colSpan={actualCols.length} //{state.cols[state.colStep].length + lf.length}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CircularProgress size={100} color="primary" />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
            <TableFooter>
              {/* footerFct !== undefined ? footerFct(schema,data) : tabHeader() */}
              <TableRow
                /*style={
                  footerStyle
                    ? footerStyle(theme)
                    : { backgroundColor: theme.palette.background.paper }
                }*/
                hover
              >
                <TableCell style={{ padding: 0, display:'flex' }}>
                  <Tooltip title="Mettre à zéro">
                    <IconButton
                      color="secondary"
                      onClick={() => dispatch({ type: "reset" })}
                    >
                      <Icon size="large" style={{ fontSize: "1.25em" }}>
                        rotate_left
                      </Icon>
                    </IconButton>
                  </Tooltip>
                  {width > 600 && <Tooltip title="Inverser le filtrage">
                    <IconButton
                      color={state.inverseFilter ? "secondary" : "inherit"}
                      onClick={() => dispatch({ type: "inverseFilter" })}
                    >
                      <Icon size="large" style={{ fontSize: "1.25em" }}>
                        swap_calls
                      </Icon>
                    </IconButton>
                  </Tooltip>}
                </TableCell>
                <TablePagination
                  count={dt.length}
                  page={state.page}
                  rowsPerPageOptions={possiblePage}
                  rowsPerPage={state.rpp}
                  onChangePage={(e, p) => dispatch({ type: "page", page: p })}
                  labelRowsPerPage={width > 600 ? "Lignes par page" : ""}
                  onChangeRowsPerPage={(e) =>
                    dispatch({ type: "rows", rpp: e.target.value })
                  }
                  labelDisplayedRows={({ frm, to, count }) =>
                    `${parseInt(state.page * state.rpp) + 1} à ${
                      to === -1 ? count : to
                    } sur ${count}`
                  }
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={100} color="secondary" />
        </div>
      )}
    </div>
  );
  // else { return(<Typography variant="h4"> Rien à afficher </Typography>) }
};
ClientTab.propTypes = {};
ClientTab.defaultProps = {
  id: "idTable",
  filterKeys: null,
  stripped: true,
  data: [],
  expressions: [],
  schema: { columns: {} },
  defaultChecked: [],
  defaultRpp: 5,
  cellFunctions: {},
  collapses: [],
  lineFunctions: [],
  speedFct: false,
  dbClickFilter: true,
  paddings: 0,
  checkedFunctions: [],
};
export default ClientTab;
