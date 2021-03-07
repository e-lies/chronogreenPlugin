import React, { useState, useEffect } from 'react';
import { path, limitSession } from './Params';
import { Redirect, useHistory } from 'react-router-dom';

export const ContextSessions = React.createContext({});

const SessionContext = (props)=>{
	//state = { session:{}, lastRole: null, nbFailures:0, redirect:false }
	const history = useHistory()
	const [session,setSession] = useState({})
	const [nbFailures,setNbFailures] = useState(0)
	const [connected,setConnected] = useState(true)
	
	useEffect(()=>{
		handleSession(true)
		//setInterval(handleSession, 40000);
		//return ()=>{ setSession({}) } //à la déconnexion
	},[])
	useEffect(()=>{
		if(nbFailures > limitSession){
			logout()
		}
	},[nbFailures])
	const handleSession = (login)=>{
		fetch(path+"/Models/Sessions.php").then(prm=>{
			if(prm.status < 299) {
				return prm.json().then(rep => { 
					setSession(rep)
					setNbFailures(0)
					setConnected(true)
				})
			}
			else if(prm.status === 401 || prm.status === 403){
				return prm.text().then(rep => { 
					alert("Vous n'etes pas connecté à l'application !")
					logout()
				 })
			}
			else { 
				console.log("Problème dans le format de la réponse du serveur");
				setConnected(false)
				setNbFailures(parseInt(nbFailures+1))
			}
		}).catch(cat => { console.log("Problème lors de la tentative de récupération de vos données de session \n Vérifiez votre réseau !"); 
		}).catch(cat => { console.log("No network !"); setConnected(false) })
	}

	const logout = () =>{
		//let role = session.role
		fetch(`${path}/Logout.php`).then(prm=>{ if(prm.status > 399){
			alert("Une erreur s'est produite au niveau du serveur !"); return null
		} else{ return prm.text()}})
		.then(rep=>{ history.push(`/vendeur`) })
		.catch(rep=>{ alert("Erreur au niveau du client"); history.push(`/vendeur`) })
		.catch(rep=>{ alert("Erreur lors de la tentative d'accès au serveur"); history.push(`/vendeur`) })
	}
	
	return(
		<ContextSessions.Provider 
			value={{ session, getSession:handleSession, logout, connected, notifs:[] }} >
		 	{props.children}
		</ContextSessions.Provider>
	)
}
export default SessionContext;