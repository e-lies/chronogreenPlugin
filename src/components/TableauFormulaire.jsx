import React from 'react';
import PropTypes from 'prop-types';
import { CrudContext } from '../context/ServerContext';
import { ContextForms } from '../context/Forms';
import LoadedComponent from './LoadedComponent';
import { ExportToCsv } from 'export-to-csv';
import { Icon, IconButton, Typography, Tooltip } from '@material-ui/core';

export default function TabForm (props){
    const { tabRule, tabParams, tabProps, insert, update, updates, deletes, clone, exports, otherFct } = props
    const forms = React.useContext(ContextForms)
    const server = React.useContext(CrudContext)
    const [functions,setFunctions] = React.useState({lineFunctions:[],checkedFunctions:[],globalFct:[]})
    const reload = () =>{
        server.read([{rule:tabRule,params:tabParams}],"TabForm",true)
    }
    React.useEffect(()=>{
        let lineFunctions = []
        let checkedFunctions = []
        let globalFct = tabProps.tools || []
        if(insert){
            const insertFct = () =>{
               return( <IconButton 
                    id="insertButton" 
                    color="primary" 
                    onClick={()=>forms.addForm("insert",insert,{
                        callback: (rep,st)=>{
                            if(st < 400){
                                alert("Inserton effectuée")
                                forms.removeForm("insert",insert)
                                reload()
                            }
                            else{ alert("Une erreur s'est produite lors de l'insertion !") }
                        }
                    })}
                >
                   <Tooltip title="Ajouter une nouvelle entrée">
                       <Icon style={{fontSize:'2.5em'}}>add_circle</Icon>
                   </Tooltip>
                </IconButton>)
            }
            globalFct = [...globalFct,insertFct]
        }
        if(update){
            let un = update.unique || 'id'
            lineFunctions.push({color:'secondary',label:'Modifier',icon:'edit',
            fct:line=>forms.addForm("update",update.rule,{
                where:[{label:un,operator:'=',value:line[un]}],
                callback: (rep,st)=>{
                    if(st < 400){
                        alert("Mise à jour réussie")
                        forms.removeForm("update",update.rule)
                        reload()
                    }
                    else{ alert("Une erreur s'est produite lors de la mise à jour !") }
                }
            })})
        }
        if(updates){
            let un = updates.unique || 'id'
            checkedFunctions.push({color:'secondary',label:'Modifier',icon:'edit',
                fct:lines=>{ let elm = lines.map(l=>l[un])
                    forms.addForm("updates",updates.rule,{
                        where:[{label:un,operator:'in',value:elm}],
                        callback: (rep,st)=>{
                            if(st < 400){
                                alert("Mise à jour réussie")
                                forms.removeForm("updates",updates.rule)
                                reload()
                            }
                            else{ alert("Une erreur s'est produite lors de la mise à jour !") }
                        }
                    })
                }
            })
        }
        if(deletes){
            let un = deletes.unique || 'id'
            checkedFunctions.push({color:'error',label:'Supprimer',icon:'delete',fct:lines=>{ 
                console.log("lines = ",lines)
                let conf = window.confirm(`Confirmez-vous la suppression de ce(s) ${lines.length} élement(s) ?`)
                if(conf){
                    let elm = lines.map(l=>l[un])
                    server.write(
                        [{rule:deletes.rule,type:'delete',where:[{label:un,operator:'in',value:elm}]}],
                        (rep,st)=>{
                            if(st < 400){
                                alert(`${lines.length} élements supprimés `);
                                reload()
                            }
                            else { alert("Une erreur s'est produite au moment de la suppression") }
                        }
                    )
                }
            }})
        }
        if(clone){
            let un = clone.unique || 'id'
            lineFunctions.push({
                color:'primary',label:'Cloner',icon:'file_copy',
                fct:line=>forms.addForm("clone",clone.rule,{ 
                    where:[{label:un,operator:'=',value:line[un]}],
                    callback: (rep,st)=>{
                        if(st < 400){
                            alert("Clonage réussi")
                            forms.removeForm("clone",clone.rule)
                            reload()
                        }
                        else{ alert("Une erreur s'est produite lors du clonage !") }
                    }
             })})
        }
        if(exports){
            checkedFunctions.push({label:'Exporter la sélection',icon:'cloud_download',color:'default',fct:handleExport})
        }
        otherFct.forEach(of=>{
            if(of.scope === "lines"){
                checkedFunctions.push(of)
            }
            else{
                lineFunctions.push(of)
            }
        })
        setFunctions({lineFunctions,checkedFunctions,globalFct})
    },[])
    const options = { 
        fieldSeparator: ';',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true, 
       // showTitle: true,
        title: `Export CSV ${tabProps.title || 'sélections'}`,
        //useTextFile: false,
        //useBom: true,
        useKeysAsHeaders: true,
        // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };
    const handleExport = data =>{
		let name = window.prompt("Comment souhaitez-vous nommer le fichier qui contiendra ces "+data.length+" enregistrements?");		
		if(name && name !== null){
			let opt = {...options}
			opt['title'] = "Export de "+data.length+" enregistrements";
			opt['filename'] = name;
			const csvExporter = new ExportToCsv(opt);
	 		csvExporter.generateCsv(data);
	 	}
    }
    return(
        <LoadedComponent
            component="./Tableaux/ClientTab"
            rule={tabRule}
            params={tabParams}
            lineFunctions={functions.lineFunctions}
            //filterFromLC={true}
            //filterButton={true}
            checkedFunctions={functions.checkedFunctions}
            tools={functions.globalFct}
            {...tabProps}
        />
    )
}
TabForm.propTypes = {
    tabRule: PropTypes.string.isRequired,
    tabParams: PropTypes.shape({
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
    tabProps: PropTypes.shape({}),
    insert: PropTypes.string,
    update: PropTypes.shape({
        rule: PropTypes.string.isRequired,
        unique: PropTypes.string,
        cond: PropTypes.func
    }),
    updates: PropTypes.shape({
        rule: PropTypes.string.isRequired,
        unique: PropTypes.string,
        cond: PropTypes.func
    }),
    clone: PropTypes.shape({
        rule: PropTypes.string.isRequired,
        unique: PropTypes.string
    }),
    deletes: PropTypes.shape({
        rule: PropTypes.string.isRequired,
        unique: PropTypes.string,
        cond: PropTypes.func
    }),
    exports: PropTypes.bool,
    otherFct: PropTypes.arrayOf(PropTypes.shape({
        scope: PropTypes.string.isRequired,
        color: PropTypes.string,
        icon: PropTypes.string,
        label: PropTypes.string.isRequired,
        cond: PropTypes.func,
        fct: PropTypes.func.isRequired
    }))
}
TabForm.defaultProps = {
    insert: null,
    update: null,
    updates: null,
    deletes: null,
    clone: null,
    tabParams: null,
    tabProps: {},
    exports: true,
    otherFct: []
}