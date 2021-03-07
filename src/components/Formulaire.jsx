import React, {
    Component, useState, useContext, useEffect, useMemo,
  } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { CrudContext } from '../context/ServerContext';
//import Formul from './Formul';
import FormRow from './FormRow';
import { Button, IconButton, Icon, Typography, CircularProgress, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    title: {
        color: theme.palette.primary.main,
        margin: 4
    },
    rows: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    reset: {
        //backgroundColor: theme.palette.error.main,
        color: theme.palette.secondary.contrastText,
        margin: 22,
        fontWeight: theme.typography.fontWeightRegular,
    },
    save: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        margin: 22,
        fontWeight: theme.typography.fontWeightRegular,
    }
}))

let idComp = ""
const typeTypes = {insert:"insert",update:"update",updates:"update",clone:"insert"}

const DefaultFooter = (props) =>{
    const { data, onValidate, reset } = props
    const classes = useStyles()
    return( <div style={{margin:12,width:'100%',display:'flex',justifyContent:'space-around'}}>
        <Button size="large" variant="contained" color="secondary" onClick={reset} className={classes.reset}>
        <Icon style={{marginRight:10}}>settings_backup_restore</Icon> <Typography variant="subtitle2"> Annuler </Typography>
        </Button>
        <Button size="large" variant="contained" color="primary" onClick={onValidate} className={classes.save}>
        <Icon style={{marginRight:10}}>save</Icon> <Typography variant="subtitle2"> Valider </Typography>
        </Button>
    </div>)
}

