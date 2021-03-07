import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, GridList, GridListTile, GridListTileBar, ListSubheader, IconButton, Icon, Button, Avatar, Paper, Typography }  from '@material-ui/core';
import { path } from '../context/Params';
import { useSize } from '../reducers/Hooks';

const useStyles = makeStyles((theme) => ({
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: 'white', //theme.palette.background.default,
    width: '100%',
    padding:6
    // backgroundColor: theme.palette.secondary.light
  },
  tooltip:{
    '& .MuiTooltip-tooltip':{
      fontSize:'2em'
    }
  }
}));

const ImagesGrid = (props) => {
  // image est la key utilisée pour l'image
  // label la key pour l'affichage en bas de l'image
  // onClick prend le json data[i] comme entrée
  const {
    id, title, titleStyle, data, image, label, icon, onClick, spacing, width, height,
  } = props;
  const size = useSize(id)
  const classes = useStyles();
  const [cols, setCols] = useState(1);
  useEffect(() => {
    /*setCols(
      document.querySelector(`.${classes.gridList}`)
        ? Math.floor(document.querySelector(`.${classes.gridList}`).clientWidth / width)
        : 4,
    );*/
    setCols(parseInt(size.width / width))
  }, []);
  useEffect(()=>{
    console.log("size = ",size,width)
    setCols(parseInt(size.width / width))
  },[JSON.stringify(size)])
  window.addEventListener('orientationchange', () => {
    setCols(
      document.querySelector(`.${classes.gridList}`)
        ? Math.floor(document.querySelector(`.${classes.gridList}`).clientWidth / width)
        : 4,
    );
  });
  return (
    <GridList
      id={id}
      cellHeight={height || width}
      spacing={spacing || 12}
      className={classes.gridList}
      cols={cols || 4}
    >
      {title && <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
        <ListSubheader component="h4">{title}</ListSubheader>
      </GridListTile>}
      {data.map((tile, i) => (
        <Tooltip className={classes.tooltip} title={tile[label]}>
        <GridListTile
          key={`title${i}`}
          //cols={1}
          clickable onClick={() => (onClick ? onClick(tile) : false)}
          style={{width,height:height || width,boxShadow:'1px 1px 3px',borderRadius:'6px',marginBottom:10,padding:1}}
        > <Button style={{width:width,height:height || width,borderRadius:'6px'}}>
          <img 
            src={tile[image] ? path+tile[image].split(',')[0] : path+'/Images/blank.png'}
            alt={tile[label]}
            //imgProps={{style:{width:100,height:100}}}
            
          />
          <GridListTileBar
            style={{borderRadius:'0px 0px 6px 6px',maxHeight:'21%',opacity:0.8,backgroundColor:'white',color:'black'}}
            clickable
            title={
              (<Typography style={titleStyle(tile) || {}} color="textPrimary" variant="subtitle2">
                 {tile[label]}
                </Typography>
              )}
            // subtitle={<span>by: {tile.author}</span>}
            actionIcon={icon(tile)}
          />
          </Button>
        </GridListTile>
        </Tooltip>
      ))}
    </GridList>
  );
};
ImagesGrid.propTypes = {
  /**
   * Identifiant qui permettra de reconaitre cette grid parmis d'autres
   */
  id: PropTypes.number.isRequired,
  /*
	Données contenant les images, les titles, et les infos complémentaires
 */
  data: PropTypes.array.isRequired,
  /*
	Titre de la grid
 */
  title: PropTypes.string,
  /*
	Nom de la key (dans les lignes data) qui contient les links vers les images
  */
  image: PropTypes.string.isRequired,
  /*
	Nom de la key qui contiendra le titr à afficher en dessous de chaque image
  */
  label: PropTypes.string,
  /*
	Icone à utiliser sur l'action de click
 */
  icon: PropTypes.string,
  /*
	Fonction à déclencher au click sur une image (un jsn de data en entrée)
 */
  onClick: PropTypes.func,
  /*
	Largeur de chaque image (qui définira, avec spacing, le nombre d'images par ligne selon le container)
 */
  width: PropTypes.number,
  /**
 Hauteur de chaque image
 */
  height: PropTypes.number,
  /**
  Espace entre images
  */
  spacing: PropTypes.number,
};
ImagesGrid.defaultProps = {
  width: 240,
  height: 200,
  spacing: 10,
  onClick: (jsn) => console.log('Click image ', jsn),
  icon: tile=>(<IconButton><Icon color="action"> zoom_in </Icon></IconButton>),
};
export default ImagesGrid;
