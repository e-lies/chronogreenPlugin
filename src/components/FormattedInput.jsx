import React from 'react';
import MaskedInput from 'react-text-mask';

export default function FormattedInput({format, showMask}){
    return(
        <MaskedInput
            mask={format}
            showMask={showMask}
        />
    )
}