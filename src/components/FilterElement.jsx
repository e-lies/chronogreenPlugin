import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Icon, IconButton } from '@material-ui/core';
import { globalType } from '../reducers/Functions';
import Inputs from './Inputs';

const useStyles = makeStyles((theme) => ({
    form: { marginTop: '10px', marginBottom: '10px', padding: '8px' },
    grid: {
      margin: 12,
      display: 'flex',
      flexWrap: 'wrap',
    },
    group: {
      padding: '4px',
    },
    unique: {
      display: 'flex',
      justifyContent: 'flex-around',
      minWidth: '200px',
    },
  }));

export default function FilterElement(props){
    const { ind, label, column, value, onChange, disabled, errors, extension } = props;
    const classes = useStyles()
    const handleChange = (e, op) =>{
        let val;
        if (e === null) {
            // cas du vidage d'un <Select
            val = null;
          } else if (column.type.includes('date') || column.type.includes('time')) {
            val = column.type === 'time' ? `${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}` : e;
          } else if (column.type.includes('foreign')) {
            val = e.map((m) => m.value);
          } else {
            val = e.value || e.target.value;
          }
        onChange(val ? [...value.filter(v=>v.operator!==op),...[{label,operator:op,value:val}]] : value.filter(v=>v.operator!==op))
    }   
    if (['text','foreign'].includes(globalType(column.type))) { 
        const op = column.type.includes('foreign') ? 'in' : 'like';
        const exp = 'contient';
        return (
          <Grid id={`grid${label}`} item className={classes.unique}>
            <Inputs
              autoFocus={ind === 0}
              key={`${column.label || label}(${exp})`}
              id={`inp_${ind}`}
             // widthCoef={width}
              filtre
              disabled={disabled}
              type={['address','geo','enum','set'].includes(column.type) ? "varchar" : column.type}
              possibles={column.possibles || []}
              icon={column.icon || null}
              value={value && value[0] && value[0]['value'] ? value[0]['value'] : ''}
              label={`${column.label || label}(${exp})`}
              error={errors}
              onChange={(e) => handleChange(e, op)}
            />
            { extension(label,column,value) }
          </Grid>
        );
    } else if (["number","date","time"].includes(globalType(column.type))) {
        return (
          <Grid id={`grid${label}`} item className={classes.unique}>
            <div className={classes.group}>
            {!column.filtrable || column.filtrable.includes('min') && (<Inputs
              key={`${column.label}(>=)`}
              id={`inp_${ind}`}
              autoFocus={ind === 0}
             // widthCoef={width}
              filtre
              disabled={disabled}
              type={column.type}
              possibles={column.possibles || []}
              icon={column.icon || null}
              value={value && value.filter(v=>v.operator==='>=').length > 0 ? value.filter(v=>v.operator==='>=')[0]['value'] : ''}
              label={`${column.label || label}(>=)`}
              error={errors}
              onChange={(e) => handleChange(e, '>=')}
            />)}
            {!column.filtrable || column.filtrable.includes('max') && (<Inputs
              key={`${column.label || label}(<)`}
              id={`inp_${ind}f`}
             // widthCoef={width}
              filtre
              disabled={disabled}
              type={column.type}
              possibles={column.possibles || []}
              icon={column.icon || null}
              value={value && value.filter(v=>v.operator==='<=').length > 0 ? value.filter(v=>v.operator==='<=')[0]['value'] : ''}
              label={`${column.label || label}(<=)`}
              error={errors}
              onChange={(e) => handleChange(e, '<=')}
            />)}
            </div>
            { extension(label,column,value) }
          </Grid>
        );
    }
    else{
      return (<h5>Filtre indisponible</h5>)
    }  
}
FilterElement.propTypes = {
    
}
FilterElement.defaultProps = {
    value: [],
    ind: -1,
    extension: null,
}