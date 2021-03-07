import React, { Component, useReducer, useEffect, useState, useContext } from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CrudContext } from '../../context/ServerContext';
import { useSize } from '../../reducers/Hooks';
import Charts from './Charts';
import ClientTab from './ClientTab';
import Stats from './Stats';
import SpeedDials from './SpeedDials';
import Alerts from '../Alerts';
import GroupBy from './GroupBy';
import AddColumn from './AddColumn';
import { ExportToCsv } from 'export-to-csv';
import { Icon, IconButton, Drawer, List, ListSubheader, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	header: {
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
	},
	check: { 
		color: theme.palette.secondary.main
	},
	checked: {
    color: theme.palette.secondary.light,
    textShadow: '2px',
  },
  unchecked: {
    color: theme.palette.text.disabled,
    //fontWeight:'bold',
 },
 	alerts: {	
		//minWidth: 360,
		backgroundColor: theme.palette.secondary.main,
		color: theme.palette.secondary.contrastText
  	}
}))

const DisplayCols = props=>{
    const { open, title, schema, cols, hidden, visibleIcon, hiddenIcon, changeVisibility, onClose } = props;
    const classes = useStyles()
    const checkedIcon = (label)=>{  return !hidden || !hidden.includes(label) }
    return(
        <div id="DisplayCols">
        <Drawer anchor="left" open={open}>
            <List style={{width:260}}
            	subheader={<ListSubheader style={{display:'flex',justifyContent:'space-between'}}>
            		 { title } <IconButton onClick={onClose}><Icon>clear</Icon></IconButton>
            		</ListSubheader>}
            >
              {cols.map((text, index) => {let cls=checkedIcon(text) ? classes.checked : classes.unchecked;
                return(<ListItem button key={text} onClick={()=>changeVisibility(text)} >
                  <ListItemIcon className={cls} > <IconButton aria-label="colonnes">
                      {checkedIcon(text) ? <Icon className={classes.checked}>{visibleIcon}</Icon> : <Icon className={classes.unchecked}>{hiddenIcon}</Icon> }
                  </IconButton></ListItemIcon>
                  <Typography variant="subtitle2" className={cls}>{schema.columns[text]['label'] || text}</Typography>
                </ListItem>)}
              )}
            </List>
        </Drawer>
        </div>    
    )
}

function reducer(state,action){
	switch(action.type){
		case "load" : 
			let fil = action.location ? action.location.search.match(/filtre=\[(.+)\]/) : null;//dans JSON.parse, les clés doivent etre entre ""
			let defaultFilter = fil !== null && fil.length > 0 ? JSON.parse(unescape(fil[0].split('tre=')[1])) : [];
			let idComp = action.context.componentCreation("StatClientTab")
			action.context.getSchema("select",action.rule)
			action.context.read([{rule:action.rule,params:action.contextParams}],idComp,true)
			let saved = localStorage.getItem(`stat${action.id}`)
			if(!saved){ localStorage.setItem(`stat${action.id}`,"{}"); saved = localStorage.getItem(`stat${action.id}`) }
			return {...state,idComp,functions:action.functions,backups:JSON.parse(saved),defaultFilter}
		break;
		case "schema" :
			return {...state,schema:action.schema,filterKeys: state.filterKeys === [] ? Object.keys(action.schema) : state.filterKeys}
		break;
		case "visibility" :
			return {...state,visibility:!state.visibility}
		break;
		case "hidden" :
			let hidden = !state.hidden.includes(action.col) ?
				state.hidden.concat(action.col) : state.hidden.filter(h=>h!==action.col)
			return {...state,hidden}
		break;
		case "filterConf" :
			return {...state,filterConf:!state.filterConf}
		break;
		case "filterKeys" :
			let filterKeys = !state.filterKeys.includes(action.col) ?
				state.filterKeys.concat(action.col) : state.filterKeys.filter(f=>f!==action.col)
			return {...state,filterKeys}
		break;
		case "fonction" :
			return {...state,fonction:action.fonction,dataFonction:action.data}
		break;
		case "addCol" :
			return {...state,addCol:true}
		break;
		case "newCol" :
			var schema = {...state.schema}
			schema.columns[action.title] = {label:action.title,type:action.colType}
			//let expressions = [...state.expressions]
			return {...state,schema,expressions:state.expressions.concat(action),addCol:false}
		break;
		case "rpp":
			return {...state,rpp:action.rows}
		break;
		case "displayBackup" :
			return {...state,saved:true}
		break;
		case "addBackup" :
			let addBackup = {...state.backups,[action.name]:{schema:state.schema,filterKeys:state.filterKeys,hidden:state.hidden,expressions:state.expressions,rpp:state.rpp}}
			localStorage.setItem(`stat${action.id}`,JSON.stringify(addBackup))
			return {...state, backups:addBackup}
		break;
		case "deleteBackup" :
			let deleteBackup = {...state.backups}
			delete deleteBackup[action.name]
			localStorage.setItem(`stat${action.id}`,JSON.stringify(deleteBackup))
			return {...state, backups:deleteBackup}
		break;
		case "setBackup" : 
			schema = {...state.schema}
			if(state.backups[action.name]['expressions']){
				state.backups[action.name]['expressions'].forEach(exp=>{ 
					schema.columns[exp['title']] = { label: exp['title'], type: exp['colType'] }
				})
			}
			let setBackup = state.selectedBackup === action.name 
				? { hidden: action.props.hidden, filterKeys: action.props.filterKeys, expressions: [] } 
				: state.backups[action.name]
			let newName = state.selectedBackup === action.name ? null : action.name
			return {...state,...setBackup,schema,selectedBackup:newName}
		break;
		case "close" :
			return {...state,addCol:false,charts:null,saved:false}
		break;
		default : { alert(action.type); console.log("Fonction inconnue !");
			return state
		}
	}
}

