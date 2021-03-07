import React from "react";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import * as fcts from '../../reducers/Functions';
import { Paper, GridList, GridListTile, ListSubheader, Button, Typography, Icon } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
  	backgroundImage: "linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-StOzRIvzTZlm0JACmxSxjPO2ZCefmPRRYy-rrRi8UNK4xHkw&s)",
  },
  grid: {
  	//width:600,height:600,
  	width:'100%',
	//backgroundColor: theme.palette.background.paper
  }, 
  subheader: {
  	
  	//opacity: 0.5
  },
  numbers: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    margin: '1%',
    width: '300px',
    height: '240px'
  },
  texts: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    margin: '1%',
    width: '300px',
    height: '90px'
  },
  dates: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    margin: '1%',
    width: '300px',
    height: '180px'
  },
  bigScreen:{ maxWidth: '30%' },
  middleScreen:{ maxWidth: '49%' },
  littleScreen:{ maxWidth: '95%' }
}))

const typeOperations = {
	text:{Occurences:'count'},
	number:{Min:'min',Max:'max',Somme:'sum',Moyenne:'avg',Médiane:'median'},
	date:{Min:'min',Max:'max',Moyenne:'avg'}
}
const globalType = type =>{
	if(type.includes("int") || type.includes("float") || type.includes("decimal")){
		return "number"
	}
	else if(type.includes("date")){
		return "date"
	}
	else if( type === "time"){
		return "time"
	}
	else if(type.includes("image")){
		return "image"
	}
	else if(type === "color"){
		return "color"
	}
	else{
		return "text"
	}
}

