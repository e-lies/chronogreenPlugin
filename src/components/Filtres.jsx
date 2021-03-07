import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import Bouttons from './Bouttons';
import { useSize } from '../reducers/Hooks';
import Inputs from './Inputs';

const useStyles = makeStyles((theme) => ({
  form: { marginTop: '10px', marginBottom: '10px', padding: '8px' },
  grid: {
    margin: 12,
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: theme.palette.background.paper,
  },
  group: {
    height: '125px',
    padding: '4px',
    // backgroundColor: theme.palette.background.paper
  },
  unique: {
    display: 'flex',
    alignItems: 'column',
    justifyContent: 'center',
    height: '125px',
    minWidth: '200px',
    // backgroundColor: theme.palette.background.paper
  },
}));
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export default function Filtres(props) {
  // inp = {age:{type:'int',operators:['>','<']},Nom:{type:'varchar(40)',operators:['like']},Poste:{type:'foreign',operators:['in'],possibles:[{label:'operateur',id:1},{label:'ingenieur',id:2}]}]}}
  // defaultWidth est 12 par défaut mais peut changer si le container du filtre est + petit par exemple
  //vriant can be client, withConfirm, server
  const {
    title, confirmation, inputs, keys, disabled, spacing, widthCoef, initialState, onChange,
  } = props;
  const classes = useStyles();
  const [stateInput, setStateInput] = useState(inputs);
  const [state, setState] = useState(initialState || []);
  const [errors, setError] = useState([]);
  
  useEffect(() => {
    const k = keys === undefined ? Object.keys(inputs) : keys;
    // ne garder que les éléments affichables et transfomer les set/enum/foreign en foreigns
    const si = Object.keys(inputs).reduce((acc, cur) => {
      if (k.includes(cur)) {
        acc[cur] = { ...inputs[cur] };
        if (acc[cur].type.includes('enum') || acc[cur].type.includes('set')) {
          const pos = acc[cur].type
            .replace(/(\w+)\((.+)\)/, '$2')
            .replace(/'/gi, '')
            .split(',')
            .reduce((a, c) => a.concat({ label: c, value: c }), []);
          acc[cur].possibles = pos;
          acc[cur].type = 'foreigns';
        }
        if (acc[cur].type === 'foreign') {
          acc[cur].type = 'foreigns';
        }
      }
      return acc;
    }, {});
    setStateInput(si);
  }, [JSON.stringify(inputs), keys]);
  useEffect(() => {
    if(!confirmation || state.length === 0){
      onChange(state) 
    }
  }, [JSON.stringify(state)]);

  const handleChange = (e, type, label, operator) => {
    let val;
    const st = [...state];
    const err = [...errors];
    if (e === null) {
      // cas du vidage d'un <Select
      val = null;
    } else if (type.includes('date') || type.includes('time')) {
      val = type === 'time' ? `${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}` : e;
    } else if (['foreigns','autocompletes'].includes(type)) {
      val = e.map((m) => m.value);
    } else {
      val = e.value || e.target.value;
    }
    if (type.includes('int') || type.includes('float') || type.includes('decimal')) {
      const oop = operator === '>' ? '<' : '>';
      const other = state.filter((s) => s.label === label && s.operator === oop);
      if (!isNumeric(val) && !err.includes(label)) {
        setError(err.concat(label));
      } else if (other.length > 0) {
        if (
          ((operator === '>' && val > other[0].value)
            || (operator === '<' && val < other[0].value))
          && !err.includes(label)
        ) {
          setError(err.concat(label));
        } else {
          setError(
            err.filter((er) => er !== label),
          );
        }
      } else {
        setError(
          err.filter((er) => er !== label),
        );
      }
    }
    const ft = st.filter((f) => f.label !== label || f.operator !== operator);
    const fil = val !== null && val !== '' ? ft.concat({ label, operator, value: val }) : ft;
    setState(fil);
  };
  const prp = {
    color: 'secondary',
    icon: 'refresh',
    callback: () => {
      setState([]);
    },
  };
  const { width } = useSize("filterGrid")
  return (
    <Grid id="filterGrid" container className={classes.grid} spacing={spacing || 0}>
      { title && <Typography variant="h5" style={{marginLeft:'10%'}}> {title} </Typography> }
      {Object.keys(stateInput).map((input,ind) => {
        const inp = stateInput[input];
        if (
          inp.type.includes('varchar')
          || inp.type.includes('text')
          || inp.type.includes('foreign')
          || inp.type.includes('autocomplete')
        ) {
          const op = inp.type === 'foreigns' || inp.type === 'autocompletes' ? 'in' : 'like';
          const exp = 'contient';
          const search = state.filter((s) => s.label === input);
          return (
            <Grid id={`grid${input}`} item className={classes.unique}>
              <Inputs
                autoFocus={ind === 0}
                key={`${inp.label}(${exp})`}
                id={`inp_${ind}`}
                widthCoef={width}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(inp.label) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp].length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={search.length > 0 ? search[0].value : ''}
                label={`${inp.label || input}(${exp})`}
                //error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, input, op)}
              />
            </Grid>
          );
        } if (
          inp.type.includes('int')
          || inp.type.includes('float')
          || inp.type.includes('decimal')
        ) {
          const min = state.filter((s) => s.label === input && s.operator === '>');
          const max = state.filter((s) => s.label === input && s.operator === '<');
          return (
            <Grid id={`grid${input}`} item className={classes.group}>
              {(!inp.filtrable || inp.filtrable.includes('min')) && (<Inputs
                key={`${inp.label}(>)`}
                id={`inp_${ind}`}
                autoFocus={ind === 0}
                widthCoef={width}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(input) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={min.length > 0 ? min[0].value : ''}
                label={`${inp.label || input}(>)`}
                //error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, input, '>')}
              />)}
              {(!inp.filtrable || inp.filtrable.includes('max')) && (<Inputs
                key={`${inp.label}(<)`}
                id={`inp_${ind}f`}
                widthCoef={width}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(input) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={max.length > 0 ? max[0].value : ''}
                label={`${inp.label || input}(<)`}
                //error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, input, '<')}
              />)}
            </Grid>
          );
        } if (inp.type.includes('date') || inp.type.includes('time')) {
          const debut = state.filter((s) => s.label === input && s.operator === 'debut');
          const fin = state.filter((s) => s.label === input && s.operator === 'fin');
          return (
            <Grid id={`grid${input}`} item className={classes.group}>
              {(!inp.filtrable || inp.filtrable.includes('min')) && (<Inputs
                key={`${inp.label}(debut)`}
                id={`inp_${ind}`}
                autoFocus={ind === 0}
                widthCoef={width}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(input) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={debut.length > 0 ? debut[0].value : null}
                label={`${inp.label || input}(debut)`}
                //error={errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, input, 'debut')}
              />)}
              {(!inp.filtrable || inp.filtrable.includes('max')) && (<Inputs
                key={`${inp.label}(fin)`}
                id={`inp_${ind}f`}
                widthCoef={width}
                filtre
                disabled={
                  disabled !== undefined && (disabled.includes(input) || disabled === [])
                }
                type={inp.type}
                possibles={inp.possibles || []}
                // length = {inp.length === undefined ? 50 : inputs[inp].length}
                icon={inp.icon || null}
                value={fin.length > 0 ? fin[0].value : null}
                label={`${inp.label || input}(fin)`}
                //{errors[inp]}
                // required = {inputs[inp].required || false}
                onChange={(e) => handleChange(e, inp.type, input, 'fin')}
              />)}
            </Grid>
          );
        }
      })}
      <Grid container xs={6} sm={4} md={3} lg={2} xl={1} style={{width:80,display:'flex',justifyContent:'space-between'}}>
        <Bouttons {...prp} />
        { confirmation && <Bouttons icon="check" color="primary" callback={()=>onChange(state)} /> }
      </Grid>
    </Grid>
  );
}