const options = { 
	fieldSeparator: ';',
	quoteStrings: '"',
	decimalSeparator: '.',
	showLabels: true, 
    showTitle: true,
	title: 'My Awesome CSV',
	useKeysAsHeaders: true,
  };
const handleExport = data =>{
	let name = window.prompt("Comment souhaitez-vous nommer le fichier qui contiendra ces "+data.length+" enregistrements?");		
	if(name && name !== null){
		let opt = {...options}
		opt['title'] = "Export de "+data.length+" enregistrements";
		opt['filename'] = name;
		const csvExporter = new ExportToCsv(opt);
		 csvExporter.generateCsv(data);
	 }
}

const StatClientTab = props =>{ //stats [{id:['min','max','sum','avg'],name:['count']}] si un key à comme valeur [], ça veut dire toute les fct possibles selon le type
	//contextParams donne d'éventuels paramètres supplémantaires pour le data context (cols, where, group, order)
	const { id, title, rule, contextParams, stats, charts, groupBy, exportation, location, tableProps } = props; 
	//charts = ["pie","bar","radar","line","matrix"]
	//let fk = filterKeys || []
	const context = useContext(CrudContext)
	const classes = useStyles()
	const { width, isMobile } = useSize()
	const [state,dispatch] = useReducer(reducer,
		{idComp:'',
		 rpp: tableProps.defaultRpp || 5,
		 schema:{},
		 filterConf:false,
		 filterKeys: (tableProps && tableProps.filterKeys) || [],
		 defaultFilter: [],
		 hidden: (tableProps && tableProps.hidden) || [],
		 visibility:false,
		 fonction:null,
		 colConf:false,
		 functions:[],
		 dataFonction:[],
		 addCol:false,
		 expressions:[],
		 backups: {},
		 selectedBackup: null,
		 saved:false
		})
	useEffect(()=>{
		let functions = [];
		if(charts !== undefined){
			functions =	[{icon:'pie_chart',title:'Camembert',classes:classes.alerts,fonction:'pie',fct:data=>dispatch({type:'fonction',data,fonction:'pie'})},
				{icon:'bar_chart',title:'Diagramme',classes:classes.alerts,fonction:'bar',fct:data=>dispatch({type:'fonction',data,fonction:'bar'})},
				{icon:'multiline_chart',title:'Courbes',classes:classes.alerts,fonction:'line',fct:data=>dispatch({type:'fonction',data,fonction:'line'})},
				{icon:'wifi_tethering',title:'Radar',classes:classes.alerts,fonction:'radar',fct:data=>dispatch({type:'fonction',data,fonction:'radar'})},
				{icon:'view_comfy',title:'Matrice',classes:classes.alerts,fonction:'matrix',fct:data=>dispatch({type:'fonction',data,fonction:'matrix'})}
			].filter(ch=>{ return charts.includes(ch.fonction) });
		}
		if(groupBy){ 
			functions.push({icon:'account_tree',title:'Regrouper',classes:classes.alerts,fonction:"groupBy",fct:data=>dispatch({type:'fonction',data,fonction:"groupBy"})})
		}
		if(stats){
			functions.push({icon:'format_list_numbered_rtl',title:'Statistiques',classes:classes.alerts,fonction:"stats",fct:data=>dispatch({type:'fonction',data,fonction:"stats"})})
		}
		if(exportation){
			functions.push({icon:'cloud_download',title:'Exporter',fct:data=>handleExport(data)})
		}
		dispatch({type:"load",rule,id,context,functions,contextParams,location})
	},[,rule,JSON.stringify(contextParams)])
	
	useEffect(()=>{
		dispatch({type:'schema',schema:context.schemas.select[rule]})
	},[rule,context.schemas.select[rule]])
	const saveConfig = (name) =>{
		let saved = localStorage.getItem(`stat${title}`)
		if(!saved){ localStorage.setItem(`stat${title}`,"{}"); saved = localStorage.getItem(`stat${title}`) }
		let nSaved = {...JSON.parse(saved),[name]:state}
		localStorage.setItem(`stat${title}`,JSON.stringify(nSaved))
	}
	const dials = [{icon:'visibility',label:'Visibles',color:'secondary',fct:()=>dispatch({type:'visibility'})},
			{icon:'filter_list',label:'Filtres',color:'secondary',fct:e=>dispatch({type:'filterConf'})},
			{icon:'post_add',label:'Créer une colonne',color:'secondary',fct:()=>dispatch({type:'addCol'})},
			{icon:'save',label:'Enregistrer cette config',color:'secondary',fct:()=> dispatch({type:"displayBackup"})}
	];
	const contextDataKey = contextParams ? JSON.stringify(contextParams) : "all"
	const theme = useTheme()

	const sd = () =>{
		return( <div style={{paddingBottom:32,paddingLeft:10,maxWidth:48}}>
			<SpeedDials 
				//tooltipOpen={parseInt(document.body.clientWidth) < 400}
				speedProps={{FabProps:{size:"small",style:{backgroundColor:theme.palette.secondary.main,position:'absolute',marginLeft:-20}}}}
				tooltipPlacement="right"
				icon="build"
				iconRotation={width < 600 ? 225 : 135}
				direction={width < 600 ? "down" : "right"}
				label="Configuration tableau"
				actions={dials}
			/></div>)
	}

	let columns = context.schemas.select[rule] ? context.schemas.select[rule].columns : {}
	let cf = tableProps['checkedFunctions'] || []
	return(
		<div id="statTab">
		  <ClientTab
			/*headerStyle={theme=>{
				return {backgroundColor:theme.palette.secondary.light,color:theme.palette.secondary.contrastText}
			}}*/
			{...tableProps}
			id={id}
			hidden={state.hidden}
			filterKeys={state.filterKeys}
			defaultRpp={state.rpp}
			checkColor="secondary"
			onChangeRowsPerPage={(rows)=>{ dispatch({type:'rpp',rows}) }}
			//caption={caption || null}
			tools={[sd]}
			schema={context.schemas.select[rule] || {}}
			data={context.data[rule] && context.data[rule][contextDataKey] ? context.data[rule][contextDataKey]['data'] : []}
			expressions={state.expressions}
			checkedFunctions={[...cf,...state.functions]}
		  />
		  <DisplayCols key="visColumns"
			title="Colonnes visibles"
			open={state.visibility}
			schema={context.schemas.select[rule] || {}}
			cols = {context.schemas.select[rule] ? Object.keys(context.schemas.select[rule]['columns']) : []}
			hidden={state.hidden}
			visibleIcon="visibility"
			hiddenIcon="visibility_off"
			changeVisibility={col=>dispatch({type:'hidden',col})}
			onClose={()=>dispatch({type:"visibility"})}
		  />
		  <DisplayCols key="visFilters"
			title="Filtres actifs"
			open={state.filterConf}
			schema={context.schemas.select[rule] || {}}
			cols={context.schemas.select[rule] ? Object.keys(context.schemas.select[rule]['columns']) : []}
			hidden={context.schemas.select[rule] ? Object.keys(context.schemas.select[rule]['columns']).filter(f=>!state.filterKeys.includes(f)) : []}
			visibleIcon="filter_list"
			hiddenIcon="power_off"
			changeVisibility={col=>dispatch({type:'filterKeys',col})}
			onClose={()=>dispatch({type:"filterConf"})}
		  />
		  <Drawer anchor="top" open={state.addCol}>
			<div className={classes.alerts} style={{display:'flex',justifyContent:'space-between',marginBottom:'15px'}}>
				<Icon> post_add </Icon>
				<Typography variant="h5"> Créer une nouvelle colonne </Typography>
		  		<IconButton color="inherit" onClick={()=>dispatch({type:"close"})}><Icon>clear</Icon></IconButton>
			</div>
			<AddColumn
		  		columns={context.schemas.select[rule] ? context.schemas.select[rule]['columns'] : {}}
		  		firstData={context.data[rule] && context.data[rule][contextDataKey] ? context.data[rule][contextDataKey]['data'][0] : []} 
		  		onConfirm={(title,colType,exp)=>dispatch({type:'newCol',title,colType,exp})}
		  	/>
		  </Drawer>
		  <Alerts id="dialogSaved"
		  	type="info"
			draggable={true}
			open={state.saved}
			handleClose={()=>dispatch({type:"close"})}
			onOk={()=>dispatch({type:"close"})}
			headerFooterFormat={{title:'Configurations sauvegardées',icon:'save'}}
		  >
			  <List style={{width:260}}
			  	component="nav"
            	subheader={<ListSubheader style={{display:'flex'}}>
					<IconButton
						color="primary" 
						onClick={()=>{ let name = window.prompt("Donnez un nom à la configuration actuelle"); if(name){ dispatch({type:"addBackup",id,name}) } }}
					>
						<Icon fontSize="large"> add_circle </Icon>
					</IconButton>
            		</ListSubheader>}
            >
				  { Object.keys(state.backups).map(bck=>{
					return(
						<ListItem button key={`back${bck}`}>
							{ state.selectedBackup === bck && <Icon color="secondary" style={{marginRight:8}}>check</Icon> }
							<ListItemText onClick={()=>dispatch({type:"setBackup",name:bck,props},alert(`Configuration ${bck} ${bck === state.selectedBackup ? "désactivée" : "appliquée"} !`)/*, dispatch({type:"close"})*/ )}>
								{bck} 
							</ListItemText> 
							<ListItemIcon 
								onClick={()=>{let conf = window.confirm("Supprimer cette configuration ?"); if(conf){ dispatch({type:"deleteBackup",id,name:bck}) }}}
							>
								<IconButton color="secondary"> <Icon fontSize="large"> delete </Icon> </IconButton>
							</ListItemIcon>
							<Divider />
						</ListItem>
					)  
				  }) }
			  </List>
		  </Alerts>
		  <Alerts id="dialogCharts" width={ state.fonction === "bar" ? "auto" : 500 } height="auto"
		  	draggable={width > 520 && ["bar","line","matrix"].includes(state.fonction) ? false : true}
		  	fullScreen={width < 520 || ["bar","line","matrix"].includes(state.fonction)}
		  	open={charts && charts.includes(state.fonction)}
			handleClose={()=>dispatch({type:"fonction",fonction:null})}
			headerFooterFormat={state.functions.filter(f=>f.fonction===state.fonction)[0]}
		  >
			<Charts type={state.fonction} schema={context.schemas.select[rule]} data={state.dataFonction} />
		  </Alerts>
		  <Alerts id="dialogGroup"
		  	fullScreen
		  	open={state.fonction === "groupBy"}
			handleClose={()=>dispatch({type:"fonction",fonction:null})}
			headerFooterFormat={state.functions.filter(f=>f.fonction===state.fonction)[0]}
		  >
			<GroupBy 
				columns={Object.keys(columns).reduce((acc,cur)=>{ 
					if(!state.hidden || !state.hidden.includes(cur)){ acc[cur]=columns[cur] }
					return acc}	, {})}
				data={state.dataFonction}
			/>
		  </Alerts>
		  <Alerts id="dialogStat"
		  	fullScreen
		  	open={state.fonction === "stats"}
			handleClose={()=>dispatch({type:"fonction",fonction:null})}
			headerFooterFormat={state.functions.filter(f=>f.fonction===state.fonction)[0]}
		  >
			<Stats schema={context.schemas.select[rule]} data={state.dataFonction} />
		  </Alerts>
		</div>
	)
}
StatClientTab.defaultProps = {
	exportation: true,
	tableProps: {}
}
export default StatClientTab