//addForm ajoute 1 dialog formulaire et removeForm en supprime
//le state forms contient les dialogs ouverts, c'est 1 array de json avec :
//type : insert, update, updates, clone
//rule: la rule correspondant au type
//prop: autres props à faire rentrer dans le component Formulaire
import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { CrudContext } from "./ServerContext";
import { ContextSessions } from "./SessionContext";
import Alerts from "../components/Alerts";
import Formulaire from "../components/Formulaire";
import { useSize } from "../reducers/Hooks";

const useStyles = makeStyles(theme => ({
  alertInsert: {
	height: 30,
	backgroundColor: theme.palette.secondary.main,
	color: theme.palette.error.contrastText
  },
  alertUpdate: {
	height: 30,
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText
  },
  alertUpdates: {
	height: 30,
	backgroundColor: theme.palette.primary.dark,
	color: theme.palette.primary.contrastText
  },
  alertClone: {
	height: 30,
	backgroundColor: theme.palette.secondary.dark,
	color: theme.palette.secondary.contrastText
  }
}))

export const ContextForms = React.createContext({
	openedForms:[],
	addForm: ()=>console.log("open"),
	removeForm: ()=>console.log("close")
});
const typeKeys = {insert:'insert',update:'update',updates:'update',clone:'insert'}
export default function FormsContext({ children }){
	const classes = useStyles()
	const context = useContext(CrudContext)
	const [forms,setForms] = useState([]) //{type:'update',rule:'Technicien',label:'Moussa',cond:[{label:'id',operator:'=',value:'15'}]}
	const { isMobile } = useSize()
	const addForm = (type,rule,prop) =>{
		let formProps = prop ? {...prop,type,rule} : {type,rule}
		if(!formProps.callback){
			formProps.callback = (rep,st)=>{
				if(st < 400){
					alert(`${type === "insert" ? "Insertion" : "Mise à jour"} réussie`)
					removeForm(type,rule)
				}
			}
		}
		//formProps['callback'] = formProps['callback'] ? () => { removeForm(type,rule); formProps.callback; return null } : () => removeForm(type,rule)
		setForms([...forms,formProps])
	}
	const removeForm = (type,rule) =>{
		let frm = forms.filter(f=>f.type !== type || f.rule !== rule)
		setForms(frm)
	}
	const typeHeader = {
		insert: (jsn,schema)=>{return {icon:'add',title:jsn.titre || schema.name || `Ajout`,classes:classes.alertInsert}},
		update: (jsn,schema)=>{return {icon:'edit',title:jsn.titre || schema.name || `Modification`,classes:classes.alertUpdate}},
		updates: (jsn,schema)=>{return {icon:'list',title:jsn.titre || schema.name || `Modifications`,classes:classes.alertUpdates}},
		clone: (jsn,schema)=>{return {icon:'file_copy',title:jsn.titre || schema.name || `Clonage`,classes:classes.alertClone}}
	}
	return(
		<ContextForms.Provider
        value={{
       		addForm,
         	removeForm,
          	openedForms: forms
        }}
      >
      	{forms.map(frm=>{
      		let f = {...frm}
			//if(f.type === "updates"){ f.populate = false; f.type="update" }
			//else if (f.type === "clone"){ f.populate = true; f.type="insert" }
			return(
				<Alerts id={`${frm.type}_${frm.rule}`}
					//draggable
					//title={f['title'] || null}
					width={document.body.clientWidth > 740 ? 750 : 450}
					fullScreen={ isMobile }
					open={true}
					handleClose={e=>removeForm(frm.type,frm.rule)}
					headerFooterFormat={typeHeader[f.type](f,context.schemas[typeKeys[frm.type]][frm.rule] || {})}
				>
					<Formulaire {...f} />
				</Alerts>
				)
			})
		}
		{ children }
      </ContextForms.Provider>
	)
}