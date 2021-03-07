import React, { useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  MarkerClusterer,
  Autocomplete,
} from '@react-google-maps/api';
import { Image } from 'image-js';
import { GeoContext } from '../../context/GeolocationContext';
import { googleMapsKey, defaultLocation, defaultZoom, path } from '../../context/Params';
import { extractPos } from '../../reducers/Functions';

var dm = []
export default function Maps(props) {
  // data = [{id:...,name:...,photo:'rt4e6.jpg',géolocalistion:'{lat:21.4785,lng:1.20347}'},....]
  // markers = {position:"géolocalisation", icon: 'photo', onClick:clickFct, onMouseOver: moFct, onMouseOut: outFct} donne les propriétés des markers
  const {
    data,
    markers,
    idMap,
    mapStyle,
    center,
    zoom,
    onError,
    onClick,
    onDblClick,
    onAutocomplete,
  } = props;
  const geoContext = useContext(GeoContext);
  const [autoc, setAutoc] = useState(null);
  const [centr,setCentr] = useState()
  useEffect(()=>{
    if(geoContext.geolocation.latLng){
      console.log("geo = ",geoContext.geolocation)
      setCentr(center || geoContext.geolocation.latLng)
    }
  },[JSON.stringify(geoContext.geolocation)])
  // markers = [{lat:....,lng:....}]
  const { isLoaded, loadError } = useLoadScript({
    libraries: ['places'],
    googleMapsApiKey: googleMapsKey,
    // ...otherOptions
  });
  const [dataMarker,setDataMarker] = useState([])
  useEffect(() => {
	  setCentr(center || defaultLocation)
  },[])
  useEffect(() => {
    dm = []
    setMarkers()
    geoContext.getGeolocation()
  }, [JSON.stringify(data)])
  useEffect(()=>{
    setDataMarker(dm)
  },[dm])
  
  const setMarker = (m) =>{
    let markerProps = Object.keys(markers).reduce((acc,mark)=>{acc[mark]=m[markers[mark]]; return acc},{})
    markerProps.position = extractPos(m[markers.position],"object")
    if(markerProps.position){
      if (markers.onDragEnd) {
        markerProps.onDragEnd = (pos) => markers.onDragEnd(pos, m);
      }
      if (markers.onClick) {
        markerProps.onClick = () => markers.onClick(m);
      }
      if (markers.onMouseOver) {
        markerProps.onMouseOver = () => markers.onMouseOver(m);
      }
      if (markers.onMouseOut) {
        markerProps.onMouseOut = () => markers.onMouseOut(m);
      }
      markerProps.opacity = 0.75;
      // markerProps.shape = shape;
      markerProps.animation = 'BOUNCE';
      return markerProps
    }
    else{
      return {}
    }
  }
  const setMarkers = ()=>{
    //setDataMarker([])
	  data.length > 0 && data.map((m) => {
     // let dm = [...dataMarker]
      if (markers.icon) {
        Image.load(path+m[markers.icon]).then(img=>{ return img.resize({width:36,height:36}) }).then(icon=>{
          let markerProps = setMarker(m)
          markerProps.icon = icon.toDataURL()
          dm.push(markerProps)
          //setDataMarker(dm.concat(markerProps))
        }).catch(err=>{ 
          let markerProps = setMarker(m)
          dm.push(markerProps)
          //setDataMarker(dm.concat(markerProps))
         })
      }
      else{
        let markerProps = setMarker(m)
        //setDataMarker(dm.concat(markerProps))
        dm.push(markerProps)
      }
	  })
  }

  const renderMap = () => {
    function onLoad(mapInstance) {
      console.log('map loaded');
    }
    const autocomLoad = (autocomplete) => {
      setAutoc(autocomplete);
    };
    const clk = (r) => {
      if (onClick !== undefined) {
        const pos = { lat: r.latLng.lat(), lng: r.latLng.lng() };
        onClick && onClick(pos);
      }
      return false;
    };
    const dbclk = (r) => {
      if (onDblClick !== undefined) {
        const pos = { lat: r.latLng.lat(), lng: r.latLng.lng() };
        onDblClick && onDblClick(pos);
      }
      return false;
    };
    
    return (<div>
      <GoogleMap
        id={idMap || 'myMap'}
        // options={options}
        onLoad={onLoad}
        center={centr}
          //{center || (geoContext.geolocation && geoContext.geolocation.latLng) || defaultLocation}
        mapContainerStyle={mapStyle || { margin: '30px', height: '400px', width: '800px' }}
        onClick={clk}
		    onDblClick={dbclk}
		   // onCenterChanged={}
        zoom={zoom || defaultZoom}
      >
        <Autocomplete
          onLoad={autocomLoad}
          onPlaceChanged={() => {
            if (autoc !== null && onAutocomplete) {
              onAutocomplete(autoc.getPlace(), {
                lat: autoc.getPlace().geometry.location.lat(),
                lng: autoc.getPlace().geometry.location.lng(),
              });
            } else {
              console.log('no autocomplete');
            }
          }}
        >
          <input
            type="text"
            placeholder="Rechercher un endroit"
            style={{
              display: onAutocomplete ? 'inline' : 'none',
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px',
            }}
          />
        </Autocomplete>
        <MarkerClusterer imagePath="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png">
		  {(clusterer) => 
			dataMarker.map(dm=>{
        dm.clusterer = clusterer
				return <Marker {...dm} />
			})
		  }
        </MarkerClusterer>
        {geoContext.geolocation && (
          <Marker
            opacity={0.75}
            position={geoContext.geolocation.latLng}
            icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
          />
        )}
        {props.children || null}
      </GoogleMap>
      </div>
    );
  };
  if (loadError) {
    return onError ? onError() : <div>Map cannot be loaded right now, sorry.</div>;
  }

  return isLoaded ? renderMap() : <h4>Map non chargé</h4>;
}
Maps.propTypes = {
	/**
   * Google Map component's ID
   */
  data: PropTypes.arrayOf(PropTypes.shape()),
  markers: PropTypes.shape({
    position: PropTypes.string.isRequired,
    icon: PropTypes.string,
    onDragEnd: PropTypes.func,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
  }),
  idMap: PropTypes.string.isRequired,
 	/**
   * The center position. Tqkes your default GPS positioh by default or the one in params
   */ 
  center: PropTypes.shape(),
  /**
   * Default zoom
   */
  zoom: PropTypes.number,
  /**
   * Styles object
   */
  mapStyle: PropTypes.shape(),
  /**
   * Callback fired whene the maps can't be loaded (executed in the parent component)
   */
  onError: PropTypes.func,
  /**
   * Callback fired upon clicking on a location
   */
  onClick: PropTypes.func, 
  /**
   * Callback fired upon double clicking on a location
   */
  onDblClick: PropTypes.func,
  /**
   * Callback fired whene a location is selected from the autocompletion input
   */
  onAutocomplete: PropTypes.func,
};
Maps.defaultProps = {
  data: [],
  markers: { position: 'Position' },
  zoom: defaultZoom,
  mapStyle: null,
  //center: defaultLocation,
  onError: ()=>alert("Impossible de charger le maps"),
  onClick: ()=>false,
  onDblClick: ()=>false,
  onAutocomplete: null,
};
