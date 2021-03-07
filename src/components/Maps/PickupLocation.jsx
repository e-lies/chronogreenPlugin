import React from "react";
import Maps from "./Maps";
import { defaultLocation } from '../../context/Params';
import { TextField, FormControl, FormLabel, Button, Icon }	from "@material-ui/core";

const PickupLocation = props =>{
	const { id, label, disabled, center, zoom, onDblClick, markers } = props;
	const [mapOpened, toggleMap] = React.useState(false)
	const [location, setLocation] = React.useState(center || null)	//React.useState(center || defaultLocation)
	
	const opclMap = () =>{ toggleMap(!mapOpened) }
	const clickMap = latlng =>{
		toggleMap(false)
		setLocation(latlng)
		onDblClick && onDblClick(latlng)
	}
	const onChange = (e,coor) =>{ 
		let loc = {...location};
		loc[coor] = parseFloat(e.target.value);
		setLocation(loc)
	}
	const moFct = d=>{ console.log(d) }
	const drgEnd = (...arg) =>{
		let pos = {lat:arg[0].latLng.lat(),lng:arg[0].latLng.lng()}  
		toggleMap(false)
		setLocation(pos)
		onDblClick && onDblClick(pos)
	}
	return(
		<FormControl component="fieldset" style={{border:'2px solid gray', padding:'10px',position:'none'}}>
          <FormLabel style={{marginLeft:'15px'}} component="legend"> {label} </FormLabel>
          <TextField id={`lat${id}`} coor="lat" type="number" inputProps={{step:0.00001}}
           label={`Latitude ${label}`} value={(location && location['lat']) || ""} onChange={e=>onChange(e,'lat')}  />
          <TextField id={`lng${id}`} coor="lng" type="number" step={0.00001}
           label={`Longitude ${label}`} value={(location && location['lng']) || ""} onChange={e=>onChange(e,'lng')}  />
           <Button
            disabled={disabled || false}
            variant="contained"
            component="label"
            color={ mapOpened ? "secondary" : "primary" }
            onClick={opclMap}>
              <Icon> location_on </Icon>
          </Button>
		  { mapOpened && <Maps idMap={`lat${id}Selector`} 
		  		onAutocomplete={(a,pos)=>{console.log(a); setLocation(pos)}}
				//data={location ? [location] : []}
				markers={{position:'location'}}
        	    center={location} zoom={zoom} onDblClick={clickMap}
				mapStyle = {{left:0,top:0,width:'300px',height:'300px'}}		
           	>
           	{props.children}
           	</Maps> 
          }
        </FormControl>	
	)
}
export default PickupLocation