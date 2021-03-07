/*import React, { Component, useReducer, useEffect, useContext } from "react";
import Select from "react-select";
import * as fcts from '../../reducers/Functions';
import { IconButton, Icon, Tooltip, Typography, FormControl, FormLabel } from '@material-ui/core';
import ClientTab from './ClientTab';

function reducer(state,action){
	switch(action.type){
		case "groupCols" :
			let groupCols = action.groupCols.map(g=>g.value)
			return {...state,groupCols}
		break;
		case "newOp" :
			return {...state,opCols:state.opCols.concat({col:null,op:null,label:null})}
		break;
		case "deleteOp" :
			let opCols = [...state.opCols]
			opCols.splice(action.index,1)
			return {...state,opCols}
		break;
		case "opCols" :
			let opc = [...state.opCols]
			if(action.oc === 'op'){ opc[action.index]['label'] = action.label }
			opc[action.index][action.oc] = action.value
			return {...state,opc}
		break;
		case "data" :
			return {...state,groupedData:action.data,groupedColumns:action.columns}
		break;
		default : return false
	}
}

const GroupBy = props =>{
	const { columns, data } = props
	//groupedColumns est le l'équivalent du schema.columns pour le tableau groupé
	const [state,dispatch] = useReducer(reducer,{groupCols:[],opCols:[],groupedData:[],groupedColumns:{}})
	
	useEffect(()=>{ if(state.groupCols.length > 0){
		let fct = fcts.nestData(state.groupCols)
		let grps = fct(data);
		for(let i = 0; i < grps.length; i++){
			state.opCols.map(oc=>{ if(oc.col !== null && oc.op !== null){
				//let opLabel = operations[fcts.globalType(columns[oc.col]['type'])].filter(p=>p.value===oc.op)[0]['label']
				grps[i][oc.op+"("+oc['col']+")"] = grps[i]['children'][oc['op']](oc['col'])
			  }
			  return false
			})
		}
		let grpData = [...grps];
		grpData.map(g=>{ delete g['children']; return false })
		//recréer les columns du new tableau
		let groupedColumns = new Object();
		state.groupCols.map(gc=>{ groupedColumns[gc] = columns[gc]; return false })
		state.opCols.map(oc=>{
		 	if(oc.col !== null && oc.op !== null){
		 	 let op = operations[fcts.globalType(columns[oc.col]['type'])]
			 groupedColumns[oc.op+"("+oc.col+")"] = {label:oc.label+"("+columns[oc.col]['label']+")",type:columns[oc.col].type}
			}
			return false
		})
		
		dispatch({type:'data',data:grpData,columns:groupedColumns})
		}
	},[JSON.stringify(state.groupCols),JSON.stringify(state.opCols)])
	
	const options = Object.keys(columns).map(col=>{
		return  {label:columns[col]['label'],value:col}
	})
	const operations = {number:[
		{label:'Minimum',value:'minim'},{label:'Maximum',value:'maxim'},{label:'Somme',value:'sum'},{label:'Moyenne',value:'avg'},{label:'Médiane',value:'median'}
		],
		date:[
			{label:'Minimum',value:'minim'},{label:'Maximum',value:'maxim'},{label:'Moyenne',value:'avgDate'},{label:'Médiane',value:'medianDate'}
		],
		time:[
			{label:'Minimum',value:'minim'},{label:'Maximum',value:'maxim'},{label:'Moyenne',value:'avgDate'},{label:'Médiane',value:'medianDate'}			
		],
		text:[
			{label:'Différents',value:'count'}
		]		
	}
	return(
		<div>
		<div id="grouping" style={{display:'flex',justifyContent:'start'}}>
			<FormControl component="fieldset" style={{minWidth:'312px'}} >
	          <FormLabel component="legend">
	           <Icon>format_list_bulleted</Icon> Regroupement 
	          </FormLabel>
	          <Select             
	            name="selGroupColumns"
	            isSearchable
	            isClearable
	            isMulti
	            placeholder="Choisissez les colonnes"
	            required
	            onChange={ e=>{dispatch({type:'groupCols',groupCols:e})} }
	            label="Choisir"
	            options={options}
	            fullWidth
	         // styles={customStyles}
	            value={options.filter(opt=>state.groupCols.includes(opt.value))}
	          />
	        </FormControl>
	        <Tooltip title="Ajouter une colonne de calcul">
	        	<IconButton onClick={e=>dispatch({type:'newOp'})} color="primary"><Icon fontSize="large">add</Icon></IconButton>
	        </Tooltip>
			<div id="opCols" style={{width:'100%',display:'flex'}} >
			{ state.opCols.map((oc,i) =>{
				return(
					<div key={`oc${i}`} style={{marginLeft:'15px'}} >
					<FormControl component="fieldset" style={{minWidth:'200px',minHeight:'125px',display:'flex',flexDirection:'column',justifyContent:'space-around'}} >
						<FormLabel component="legend">
						 <IconButton color="secondary" onClick={e=>dispatch({type:'deleteOp',index:i})}><Icon>delete</Icon></IconButton>
						 	Calcul {i}
						</FormLabel>
						<Select key={`col${i}`}
							fullWidth
							isSearchable={false}
							placeholder="Choisir une colonne"
							required
							options={options.filter(opt=>Object.keys(operations).includes(fcts.globalType(columns[opt['value']]['type'])) ) }
							value={options.filter(opt=> opt.value === oc['col'])[0] || null}
							onChange={ e=>dispatch({type:'opCols',oc:'col',index:i,value:e.value}) }			
						/>
						<Select key={`op${i}`}
							fullWidth
							isSearchable={false}
							placeholder="Choisir une opération"
							required
							options={state.opCols[i]['col'] !== null ? operations[fcts.globalType(columns[state.opCols[i]['col']]['type'])] : []}
							value={state.opCols[i]['col'] !== null ? operations[fcts.globalType(columns[state.opCols[i]['col']]['type'])].filter(ope=> ope.value === oc['op'])[0] : null}
							onChange={ e=>dispatch({type:'opCols',oc:'op',index:i,label:e.label,value:e.value}) }			
						/>
					</FormControl>
					</div>
				)				
			})}
			</div>
			</div>
			{state.groupedData.length > 0 &&(
				<ClientTab 
					schema={{columns:state.groupedColumns}}
					data={state.groupedData}
					filterKeys={[]}
				/>
			)}
		</div>
	)
}
export default GroupBy*/