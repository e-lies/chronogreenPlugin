import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AutoCompAddress from './AutoCompAddress';
import Directions from "./Directions";

export default function Addresses(props){
    const { id, data, labelKey, addressKey, onAddressesChange, mapsProps } = props
    const [addresses,setAddresses] = useState(data)

    useEffect(()=>{ //Mettre à jour les données changées depuis le parent
        let updated = data.map((d,i)=>{
            return {...addresses[i],d}
        })
        setAddresses(updated)
    },[JSON.stringify(data)])

    useEffect(()=>{
        onAddressesChange(addresses)
    },[JSON.stringify(addresses)])

    const onChange = (e,i)=>{
        let adr = [...addresses]
        adr[i] = {...adr[i],[addressKey]:e}
        setAddresses(adr)
    }

    return(
        <div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap-reverse'}}>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start'}}>
            {addresses.map((point,i)=>{return(
                <AutoCompAddress
                    id={`${id}_address${i}`}
                    label={point[labelKey] || `Adresse${i}`}
                    value={point[addressKey] || null}
                    displayMap={false}
                    onChange={e=>onChange(e,i)}
                />
            )})}
            </div>
            <Directions
                id={`addressMap_${id}`}
                data={addresses}
                directionAddresses={[]}
                addressKey="Address"
                mapsProps={mapsProps}
            />
        </div>
    )
}
Addresses.propTypes = {

}
Addresses.defaultProps = {
    defaultAddresses: [],
    mapsProps: {}
}