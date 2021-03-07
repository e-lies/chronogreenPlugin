import React, { useContext, useEffect } from 'react';
//import TabForm from '../../components/TableauFormulaire';
import LoadedComponent from '../../components/LoadedComponent';
import { CrudContext } from '../../context/ServerContext';
import { ContextForms } from '../../context/Forms';
import  { IconButton, Icon } from '@material-ui/core';
import SpeedDials from '../../components/Tableaux/SpeedDials';

var idComp;
export default function Vehicules(){
    const server = useContext(CrudContext)
    const forms = useContext(ContextForms)
    useEffect(()=>{
        idComp = server.componentCreation('Vehicules')
    },[])
    return( <div>
        <IconButton
            color="primary"
            onClick={()=>forms.addForm(
                "insert",
                "Vehicule",
                {callback:(rep,st)=>{
                    if(st < 300){
                        alert(`Véhicule bien ajoutée`)
                        forms.removeForm("insert","Vehicule")
                        server.read([{rule:"Vehicule"}],"Entrees",true)
                    }
                    else{ alert("Une erreur s'est produite \n Veuillez vérifier le résultat !") }
                }}
            )}
        >
            <Icon style={{fontSize:'1.75em'}} size="medium">add_circle</Icon>
       </IconButton>
        <LoadedComponent
            id="Vehicule"
            component="ImagesGrid2"
            rule="Vehicule"
            filterKeys={['idCategorie','Longueur','Largeur','Hauteur','Charge']}
            otherProps={{
                image: 'Image',
			    label: 'Vehicule',
                titleStyle: (jsn)=>{return {display:'flex',color:'black'}},
                icon:()=><React.Fragment></React.Fragment>,
			    subtitleCol: 'Categorie',
			    width: 200,
			    height: 150,
                actionFct: (jsn,i)=>{ 
				  return(				
					<SpeedDials
						//classes={classes.speedDials}
						blockStyle={{width:'100%',position:'absolute',display:'flex',justifyContent:'space-between'}}
						speedProps={{FabProps:{size:'small',color:'secondary',style:{position:'relative'}},style:{width:'100%',position:'absolute',display:'flex',justifyContent:'space-between'}}}
						tooltipPlacement="bottom"
						icon="build"
						direction="right"
						label="Configuration tableau"
						actions={[
                            {label:'Supprimer',
                            icon:'delete',
                            color:'error',
                            fct:()=>{
                                server.write(
                                    [{type:'delete',rule:'Vehicule',where:[{label:'id',operator:'=',value:jsn.idVehicule}]}],
                                    (rep,st)=>{
                                        if(st < 400){
                                            alert("Véhicule "+jsn.Vehicule+" bien supprimer")
                                            server.read([{rule:'Vehicule'}],idComp,true)
                                        }
                                        else{
                                            alert("Une erreur s'est produite lors de la suppression du véhicule !!\n Il est peut-être utilisé dans un devis")
                                        }
                                    },
                                    idComp
                                )
                            }},
                            { label:'Modifier',
                             icon:'edit',
                             color:'secondary',
                             fct:()=>{
                                forms.addForm('update','Vehicule',{
                                    where:[{label:'id',operator:'=',value:jsn.idVehicule}],
                                    callback:(rep,st)=>{
                                        if(st < 400){
                                            alert(`Véhicule ${jsn.Vehicule} bien modifié`)
                                            forms.removeForm('update','Vehicule')
                                            server.read([{rule:'Vehicule'}],idComp,true)
                                        }
                                        else{ alert("Une erreur s'est produite sur le serveur !!") }
                                    }
                                })
                             }
                            }
                        ]}
                    />
                  )
                }
            }}
        />
        {/*<LoadedComponent
            id="Vehicule"
            component="./Tableaux/ClientTab"
            rule="Vehicule"
            otherProps={{
                hidden:['id','idCategorie','idVehicule'],
                paddings:16,
                tools:[
                    ()=> <IconButton
                        color="primary"
                        onClick={()=>forms.addForm(
                            "insert",
                            "Vehicule",
                            {callback:(rep,st)=>{
                                if(st < 300){
                                    alert(`Véhicule bien ajoutée`)
                                    forms.removeForm("insert","Vehicule")
                                    server.read([{rule:"Vehicule"}],"Entrees",true)
                                }
                                else{ alert("Une erreur s'est produite \n Veuillez vérifier le résultat !") }
                            }}
                        )}
                    >
                        <Icon style={{fontSize:'1.75em'}} size="medium">add_circle</Icon>
                   </IconButton>
                ]
            }}
        />*/}
        </div>
    )
}