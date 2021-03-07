import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useLocation } from "react-router";
import { useTheme } from '@material-ui/core/styles'
import { Typography, Tabs, Tab, Icon, AppBar, Toolbar } from '@material-ui/core'

export default function BackContainer(props){
    const [tab,setTab] = useState(-1)
    const params = useParams()
    const location = useLocation()
    const pages = ["Categories","Vehicules","Clients","Devis"]
    const theme = useTheme()
    useEffect(()=>{
        console.log("location = ",location)
        pages.forEach((p,i)=>{
         if(location['pathname'].includes(p)) { console.log("page = ",i); setTab(i) }})
    },[JSON.stringify(location)])
    return(
        <div id="menuStats">
            <AppBar position="fixed">
            <Toolbar style={{display:'flex',justifyContent:'space-around',backgroundColor:'#f5f5f5',position:'fixed',width:'100%'}}> 
            {/*<Typography variant="h6">backoffice</Typography>*/}
            <Tabs value={tab} indicatorColor="secondary" style={{flex:0.8}}
               variant="scrollable" scrollButtons="on"
               //style={{display:'flex',justifyContent:'space-around',backgroundColor:'#DDD',marginBottom:'100px',position:'fixed',width:'100%',height:'90px'}} 
               >
            <div style={{width:'100%',display:'flex',justifyContent:'space-around'}}>
                <Tab component={Link} to="/backoffice/Categories" value={0} label="Catégories" icon={<Icon>category</Icon>} style={{color:tab===0 ? theme.palette.primary.main : theme.palette.secondary.main}} />
                <Tab component={Link} to="/backoffice/Vehicules" value={1} label="Véhicules" icon={<Icon>local_shipping</Icon>} style={{color:tab===1 ? theme.palette.primary.main : theme.palette.secondary.main}} />
                {/*<Tab component={Link} to="/backoffice/mouvements" value={2} label="Mouvements" icon={<Icon>swap_horiz</Icon>} />*/}
                {/*<Tab component={Link} to="/backoffice/Clients" value={2} label="Clients" icon={<Icon>reply_all</Icon>} style={{color:tab===2 ? theme.palette.primary.main : theme.palette.secondary.main}} />*/}
                <Tab component={Link} to="/backoffice/Devis" value={3} label="Devis" icon={<Icon>money</Icon>} style={{color:tab===3 ? theme.palette.primary.main : theme.palette.secondary.main}} />
            </div>
            </Tabs>
            </Toolbar>
            </AppBar>
            <div style={{height:70}}> </div>
        </div>
    )
}