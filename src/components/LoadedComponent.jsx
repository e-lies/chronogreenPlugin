/**
 * Pass Filters component to children
 * If the child component does not support being passed the Filters component, load it with another component that will simply put Filters on top of it
 * Specifying load/<componentName/path> will indicate that
 */
import React, { Suspense, lazy, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import { Typography, CircularProgress, Tooltip, Badge, Icon, Button, Popover } from '@material-ui/core';
import ErrorBoundary from '../ErrorBoundary';
import { CrudContext } from '../context/ServerContext';
import Filtres from './Filtres';
import { nestData, filt } from '../reducers/Functions';

let idComp = '';
let MyComponent = null;
export default function LoadedComponent(props) {
  const theme = useTheme()
  const {
      component, rule, params, globalStyle, optionStyle, contentStyle, filterFromLC, filterKeys, levels, fromServer, extra, propToRender, otherProps
  } = props;
  const location = useLocation()
  const comp = component.includes("./") ? `${component}` : `./${component}`
  const context = useContext(CrudContext);
  const [visibleFilter,setVisibleFilter] = useState(false)
  const [filtre, setFiltre] = useState([]);
  const [stateParams,setStateParams] = useState(params)
  const [data, setData] = useState([]);
  // la fct key formate la clé pour récupérer les data du context
  const key = ()=>{ return stateParams && Object.keys(stateParams).length > 0 ? JSON.stringify(stateParams) : 'all' }
  
  useEffect(() => {
    //MyComponent = lazy(() => import(`${comp}`))
    let fil = location ? location.search.match(/filtre=(\[(.+)\])/) : null;//dans JSON.parse, les clés doivent etre entre ""
    let defaultFilter = "[]" // fil !== null && fil.length > 0 ? JSON.parse(unescape(fil[1])) : [];
    if(defaultFilter && JSON.parse(defaultFilter)){ setFiltre(JSON.parse(defaultFilter)) }
    idComp = context.componentCreation(component);
    context.getSchema('select', rule, idComp);
    const par = stateParams ? [{ rule, params:stateParams }] : [{ rule }];
    context.read(par, idComp);
  }, []);
  /*useEffect(()=>{
    context.getSchema('select', rule, idComp);
    const par = stateParams ? [{ rule, params:stateParams }] : [{ rule }];
    context.read(par, idComp);
  },[rule])*/
  useEffect(()=>{
    MyComponent = lazy(() => import(`${comp}`))
  },[component])
  useEffect(()=>{
    setStateParams(params)
  },[JSON.stringify(params)])
  useEffect(()=>{
    const par = stateParams ? [{ rule, params:stateParams }] : [{ rule }]
    context.read(par, idComp)
    setData(loadData())
  },[JSON.stringify(stateParams),rule])
  useEffect(()=>{ //vérifier si filtre client ou serveur
    if(fromServer){
      let keys = filtre.map(f=>f.label)
      let where = params && params.where ? params.where.filter(w=>!keys.includes(w.label)).concat(filtre) : 
      setStateParams({...stateParams,where}) //le changement de stateParams provoquera un read
    }
    else{
      setData(loadData())
    }
  },[filtre])
  useEffect(() => {
    let ld = loadData()
    console.log("update data[rule]",context.data[rule] ? context.data[rule][key()] : "walou",ld)
    setData(ld);
  }, [JSON.stringify(context.data[rule]),JSON.stringify(context.schemas.select[rule])]);
  const refFilter = React.useRef()
  const loadData = () => {
    let dt = [];
    if (context.data[rule] && context.data[rule][key()]) {
      console.log("loadData")
      dt = filtre.length > 0 && context.schemas.select[rule]
        ? filt(context.data[rule][key()].data, filtre, context.schemas.select[rule].columns)
        : context.data[rule][key()].data;
      if (levels && levels.length > 0) {
        const fctData = nestData(...levels);
        dt = fctData(dt);
      }
    }
    return dt;
  };

  const onParamsChange = (p) =>{ 
    context.read([{rule, params:p}], idComp) //va provoquer un nouveau loadData
  }
  //Component filtre qui se collera à un des élements du child
  const FilterComp = React.useMemo(()=>{
    return filterKeys ? (
      <Filtres
        inputs={context.schemas.select[rule] ? context.schemas.select[rule].columns : {}}
        keys={filterKeys}
        //confirmation
        onChange={(st) => setFiltre(st)}
      />
    ) : null
  },[rule, context.schemas.select, filterKeys, JSON.stringify(params)])
  const render = React.useCallback((x) =>{
    return(
      <Suspense className="Suspense" fallback={ <h5> {`Composant ${comp.split('/').slice(-1)[0]} en cours de chargement...`} </h5> }> 
      <MyComponent
        key={comp+rule+JSON.stringify(params)}
        data={data}
        FilterComp={ filterFromLC ? FilterComp : null}
        schema={context.schemas.select[rule] || {}} 
        onParamsChange={onParamsChange}
        {...otherProps}
      />
      </Suspense>
    )
  }, [JSON.stringify(data),context.schemas.select[rule],component,rule,JSON.stringify(propToRender)]);
  
  return ( <div className="fragmentDiv"> {/*<ErrorBoundary>*/}
    { context.schemas.select[rule] && context.data[rule] && context.data[rule][key()] ? (
    <div className="fragmentDiv">
      <div className="styleDiv" style={optionStyle}>
        { extra }
        {filterKeys && !filterFromLC && ( <div className="filters">
        <Button
          ref={refFilter}
          onClick={(e) => setVisibleFilter(!visibleFilter)}
          color={filtre.length > 0 ? 'primary' : 'secondary'}
          variant="contained"
          style={{maxHeight:36,margin:24,color:'white'}}
        >
          <Tooltip title={ filtre.map(f=>`${f.label} ${f.operator} ${f.value}`).join('\n') }>
            <Badge badgeContent={filtre.length} color="error">
              <Typography style={{marginRight:10,fontFamily:theme.typography.fontFamily}} variant="h6">
                Filtrer
              </Typography>
              <Icon 
                fontSize="large"
                style={{
                  transform: visibleFilter && 'rotate(-180deg)',
                  transition: 'transform .6s ease-in-out',
                }}
              >
                filter_list
              </Icon>
            </Badge>
          </Tooltip>
        </Button>
        <Popover
          id={`popover_${rule}`}
          open={visibleFilter}
          anchorEl={refFilter.current}
          onClose={e=>setVisibleFilter(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Filtres
            initialState={filtre}
            inputs={context.schemas.select[rule] ? context.schemas.select[rule].columns : {}}
            keys={filterKeys}
            onChange={(st) => setFiltre(st)}
          />
        </Popover>  
        </div>
        )}
        { props.children }
      </div>
      <div style={contentStyle} className="divContent">
        {render()}
      </div>
    </div>
    ) : (
        <div style={{width:'100%',height:400,display:'flex',justifyContent:'center',alignItems:'center'}}>
          <CircularProgress color="secondary" size={120} />
        </div>
    )
  }
  {/*</ErrorBoundary>*/} </div>
  )
}
LoadedComponent.propTypes = {
  /**
   * Type de composant
   */
  component: PropTypes.string.isRequired,
  /**
   * Rule à utiliser pour charger
   */
  rule: PropTypes.string.isRequired,
  /**
   * Params à ajouter au moment du Read(colonnes, filtres, group...etc)
   */
  params: PropTypes.object,
  /**
   * Style à appliquer au bloc principal
   */
  globalStyle: PropTypes.shape(),
  /**
   * Style du bloc contenant le children et le filtre
   */
  optionStyle: PropTypes.shape(),
  /**
   * Style à appliquer au conteneur interne 
   */
  contentStyle: PropTypes.shape(),
  /**
   * Les keys de data avec lesquels filtrer, si undefined, aucun component Filtre ne sera généré
   */
  filterKeys: PropTypes.array,
  /**
   * Le chargement se fait-il coté client ou serveur
   */
  fromServer: PropTypes.bool,
  /**
   * S'ils existent, la data sera transformée en arbre hiérarichique avec des children
   */
  levels: PropTypes.array,
  /**
   * Passer ou pas le component Filtre au child
   */
  filterFromLC: PropTypes.bool,
  /**
   * Elément à ajouter au début si nécéssaire
   */
  extra: PropTypes.element,
  /**
   * Variables qui doivent déclencher un render si elles changent (on peut mettre plusieurs variables dans un array, le changement d'1 seule, déclenchera un rerender)
   */
  propToRender: PropTypes.array,
  /**
   * Les props à ajouter au component
   */
  otherProps: PropTypes.object,
};
LoadedComponent.defaultProps = {
  fromServer: false,
  params: undefined,
  filterFromLC: false,
  otherProps: {},
  globalStyle: {width:'100%'},
  optionStyle: {display:'flex',padding:6},
  contentStyle: {width:'100%'},
  extra: <span> </span>
}
// export default LoadedComponent;
