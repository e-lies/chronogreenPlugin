import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Alerts from './Alerts';
import { IconButton, Icon, List, ListItem, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core';

export default function LocalSaves(props){
    const { key, /*group,*/ title, open, stateToSave, onClick, onClose } = props;
    const [saves,setSaves] = useState([]) //[{ label:'save27-01', value:[{name:'ilias',age:36},....]}]
    useEffect(()=>{
        let sv = localStorage.getItem(key)
        if(sv){
            let parsed = JSON.parse(sv)
            /*if(parsed && group && parsed[group]){
                setSaves(parsed[group])
            }*/
            //else if(parsed){
                setSaves(parsed)
            //}
        }
        else{
            localStorage.setItem(key,"{}")
            /*if(group){
                localStorage.setItem(key,JSON.stringify({[group]:{}}))
            }
            else{
                localStorage.setItem(key,"{}")
            }*/
        }
    },[])
    useEffect(()=>{
        localStorage.setItem(key,JSON.stringify(saves))
    },[JSON.stringify(saves)])

    const insertSave = ()=>{
        let label = window.prompt("Entrez le nom de la sauvegarde: ")
        if(saves.findIndex(s=>s.label===label) < 0){
             setSaves(saves.concat({label,default:false,value:stateToSave}))
         }
        else{
            let conf = window.confirm("Nom déjà utilisé ! \n Veuillez en choisir un autre...")
            if(conf){ insertSave() }
        }
        let sameValue = saves.findIndex(s=>JSON.stringify(s.value)===JSON.stringify(stateToSave))
        if(sameValue >= 0){
            let conf = window.confirm("La valeur sauvegardée est la même que celle de la sauvegarde "+saves[sameValue]['label']+"\n Souhaitez-vous l'écraser ?")
            if(conf){ 
                let sv = [...saves];
                sv[sameValue]['label'] = label; 
                setSaves(sv)
            }
        }
    }
    const removeSave = (label)=>{
        let conf = window.confirm("êtes-vous sûr de vouloir supprimer cette sauvegarde ?")
        if(conf){ setSaves(saves.filter(s=>s.label!==label)) }
    }
    const defaultSave = (label)=>{
        let sv = [...saves]
        if(sv[saves.indexOf(s=>s.default)]){ //au cas ou il y a déjà une config par défaut
           delete  sv[saves.indexOf(s=>s.default)]['default']
        }
        sv[saves.indexOf(s=>s.label===label)]['default'] = true
        setSaves(sv)
        alert("La configuration "+label+" est maintenant par défaut")
    }
    return(
        <React.Fragment>
            <Alerts
                type="confirm"
                open={open}
                handleClose={onClose}
                draggable
                headerFooterFormat={{title,icon:'save'}}
                onOk={insertSave}
            >
                <List>
                {
                    saves.map((save,i)=>{
                        return(
                            <ListItem button onClick={()=>onClick(save)}>
                                <ListItemIcon> 
                                    <Icon size="medium" onClick={()=>removeSave(save['label'])} color="error"> delete </Icon>
                                </ListItemIcon>
                                <ListItemText primary={save['label']} />
                                <IconButton onClick={()=>defaultSave(save['label'])}>
                                    <Icon color={localStorage.getItem[key][i]['default'] ? "primary" : "disabled"}>check_circle</Icon>
                                </IconButton>
                            </ListItem>
                        )
                    })
                }
                </List>
            </Alerts>
        </React.Fragment>
    )
}

LocalSaves.propTypes = {
    /** Nom du storage dans localStorage */
    key: PropTypes.string.isRequired,
    /** Titre du storage */
    title: PropTypes.string,
    /** L'interface avec les sauvegardes est-elle ouverte */
    open: PropTypes.bool,
    /** La variable d'environnement à sauvegarder (souvent un state) */
    stateToSave: PropTypes.object.isRequired,
    /** Callback au clique sur une des valeur sauvegardées */
    onClick: PropTypes.func.isRequired,
    /** Callback à la fermeture de l'Alert */
    onClose: PropTypes.func
}
LocalSaves.defaultProps = {
    group: undefined,
    title: 'Sauvegardes',
    open:false,
    onClick:(save)=>console.log("save = ",save)
}
