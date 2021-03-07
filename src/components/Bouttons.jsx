import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';

export default function Bouttons (props){
	const { type, disabled, color, label, size, icon, callback } = props;
	// size => ['small','medium','large']
	let comp = type==='button' ? Button : Fab;
	let t = type || 'Fab';
	/*return(
		<Button 
			color={color || "default"}
			variant="contained"
			size={size || 'medium'}
			disabled={disabled ? true : false}
			onClick={callback || {}} >
			{label} <Icon> {icon || null} </Icon> 
			{props.children}
		</Button>
	)*/
	return(React.createElement(comp,{
		color:color || 'default',size:size || 'large',variant:"contained",onClick:callback || {}
	},
		<span style={{display:'flex',justifyContent:'space-between'}}> {label}  <Icon> {icon || null} </Icon></span>))
}