import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from '../../ErrorBoundary';
import Pies from '../Nivos/Pies';
import Bars from '../Nivos/Bars';
import Lines from '../Nivos/Lines';
import Radars from '../Nivos/Radars';
import Matrix from '../Nivos/Matrix';
import {
  FormPies, FormBars, FormLines, FormRadars, FormMatrix,
} from '../Nivos/FormGenerator';
import { Typography } from '@material-ui/core';
import {
  clientPies,
  clientLines,
  clientBMR,
  serverPies,
  serverLines,
  serverBMR,
} from '../../reducers/Functions';

const Charts = (props) => {
  const {
    title, type, schema, data, chartParams, chartProps, onChange
  } = props;
  const [params, setParams] = useState({});
  const [form,setForm] = useState(chartParams || {})
 
  useEffect(()=>{
    if(chartParams){
      eval(`${type}Update(${JSON.stringify(form)})`)
    }
  },[JSON.stringify(data)])  

  useEffect(()=>{
    onChange && onChange(params)
  },[JSON.stringify(params)])

  const pieUpdate = (obj) => {
    setForm(obj)
    if (obj.label && obj.value) {  
      var dt = schema.columns[obj.label]['type'] === 'foreign' 
        ? data.map(d=>{
          return {...d,
            [obj.label]:schema.columns[obj.label].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.label])}) ? schema.columns[obj.label].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.label])})['label'] : d[obj.label]
            }
          })
        : data
      const formattedData = clientPies(dt, obj.label, obj.value, obj.op, obj.color);
      obj.color
        ? setParams({ data:formattedData, colorKey: obj.color })
        : setParams({ data:formattedData });
    }
  };
  const radarUpdate = (obj) => {
    setForm(obj)
    if (obj.group && obj.index && obj.Y && obj.op) {
      var dt = schema.columns[obj.group]['type'] === 'foreign' 
        ? data.map(d=>{
          return {...d,
            [obj.group]:schema.columns[obj.group].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.group])}) ? schema.columns[obj.group].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.group])})['label'] : d[obj.group]
            }
          })
        : data
      const formattedData = clientBMR(dt, obj.group, obj.index, obj.Y, obj.op);
      // récupérer toutes les aretes possibles
      const keys = formattedData.reduce((acc, cur) => {
        const newk = Object.keys(cur).filter((k) => !acc.includes(k) && k !== obj.index);
        acc = acc.concat(newk);
        return acc;
      }, []);
      setParams({
        data:formattedData, index: obj.index, group: obj.group, keys,
      });
    } else {
      setParams({});
    }
  };
  const matrixUpdate = (obj) => {
    setForm(obj)
    if (obj.group && obj.index && obj.Y && obj.op) {
      var dt = schema.columns[obj.index]['type'] === 'foreign' 
        ? data.map(d=>{
          return {...d,
            [obj.index]:schema.columns[obj.index].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.index])}) ? schema.columns[obj.index].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.index])})['label'] : d[obj.index]
            }
          })
        : data
      const formattedData = clientBMR(dt, obj.group, obj.index, obj.Y, obj.op);
      // récupérer toutes les aretes possibles
      const keys = formattedData.reduce((acc, cur) => {
        const newk = Object.keys(cur).filter((k) => !acc.includes(k) && k !== obj.index);
        acc = acc.concat(newk);
        return acc;
      }, []);
      setParams({
        data:formattedData, index: obj.index, group: obj.group, keys
      });
    } else {
      setParams({});
    }
  };
  const barUpdate = (obj) => {
    setForm(obj)
    if (obj.X !== null && obj.Y !== null && obj.op !== null) {
      var dt = schema.columns[obj.index]['type'] === 'foreign' 
        ? data.map(d=>{
          return {...d,
            [obj.index]:schema.columns[obj.index].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.index])}) ? schema.columns[obj.index].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.index])})['label'] : d[obj.index]
            }
          })
        : data
      const formattedData = clientBMR(dt, obj.index, obj.X, obj.Y, obj.op);
      // récupérer toutes les aretes possibles
      const keys = formattedData.reduce((acc, cur) => {
        const newk = Object.keys(cur).filter((k) => !acc.includes(k) && k !== obj.index);
        if(newk !== obj.index){ acc = acc.concat(newk) }
        return acc;
      }, []);
      setParams({data:formattedData, index: obj.index, X: obj.X, Y: obj.Y, grouped: obj.grouped, keys});
    } else {
      setParams({});
    }
  };
  const lineUpdate = (obj) => {
    setForm(obj)
    if (obj.X && obj.Y && obj.op) {
      var dt = schema.columns[obj.id]['type'] === 'foreign' 
      ? data.map(d=>{
        return {...d,
          [obj.id]:schema.columns[obj.id].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.id])}) ? schema.columns[obj.id].possibles.find(p=>{return parseInt(p.value)===parseInt(d[obj.id])})['label'] : d[obj.id]
          }
        })
      : data
      const formattedData = clientLines(dt, obj.id || null, obj.X, obj.Y, obj.op, obj.color, obj.precision);
      let xLabel = schema ? schema.columns[obj.X].label : obj.X
      let yLabel = schema ? schema.columns[obj.Y].label : obj.Y
      let colorKey = obj.color || null
      setParams({
        data:formattedData, precision: obj.precision, interpolated: obj.interpolated, xLabel, yLabel, colorKey: obj.color
      });
    } else {
      setParams({});
    }
  };
  const display = () => {
    let allProps = {...params,...chartProps}
    switch (type) {
      case 'pie':
        return (
          <div>
            {' '}
            { !chartParams && <FormPies /*width={400} height={400}*/ schema={schema} fct={pieUpdate} /> }
            <Typography variant="h6" color="primary" style={{marginLeft:'10%'}}> {title} </Typography>
            {params.data && <Pies {...allProps} />}
            {' '}
          </div>
        );
        break;
      case 'bar':
        return (
          <div>
            {' '}
            { !chartParams && <FormBars schema={schema} fct={barUpdate} /> }
            <Typography variant="h6" color="primary" style={{marginLeft:'10%'}}> {title} </Typography>
            {params.data && <Bars {...allProps} />}
            {' '}
          </div>
        );
        break;
      case 'line':
        return (
         <div style={{width:'100%',height:'100%'}}>
            {' '}
            { !chartParams && <FormLines schema={schema} fct={lineUpdate} /> }
            <Typography variant="h6" color="primary" style={{marginLeft:'10%'}}> {title} </Typography>
            {params.data && <Lines {...allProps} />}
            {' '}
          </div>
        );
        break;
      case 'radar':
        return (
          <div /*style={{width:500,height:500}}*/>
            {' '}
            { !chartParams && <FormRadars id="radarContainer" schema={schema} fct={radarUpdate} /> }
            <Typography variant="h6" color="primary" style={{marginLeft:'10%'}}> {title} </Typography>
            {params.data && <Radars {...allProps} />}
            {' '}
          </div>
        );
        break;
      case 'matrix':
        return (
          <div>
            {' '}
            { !chartParams && <FormMatrix schema={schema} fct={matrixUpdate} /> }
            <Typography variant="h6" color="primary" style={{marginLeft:'10%'}}> {title} </Typography>
            {params.data && <Matrix {...allProps} />}
            {' '}
          </div>
        );
        break;
      default:
        return <span> Pas de type valable </span>;
    }
  };
  return display()
};
Charts.propTypes = {
  /**
   * Type de graphe (pie, lines, radar, matrix, bars...)
   */
  type: PropTypes.string,
  /**
   * Schema de la source de data depuis rules
   */
  schema: PropTypes.shape({}),
  /**
   * Les données du serveur
   */
  data: PropTypes.arrayOf( PropTypes.shape({}) ),
  /**
   * Les paramètres du chart qui permettent de calculer les formattedData (x, y, groupe....), si undefined, des formulaires permettent de les introduire
   */
  chartParams: PropTypes.shape({}),
  /**
   * Autres props du graphe (onLegendClick, onPointClick, interpollated...etc)
   */
  chartProps: PropTypes.shape({})
}
Charts.defaulProps = {
  title: "",
  data: [],
  chartParams: undefined,
  chartProps: {}
}
export default Charts;
