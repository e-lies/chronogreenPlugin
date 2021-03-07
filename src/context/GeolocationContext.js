import React from 'react';

export const GeoContext = React.createContext({
	activated:true,
	geolocation:{latLng:{},altitude:0,accuracy:0,speed:0,lastReqDt:null},
	getGeolocation:()=>{return false}})

export default class GeolocationContext extends React.Component{
	state={latLng:{},altitude:0,accuracy:0,speed:0,lastReqDt:null}
	componentDidMount(){
		if(localStorage.getItem("geolocActivated")){
			this.setState({activated:true},this.getGeolocation)
		}
	}
	activateGeolocation = () =>{
		localStorage.setItem("geolocActivated",true)
		this.setState({activated:true},this.getGeolocation)
	}
	unactivateGeolocation = () =>{
		localStorage.setItem("geolocActivated",false)
		this.setState({activated:false,latLng:{},altitude:0,accuracy:0,speed:0,lastReqDt:null})
	}
	getGeolocation = () =>{
		let obj = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(rep=>{
				obj.setState({latLng:{lat:rep.coords.latitude,lng:rep.coords.longitude},
					altitude:rep.coords.altitude || 0,
					accuracy:rep.coords.accuracy,
					speed:rep.coords.speed || 0,
					lastReqDt:rep.timestamp
				})
			});
		} 
		else { obj.unactivateGeolocation()
		  	alert("Impossible d'utiliser la géolocalisation")
		}
	}
	render(){
		return(
			<GeoContext.Provider value={{geolocation:this.state, getGeolocation:this.getGeolocation}}>
				{this.props.children}
			</GeoContext.Provider>
		)
	}
}
