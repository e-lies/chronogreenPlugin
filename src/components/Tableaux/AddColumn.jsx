import React, { Component, useReducer, useEffect } from "react";
import { Grid, TextField, TextareaAutosize, Typography, Tooltip, Button, ButtonGroup, Icon } from '@material-ui/core';

function reducer(state,action){
	switch(action.type){
		case "handleTitle" :
			return {...state, title:action.value}
		break;
		case "handleChange" :
			return {...state, expLabel:action.value}
		break;
		case "handleClick" :
			let expLabel = state.expLabel.concat(" "+action.label+" ")
			//let expValue = state.expValue.concat(" "+action.value)
			document.getElementById('expression').focus()
			return {...state, expLabel}
		break;
		case "handleValue" :
			let d = action.firstData
			let ev = ""
			try{ ev = eval(action.value) }
			catch (e){ console.log(e) }
			let example = Object.keys(action.columns).reduce((acc,cur)=>{
				return action.value.includes("d."+cur) ? acc.concat({col:cur,label:action.columns[cur]['label'],value:d[cur]}) : acc 
			},[])
			example.push({col:state.title,label:state.title,value:ev})
			let type = typeof ev === "number" ? "float" : (typeof ev === "object" ? "date" : "text")
			return {...state, expValue:action.value,type,example}
		break;
		default : return false
	}
}
// expLabel sera l'expression affichée (avec les labels de columns)
// expValue sera l'expression à utiliser pour le calcul (avec les keys de columns)
const AddColumns = props =>{
	const { columns, firstData, onConfirm } = props;
	const [state,dispatch] = useReducer(reducer,{title:"",type:"text",expLabel:"",expValue:"",example:[]})
	useEffect(()=>{
		document.getElementById('titreCol').focus()
	},[])
	useEffect(()=>{
		let value = Object.keys(columns).reduce((acc,cur)=>{
			if(columns[cur]['label'] && columns[cur]['label'].length > 1){
				var reg = new RegExp(" "+columns[cur]['label'],"gi")
				acc = acc.replace(reg,"d."+cur) //d sera utiliser comme key pour appliquer l'évaluation
			}
			return acc
		},state.expLabel)
		dispatch({type:"handleValue",value,firstData,columns})
	},[state.expLabel])
	return(
		<Grid container id="evaluationCol" style={{width:'96%'}} >
			<Typography color="secondary" variant="h6"> Laisser des espaces avant et après les noms de colonnes !! </Typography>
			<Grid item container xs={12} sm={11} md={11} lg={11} xl={10}
				id="colexp" style={{display:'flex',flexWrap:'wrap',justifyContent:'space-around',margin:'15px'}} >
				<Grid item xs={11} sm={3} md={3} lg={3} xl={3}>
				<TextField id="titreCol"
					label="Titre"
					placeholder="Nom de la colonne"
					value={state.title}
					onChange={e=>dispatch({type:"handleTitle",value:e.target.value})}
				/>
				</Grid>
				<Grid item xs={11} sm={8} md={7} lg={6} xl={6}>
				<TextareaAutosize  id="expression"
					rows={2}
					style={{width:'100%'}}
					placeholder="Expression"
					value={state.expLabel}
					onChange={e=>dispatch({type:"handleChange",value:e.target.value})} 
				/>
				</Grid>
			</Grid>
			{/*<Grid spacing={4} item xs={10} sm={8} md={6} lg={6} xl={6} id="evalCol" style={{display:'flex',marginTop:'10px'}} >*/}
				<ButtonGroup
					style={{marginBottom:'50px'}}
              		color="secondary"
              		size="medium"
              		aria-label="Colonnes"
            	>
				{ Object.keys(columns).map(col=>{ return( <Tooltip title={columns[col]['label']}>
					<Button onClick={()=>dispatch({type:"handleClick",label:columns[col]['label'],value:col})}>
						<Icon>{columns[col]['icon'] || ""}</Icon> {columns[col]['label']}
					</Button></Tooltip>)
				})}
				</ButtonGroup>
				<div style={{width:'96%',marginBottom:'50px',display:'flex',justifyContent:'space-around'}}><Typography variant="h5">Exemple :</Typography>
				{	state.example.map(ex=>{ return(
						<div style={{display:'flex',flexDirection:'column'}}>
							<Typography variant="h6">{ ex.label || ex.col }</Typography>
							<Typography variant="subtitle1">{ ex.value }</Typography>
						</div>)
					}
				)}
				</div>
			{/*</Grid>*/}
			<Button color="primary" size="large" onClick={()=>onConfirm(state.title,state.type,state.expValue)} style={{position:'absolute',bottom:12,right:12,fontSize:'1.2em'}}>
				<Icon>check</Icon> Confirmer
			</Button>
		</Grid>
	)
}

export default AddColumns