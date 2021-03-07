import React, {
  Component, useState, useReducer, useEffect, useMemo, Fragment,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import { CrudContext } from '../context/ServerContext';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function reducer(state, action) {
  switch (action.fct) {
    case 'affect': console.log("state = ",state," action = ",action)
      return { ...state, [action.col]: action.val };
  }
}

const selCol = (label, value, possibles, key, callback, all) => {
  return (
    <FormControl key={label} style={{ minWidth: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ""}
        onChange={(e) => {
          callback(e.target.value);
        }}
        inputProps={{ name: key, id: key }}
      >
        {' '}
        <MenuItem key="all" value={null}>
          <u>Aucun</u>
        </MenuItem>
        {possibles[key].map((p) => (
          <MenuItem key={`mi${p.label}`} value={p.value}>
            {' '}
            {p.label}
            {' '}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export function FormPies(props) {
  // Pies a besoin d'1 array d'objet de la forme {id:...,label:...,value:...,color:...}
  const { schema, fct } = props;
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, { label: null, value: null, color: null });
  useEffect(() => {
    if (state.label && state.value) {
      fct(state);
    }
  }, [JSON.stringify(state)]);
  const possibles = Object.keys(schema.columns).reduce(
    (acc, cur) => {
      if (
        schema.columns[cur].type.includes('char')
        || schema.columns[cur].type.includes('enum')
        || schema.columns[cur].type.includes('foreign')
      ) {
        acc.labels = acc.labels.concat({ label: schema.columns[cur].label || cur, value: cur });
      }
       else if (
        schema.columns[cur].type.includes('float')
        || schema.columns[cur].type.includes('decimal')
        || schema.columns[cur].type.includes('int')
      ) {
        acc.values = acc.values.concat({ label: schema.columns[cur].label || cur, value: cur });
      } else if (schema.columns[cur].type === 'color') {
        acc.colors = acc.colors.concat({ label: schema.columns[cur].label || cur, value: cur });
      }
      return acc;
    },
    { labels: [], values: [], colors: [] },
  );

  return (
    <form style={{ display: 'flex', justifyContent: 'space-around', minWidth: 520 }}>
      {selCol('Groupe', state.label, possibles, 'labels', (v) => {
        dispatch({ fct: 'affect', col: 'label', val: v });
      })}
      {selCol('Valeur', state.value, possibles, 'values', (v) => {
        dispatch({ fct: 'affect', col: 'value', val: v });
      })}
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Opération</FormLabel>
        <RadioGroup
          aria-label="opération"
          key="operation"
          value={state.op}
          onChange={(e) => {
            dispatch({ fct: 'affect', col: 'op', val: e.target.value });
          }}
        >
          <FormControlLabel value="count" control={<Radio />} label="Occurences" />
          <FormControlLabel value="sum" control={<Radio />} label="Somme" />
        </RadioGroup>
      </FormControl>
      {possibles.colors.length > 0
        && selCol('Couleur', state.color, possibles, 'colors', (v) => {
          dispatch({ fct: 'affect', col: 'color', val: v });
        })}
    </form>
  );
}
export function FormBars(props) {
  const { schema, fct } = props;
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    X: null,
    index: null,
    Y: null,
    grouped: false,
    interpolated: false,
    op: 'sum',
  });
  useEffect(() => {
    //if (state.label && state.value) {
      fct(state);
    //}
  }, [JSON.stringify(state)]);
  const possibles = Object.keys(schema.columns).reduce(
    (acc, cur) => {
      const { type } = schema.columns[cur];
      if (
        type.includes('char')
        || type.includes('foreign')
        || type.includes('enum')
        || type.includes('int')
        || type === 'date'
      ) {
        acc.xKeys.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        type.includes('char')
        || type.includes('foreign')
        || type.includes('enum')
        || type.includes('int')
        || type === 'date'
      ) {
        acc.indexes.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        schema.columns[cur].type.includes('float')
        || schema.columns[cur].type.includes('decimal')
        || schema.columns[cur].type.includes('int')
      ) {
        acc.yKeys.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      return acc;
    },
    { xKeys: [], indexes: [], yKeys: [] },
  );
  return (
    <form style={{ display: 'flex', justifyContent: 'space-around' }}>
       {selCol('X', state.X, possibles, 'xKeys', (v) => {
        dispatch({ fct: 'affect', col: 'X', val: v });
      })}
       {selCol('Regrouper par', state.index, possibles, 'indexes', (v) => {
        dispatch({ fct: 'affect', col: 'index', val: v });
      })}
      {selCol('Y', state.Y, possibles, 'yKeys', (v) => {
        dispatch({ fct: 'affect', col: 'Y', val: v });
      })}
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Opération</FormLabel>
        <RadioGroup
          aria-label="opération"
          key="operation"
          value={state.op}
          onChange={(e) => {
            dispatch({ fct: 'affect', col: 'op', val: e.target.value });
          }}
        >
          <FormControlLabel value="count" control={<Radio />} label="Occurences" />
          <FormControlLabel value="sum" control={<Radio />} label="Somme" />
          <FormControlLabel value="avg" control={<Radio />} label="Moyenne" />
          <FormControlLabel value="median" control={<Radio />} label="Médiane" />
        </RadioGroup>
      </FormControl>
      <FormControlLabel
        control={(
          <Switch
            checked={state.grouped}
            onChange={(e) => dispatch({ fct: 'affect', col: 'grouped', val: !state.grouped })}
            value={state.grouped}
            color="primary"
          />
        )}
        label="Colonnes groupées"
      />
    </form>
  );
}
export function FormLines(props) {
  const { schema, fct } = props;
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    id: null,
    X: null,
    Y: null,
    interpolated: false,
    color: null,
    precision: 'day',
    op: 'sum',
  }); // sum ou count seulement
  useEffect(() => {
   // if (state.label && state.value) {
      fct(state);
    //}
  }, [JSON.stringify(state)]);
  const possibles = Object.keys(schema.columns).reduce(
    (acc, cur) => {
      const { type } = schema.columns[cur];
      if (type.includes('char') || type.includes('enum') || type.includes("foreign") || type.includes('int')) {
        acc.id.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (type.includes('date') || type.includes('time')) {
        acc.X.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        schema.columns[cur].type.includes('float')
        || schema.columns[cur].type.includes('decimal')
        || schema.columns[cur].type.includes('int')
      ) {
        acc.Y.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (schema.columns[cur].type === 'color') {
        acc.colors.push({ label: schema.columns[cur].label, value: cur });
      }
      return acc;
    },
    {
      id: [], X: [], Y: [], colors: [],
    },
  );
  const precisionForm = () => {
    if (schema.columns[state.X] && schema.columns[state.X].type.includes('date')) {
      return (
        <>
          <FormControlLabel value="year" control={<Radio />} label="Année" />
          <FormControlLabel value="month" control={<Radio />} label="Mois" />
          <FormControlLabel value="day" control={<Radio />} label="Jour" />
        </>
      );
    } if (schema.columns[state.X] && schema.columns[state.X].type.includes('time')) {
      return (
        <>
          <FormControlLabel value="hour" control={<Radio />} label="Heure" />
          <FormControlLabel value="minute" control={<Radio />} label="Minute" />
          <FormControlLabel value="seconde" control={<Radio />} label="Seconde" />
        </>
      );
    }
  };
  return (
    <form style={{ display: 'flex', justifyContent: 'space-around' }}>
      {selCol('Regrouper par', state.id, possibles, 'id', (v) => {
        dispatch({ fct: 'affect', col: 'id', val: v });
      },"all")}
      {selCol('X', state.X, possibles, 'X', (v) => {
        dispatch({ fct: 'affect', col: 'X', val: v });
      })}
      {selCol('Y', state.Y, possibles, 'Y', (v) => {
        dispatch({ fct: 'affect', col: 'Y', val: v });
      })}
      {possibles.colors.length > 0
        && selCol('Couleur', state.color, possibles, 'colors', (v) => {
          dispatch({ fct: 'affect', col: 'color', val: v });
        })}
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Grouper par</FormLabel>
        <RadioGroup
          aria-label="précision"
          key="précision"
          value={state.precision}
          onChange={(e) => {
            dispatch({ fct: 'affect', col: 'precision', val: e.target.value });
          }}
        >
          {precisionForm()}
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Opération</FormLabel>
        <RadioGroup
          aria-label="opération"
          key="operation"
          value={state.op}
          onChange={(e) => {
            dispatch({ fct: 'affect', col: 'op', val: e.target.value });
          }}
        >
          <FormControlLabel value="count" control={<Radio />} label="Occurences" />
          <FormControlLabel value="sum" control={<Radio />} label="Somme" />
          <FormControlLabel value="avg" control={<Radio />} label="Moyenne" />
        </RadioGroup>
      </FormControl>
      <FormControlLabel
        control={(
          <Switch
            checked={state.interpolated}
            onChange={(e) => dispatch({ fct: 'affect', col: 'interpolated', val: !state.interpolated })}
            value={state.interpolated}
            color="primary"
          />
        )}
        label="Interpolation"
      />
    </form>
  );
}
export function FormMatrix(props) {
  const { schema, fct } = props;
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    group: null, index: null, Y: null, op: 'sum',
  });
  useEffect(() => {
    // if(state.label !== null && state.value !== null){
    fct(state);
    // }
  }, [JSON.stringify(state)]);
  const possibles = Object.keys(schema.columns).reduce(
    (acc, cur) => {
      const { type } = schema.columns[cur];
      if (type.includes('char') || type.includes('foreign') || type.includes('enum') || type.includes('int')) {
        acc.groups.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        type.includes('char')
        || type.includes('foreign')
        || type.includes('enum')
        || type.includes('int')
        || type === 'date'
      ) {
        acc.indexes.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        schema.columns[cur].type.includes('float')
        || schema.columns[cur].type.includes('decimal')
        || schema.columns[cur].type.includes('int')
      ) {
        acc.values.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      return acc;
    },
    { groups: [], indexes: [], values: [] },
  );
  return (
    <form style={{ display: 'flex', justifyContent: 'space-around' }}>
      {selCol('Horizontale', state.group, possibles, 'groups', (v) => {
        dispatch({ fct: 'affect', col: 'group', val: v });
      })}
      {selCol('Verticale', state.index, possibles, 'indexes', (v) => {
        dispatch({ fct: 'affect', col: 'index', val: v });
      })}
      {selCol('Valeure', state.Y, possibles, 'values', (v) => {
        dispatch({ fct: 'affect', col: 'Y', val: v });
      })}
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Opération</FormLabel>
        <RadioGroup
          aria-label="opération"
          key="operation"
          value={state.op}
          onChange={(e) => {
            dispatch({ fct: 'affect', col: 'op', val: e.target.value });
          }}
        >
          <FormControlLabel value="count" control={<Radio />} label="Occurences" />
          <FormControlLabel value="sum" control={<Radio />} label="Somme" />
          <FormControlLabel value="avg" control={<Radio />} label="Moyenne" />
          <FormControlLabel value="median" control={<Radio />} label="Médiane" />
        </RadioGroup>
      </FormControl>
    </form>
  );
}
export function FormRadars(props) {
  const { schema, fct } = props;
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, {
    group: null, index: null, Y: null, op: 'sum',
  });
  useEffect(() => {
    // if(state.label !== null && state.value !== null){
    fct(state);
    // }
  }, [JSON.stringify(state)]);
  const possibles = Object.keys(schema.columns).reduce(
    (acc, cur) => {
      const { type } = schema.columns[cur];
      if (type.includes('char') || type.includes('foreign') || type.includes('enum') || type.includes('int')) {
        acc.groups.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        type.includes('char')
        || type.includes('foreign')
        || type.includes('enum')
        || type.includes('int')
        || type === 'date'
      ) {
        acc.indexes.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      if (
        schema.columns[cur].type.includes('float')
        || schema.columns[cur].type.includes('decimal')
        || schema.columns[cur].type.includes('int')
      ) {
        acc.values.push({ label: schema.columns[cur].label || cur, value: cur });
      }
      return acc;
    },
    { groups: [], indexes: [], values: [] },
  );
  return (
    <form style={{ display: 'flex', justifyContent: 'space-around' }}>
      {selCol('Groupe', state.group, possibles, 'groups', (v) => {
        dispatch({ fct: 'affect', col: 'group', val: v });
      })}
      {selCol('Arête', state.index, possibles, 'indexes', (v) => {
        dispatch({ fct: 'affect', col: 'index', val: v });
      })}
      {selCol('Valeure', state.Y, possibles, 'values', (v) => {
        dispatch({ fct: 'affect', col: 'Y', val: v });
      })}
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">Opération</FormLabel>
        <RadioGroup
          aria-label="opération"
          key="operation"
          value={state.op}
          onChange={(e) => {
            dispatch({ fct: 'affect', col: 'op', val: e.target.value });
          }}
        >
          <FormControlLabel value="count" control={<Radio />} label="Occurences" />
          <FormControlLabel value="sum" control={<Radio />} label="Somme" />
          <FormControlLabel value="avg" control={<Radio />} label="Moyenne" />
          <FormControlLabel value="median" control={<Radio />} label="Médiane" />
        </RadioGroup>
      </FormControl>
    </form>
  );
}
