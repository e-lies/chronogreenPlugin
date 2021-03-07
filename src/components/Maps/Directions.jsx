import React from 'react';
import PropTypes from 'prop-types';
import { DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { extractPos } from '../../reducers/Functions';
import Maps from './Maps';

export default function Directions(props){
    const { id, data, directionAddresses, addressKey, mapsProps } = props;
    const [responses,setResponses] = React.useState([])
    
    const directionsCallback = (response,index)=>{
        if(response){
            if(response.status==='OK'){
                let resp = [...responses]
                resp[index] = response
                setResponses(resp)
            }
            else{ alert("Maps directionsService failed "+response.status) }
        }
    }

    return(
        <Maps
            idMap={id}
            data={data}
            onError={()=>{ return(<h4>Impossible d'accéder au service Google Maps</h4>)}} 
            {...mapsProps}
        >
            {directionAddresses.map((arrayAddress,index)=>{
                return(<React.Fragment>
                    <DirectionsService
                        // required
                        options={{
                            destination: extractPos(data[arrayAddress[arrayAddress.length-1]][addressKey]),
                            origin: extractPos(data[arrayAddress[0]][addressKey]),
                            travelMode: "DRIVING",
                            waypoints: arrayAddress.slice(1,-1).map(waypoint=>({
                                location: extractPos(data[arrayAddress[waypoint]][addressKey]),
                                stopover: true
                            }))
                           }}
                        // required
                           callback={r=>directionsCallback(r,index)}
                           // optional
                           onLoad={directionsService => {
                            console.log('DirectionsService onLoad directionsService: ', directionsService)
                        }}
                        onUnmount={directionsService => {
                            console.log('DirectionsService onUnmount directionsService: ', directionsService)
                        }}
                    />     
                    {responses[index] && <DirectionsRenderer
                        // required
                        options={{
                            directions: responses[index]
                        }}
                        // optional
                        onLoad={directionsRenderer => {
                            console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                        }}
                        // optional
                        onUnmount={directionsRenderer => {
                            console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                        }}
                    />}     
                </React.Fragment>)
            })}
        </Maps>
    )
}

Directions.propTypes = {
    /** id du composant Maps */
    id: PropTypes.number,
    /** Array de données avec dans chacun, une key d'adresse (ou de position latLng) */
    data: PropTypes.arrayOf(PropTypes.shape({})),
    /** Array d'array (avec les indexs des objets de data) des addresses à suivre pour dessiner la road */
    directionAddresses: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    /** D'autres props pour destinés à l'objet <Maps */
    mapsProps: PropTypes.shape({
        markers: PropTypes.shape({
            position: PropTypes.string.isRequired,
            icon: PropTypes.string,
            onDragEnd: PropTypes.func,
            onClick: PropTypes.func,
            onMouseOver: PropTypes.func,
            onMouseOut: PropTypes.func,
          }),
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
    })
}
Directions.defaultProps = {
    center: undefined,
}