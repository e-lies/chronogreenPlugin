import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Box, CircularProgress, LinearProgress } from '@material-ui/core';

const defaultTextFct = (value,total)=>{
    return(
        <Typography variant="caption" component="div" color="textSecondary">
            {`${total && total > 0 ? Math.round((value/total)*100) : 0}%`}
        </Typography>
    )
}

export default function Progress(props){
    const { id, value, total, type, size, thickness, color, textFct, otherProps } = props
    const val = total && total > 0 ? Math.round((value/total)*100) : 0
    const BorderLinearProgress = withStyles((theme) => ({
        root: {
          height: thickness,
          borderRadius: thickness,
        },
        colorPrimary: {
          backgroundColor: theme.palette[color].light //[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
          borderRadius: thickness,
          backgroundColor: theme.palette[color].dark,
        },
      }))(LinearProgress);
    return(
        <Box position="relative" display="inline-flex">
        { type === 'circle' ?
            (<CircularProgress 
                /*{...otherProps}
                {...size}
                {...color}*/
                {...thickness}
                variant="static"
                value={val}
            />)
            : 
            (<Box width={size} mr={1}><BorderLinearProgress 
                {...otherProps}
                {...color}
                variant="determinate"   
                value={val}
            /></Box>)
        }
        <Box
            top={0}
            left={0}
            bottom={0}
            right={0}
            position={type === 'circle' ? "absolute" : "inherit"}
            display="flex"
            alignItems={type === 'circle' ? "center" : "flex-end"}
            justifyContent={type === 'circle' ? "center" : "flex-end"}
        >
            { textFct(value,total) }
        </Box>
    </Box> 
    )
}
Progress.propTypes = {
    id: PropTypes.string,
    /**
     * Valeur actuelle
     */
    value: PropTypes.number.isRequired,
    /**
     * Valeur Total
     */
    total: PropTypes.number,
    /**
     * Le progress est-il un cercle ou une ligne ?
     */
    type: PropTypes.oneOf('circle','line'),
    /**
     * La largeur du progresse (en pixels)
     */
    size: PropTypes.number,
    /**
     * L'épaisseur du trait
     */
    thickness: PropTypes.number,
    /**
     * Couleur du trait
     */
    color: PropTypes.any,
    /**
     * Fonction qui render le texte
     */
    textFct: PropTypes.func,
    /**
     * Autre props à appliquer éventuellement
     */
    otherProps: PropTypes.object
}
Progress.defaultProps = {
    id: "Progress",
    total: undefined,
    type: 'line',
    size: 50,
    thickness: 4,
    color: 'primary',
    textFct: defaultTextFct,
    otherProps: {}
}