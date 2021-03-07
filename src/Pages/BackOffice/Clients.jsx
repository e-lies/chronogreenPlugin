import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const PlacesAutocomplete = () => {
  const {
    value,
    suggestions: { status, data },
    setValue
  } = usePlacesAutocomplete();
  
  React.useEffect(()=>{
    console.log(value,status,data)
    if(data[0]){
        getGeocode({address:data[0].description})
        .then((results) => getLatLng(results[0]))
        .then(latLng=>console.log(latLng))
        .catch(err=>console.log(err))
    }
  },[JSON.stringify(value)])
  const handleInput = e =>{
      setValue(e.target.value)
  }
  const handleSelect = ({ description }) => () => {
    // When user select a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
  };

  const renderSuggestions = () =>
    data.map(suggestion => (
        <li
          key={suggestion.place_id}
          onClick={handleSelect(suggestion)}
        >
          {suggestion.description}
        </li>
      )
    );

  return (
    <div>
      <input value={value} onChange={handleInput} />
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

  export default PlacesAutocomplete