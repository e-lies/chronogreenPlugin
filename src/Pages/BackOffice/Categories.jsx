import React, { useContext } from 'react';
//import TabForm from '../../components/TableauFormulaire';
import LoadedComponent from '../../components/LoadedComponent';
import { CrudContext } from '../../context/ServerContext';
import { ContextForms } from '../../context/Forms';
import  { IconButton, Icon } from '@material-ui/core';

export default function Categories(){
    const server = useContext(CrudContext)
    const forms = useContext(ContextForms)
    /*return(<div>
        {<IconButton
            color="primary"
            onClick={()=>forms.addForm(
                "insert",
                "Categorie",
                {callback:(rep,st)=>{
                    if(st < 300){
                        alert(`Catégorie bien ajoutée`)
                        forms.removeForm("insert","Categorie")
                        server.read([{rule:"Categorie"}],"Entrees",true)
                    }
                    else{ alert("Une erreur s'est produite \n Veuillez vérifier le résultat !") }
                }}
            )}
        >
            <Icon style={{fontSize:'1.75em'}} size="medium">add_circle</Icon>
       </IconButton>
        <LoadedComponent
            component="./ImagesGrid"
            filterKeys={['Nom']}
            rule="Categorie"
            otherProps={{
                //title:"Liste des catégories de véhicule",
                image:"Logo",
                icon:(tile)=>(<Icon>{tile['Nom'].includes('2') ? "done" : "edit"}</Icon>),
                label:"Nom",
                titleStyle: jsn => {return {fontWeight:'bold'}},
                width:130,
                height:100,
                spacing:12
            }}
            //onClick={(jsn) => cards.addCard('Technicien', jsn.id)}
        />
    </div>)*/
    return(
        <LoadedComponent
            id="Categorie"
            component="./Tableaux/ClientTab"
            rule="Categorie"
            //propToRender={[confirmed]}
            otherProps={{
                hidden:['id'],
                lineFunctions:[{
                    label:'Modifier',
                    icon:'edit',
                    fct:(jsn)=>{
                        forms.addForm('update','Categorie',{
                            where:[{label:'Nom',operator:'=',value:jsn.Nom}],
                            callback:(rep,st)=>{
                                if(st < 400){
                                    alert("Catégorie bien modifiée")
                                    server.read([{rule:'Categorie'}],"Categorie",true)
                                    forms.removeForm('update','Categorie')
                                }
                                else{
                                    alert("Une erreur s'est produite lors de la modification !!")
                                }
                            }
                        })
                    }
                }],
                tools:[
                    ()=> <IconButton
                        color="primary"
                        onClick={()=>forms.addForm(
                            "insert",
                            "Categorie",
                            {callback:(rep,st)=>{
                                if(st < 300){
                                    alert(`Catégorie bien ajoutée`)
                                    forms.removeForm("insert","Categorie")
                                    server.read([{rule:"Categorie"}],"Entrees",true)
                                }
                                else{ alert("Une erreur s'est produite \n Veuillez vérifier le résultat !") }
                            }}
                        )}
                    >
                        <Icon style={{fontSize:'1.75em'}} size="medium">add_circle</Icon>
                   </IconButton>
                ]
            }}
        />
    )
}

 {/*<TabForm
            tabRule="Categorie"
            //tabParams={{where: [{ label: 'Etat', operator: 'in', value: ['Dispatche', 'Planification'] }]}}
            tabProps={{
            filterKeys: ['Article','idCategorie','code_bar','Cout'],
            hidden: ['id','idCategorie','code_bar'],
            title: "Modèles de matériel",
            caption: "Les différentes modèles de matériel géré de façon unique (code-barre, MAC...)"
            }}
            insert="Article"
            update={{rule:"Article"}}
            deletes={{rule:"Article"}}
            clone={{rule:"Article"}}
            export={true}
            //location={props.location}
        />*/}