export default function Formulaire(props){
    const { 
        id, title, Header, type, rule, where, defaultData, inputProps, complement, hidden, FooterElement, addRows, errors, deletable, onChange, onEnter, condChange, condSave, callback
    } = props
    const classes = useStyles()
    const server = useContext(CrudContext)
    const [original,setOriginal] = useState([])
    const [state,setState] = useState(defaultData)
    const [resets,setResets] = useState(0)
    const [files,setFiles] = useState(new FormData())
    
    useEffect(()=>{
        idComp = server.componentCreation(`${type}_${rule}`)
        server.getSchema(typeTypes[type],rule,idComp,true)
        let dd = defaultData || [{}]
        setState(dd)
        let pop = ['update','clone'].includes(type)
        if(pop){ server.populate(typeTypes[type],rule,where,idComp,true) }
    },[])

    useEffect(()=>{ 
        let orgData = []
        let w = where ? JSON.stringify(where) : 'all'
        if(server.popData[typeTypes[type]][rule] && server.popData[typeTypes[type]][rule][w.replace(/"/gi, '')]) {
            orgData = server.popData[typeTypes[type]][rule][w.replace(/"/gi, '')].data
        }
        /*if(defaultData){ 
            orgData.forEach((od,i)=>{ 
                if(defaultData[i]) { od = {...od,...defaultData[i]} }
            })
        }*/
        setOriginal(orgData) 
    },[JSON.stringify(server.popData[typeTypes[type]])])
    
    useEffect(()=>{
        let st = [...state]
        defaultData.forEach((dd,i)=>{ 
           st[i] = st[i] ? {...st[i],...dd} : dd
        })
        setState(st)
    },[JSON.stringify(defaultData)])
    
    useEffect(()=>{
        onChange(state)
    },[JSON.stringify(state)])

    const handleChange = (val,i,key) =>{
        let b = condChange(i,key,val,state)
        if(b){ //permet d'empécher des changement interdits
            let sta = [...state]
            sta[i] = {...sta[i],[key]:val}
            setState(sta)
        }
   }
   const removeLine = (i) =>{
       let st = [...state]
       //delete st[i]
       st.splice(i,1)
       setState(st)
   }
   const addRow = () =>{ //à l'ajout d'une ligne elle prendra le premier defaultData s'il existe (si différent, il faudra le changer coté parent)
       let dd = defaultData ? defaultData[0] : {}
       setState(state.concat(dd))
   }
   const handleFiles = (fls,id,key) =>{
        let fl = files
        if (!server.schemas[typeTypes[type]][rule]['columns'][key]['type'].includes('image')) {
            fl.delete(`${idComp}_${key}_${id}`);
        }
        for (let i = 0; i < fls.length; i++) {
            fl.append(`${idComp}_${key}_${id}[]`, fls[i]);
        }
        setFiles(fl)
   }
   function reset(){
       setState(original)
   }
   function save(){
        let pst = new Object()
        pst = {rule}
        pst['idComp'] = idComp
        pst['type'] = type.includes('update') ? 'update' : 'insert'
        let req = server.schemas[typeTypes[type]][rule] 
        ? Object.keys(server.schemas[typeTypes[type]][rule]['columns']).filter(col=>{ return server.schemas[typeTypes[type]][rule]['columns'][col]['required'] })
        : []
        let missing = false
        for(let i=0; i < state.length; i++){ //Vérifier qu'aucun required ne manque
            req.forEach(r=>{
                if(!state[i][r]){
                    alert(`Colonne ${server.schemas[typeTypes[type]][rule]['columns'][r]['label']} manquante !!`);
                    missing = true 
                }
            })
        }
        if(!missing && (!condSave || condSave(state))){
            if(where){ pst['where'] = where }
            pst['data'] = pst.type === "update" ? state[0] : state //les update envoient 1 objet pas un array
            let fl = files
            fl.set('q',JSON.stringify([pst]))
            server.write(fl, callback, idComp)
        }
    }
    
    let data = state.map((s,i)=>{
        return original[i] ? {...original[i],...s} : s
    })
    return(
        <div id={`${id}Form`} className={classes.rows}>
            <div style={{width:'100%',display:'flex',justifyContent:'start',maxHeight:'40px'}}>
                <Typography variant="h6" className={classes.title}> { title || "" } </Typography>
                { addRows && <IconButton id={`${id}AddRow`} color="secondary" onClick={addRow} style={{margin:12}}>
                    <Icon fontSize="large"> playlist_add </Icon>
                </IconButton> }
                { Header && <Header data={state} addRow={addRow} /> }
            </div>
            <form method="post" action="/" encType="multipart/form-data" className={classes.rows}>
            { state.map((st,i)=>{ if(st){
                return( <div id={`${id}FormContent`} style={{width:'100%',display:'flex',justifyContent:'space-around',flexWrap:'no-wrap'}}>
                    {server.schemas[typeTypes[type]][rule] ? <FormRow
                        id={i}
                        key={`${title}${i}`}
                        hidden={hidden}
                        onEnter={(key,v)=>onEnter(i,key,state[i],v)} //v est la nouvelle valeur (ne passe pas tjr avant l'enter)
                        inputs={server.schemas[typeTypes[type]][rule] && server.schemas[typeTypes[type]][rule]['columns']}
                        data={data[i] || {}}
                        onChange={(val,id,key)=>{ handleChange(val,id,key) } }
                        handleFiles={handleFiles}
                        errors={errors}
                        resets={resets} //à chaque incrémentation on revient aux données d'origine
                        complement={complement}
                        inputProps={inputProps}
                    /> : <CircularProgress color="primary" size={20} /> }
                    { deletable &&  <IconButton color="secondary" onClick={()=>removeLine(i)}>
                        <Icon> delete </Icon>
                      </IconButton>
                    }
                    <Divider />
                 </div>
                )
             }})
            }
            </form>
           <FooterElement data={state} onValidate={save} reset={reset} />
        </div>
    )
}
Formulaire.propTypes = {
    /**
     * id du component
     */
    id: PropTypes.string,
    /**
     * Titre du formulaire
     */
    title: PropTypes.string,
    /**
     * Element JSX à mettre à coté du titre
     */
    Header: PropTypes.elementType,
    /**
     * Le type de formulaire (insert, update)
     */
    type: PropTypes.oneOf(['insert','update','updates','clone']).isRequired,
    /**
     * La rule utilisée 
    */
    rule: PropTypes.string.isRequired,
    /**
     * La condition si c'est 1 update
     */
    where: PropTypes.arrayOf(PropTypes.shape({ 
        label: PropTypes.string,
        operator: PropTypes.string,
        value: PropTypes.any
     })),
     /**
     * Les données par défaut à envoyer au serveur
     */
    defaultData: PropTypes.arrayOf(PropTypes.shape({})),
    /**
     *  Props à éventuellement ajouter aux inputs correspondant à certaines clés  
     */
    inputProps: PropTypes.shape({}),
    /**
     * Passé à FormRow afin de pouvoir ajouter des extra functions aux différents input selon leur key {key1:fct1,key2:fct2...}
     */
    complement: PropTypes.shape({}),
    /**
     * Les champs devant etre invisibles
    */ 
    hidden: PropTypes.array,
    /**
     * Elément JSX à mettre en footer (si undefined, ce sera save et reset), il prendra en entrée data(state), onValidate, et reset
     */
    FooterElement: PropTypes.elementType,
    /**
     * Peut-on ajouter de nouvelles lignes
    */
    addRows: PropTypes.bool,
    /**
     * Les erreurs sur les formulaires
    */
    errors: PropTypes.func,
     /**
     * Les rows sont-il suppressible
    */
    deletable: PropTypes.bool,
    /**
     * Fonction qui se déclenche à chaque modification sur un des formulaires (pour les warnings par exemple)
    */
    onChange: PropTypes.func,
    /**
     * Objet avec fonction à éxecuter à la validation de certains champs (par exemple en tapant entrée sur un input)
    */
    onEnter: PropTypes.func,
    /**
     * Condition à éxécuter pour voir si le change est autorisé (peut tout contenir, mais avec un booléen en sortie)
     */
    condChange: PropTypes.func,
    /**
     * Condition à éxécuter pour voir si le save peut s'éxecuter (peut tout contenir, mais avec un booléen en sortie)
     */
    condSave: PropTypes.func,
   /**
    *  Fonction à éxecuter après l'envoie au serveur (prend la réponse et le status HTTP en entrée)
   */
   callback: PropTypes.func
}
Formulaire.defaultProps = {
    id: '',
    title: ' ',
    Header: undefined,
    type: 'insert',
    where: null,
    defaultData: [{}],
    inputProps: {},
    hidden: [],
    addRows: false,
    errors: (index,key,val)=>{return null},
    deletable: false,
    FooterElement: DefaultFooter,
    condChange: (i,k,v,st) => true,
    onChange: (st) => console.log(st),
    onEnter: (i,k,v)=>console.log("Enter on ",i,k,v),
    callback: (rep,status) => { if(status > 399){ alert("Une erreur s'est produite au niveau du serveur !") } else{ alert(`Opération bien effectué`) } }
}
