import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { ContextSessions } from './context/SessionContext';
import { path } from './context/Params';
import Bouttons from './components/Bouttons';
import { makeStyles } from '@material-ui/core/styles';
import { 
	IconButton, Icon, Typography, Grid, TextField, Card, CardHeader, CardContent, CardActions, Tooltip, InputAdornment,
	FormControl,
	FormLabel,
	RadioGroup,
	FormControlLabel,
	Radio,
	Button
} from '@material-ui/core';
import Alerts from './components/Alerts';

const useStyles = makeStyles(theme => ({
  card: {
  	width:'100%', 
	backgroundColor: theme.palette.background.default
  },
  avatar: {
  	width:'52px',
  	height: '52px'
  }
}));
const Login = props =>{
	const classes = useStyles();
	const session = React.useContext(ContextSessions);
	React.useEffect(()=>{ document.getElementById('mail').select() },[])
	const history = useHistory()
	const [mail,setMail] = useState("");
	const [psw,setPsw] = useState("");
	const [visible,setVisible] = useState("password");
	const [msg,setMessage] = useState("");
	const [magSelector,setMagSelector] = useState([]);
	const [mag,setMag] = useState(null)
	let role = props.location.pathname.split("/").pop(props.location.pathname.split("/").length-1) ;
	
	const changeVisibility = () =>{
		let vis = visible === "password" ? "text" : "password";
		setVisible(vis)
	}
	const onChange = (e,type) =>{
		if(type === 'mail') { setMail(e.target.value) }
		else if(type === 'psw') { setPsw(e.target.value) }
	}
	const reset = () =>{
		setMail("");
		setPsw("");
		document.getElementById('mail').focus()
	}
	const conf = (e) =>{
		if(e.which===13) { send() }
	}

	const send = () =>{
		fetch(path+"/Models/Login.php?role="+role+"&mail="+mail+"&psw="+psw, {
			method: 'GET',
			credentials: 'include',
			mode: 'no-cors',
			headers: { "Access-Control-Allow-Methods": "GET", "allow-origins":"*" }
		}).then(prm=>{ console.log(prm.status)
				if(prm.status > 299){ prm.text().then(rep=>{ setMessage(rep) }) } 
				else { prm.json().then(rep=>listOfMags(rep)) }
			}).catch(rep => { setMessage("Problème rencontré au niveau du serveur !") })
	}

	const listOfMags = (rep)=>{
		if(rep['mags']){
			if(rep['mags'].length === 0 && role.includes("admin")){
				session.getSession(false); 
				history.push(`/siraj/${role}/Accueil`)
			}
			else{ //cas vendeurs, préparateurs....etc
				if(rep['mags'].length > 0){
					setMagSelector(rep['mags'])
				}
				else{
					alert("Aucun magasin ne vous est affilié !!")
				}
			}
		}
		else{
			alert("Magasin affiliés non détectés !!")
		}
	}

	const selectMag = mag =>{
		fetch(path+"/Models/SelectMag.php?idMagasin="+mag, {
			method: 'GET',
			credentials: 'include',
			mode: 'no-cors',
			headers: { "Access-Control-Allow-Methods": "GET", "allow-origins":"*" }
		}).then(prm=>{ 
			if(prm.status > 299){ prm.text().then(rep=>{ setMessage(rep) }) } 
			else { prm.text().then(rep=>{
				session.getSession(false); 
				history.push(`/siraj/${role}/Accueil`)
			})}
			setMagSelector(null)
		}).catch(rep => { setMessage("Problème rencontré au niveau du serveur !") })
	}
	return(
		<Grid container spacing={2} style={{display:'flex',justifyContent:'center',height:'450px',alignItems:'center'}}>
		<Grid xs={10} sm={7} md={6} lg={5} xl={4}>
		<Card raised={true} className={classes.card}>
	      <CardHeader
			style={{opacity:0.7}}
	      	titleTypographyProps={{variant:'h5'}}
			avatar={ <Icon style={{fontSize:'1.75em'}}> airport_shuttle </Icon> }
	        action={
	        	<Tooltip title="Mise à zéro">
	          		<Icon style={{fontSize:'2em'}} color="error" onClick={reset}> replay </Icon>
	          	</Tooltip>
	        }
			title={`Connexion`}
	        subheader={role}
	      />
	      <CardContent style={{display:'flex',flexDirection:'column',height:'130px',justifyContent:'space-between',margin:'10px'}} >
			<TextField
				id="mail"
				label="Mail"
				type="email"
				value={mail}
				onChange={e=>onChange(e,"mail")}
				InputProps={{
		          startAdornment: (
		            <InputAdornment position="end">
						<IconButton style={{padding:0}}>
		              <Icon style={{float:'right',marginRight:'25px',marginLeft:'5px'}}>
		               email </Icon></IconButton>
		            </InputAdornment>
		          ),
		        }}
			/>
			<TextField
				id='password'
				label='Mot de passe'
				type={visible}
				value={psw}
				onChange={e=>onChange(e,"psw")}
				onKeyPress={e=>conf(e)}
				InputProps={{
		          startAdornment: (
		            <InputAdornment position="end">
						<IconButton style={{padding:0}} onClick={changeVisibility}>
		              <Icon style={{float:'right',marginRight:'25px',marginLeft:'5px'}}>
		               {visible === "password" ? "visibility" : "visibility_off"} </Icon></IconButton>
		            </InputAdornment>
		          ),
		        }}
			/>
	      </CardContent>
	      <CardActions style={{display:'flex',justifyContent:'space-between'}} >
			<Typography variant="h5" color="error"> {msg} </Typography>
			<Bouttons disabled={mail.length < 1 || psw.length < 1}
			 icon="send" color="primary" label="connexion" callback={ send } />
	      </CardActions>
	    </Card>
	    </Grid>
		<Alerts 
			id="dialogMags"
		  	type="info"
			draggable={true}
			open={magSelector && magSelector.length > 0}
			handleClose={()=>setMagSelector(null)}
			onOk={()=>selectMag(mag)}
			headerFooterFormat={{title:'Choix magasin',icon:'business',footer:null}}
		  >
			<div style={{display:'flex',flexDirection:'column',justifyContent:'space-around',height:240}}>
			<FormControl component="fieldset" error={!mag} className={classes.formControl}>
				<FormLabel component="legend">Choisissez un de vos magasin...</FormLabel>
				<RadioGroup aria-label="quiz" name="quiz" value={mag} onChange={(e)=>setMag(e.target.value)}>
					{magSelector && magSelector.map(ms=>{
						return(<FormControlLabel value={ms['idMagasin']} control={<Radio />} label={ms['Magasin']} />)
					})}
				</RadioGroup>
				{/*<FormHelperText>{helperText}</FormHelperText>*/}
			</FormControl>
			<Button type="submit" variant="contained" color="primary" disabled={!mag} onClick={e=>selectMag(mag)}>
				Ok
			</Button>
			</div>
		  </Alerts>
	    </Grid>
	)
}
export default Login