import React, { Component, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import { Icon } from '@material-ui/core';

export default function SpeedDials(props){
	const { icon, iconRotation, label, tooltipOpen, tooltipPlacement, direction, actions, speedProps } = props //actions a la forme [{icon:'',label:'',fct:..},{icon:....},...]
	const [open,setOpen] = useState(false)
	const actionClick = fct =>{
		setOpen(false);
		fct(label)
	}
	return(
		<SpeedDial
			{...speedProps}
			ariaLabel={label}
			//style= //{{position:'absolute'}}
			speedProps={speedProps}
			icon={<SpeedDialIcon icon={<Icon>{icon}</Icon>} openIcon={<Icon style={{transform:`rotate(${iconRotation}deg)`,transition: 'transform .8s ease-in-out'}}>{icon}</Icon>}/>}
			onClose={()=>setOpen(false)}
			onOpen={()=>setOpen(true)}
			open={open}
			direction={direction}
		>
		{actions.map(action=>{ return(
			<SpeedDialAction
				key={action.label}
				//style={{position:'absolute',padding:0}}
		        delay={30}
		        icon={<Icon style={{fontSize:'2em',fontWeight:'bold'}} color={action.color}> {action.icon} </Icon>}
		        tooltipTitle={action.label}
		        tooltipOpen={tooltipOpen}
		        tooltipPlacement={tooltipPlacement}
		        onClick={e=>{setOpen(false); actionClick(action.fct,action.label)}}
		    />)
		})}
		</SpeedDial>	
	)
}
SpeedDials.propTypes = {
	/**
	 * L'icon à utiliser pour le speedDial
	 */
	icon: PropTypes.string,
	/**
	 * Angle de rotation de l'icone quand il s'ouvre (en degrés°)
	 */
	iconRotation: PropTypes.number,
	/**
	 * Le nom du speedDial
	 */
	label: PropTypes.string,
	/**
	 * Les actions sont-elles tjr visibles
	 */
	tooltipOpen: PropTypes.bool,
	/**
	 * Placement de la tooltip avec les actions
	 */
	tooltipPlacement: PropTypes.oneOf('bottom-end','bottom-start','bottom','left-end','left-start','left','right-end','right-start','right','top-end','top-start','top'),
	/**
	 * Direction d'oucerture de la tooltip
	 */
	direction: PropTypes.oneOf('down','left','right','up'),
	/**
	 * Un array avec les features de chaque action
	 */
	actions: PropTypes.arrayOf(PropTypes.shape({
		icon: PropTypes.string,
		label: PropTypes.string,
		color: PropTypes.string,
		fct: PropTypes.func
	})),
	/**
	 * Props supplémentaires à appliquer au speedDial
	 */
	speedProps: PropTypes.shape()
}
SpeedDials.defaultProps = {
	iconRotation: 135,
	speedProps: {},
	tooltipOpen: false,
	tooltipPlacement: 'bottom',
	direction: 'right'
}