const Stats = props =>{
	const { computeLevel, data, schema } = props; //computeLevel sera client ou server
	const [selected,setSelected] = React.useState({})
	const classes = useStyles()
	React.useEffect(()=>{
		let sel = Object.keys(schema.columns).reduce((acc,cur)=>{ acc[cur] = {}; return acc },{})
		console.log("sel = ",sel)
		setSelected(sel)
		//return setSelected({}) //vider dés qu'il y'a un nouveau render
	},[])
	const setValues = (value,type,col) =>{
		let sel = {...selected}
		if(sel[col] === undefined){
			sel[col] = new Object()
		}
		sel[col][type] = value
		setSelected(sel)
	}
	const selectAll = () =>{
		let op = document.getElementsByClassName("colStats");
		for(let i = 0; i < op.length; i++){
			op[i].click()
		}
	}
	const setColumn = col =>{
		let op = document.getElementsByClassName(`${col}Stat`)
		for(let i = 0; i < op.length; i++){
			setTimeout(op[i].click(),100*i)
		}
	}
	const operation = col =>{
		let type = globalType(schema.columns[col]['type'])
		switch(type){
			case "number" : {
				return(<GridListTile key={`${col}Stats`} rows={3} className={classes.numbers} >
					<ul> <div style={{display:'flex'}}> <Icon>{schema.columns[col]['icon']}</Icon> <Typography variant="h5">
						<Button color="inherit" className={`colStats`} onClick={e=>{setColumn(col)}} > {col} </Button>
					   </Typography></div>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.minim(col),'Minimum',col)}}> Minimum : </Button><b> { selected[col] && selected[col]['Minimum'] || "?" }</b></li>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.maxim(col),'Maximum',col)}}> Maximum : </Button><b> { selected[col] && selected[col]['Maximum'] || "?" }</b></li>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.sum(col),'Somme',col)}}> Somme : </Button><b> { selected[col] && selected[col]['Somme'] || "?" }</b></li>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.avg(col),'Moyenne',col)}}> Moyenne : </Button><b> { selected[col] && selected[col]['Moyenne'] || "?" }</b></li>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.median(col),'Médiane',col)}}> Médiane : </Button><b> { selected[col] && selected[col]['Médiane'] || "?" }</b></li>
					</ul>	      
			    </GridListTile>
			)}		
			break;
			case "date" : {
				return(<GridListTile key={`${col}Stats`} rows={2} className={classes.dates} >
					<ul> <div style={{display:'flex'}}> <Icon>{schema.columns[col]['icon']}</Icon> <Typography variant="h5">
						<Button color="inherit" className={`colStats`} onClick={e=>{setColumn(col)}} > {col} </Button>
					   </Typography></div>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.minim(col),'Minimum',col)}}> Minimum : </Button><b> { selected[col] && selected[col]['Minimum'] || "?" }</b></li>
						<li> <Button className={`${col}Stat`} onClick={e=>{setValues(data.maxim(col),'Maximum',col)}}> Maximum : </Button><b> { selected[col] && selected[col]['Maximum'] || "?" }</b></li>
						<li> <Button className={`${col}Stat`} onClick={e=>{setValues(data.avgDate(col),'Moyenne',col)}}> Moyenne : </Button><b> { selected[col] && selected[col]['Moyenne'] || "?" }</b></li>
						<li> <Button className={`${col}Stat`} onClick={e=>{setValues(data.medianDate(col),'Médiane',col)}}> Médiane : </Button><b> { selected[col] && selected[col]['Médiane'] || "?" }</b></li>
					</ul>	      
			    </GridListTile>
			 )}
			break;
			case "time" : {
				return(<GridListTile key={`${col}Stats`} rows={2} className={classes.dates} >
					<ul> <div style={{display:'flex'}}> <Icon>{schema.columns[col]['icon']}</Icon> <Typography color="inherit" variant="h5">
						<Button className={`colStats`} onClick={e=>{setColumn(col)}} > {col} </Button>
					    </Typography></div>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.minim(col),'Minimum',col)}}> Minimum : </Button><b> { selected[col] && selected[col]['Minimum'] || "?" }</b></li>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.maxim(col),'Maximum',col)}}> Maximum : </Button><b> { selected[col] && selected[col]['Maximum'] || "?" }</b></li>
					</ul>	      
			    </GridListTile>
			 )}
			break;
			default : {
				return(<GridListTile key={`${col}Stats`} rows={1} className={classes.texts} >
					<ul> <div style={{display:'flex'}}> <Icon>{schema.columns[col]['icon']}</Icon> <Typography variant="h5">
						<Button color="inherit" className={`colStats`} onClick={e=>{setColumn(col)}} > {col} </Button>
						</Typography></div>
						<li><Button className={`${col}Stat`} onClick={e=>{setValues(data.different(col),'Différents',col)}}> Différents : </Button><b> { selected[col] && selected[col]['Différents'] || "?" }</b></li>
					</ul>	      
			    </GridListTile>
			)}
		}
	}
	return( <Paper elevation="2" className={classes.paper}>
		<GridList spacing={10}
			cellHeight={80}
			//className={classes.grid}
			cols={document.body.clientWidth > 750 ? 3 : (document.body.clientWidth > 368 ? 2 : 1)}
		>
			<GridListTile 
				key="Subheader"
				cols={document.body.clientWidth > 750 ? 3 : (document.body.clientWidth > 368 ? 2 : 1)}
			 	//className={classes.subheader}
			 >
	          <ListSubheader component="h4" style={{width:'33%'}}>
	          	<Button color="primary" onClick={e=>selectAll()}> 
	          		<Icon>format_list_numbered_rtl</Icon><Typography style={{fontWeight:'bold'}} variant="h5"> Statistiques </Typography>
	          	</Button>
	          </ListSubheader>
	        </GridListTile>
	        <div style={{width:'100%',height:'auto',display:'flex',justifyContent:'space-around',flexWrap:'wrap'}} >
			{ Object.keys(schema.columns).map(col =>{
				return( operation(col) )
			  })
			}
			</div>
		</GridList>
		</Paper>
	)
}
Stats.defaultProps = {
	computeLevel: 'client'
}
export default Stats