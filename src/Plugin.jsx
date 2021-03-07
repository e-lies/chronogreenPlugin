import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Addresses from './components/Maps/Addresses';
import Formulaire from './components/Formulaire';
import { CrudContext } from './context/ServerContext';
import IdCard from './components/IdCard';
import LoadedComponent from './components/LoadedComponent';
import { FormControlLabel, Card, CardContent, CardMedia, Stepper, Step, StepLabel, StepButton, Icon, IconButton, Button, Chip, Avatar, Typography, Checkbox } from '@material-ui/core';
import Directions from './components/Maps/Directions';
import { useSize } from './reducers/Hooks';
import { mailValidation, distanceAndTime, cleanFromKeys } from './reducers/Functions';

const useStyles = makeStyles((theme) => ({
    steps: {
        backgroundColor: theme.palette.primary.main, //theme.palette.background.default,
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        overflow:'hidden',
        fontWeight: '1.25em',
        maxHeight:42,
        '& > *': {
          margin: theme.spacing(0.5),
        }
    },
    chips: {
        backgroundColor: theme.palette.background.default,
        margin:24,
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        fontSize: '1.25em',
        /*minWidth: 300,
        minHeight:300,*/
        '& > *': {
          margin: theme.spacing(0.5),
        }
    },
    prix: {
        color: 'white',
        fontSize: '1.2em',
        width:270,
        height:60,
        marginTop:24
    },
    button:{
        backgroundColor: theme.palette.primary.main,
        color:'white',
        //fontWeight:'bold',
        margin:24,
        fontSize:'1em',
        "&:hover": {
            backgroundColor: theme.palette.secondary.main
        }
    },
    buttonIcon:{
        marginLeft:12
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    titles:{
        backgroundColor: 'white',
        height: 40
    },
    conditions:{
        color: theme.palette.secondary.main
    }
}));

function reducer(state, action) {
    switch (action.type) {
      case "step":
        return { ...state, step: action.step };
  
      case "devis":
        return {...state,devis:action.devis}

      case "articles":
        return {...state,articles:action.articles}

      case "client":
        return {...state,client:action.client}

      case "check":
          return {...state,checkedF:!state.checkedF}

      default: 
        return state
    }
}

export default function Plugin(){
    const classes = useStyles()
    const theme = useTheme()
    const server = React.useContext(CrudContext)
    const [state, dispatch] = React.useReducer(reducer, {
        step: 0,
        devis:{},
        articles:[],
        client:{},
        checkedF:false
    })
    const [vehicules,setVehicules] = React.useState([])
    const [distanceDuration,setDistanceDuration] = React.useState({})
    const [article,setArticle] = React.useState({Intitule:'',Qte:0})
    const [price,setPrice] = React.useState(null)
    const { width, height } = useSize("pluginContainer")
    React.useEffect(()=>{
        var idComp = server.componentCreation("Devis");
        server.getSchema("select","Vehicule",idComp,true)
        server.getSchema("insert","Articles",idComp,true)
        server.read([{rule:'Vehicule'}],idComp,true,(dt)=>setVehicules(dt))
        if(document.querySelector("#Recuperation0")) {
           setTimeout(()=>document.querySelector("#Recuperation0").focus(),400) 
        }
    },[])
    React.useEffect(()=>{
        dispatch({type:'devis',devis:{...state.devis,...distanceDuration}})
    },[JSON.stringify(distanceDuration)])
    React.useEffect(()=>{
        setPrice(null)
        if(state.step===2){ document.querySelector("[name=Intitule0]").focus() }
    },[state.step])
    const SaveAll = ({ data, reset, onValidate })=>{
        const saveAll = ()=>{
            let query =  [{
                type:'insert',
                rule:'Client',
                data:[{
                ...data[0],
                children:[{
                    type:'insert',
                    rule:'Devis',
                    data: [{...state.devis,
                            children: [{
                                type:'insert',
                                rule:'Articles',
                                data: state.articles
                            }]
                        }]
                    }]
                }] 
            }]
            server.write(
                query,
                (rep,st)=>{
                    if(st < 400){
                        alert("Votre demande a bien été enregistrée")
                        //window.location.reload()
                    }
                    else{
                        alert("Une erreur a empêchée l'envoie de votre requête !!")
                    }
                }
            )
        }
        /*  fetch("http://127.0.0.1:8080/chronogreen/Mail.php")
        .then(prm=>{return prm.text()})
        .then(rep=>{ alert("Données bien transmises !"); window.location.reload() })
        .catch(err=>alert("Une erreur s'est produite en envoyant vos données sur le serveur !"))*/
        return(
            <div style={{width:'100%',display:'flex',justifyContent:'space-around'}}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={state.checkedF}
                            onChange={()=>dispatch({type:'check'})}
                            name="checkedF"
                            //indeterminate
                        />
                    }
                    label={<Typography variant="subtitle1">J'accepte les termes du <a className={classes.conditions} href="https://google.com" target="_blank">contrat</a></Typography>}
                />
                <Button 
                    className={classes.button}
                    variant="contained" 
                    disabled={!state.client.Nom || !state.client.Mail || !state.checkedF || !mailValidation(state.client.Mail) || state.articles.length < 1}
                    onClick={saveAll}
                >
                Envoyer <Icon className={classes.buttonIcon}>send</Icon>
                </Button>
            </div>
        )
    }
    const distanceDurationdCalback = resp=>{
        setDistanceDuration({Distance:(resp.distance/1000).toFixed(2),Duration:parseInt(resp.duration/60)})
    }
    const stepContent = (stp)=>{
        switch (stp) {
            case 3:
                return(<div style={{display:'flex',justifyContent:'space-around',flexWrap:'wrap-reverse'}}>
                    <div style={{width:width > 660 ? parseInt(width/2.1) : parseInt(width-parseInt(width/14)),display:'flex',justifyContent:'center',paddingLeft:18}}>
                    <Formulaire
                        id="AddressesSelection"
                        label="Adresses et heure"
                        type="insert"
                        rule="Devis"
                        defaultData={[state.devis]}
                        hidden={['idVehicule','idClient','Distance','Details','Duration']}
                        onChange={st=>dispatch({type:'devis',devis:st[0]})}
                        onEnter={(i,k,st,v)=>{
                            if(k==="Recuperation"){
                                document.querySelector(`#Livraison${i}`).select()
                                if(state.devis.Livraison && state.devis.dateHeure){
                                    let dt = distanceAndTime(v,state.devis.Livraison,state.devis.dateHeure,distanceDurationdCalback)
                                    //dt.then(rep=>setDistanceDuration({Distance:(rep.distance/1000).toFixed(2),Duration:parseInt(rep.duration/60)}))
                                }
                            }
                            else if(k==="Livraison"){
                                setTimeout(document.querySelector(`[name=dateHeure${i}]`).select(),100)
                                if(state.devis.Recuperation && state.devis.dateHeure){
                                    let dt = distanceAndTime(state.devis.Recuperation,v,state.devis.dateHeure,distanceDurationdCalback)
                                    //dt.then(rep=>setDistanceDuration({Distance:(rep.distance/1000).toFixed(2),Duration:parseInt(rep.duration/60)}))
                                }
                            }
                            else if(k==="dateHeure" && state.devis.Recuperation && state.devis.Livraison){
                                let dt = distanceAndTime(state.devis.Recuperation,state.devis.Livraison,v,distanceDurationdCalback)
                                //dt.then(rep=>setDistanceDuration({Distance:(rep.distance/1000).toFixed(2),Duration:parseInt(rep.duration/60)}))
                            }
                        }}
                        complement={{dateHeure:()=>(<Typography style={{margin:20}} variant="h5" color="primary">
                                {distanceDuration.Distance ? `${distanceDuration.Distance}Km, ${Math.floor(distanceDuration.Duration/60)}H${distanceDuration.Duration%60}Min` : ""}
                            </Typography>)
                        }}
                        FooterElement={()=>
                            {return(<div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                             <Button 
                                className={classes.button}
                                variant="contained" 
                                disabled={!state.devis.Recuperation || !state.devis.Livraison || !state.devis.dateHeure}
                                onClick={()=>dispatch({type:'step',step:state.step+1})}
                             >
                                    Confirmer <Icon className={classes.buttonIcon}>arrow_forward</Icon>
                                </Button>
                                
                            </div>)}
                        }
                    />
                    </div>
                    <Directions
                        id="DirectionAddress"
                        data={[{type:'De',label:'Récupération',address:state.devis.Recuperation},{type:'À',label:'Livraison',address:state.devis.Livraison}]}
                        addressKey='address'
                        directionAddresses={[[0,1]]}
                        mapsProps={{
                            //markers:{label:'type',position:'address'},
                            mapStyle:{margin:4,width:width > 660 ? parseInt(width/2.2) : parseInt(width-parseInt(width/14)),height:width > 550 ? 380 : 300},
                            onDblClick: pos => dispatch({type:'devis',devis:{...state.devis,[state.devis.Recuperation ? 'Livraison' : 'Recuperation']:pos}}),
                        }}

                    />
                </div>)

            case 1: return(
                <div style={{flex:5,display:'flex',justifyContent:'space-around',flexWrap:'wrap'}}>
                    <div style={{flex:3,minWidth:340,maxHeight:480,overflowY:'scroll',overflowX:'hidden',display:'flex',justifyContent:'space-around',flexWrap:'wrap'}}>
                    {/*vehicules.map(vehicule=>{
                        return( <Button
                                onClick={()=>dispatch({type:'devis',devis:{...state.devis,idVehicule:vehicule['idVehicule'] || null}})}
                                style={{display:'flex',flexDirection:'column',alignItems:'center'}}
                            >
                           <Card style={{width:180,height:150}}>
                               <CardMedia
                                    className={classes.media}
                                    image={"http://127.0.0.1:8080/chronogreen"+vehicule.Image}
                                    title={vehicule.Vehicule}
                               />
                               <CardContent className={classes.titles}>
                                <Typography variant="subtitle1" style={{fontWeight:vehicule.idVehicule === state.devis.idVehicule ? 'bold' : 'normal'}} color={vehicule.idVehicule === state.devis.idVehicule ? "primary" : "initial"}>
                                    { vehicule.Vehicule }
                                </Typography>       
                               </CardContent>
                           </Card>
                        </Button>)
                    })*/}
                    <LoadedComponent
                        component="./ImagesGrid"
                        rule="Vehicule"
                        params={{where:[]}}
                        filterKeys={['idCategorie','Nom','Longueur','Largeur','Hauteur','Charge']}
                        propToRender={state.devis}
                        globalStyle={{maxWidth:480,minWidth:330}}
                        otherProps={{
                            image:"Image",
                            icon:(tile)=>(<React.Fragment> </React.Fragment>),
                            label:"Vehicule",
                            titleStyle:jsn=>{return {color:jsn.idVehicule===state.devis.idVehicule ? theme.palette.secondary.dark : theme.palette.grey[900], fontWeight:'bold'} },
                            width:185,
                            height:150,
                            spacing:12,
                            onClick:(jsn)=>dispatch({type:'devis',devis:{...state.devis,idVehicule:jsn['idVehicule'] || null}})
                        }}
                    />
                    </div>
                    <div style={{flex:2,padding:12}}>
                    {state.devis.idVehicule ? (<div>
                        <IdCard
                            cardStyle={{flex:1,minWidth:320,maxWidth:400,maxHeight:440,backgroundColor:theme.palette.primary.main,color:theme.palette.primary.contrastText}}
                            contentStyle={{padding:4}}
                            columns={(server.schemas.select['Vehicule'] && server.schemas.select['Vehicule']['columns']) || {}}
                            /*jsn={server.data['Vehicule'] && server.data['Vehicule']['all']
                                ? server.data['Vehicule']['all']['data'].find(v=>v.id===state.devis.idVehicule) 
                                : {}
                            }*/
                            jsn={state.devis.idVehicule ? vehicules.find(v=>v.id===state.devis.idVehicule) : {}}
                            type={state.devis.idVehicule ? vehicules.find(v=>v.id===state.devis.idVehicule)['Categorie'] : "non défini"}
                            title="Vehicule"
                            images="Image"//{state.devis.idVehicule && vehicules.find(v=>v.id===state.devis.idVehicule) && vehicules.find(v=>v.id===state.devis.idVehicule)['logoCategorie']}
                            lists={['Longueur','Largeur','Hauteur','Volume','Charge']}
                        />
                    <div style={{width:'100%',display:'flex',justifyContent:'center'}}>
                        <Button 
                            className={classes.button}
                            variant="contained" 
                            disabled={!state.devis.idVehicule}
                            onClick={()=>dispatch({type:'step',step:state.step+1})}
                        >
                            Confirmer <Icon className={classes.buttonIcon}>arrow_forward</Icon>
                        </Button>
                    </div>
                    </div>) : (<Typography variant="h5" color="textPrimary">En attente de sélection...</Typography>)}
                    </div>
                </div>
            )
            case 2:
                return( <div style={{width:'100%',flex:2,display:'flex',flexWrap:'wrap',padding:12}}>
                    <div style={{flex:1,display:'flex',flexDirection:'column'}}>
                    <Formulaire
                        id="ArticlesSelection"
                        title="Articles à livrer"
                        type="insert"
                        rule="Articles"
                        hidden={['idDevis']}
                        defaultData={[article]}
                        onChange={st=>setArticle(st[0])}
                        onEnter={(i,k,st,v)=>{
                            if(st['Intitule'] && st['Intitule'].length > 0 &&st['Qte'] && st['Qte'] > 0){
                                if(state.articles.find(art=>art.Intitule===st.Intitule)){
                                    alert ("Nom d'article déjà passé ! \n Veuillez supprimer l'existant pour changer la quantité")
                                }
                                else{
                                    dispatch({type:'articles',articles:state.articles.concat(st)})
                                    setArticle({Intitule:'',Qte:0})
                                    document.querySelector("[name=Intitule0]").select()
                                }
                            }
                        }}
                        complement={{
                            Qte: (jsn)=> <IconButton 
                                color="primary"
                                onClick={()=>{
                                    dispatch({type:'articles',articles:state.articles.concat(jsn)})
                                    setArticle({Intitule:'',Qte:0})
                                    document.querySelector("[name=Intitule0]").select()
                                }}
                            >
                                <Icon size="medium"> send </Icon>
                            </IconButton>
                        }}
                        FooterElement={()=>(<></>)}
                    />
                    <div className={classes.chips}>
                        {state.articles.map(article=>{
                            return(<Chip
                                avatar={<Avatar style={{fontSize:'1.3em'}}>{article['Qte']}</Avatar>}
                                label={article['Intitule']}
                                clickable
                                color="primary"
                                onDelete={()=>dispatch({type:'articles',articles:state.articles.filter(art=>art.Intitule!==article.Intitule)})}
                                deleteIcon={<Icon>clear</Icon>}
                            />)
                        })} 
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',margin:18}}>
                        <Button
                            className={classes.prix}
                            disabled={!state.devis.Recuperation || !state.devis.Livraison || !state.devis.idVehicule || state.articles.length < 1}
                            variant="contained" 
                            color="secondary"
                            onClick={()=>{
                                if(!vehicules.find(v=>v.id===state.devis.idVehicule)){
                                    alert("Veuillez d'abord sélectionner un véhicule !")
                                }
                                else if(!distanceDuration['Distance']){
                                    alert("Veuillez d'abord sélectionner le trajet à effectuer !")
                                }
                                else{
                                    setPrice((distanceDuration['Distance']*vehicules.find(v=>v.id===state.devis.idVehicule)['Tarif']).toFixed(2))
                                }
                            }}
                        >
                            Estimer le prix
                        </Button>
                        { price && <Button variant="contained" disableTouchRipple color="primary" className={classes.prix}> 
                            { `${price} €` } 
                        </Button>}
                    </div>
                    </div>
                    <div style={{flex:1,minWidth:370}}>
                    <Formulaire
                        id="DetailsLivraison"
                        //style={{maxWidth:360}}
                        defaultData={[state.devis]}
                        title="Commentaire à ajouter"
                        type="insert"
                        rule="Devis"
                        hidden={['idVehicule','idClient','Recuperation','Livraison','dateHeure','Distance','Duration']}
                        onChange={st=>{dispatch({type:'devis',devis:{...state.devis,Details:st[0]['Details'] || null}})}}
                        FooterElement={()=>(<div style={{width:'100%',display:'flex',justifyContent:'space-around'}}>
                            <Button 
                                className={classes.button}
                                variant="contained" 
                                disabled={state.articles.length < 1}
                                onClick={()=>dispatch({type:'step',step:state.step+1})}
                            >
                                Devis détaillé <Icon className={classes.buttonIcon}>description</Icon>
                            </Button></div>
                        )}
                    />
                    </div>
                </div>)
            case 0:
                return(<div style={{display:'flex',justifyContent:'center'}}>
                    <Formulaire
                        id="DetailsClient"
                        label="Information client"
                        type="insert"
                        rule="Client"
                        inputProps={{Telephone:{
                            format:[/\d/,/\d/,'-',/\d/,/\d/,'-',/\d/,/\d/,'-',/\d/,/\d/,'-',/\d/,/\d/]
                        }}}
                        errors={(ind,key,val)=>{
                            if(key==="Mail" && state.client.Mail && state.client.Mail.length > 0 && !mailValidation(state.client.Mail)){
                                return 'Format de mail invalide'
                            }
                            if(key==="Telephone" && state.client.Telephone && state.client.Telephone.length < 9){
                                return 'Format de numéro de téléphone invalide'
                            }
                            else{ return null }
                        }}
                        onChange={(st)=>dispatch({type:'client',client:st[0]})}
                        FooterElement={SaveAll}
                    />
                    </div>
                )

            default:
                break;
        }
    }
    return(
        <div id="pluginContainer" style={{width:'100%'}}>
            {/*<Paper style={{ padding: 12 }} elevation={3}>*/}
                <Stepper className={classes.steps} alternativeLabel activeStep={state.step}>
                <Step key="Infoslivraison">
                    <StepLabel
                        onClick={()=>dispatch({type:'step',step:0})} 
                        StepIconComponent={()=>(<Icon style={{color:theme.palette.secondary[state.step >= 0 ? 'main' : 'contrastText'],fontSize:'1.75em'}}>map</Icon>)}
                    >
                        {width > 480 && <Typography style={{color:theme.palette.secondary[state.step >= 0 ? 'main' : 'contrastText'],fontWeight:'bold'}} variant="subtitle2">Infos livraison</Typography>}
                    </StepLabel>
                </Step>
                <Step key="Choixvéhicule">
                    <StepLabel
                        onClick={()=>dispatch({type:'step',step:1})}
                        StepIconComponent={()=>(<Icon style={{color:theme.palette.secondary[state.step >= 1 ? 'main' : 'contrastText'],fontSize:'1.75em'}}>local_shipping</Icon>)}
                    >
                        {width > 480 && <Typography style={{color:theme.palette.secondary[state.step >= 1 ? 'main' : 'contrastText'],fontWeight:'bold'}} variant="subtitle2">Choix de véhicule </Typography>}
                    </StepLabel>
                </Step>
                <Step key="Estimation">
                    <StepLabel
                        onClick={()=>distanceDuration['Distance'] && state.devis.idVehicule && dispatch({type:'step',step:2})}
                        StepIconComponent={()=>(<Icon style={{color:theme.palette.secondary[state.step >= 2 ? 'main' : 'contrastText'],fontSize:'1.75em'}}>euro</Icon>)}
                    >
                        {width > 480 && <Typography style={{color:theme.palette.secondary[state.step >= 2 ? 'main' : 'contrastText'],fontWeight:'bold'}} variant="subtitle2">Estimation</Typography>}
                    </StepLabel>
                </Step>
                <Step key="Confirmation">
                    <StepLabel
                        onClick={()=>distanceDuration['Distance'] && state.devis.idVehicule && dispatch({type:'step',step:3})}
                        StepIconComponent={()=>(<Icon style={{color:theme.palette.secondary[state.step >= 3 ? 'main' : 'contrastText'],fontSize:'1.75em'}}>check_circle</Icon>)}
                    >
                        {width > 480 && <Typography style={{color:theme.palette.secondary[state.step >= 3 ? 'main' : 'contrastText'],fontWeight:'bold'}} variant="subtitle2">Confirmation</Typography>}
                    </StepLabel>
                </Step>
                </Stepper>
            {/*</Paper>      */}
            <div>
                { stepContent(state.step) }
            </div>
        </div>
    )
}