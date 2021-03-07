import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { GeoContext } from '../../context/GeolocationContext';
import Maps from "./Maps";
import { defaultLocation, googleMapsKey } from '../../context/Params';
import { extractPos, extractAddress, circleDistance } from '../../reducers/Functions';
import { TextField, FormControl, FormLabel, IconButton, Icon, Menu } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";
/*import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';*/

const useStyles = makeStyles(theme => ({
	panel:{ backgroundColor: theme.palette.background.default,
		padding:'10px',
		overflow:'visible' },
}))
var isJsonParsable = string => {
    try {
        JSON.parse(string);
    } catch (e) {
        return false;
    }
    return true;
}

function reducer(state,action){
	switch (action.type){
		case "empty" :
			return {...state,options:[]}
		break;
		case "predictions" :		
			return {...state,options:action.options}
		break;
		case "openMap" :
			let mo = !state.mapOpened;
			return {...state,mapOpened:mo}
		break;
		/*case "fromMap" :
			return {...state, location: action.latlng, search: action.ad+" "+JSON.stringify(action.latlng)}
		break;*/
		default : return false
	}
}

export default function AutoCompAddress(props){
	const { id, defaultValue, label, displayMap, myLocation, disabled, zoom, onChange } = props;
	const context = React.useContext(GeoContext)
	const classes = useStyles();
	const {
		ready,
		value,
		suggestions: { status, data },
		//clearSuggestions,
		setValue
	  } = usePlacesAutocomplete({
		  requestOptions:{
			componentRestrictions: { country: "fr" },
			strictBounds: false
		  }
	  });
	//const [value,setValue] = React.useState(defaultValue || "")
	const [state, dispatch] = React.useReducer(reducer,{ mapOpened:false, options:[]});
	React.useEffect(()=>{ 
		context.activated && context.getGeolocation() 
		//return ()=>{ clearSuggestions() }
	},[])
	/*React.useEffect(()=>{
		console.log(value,status,data)
	},[JSON.stringify(value)])*/
	React.useEffect(()=>{ //Si le parent injecte une nouvelle adresse
		setValue(defaultValue)
		dispatch({type:'predictions',options:[]})
	},[defaultValue])
	
	
	const selectAddress = ad =>{ //réponse au format {lat:14.578963,lng:-2.98534}
		dispatch({type:'search',search:ad});
		dispatch({type:'empty'})
		fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+ad+"&key="+googleMapsKey)
		.then(prm=>{ if(prm.status < 300){
			return prm.json().then(rep=>{ 
				if(rep.status==='OK' && rep.results.length > 0){
					setValue(ad, false);
				//dispatch({type:'fromAddress',loc:rep.results[0].geometry.location}) }					
					onChange(rep.results[0].formatted_address+" "+JSON.stringify(rep.results[0].geometry.location))
				}
				else { alert("Google Maps ne peut donner de réponse \n "+rep.status) }
			})}
			else { alert("Erreur lors du traitement de la requete !"+prm.status) }
		 }).catch(err=>{ alert("Erreur "+err+" lors de la transmission de la requete !") })
	}

	const selectLocation = loc =>{ //réponse format string
		let latlng = loc['lat']+","+loc['lng']
		fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&key="+googleMapsKey)
		.then(prm=>{ if(prm.status < 300){
			return prm.json().then(rep=>{ 
				if(rep.status==='OK' && rep.results.length > 0){
					onChange(rep.results[0].formatted_address+" "+JSON.stringify(rep.results[0].geometry.location))
				}
				else { alert("Google Maps ne peut donner de réponse "+rep.status) }
			}) }
			else { alert("Erreur lors du traitement de la requete !"+prm.status) }
		 }).catch(err=>{ alert("Erreur "+err+" lors de la transmission de la requete !") })
	}
	const drgEnd = (...arg) =>{
		let pos = {lat:arg[0].latLng.lat(),lng:arg[0].latLng.lng()}  
		selectLocation(pos)
		dispatch({type:'openMap'})
	}
	const clickMap = latlng =>{
		selectLocation(latlng)
		dispatch({type:'openMap'})
	}
	const setVal = e=>{
		setValue(e.target.value)
		e.target.focus()
	}
	//let posit = value.search(/{/) > -1 && isJsonParsable(value.substr(value.search(/{/),value.length)) ? JSON.parse(value.substr(value.search(/{/),value.length)) : defaultLocation //value.replace(/(.*)(\{.*\})/,"$2")
	return(<div className="address" style={{width:'100%'}}>
		<div id={`autoCompContainer${id}`} style={{width:'100%',minWidth:300, display:'flex',justifyContent:'space-between'}}>
		<Autocomplete
			freeSolo
			id={id}
			style={{width:'100%'}}
			//disableClearable
			disabled={!ready}
			options={status==='OK' ? data.map(d=>d.description) : []}
			onChange={(e,v)=>v && v.length > 0 && selectAddress(v)}
			value={extractAddress(value)}
			//onFocus={()=>clearSuggestions()}
			renderInput={(params) => (
			<TextField
				{...params}
				color="primary"
				multiline
				//rows={value ? Math.floor(value.length/60) : 1}
				//value={value}
				label={label}
				margin="normal"
				variant="outlined"
				onChange={setVal} //{e=>handleChange(e)}
				InputProps={{ ...params.InputProps, type: 'search', autocomplete: 'off' }}
			/>
			)}
		/>
			{myLocation && <IconButton
				disabled={!context.geolocation.latLng.lat}
				color={extractPos(value,'object') && context.geolocation.latLng && circleDistance(extractPos(value,'object'),context.geolocation.latLng) < 50 ? "secondary" : "primary"}
				onClick={()=>selectLocation(context.geolocation.latLng)}
			 >
				 <Icon style={{fontSize:'2em'}}> my_location </Icon>
			 </IconButton>
		}
			{displayMap && <IconButton
				disabled={disabled || false}
				//variant="contained"
				//component="label"
				color={ state.mapOpened ? "secondary" : "primary" }
				onClick={()=>{dispatch({type:'openMap'})}} >
				<Icon style={{fontSize:'2em'}}> map </Icon>
			</IconButton>}
			</div>
			{/*state.mapOpened && <Maps idMap={`lat${id}Selector`}
		  		onError={()=>{ return(<h4>Impossible d'accéder au service Google Maps</h4>)}} 
	         	data={[{position:value, draggable:true}]}
				markers={{position:'position', onDragEnd:drgEnd}}
				center={posit}	//{state.location}
				zoom={zoom} 
				onDblClick={clickMap}
				mapStyle = {{left:0,top:0,marginLeft:'5%',width:'90%',height:'320px'}}		
	        />*/}
	    </div>
	)
}
AutoCompAddress.propTypes = {
	/** id de l'élément */
	id: PropTypes.number.isRequired,
	/** label à mettre au dessus de l'input */
	label: PropTypes.string,
	/** Valeur de l'adresse (adresse + position) */
	value: PropTypes.string,
	/** Afficher le boutton qui permet l'affichage du map avec la position actuelle comme center */
	displayMap: PropTypes.bool,
	/** Afficher le boutton qui permet la sélection de la position GPS actuelle */
	myLocation: PropTypes.bool
}	
AutoCompAddress.defaultProps={
	label: "Recherche d'adresse",
	value:"",
	displayMap: true,
	myLocation: true
}