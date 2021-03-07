import React, {
  Component, useState, useEffect, useContext, useMemo
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import Icon from '@material-ui/core/Icon';
import Skeleton from '@material-ui/lab/Skeleton';
import { path } from '../context/Params';

const useStyles = makeStyles((theme) => ({
  head: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.contrastText,
    fontWeight: 'bolder',
  },
  menuActions: {
    width: 'auto',
    //backgroundColor: theme.palette.primary.light,
    //color: theme.palette.background.paper,
    fontWeight: 'bold',
    padding: '2px',
  },
  action: { display: 'flex', justifyContent: 'start' },
  avatar: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
    width: 48,
    height: 48
  },
}));
const CollapseContent = props =>{
  const { j, f, expanded } = props;
  const CollapseRender = useMemo(()=>{ return(<div> {f.fct(j)} </div>)},[JSON.stringify(j)])
  return(
    <Collapse in={expanded === f.name} timeout="auto" unmountOnExit>
      { CollapseRender }
    </Collapse>
  )
}


export default function IdCard(props) {
  // functions est un array de fonction avec comme param jsn [{name:'détails',cond:session=>session.role==='admin',fct:j=>{...}},{name:'activités',fct:...}]
  // actions sont les actions qu'on peut faire à partir de la carte sur l'entité (accessible depuis un menu) [{label:'modifier',icon:'pen',cond:e=>e.id>10,fct:e=>{alert(e)}}]
  const {
    columns,
    jsn,
    type,
    title,
    lists, // liste des keys utilisées pour le contenu
    fillList, // fonction qui rend le contenu principal (si undefined ça sera la liste des éléments list), en entrée jsn et columns
    images,
    actions,
    functions,
    actionClass,
    cardStyle,
    headerStyle,
    contentStyle,
    customFunctions = [],
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const defaultHeaderStyle = { backgroundColor: theme.palette.primary.main, fontWeight: 'bold' };
  const [actionsDisplayed, setActionsDisplayed] = useState(null);
  const [expanded, setExpanded] = React.useState('Informations');
  const displayActions = (e) => {
    setActionsDisplayed(e.currentTarget);
  };
  const fillContent = (jsn) => (
    <List component="ol" style={{ ...contentStyle}}>
      {lists.map((d) => (
        <ListItem key={`item${d}`} style={{padding:4}}>
          <Icon>{columns && columns[d] && columns[d].icon ? columns[d].icon : ''}</Icon>
          <Typography style={{ margin: '8px' }} variant="subtitle2">
            {`${columns && columns[d] && columns[d].label && jsn[d] ? columns[d].label : d}: `}
          </Typography>
          {columns && columns[d] && columns[d].type === 'color' ? (
            <Avatar style={{ backgroundColor: jsn[d] || null }} />
          ) : columns && columns[d] && columns[d].type.includes('image') ? (
            <Avatar alt={`img ${d}`} src={jsn[d] ? jsn[d].split(',')[0] : null} />
          ) : (
            <Typography variant="subtitle1">{`${jsn[d]}${columns[d] && columns[d]['suffixe']}`}</Typography>
          )}
        </ListItem>
      ))}
      {' '}
    </List>
  );
  if (jsn) {
    return (
      <Card style={cardStyle || {backgroundColor: theme.palette.background.default}}>
        <CardHeader
          className={classes.head}
          //style={headerStyle || defaultHeaderStyle}
          avatar={(
            <Avatar
              aria-label="photo"
              src={jsn[images] ? path + jsn[images].split(',')[0] : ''}
              alt={jsn[title]}
              className={classes.avatar}
            />
          )}
          action={
            actions && actions.length > 0 && (
              <IconButton
                className={classes.avatar}  
                aria-haspopup="true"
                aria-label="settings"
                onClick={(e) => {
                  displayActions(e);
                }}
              >
                <MoreVertIcon size="large" />
              </IconButton>
            )
          }
          title={<Typography variant="h5">{jsn[title]}</Typography>}
          subheader={<Typography color="secondary" variant="subtitle1">{type}</Typography>}
        />
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          open={Boolean(actionsDisplayed)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorEl={actionsDisplayed}
          onClose={(e) => {
            setActionsDisplayed(null);
          }}
        >
          {actions.map((ac) => {
            if (ac.cond === undefined || ac.cond(jsn)) {
              return (
                <div style={{backgroundColor:theme.palette.background.default}}>
                  <MenuItem divider
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    className={actionClass || classes.action}
                    onClick={(e) => {
                      ac.fct(jsn);
                      setActionsDisplayed(false)
                    }}
                  >
                    <ListItemIcon>
                      <Icon className={classes.menuActions}>{ac.icon || null}</Icon>
                    </ListItemIcon>
                    <ListItemText style={{ fontFamily: 'tahoma' }} primary={ac.label} />
                  </MenuItem>
                  {' '}
                  <Divider />
                </div>
              );
            }
            return false;
          })}
        </Menu>
        {/* <CardContent style={{...contentStyle}}>
          {fillList ? fillList(jsn, columns) : fillContent(jsn)}
        </CardContent> */}
        <CardActions style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: '100%' }}>
            <Divider component="hr" />
            <div
              style={{
                width: '94%',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '15px',
              }}
            >
              <Typography variant="h5"> Informations </Typography>
              <IconButton
                style={{ float: 'right' }}
                aria-expanded={expanded === 'Informations'}
                onClick={(e) => {
                  e.preventDefault();
                  setExpanded('Informations');
                }}
              >
                {expanded === 'Informations' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </div>
            <Collapse in={expanded === 'Informations'} timeout="auto" unmountOnExit>
              {fillList ? fillList(jsn, columns) : fillContent(jsn)}
            </Collapse>
          </div>
          {functions.map((f) =>{
            
            return(<div style={{ width: '100%' }}>
              <Divider component="hr" />
              <div
                style={{
                  width: '94%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '15px',
                }}
              >
                <Typography variant="h5">
                  {' '}
                  {f.name}
                  {' '}
                </Typography>
                <IconButton
                  style={{ float: 'right' }}
                  aria-expanded={expanded === f.name}
                  onClick={(e) => {
                    e.preventDefault();
                    expanded === f.name ? setExpanded(false) : setExpanded(f.name);
                  }}
                >
                  {expanded === f.name ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </div>
              <CollapseContent j={jsn} f={f} expanded={expanded} />
            </div>)
        }
      )}
        </CardActions>
      </Card>
    );
  }
  return (
    <div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton width={80} height={80} variant="circle" />
        <div>
          <Skeleton variant="text" width={240} />
          <Skeleton variant="text" width={240} />
        </div>
      </div>
      <Skeleton variant="rect" width={320} height={400} />
    </div>
  );
}
IdCard.propTypes = {
  columns: PropTypes.object,
  jsn: PropTypes.shape(),
  title: PropTypes.string,
  lists: PropTypes.arrayOf(PropTypes.string),
  cardStyle: PropTypes.shape()
};
IdCard.defaultProps = {
  lists: [],
  columns: {},
  contentStyle: {},
  functions: [],
  actions: []
};