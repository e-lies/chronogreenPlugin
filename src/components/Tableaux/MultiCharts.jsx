import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, IconButton, Icon, FormControl, Select, MenuItem, InputLabel,  } from '@material-ui/core';
import { CrudContext } from '../../context/ServerContext';
import Charts from './Charts';
import LoadedComponent from '../LoadedComponent';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

var idComp = "MultiCharts"

export default function MultiCharts(props){
    const { rules, defaultParams, filterKeys, propsForAll } = props
    const classes = useStyles()
    const [list,setList] = useState([])
    const server = useContext(CrudContext)
    useEffect(()=>{
        idComp = server.componentCreation("MultiCharts")
        rules.forEach(rule=>{
            server.getSchema('select',rule,idComp)
        })
    },[])
    return(
        <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <IconButton onClick={()=>setList(list.concat({type:'pie'}))}>
                <Icon color="primary" style={{fontSize:'1.5em'}}> add_circle </Icon>
            </IconButton>
            {
                list.map((chart,i)=>{ return(
                    <div style={{width:'100%',display:'flex',flexDirection:'column'}}>
                        <div style={{width:'100%',display:'flex',justifyContent:'space-around'}}>
                        <IconButton onClick={()=>setList(list.filter((l,ind)=>ind!==i))}>
                            <Icon color="error" size="medium"> delete </Icon>
                        </IconButton>
                        {
                            rules.length > 1 && (
                                <FormControl className={classes.formControl}>
                                    <InputLabel id={`TypeChart${i}`}> Source: </InputLabel>
                                    <Select
                                        labelId={`RuleChart${i}`}
                                        id={`RuleChart${i}`}
                                        className={classes.selectEmpty}
                                        value={chart['rule'] || null}
                                        onChange={e=>{ 
                                            let lst = [...list];
                                            lst[i]['rule'] = e.target.value;
                                            setList(lst)
                                        }}
                                    >
                                        { rules.map(rule=>(<MenuItem value={rule}> {server.schemas.select[rule] ? server.schemas.select[rule]['name'] : rule} </MenuItem>) ) }
                                    </Select>
                                </FormControl>
                            )
                        }
                        <FormControl className={classes.formControl}>
                            <InputLabel id={`TypeChart${i}`}> Graphe: </InputLabel>
                            <Select
                                labelId={`TypeChart${i}`}
                                id={`SelectChart${i}`}
                                 className={classes.selectEmpty}
                                value={chart['type'] || null}
                                onChange={e=>{ 
                                    let lst = [...list];
                                    lst[i]['type'] = e.target.value;
                                    setList(lst)
                                }}
                            >
                                <MenuItem value="pie">Camembert</MenuItem>
                                <MenuItem value="bar">Colonnes</MenuItem>
                                <MenuItem value="line">Temporel</MenuItem>
                                <MenuItem value="radar">Radar</MenuItem>
                                <MenuItem value="matrix">Matrice</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                        {(chart['rule'] || rules.length === 1) && (<LoadedComponent
                            component="./Tableaux/Charts"
                            rule={chart['rule'] || rules[0]}
                            params={defaultParams}
                            filterKeys={filterKeys}
                            otherProps={{
                                ...propsForAll,
                                type:chart['type']
                            }}
                            propToRender={JSON.stringify(list[i])}
                        />) }
                    </div>)
                })
            }
        </div>
    )
}

MultiCharts.propTypes = {
  /**
   *  rules utilisé cmme source de données 
   */
    rules: PropTypes.arrayOf(PropTypes.string).isRequired,
  /**
   * Paramètres par défaut de filtrage, tri, limites...etc (qui peuvent etre l'etat d'un tableau par exemple)
   */
    defaultParams: PropTypes.shape({
        distinct: PropTypes.bool,
        cols: PropTypes.arrayOf(PropTypes.shape({
            col: PropTypes.string.isRequired,
            op: PropTypes.string,
            alias: PropTypes.string
        })),
        where: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            operator: PropTypes.string.isRequired,
            value: PropTypes.any.isRequired
        })),
        order: PropTypes.arrayOf(PropTypes.shape({
            col: PropTypes.string.isRequired,
            ordre: PropTypes.string
        })),
        group: PropTypes.arrayOf(PropTypes.string)
    }),
    /**
     * Clés de filtrage
     */
    filterKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * props à appliquer à tous les charts (onLegendClick, onPointClick, interpollated...etc)
     */
    propsForAll: PropTypes.shape(),
}
MultiCharts.defaultProps = {
    defaultParams:undefined,
    propsForAll:{},
    filterKeys:[]
}