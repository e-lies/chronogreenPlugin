import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { GridList, GridListTile, GridListTileBar, ListSubheader, IconButton, Icon, Avatar, Paper, Typography }  from '@material-ui/core';
import { path } from '../context/Params';
import { useSize } from '../reducers/Hooks';

const useStyles = makeStyles((theme) => ({
  gridList: {
    display: 'flex',
    flexWrap: 'wrap',
    //justifyContent: 'space-around',
    overflow: 'hidden',
    width: '100%',
    // backgroundColor: theme.palette.secondary.light
  },
  gridImages: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  },
  gridTile: {
    boxShadow: "2px 2px 3px rgba(0, 0, 0, 0.1), -1px -2px 3px rgba(0, 0, 0, 0.1)",
    borderRadius:'8px',
    margin:8,
    backgroundColor: theme.palette.background.paper
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
  images: {
    borderRadius:'8px',
    opacity: 0.8,
    cursor: 'pointer',
    "&:hover": {
      opacity: 1
    }
  }
}));

const ImagesGrid2 = (props) => {
  // image est la key utilisée pour l'image
  // label la key pour l'affichage en bas de l'image
  // onClick prend le json data[i] comme entrée
  const {

    id, title, data, image, titleCol, subtitleCol, actionFct, onClick, /*spacing,*/ width, height, /*tileBarProps,*/ imagesProps
  } = props;
  const size = useSize(id)
  //const theme = useTheme()
  const classes = useStyles();
  const [cols, setCols] = useState(1);
  useEffect(() => {
    /*setCols(
      document.querySelector(`.${classes.gridList}`)
        ? Math.floor(document.querySelector(`.${classes.gridList}`).clientWidth / width)
        : 4,
    );*/
    setCols(Math.floor(size.width / width))
  }, []);
  /*useEffect(()=>{
    console.log("size = ",size,width)
    setCols(parseInt(size.width / parseInt(width+(2*spacing))))
  },[JSON.stringify(size)])*/
  window.addEventListener('orientationchange', () => {
    setCols(
      document.querySelector(`.${classes.gridList}`)
        ? Math.floor(document.querySelector(`.${classes.gridList}`).clientWidth / width)
        : 4,
    );
  });
  return(
    <div 
      id={id}
      className={classes.gridList}
    >
      <Typography variant="h4" className="gridTitle"> { title } </Typography>
      <div className={classes.gridImages}>
      {data.map((tile, i) => (
        <div style={{width,height:height ? (height+(height*0.35)) : (width+(width*0.35))}} className={classes.gridTile}>
          <img 
            {...imagesProps}
            src={tile[image] ? tile[image].split(',')[0] : '/Images/blank.png'}
            alt={tile[titleCol]}
            width={width} height={height || width}
            className={classes.images}
            clickable={true}
            onClick={e=>onClick(tile)}
          />
          <div style={{position:'relative',bottom:'12%',display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',justifyContent:'flex-start'}}>
              { actionFct(tile,i) }
            </div>
            <div style={{width:'100%',display:'flex',flexDirection:'column',alignItems:'start',padding:'20%'}}>
            <Typography variant="subtitle1"> {tile[titleCol]} </Typography>
            <Typography color="primary" variant="subtitle2"> {tile[subtitleCol]} </Typography>
            </div>
          </div>
        </div>)
      )}
      </div>
    </div>
  )
 /* return (
    <GridList
      id={id}
      cellHeight={height || width}
      spacing={spacing}
      className={classes.gridList}
      cols={cols || 4 }
    >
      {title && <GridListTile key="Subheader" cols={1} style={{ height: 'auto' }}>
        <ListSubheader component="h4">{title}</ListSubheader>
      </GridListTile>}
      {data.map((tile, i) => (
        <GridListTile
          key={`title${i}`}
          clickable onClick={() => (onClick ? onClick(tile) : false)}
          className={classes.gridTile}
          style={{width}}
          cols={1}
        >
          <img 
            src={tile[image] ? path+tile[image].split(',')[0] : path+'/Images/blank.png'}
            alt={tile[titleCol]}
            //imgProps={{style:{width:100,height:100}}}
            style={{borderRadius:'8px',width:'100%',height:'100%'}}
          />
          <GridListTileBar
            {...tileBarProps}
            title={tile[titleCol]}
            subtitle={subtitleCol && <span>{tile[subtitleCol]}</span>}
            actionIcon={ <IconButton className={classes.icon}>
                          {actionFct(tile,i)}
              </IconButton>}
          />
        </GridListTile>
      ))}
    </GridList>
  );*/
};
ImagesGrid2.propTypes = {
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
	Nom de la key qui contiendra le titre à afficher en dessous de chaque image
  */
  titleCol: PropTypes.string,
  /**
   * Nom de la key qui contiendra le subtitle en dessous du titre
   */
  subtitleCol: PropTypes.string,
  /*
	Fonction qui donne les actions à effectuer (souvent un speedDial)
 */
  actionFct : PropTypes.func,
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
  /**
   * Les options d'afichage de la tileBar de chaque image
   */
  tileBarProps: PropTypes.shape()
};
ImagesGrid2.defaultProps = {
  id: 'ImageGrid',
  width: 240,
  height: 200,
  spacing: 0,
  onClick: (jsn) => console.log('Click image ', jsn),
  //tileBarProps: {clickable: true, titlePosition: 'bottom', style:{width:'100%',display:'flex',justifyContent:'space-between'} /*actionPosition: 'left'*/},
  imagesProps: {}
  //icon: 'zoom_in',
};
export default ImagesGrid2;
