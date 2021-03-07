/*import React, { Component, useContext, useReducer, useEffect } from "react";
import { CrudContext } from '../context/ServerContext';
import { DisplayCols, Pagination, TabHeader, TableauBody } from "./Tableaux/Tableau";
import Filtres from './Filtres';
import { globalType, filt } from '../reducers/Functions';
import CircularProgress from '@material-ui/core/CircularProgress';

function reducer (state,action){
	switch(action.type){
		case "load" :
			const idComp = action.context.componentCreation("ServerTab");
			action.context.getSchema("select",action.rule)
			return {...state,idComp}
		break;
		case "filter" : 

		break;
		case "rows" :

		break;
		case "page" :

		break;
		case "checked" :

		break;
		default : { console.log("Action inconnue")
			return state
		}
	}
}

const sorting = (data,scheme,col) =>{
	
}

const ClientTableau = props =>{ //stats = ['pie', 'bar', 'line'.....]
	//group et checkable sont des booléens
	const { data, cols, rule, lineFunctions, hidden, checkable, group, globalFct, stats } = props;
	const context = useContext(CrudContext)
	if(cols === undefined){ cols = context.schemas.select[rule] ? Object.keys(context.schemas.select[rule].columns) : [] }
	const [state,dispatch] = useReducer(reducer,{idComp:null,rows:5,page:1,rpp:5,filters:[],order:[],checked:[]})
	useEffect(()=>{
		dispatch({type:"load",rule,context,cols})
		return ()=>{
			context.destroyComponent(state.idComp)
		}
	},[])
	
	useEffect(()=>{
		context.read([{rule,params:{cols:[{col:cols[0],alias:'count',op:"COUNT"}]}}],state.idComp)
		//context.read({rule,cols:colsObj,limit:[0,state.rpp]},state.idComp)
	},[state.idComp,JSON.stringify(state.filters),JSON.stringify(state.order)])
	
	useEffect(()=>{
		let colsObj = cols.map(c=>{return {col:c}})
		let count = context.data[rule][JSON.stringify([{rule,params:{cols:[{col:cols[0],alias:'count',op:"COUNT"}]}}])];
		context.read([{rule,params:{cols:colsObj,}}],state.idComp)
		let pages = Math.ceil(count/state.rpp);

		context.read()
	},[context.data[rule][JSON.stringify([{rule,params:{cols:[{col:cols[0],alias:'count',op:"COUNT"}]}}])]])


	return(<div id={state.idComp}>
			{ context.readLoad.includes(state.idComp) && 
			(<div style={{display:'relative',backgroundColor:"#555",opacity:0.25}}><CircularProgress color="secondary" />
			</div>) }
					
		</div>
	)
}*/