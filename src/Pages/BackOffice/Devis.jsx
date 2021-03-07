import React, { useContext } from 'react';
import StatClientTab from '../../components/Tableaux/StatClientTab';
import { CrudContext } from '../../context/ServerContext';
import { ContextForms } from "../../context/Forms";

export default function Devis(){
    const forms = useContext(ContextForms)
    const server = useContext(CrudContext)
    return(
        <StatClientTab 
            id="Devis"
            rule="Devis"
            tableProps={{
                title: "Historique des devis",
                filterKeys:[],
                hidden:['id'],
                paddings: 2,
                collapses: [{title:"Client", fct:
                    (row)=>{ return(<div style={{paddingBottom:12}}>
                            
                        </div>
                    )}
                }],
                checkedFunctions: [{
                    label:'Supprimer',
                    icon:'delete',
                    fct:(rows)=>{
                        let conf = window.confirm("Souhaitez-vous vraiment supprimer ces "+rows.length+" devis ?")
                        server.write(
                            [{type:'delete',rule:'Client',where:[{label:'id',operator:'in',value:rows.map(row=>row.idClient)}]}],
                            (rep,st)=>{
                                if(st < 400){
                                    alert(`${rows.length} devis bien supprimés`)
                                    window.location.reload()
                                }
                                else{
                                    alert("Une erreur s'est produite lors de la suppression des devis !!")
                                }
                            },
                            "Devis01"
                        )
                    }
                }]
            }}
            //groupBy
            //stats
            charts={['pie','line']}
        />		  
    )
}