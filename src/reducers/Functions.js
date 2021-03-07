import { googleMapsKey } from "../context/Params";
/* eslint-disable radix */
/* eslint-disable no-extend-native */
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

Array.prototype.grouping = function(group,cols=null) {
	let obj=new Object();
	if(this.length < 1) { return false; }
	if(cols === null) { cols = Object.keys(this[0]); }
	obj=this.reduce((acc,cur)=>{
		if(Object.keys(acc).includes(cur[group])) { acc[cur[group]].push(cols.reduce((x,y)=>{x[y]=cur[y]; return x;},{})); }
		else { acc[cur[group]]=[cols.reduce((x,y)=>{x[y]=cur[y]; return x;},{})]; }
		return acc;
	},{}); 
	return obj;     
}

Array.prototype.minim = function(col){
    return this.reduce((acc,cur)=>{
    	return acc > cur[col] && cur[col] !== null ? cur[col] : acc },this[0][col])
}

Array.prototype.maxim = function(col){
    return this.reduce((acc,cur)=>{
    	return acc < cur[col] && cur[col] !== null ? cur[col] : acc },this[0][col])
}

Array.prototype.count = function(col) {
	return this.reduce((acc,cur)=>{
		return cur[col] && cur[col] !== null ? acc+1 : acc},0)
}

Array.prototype.different = function(col) { //different donnera le nombre des différentes possibilitéspour la colonne
	return this.reduce((acc,cur)=>{
		return cur[col] && cur[col] !== null && !acc.includes(cur[col]) ? acc.concat(cur[col]) : acc},[]).length
}

Array.prototype.sum = function(col) {
	return this.reduce((acc,cur)=>{
		return cur[col] && cur[col] !== null ? acc+Number(cur[col]) : acc},0)
}

Array.prototype.avg = function(col) {
	return this.sum(col)/this.count(col)
}

Array.prototype.avgDate = function(col) {
	let sts = this.reduce((acc,cur)=>{ let ts = cur[col] ? new Date(cur[col]).getTime() : 0
		return acc+ts },0)
	let dt = new Date(sts/this.count(col))
	return dt.toISOString()
}

Array.prototype.median = function(col) {
	let arr = this.reduce((acc,cur)=>{
		return cur[col] && cur[col] !== null ? acc.concat(cur[col]) : acc },[]).sort();
	return arr.length % 2 === 0 
		? (arr[parseInt(parseInt(arr.length/2)-1)] + arr[parseInt(arr.length/2)])/2 
		: arr[Math.floor(arr.length/2)]
}

Array.prototype.medianDate = function(col) {
	let arr = this.reduce((acc,cur)=>{
		return cur[col] && cur[col] !== null ? acc.concat(cur[col]) : acc },[]).sort();
	let rslt;
	if(arr.length % 2 === 0) {
		rslt = (new Date(arr[parseInt(parseInt(arr.length/2)-1)]) + new Date(arr[parseInt(arr.length/2)]))/2
	}
	else{
		rslt = new Date(arr[Math.floor(arr.length/2)])
	}
	return rslt.toISOString()
}

Array.prototype.groupCount = function(group,col) { 
    return this.reduce((acc,cur)=>{
		if(!group){ acc['all'] = acc['all'] ? acc['all'] + 1 : 1}
    	else if(acc[cur[group]]){ acc[cur[group]] += 1 }
    	else { acc[cur[group]] = 1 } 
  return acc  },{}) 
} 

Array.prototype.groupSum = function(group,col) { 
    return this.reduce((acc,cur)=>{
		let val = Number(cur[col])
		if(!group){ acc['all'] = acc['all'] ? acc['all'] + val : val}
    	else if(acc[cur[group]]){ acc[cur[group]] += val }
       	else { acc[cur[group]] = val } 
  return acc  },{}) 
} 

Array.prototype.groupAvg = function(group,col,precision=null) { 
    let obj = this.reduce((acc,cur)=>{
	    if(!group){ 
			if(!acc['all']){ acc['all'] = {sum:cur[col],count:1} }
			else{ acc['all']['sum'] += cur[col]; acc['all']['count'] += 1 } }
       else if(acc[cur[group]]){ acc[cur[group]]['sum'] += cur[col]; acc[cur[group]]['count'] += 1 }
       else { acc[cur[group]] = {}; acc[cur[group]]['sum'] = cur[col]; acc[cur[group]]['count'] = 1 } 
  	return acc  },{})
  return Object.keys(obj).reduce((a,c)=>{ a[c] = parseFloat((obj[c]['sum']/obj[c]['count']).toFixed(precision || 3)); return a },{}) 
} 

Array.prototype.groupMedian = function(group,col) { 
    let obj = this.reduce((acc,cur)=>{
		if(!group){ acc['all'] = acc['all'] ? acc['all'].concat(cur[col]) : [] }
    	else if(acc[cur[group]]){ acc[cur[group]] = acc[cur[group]].concat(cur[col]) }
       	else { acc[cur[group]] = [cur[col]] } 
  	return acc  },{})
  return Object.keys(obj).reduce((a,c)=>{ let cs = obj[c].sort(function(a, b){return a-b});
  		let l = cs.length;
    	if(l % 2 === 0){ a[c] = (cs[parseInt(l/2)] + cs[parseInt(l/2)-1]) / 2 }
    	else{ a[c] = cs[Math.floor(l/2)] }
    return a }
    ,{}) 
} 
export const clientPies = (arr,lab,val,op,color=null) =>{ //op ne peut etre que SUM ou COUNT
	let grp = new Object()
	if(op === "sum"){
		grp = arr.groupSum(lab,val)
	}
	else if(op === "count"){
		grp = arr.groupCount(lab,val)
	}
	return Object.keys(grp).map(g=>{
		let af = arr.filter(e=>{return e[lab] === g})
		let clr = color !== null && af.length > 0 ? af[0][color] : null
		return {id:g,label:g,value:grp[g],color:clr} })
}
export const serverPies = (obj,lab,val) =>{ //juste donner les noms label et value aux éléments
	let rslt = obj.map((e)=>{let v = new Object();
		v = {...e};
		v["label"] = e[lab];
		delete v[lab];
		v["value"] = e[val];
		delete v[val];
		return v;
	});
	return rslt;
};
//Bars, Matrix et Radar ont le meme format
export const clientBMR = (data,group,X,Y,op) =>{ //générer des données adéquats pour ces 3 formats coté client (pas de regroupement)
	let arr = [...data]
	let grp = arr.grouping(X,[group,Y])
	switch (op) {
		case "sum" :
			return Object.keys(grp).map(g=>{ return {...grp[g].groupSum(group,Y),[X]:g} })
		break;
		case "count" :
			return Object.keys(grp).map(g=>{ return {...grp[g].groupCount(group,Y),[X]:g} })
		break;
		case "avg" :
			return Object.keys(grp).map(g=>{ return {...grp[g].groupAvg(group,Y),[X]:g} })
		break;
		case "median" :
			return Object.keys(grp).map(g=>{ return {...grp[g].groupMedian(group,Y),[X]:g} })
		break;
		default : return []
	}
}
//Pour les fonctions serveurs, on suppose que le regroupement et les opérations ont été effectués en backend
export const serverBMR = (obj,group,key,somme) =>{ //key est la clé de la colonne de sommation et somme celle du nombre
	let grouped = obj.grouping(group,[key,somme]);
	let rslt = Object.keys(grouped).map((g)=>{
		return Object.assign({[group]:g},grouped[g].reduce((acc,cur)=>{
		 acc[cur[key]]=cur[somme]; return acc; },[]));	
	});
	return rslt;
};
export const clientLines = (dat,group,X,Y,op,color=null,precision=null) =>{ //si X est de type date/time op ne doit etre que SUM ou COUNT
	let arr = []
	dat = dat.filter(ar=>ar[X])
	if(precision){
		switch(precision){ //Bon exemple d'un code qui serait moins bon en clean code
			case "year":
				arr = dat.map((ar,i)=>{ 
					let changed = new Date(ar[X])  
					return {...ar,[X]:changed.getFullYear()+"-01-01"}
				})
			break;
			case "month":
				arr = dat.map((ar,i)=>{ 
					let changed = new Date(ar[X])  
					return {...ar,[X]:changed.getFullYear()+"-"+parseInt(changed.getMonth()+1)+"-01"}
				})
			break;
			case "day":
				arr = dat.map((ar,i)=>{ 
					let changed = new Date(ar[X])  
					return {...ar,[X]:changed.getFullYear()+"-"+parseInt(changed.getMonth()+1)+"-"+changed.getDate()}
				})
			break;
			case "hour":
				arr = dat.map((ar,i)=>{ 
					let changed = new Date(ar[X])  
					return {...ar,[X]:changed.getFullYear()+"-"+parseInt(changed.getMonth()+1)+"-"+changed.getDate()+"T"+changed.getHours()}
				})
			break;
			case "minute":
				arr = dat.map((ar,i)=>{ 
					let changed = new Date(ar[X])  
					return {...ar,[X]:changed.getFullYear()+"-"+parseInt(changed.getMonth()+1)+"-"+changed.getDate()+"T"+changed.getHours()+":"+changed.getMinutes()}
				})
			break
			default: arr = [...dat]
				return false
		}
	}
	arr = arr.sort((a,b)=> new Date(a[X]) > new Date(b[X]))
	let grp = [];
	let grouped = arr.reduce((acc,cur)=>{
		let ind = grp.indexOf(cur[group]);
		if(ind < 0){ //ce groupe n'a pas encore été ajouté
			acc = acc.concat({id:cur[group],color:cur[color] || null,data:[{x:cur[X],y:cur[Y]}]})
			grp.push(cur[group])
		}
		else{ //a déjà été croisé
			acc[ind]['data'] = acc[ind]['data'].concat({x:cur[X],y:cur[Y]})
		}
		return acc
	},[]);
	return grouped.map(g=>{
		let opData = {}
		if(group==='all'){
			opData = op === "count" ? g.data.groupCount('x','y','all') : (op === "avg" ? g.data.groupAvg('x','y','all') : g.data.groupSum('x','y','all'))
		}
		else{
			opData = op === "count" ? g.data.groupCount('x','y') : (op === "avg" ? g.data.groupAvg('x','y') : g.data.groupSum('x','y'))
		}
		let data = Object.keys(opData).reduce((acc,cur)=>{return acc.concat({x:cur,y:opData[cur]})},[])
		return {id:g.id,color:g.color,data} })
}
export const serverLines = (obj,group,X,Y,cols=[]) =>{ //cols sont les éventuelles colonnes supplémentaitres
	let passed = [];
	let rslt = obj.reduce((acc,cur)=>{
		let pos = passed.indexOf(cur[group]); //group est tjr égale à "id" pour Nivo
		if(pos >= 0) {
		 acc[pos]["data"].push({x:cur[X],y:cur[Y]}); 
		}
		else {
		 passed.push(cur[group]);	
		 let line = {[group]:cur[group],data:[{x:cur[X],y:cur[Y]}]};
		 cols && cols.map(c=>{line[c]=cur[c];});
		 acc.push(line);
		}
		return acc;
	},[]);
	return rslt;
};

export const regroup = lev => (ob) =>{ 
	let grps = [];
	return ob.reduce((acc,cur)=>{ 
		let strLevel = JSON.stringify(Object.keys(cur).reduce((a,c)=>{return lev.includes(c) ? {...a,[c]:cur[c]} : a},{}))
		//if(cur[grp]) { //vérifier que la key de regroupement existe, sinon ne rien faire
			if(grps.includes(strLevel)){
				let ind = grps.indexOf(strLevel)
				acc[ind]["children"].push(
					Object.keys(cur).reduce((circle,elm)=>{ if(!lev.includes(elm)){
						circle[elm]=cur[elm]; } return circle },{}));
			}
			else{
				grps.push(strLevel);
				acc.push(Object.keys(cur).reduce((a,c)=>{ 
					lev.includes(c) ? a = {...a,[c]:cur[c]} : a['children'][0][c] = cur[c]
					return a;
				},{children:[{}]}));
			}
		return acc }
	,[])
}

export const nestData = (...levels) => obj =>{ //exp: BubbleA = nestData(['nom'],['adresse','age']); y = BubbleA(donnees)
	let depth = (data,fct)=>{ //Cette fonction applique fct si il n'y a plus de child sinon descend d'un niveau
		let checkChild = data.reduce((a,c)=>{return a || Array.isArray(c["children"]); },false);
		let out = checkChild ? data.map(d=>{
			if(Object.keys(d).includes("children")) { d.children=depth(d.children,fct); } return d;
		}) : fct(data);
		return out;};	
	let rslt = [...obj];
	levels.map((level,i)=>{
		let levRegroup = regroup(level);
		rslt = depth(rslt,levRegroup);
	});
	return rslt;
}

export const check = (jsn,cond,column={},or=";",and="&",neg="!") =>{ // cond: {label;'id',operator:'in',value:[1,2,3]}
	const { label, operator, value } = cond;
	if(label === undefined || operator === undefined || value === undefined){
	 console.log("Erreur de format"); return false }
	if(!jsn[label] && operator !== "like"){
		return false
	}
	else{
		switch (operator){
			case "=" : return jsn[label] === value;
			case ">" :  return column.type && column.type.includes("date") ? new Date(jsn[label]) > new Date(value) : jsn[label] > value;
			case "<" : return column.type && column.type.includes("date") ? new Date(jsn[label]) < new Date(value) : jsn[label] < value;
			case ">=" : return column.type && column.type.includes("date") ? new Date(jsn[label]) >= new Date(value) : jsn[label] >= value;
			case "<=" : return column.type && column.type.includes("date") ? new Date(jsn[label]) <= new Date(value) : jsn[label] <= value;
			case "<>" : return column.type && column.type.includes("date") ? new Date(jsn[label]) !== new Date(value) : jsn[label] !== value;
			case "like" :
				let values = value.toString().split(or)
				let j = jsn[label] || ""
					return values.some(v=>{
						return v.toString().split(and).every(va=>{
							return va[0] === neg 
							? !j.toString().toLowerCase().includes(va.substr(1,va.length-1).toLowerCase()) 
							: j.toString().toLowerCase().includes(va.toLowerCase())
						})
					}) 
			case "in" : return value.length === 0 || value.includes(jsn[label]);
			default: return value === jsn[label]
		}
	}
}

export const displayFilter = (exp,or=";",and="&") =>{ //Donner une représentation écrite d'une expression de filtrage(en json)
	if(exp.operator === 'like'){
		return "contient: '"+exp.value.toString().split(or).reduce((acc,cur)=>{return acc.concat(cur.toString().split(and).join("' et '"))},[]).join("' ou '")+"'"
	}
	else if(exp.operator === 'in'){
		return "parmi: '"+exp.value.join("', '")+"'"
	}
	else{
		return exp.operator+" '"+exp.value+"'"
	}
}

const checks = (jsn,conds,columns) =>{ // conds: [{label:'id',operator:'in',value:[1,2,3]},{label...}...]
	return conds.reduce((acc,cur)=>{ acc = acc && check(jsn,cur,columns[cur['label']]); return acc },true)
}

export const filt = (arr,conds=[],columns,exclude=false) =>{
	return arr.filter(jsn => {
		return exclude ? !checks(jsn,conds,columns) : checks(jsn,conds,columns)
	})
}

export const limit = (arr,lim=null) =>{ //lim est 1 array de arrays, contenant chacun 1 ou 2 éléments
	if(lim){
		return lim.reduce((acc,cur)=>{ 
			return acc.concat(cur.length === 2 ? [arr.slice(cur[0],cur[1])] : (cur.length === 1 ? [arr.slice(0,cur[0])] : []))	
		},[])
	}
	else{
		return arr
	}
}

export const globalType = type =>{
	if(type.includes("int") || type.includes("float") || type.includes("decimal")){
		return "number"
	}
	else if(type.includes("date")){
		return "date"
	}
	else if(type === "time"){
		return "time"
	}
	else if(type.includes("image")){
		return "image"
	}
	else if(type === "color"){
		return "color"
	}
	else if(type.includes("foreign")){
		return "foreign"
	}
	else{
		return "text"
	}
}
 
export const indexation = (arr,ind=[]) =>{ //indexer un array hiérarchique avec un système de array qui contient les coordonnées pour accéder à l'array actuel
	return arr.map((obj,i)=>{
		obj['index'] = [...ind,i]
		if(obj['children']){
			obj['children'] = indexation(obj['children'],[...ind,i])
		}
		return obj
	})
}

export const readIndex = (arr,ind=[0]) =>{ //Lecture d'un certain index d'un arbre hiérarchique indexé 
	// le array d'origine sera mutable par rapport à l'objet du return !!!
	if(Array.isArray(arr) && arr.length > 0){
		let nd = [...ind];
		nd.shift() //retirer le premier élement	
		let exp = nd.reduce((acc,cur)=>{ return `${acc}.children[${cur}]` },`arr[${ind[0]}]`)
		return eval(exp)
	}
	else{ return {} }
}

export function cleanFromKeys(obj,keys){
    return Object.keys(obj).reduce((a,c)=>{ return keys.includes(c) ? a : {...a,[c]:obj[c]}},{})
}

export function mailValidation(mail){
	let mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return mailFormat.test(mail)
}

export function Itinerary(orig,dest,mode="car"){
	//adapter selon qu'on donne une adresse ou un latlng
	let org = typeof orig === "string" ? orig.replace(" ","+") : orig.lat+","+orig.lng
	let des = typeof dest === "string" ? dest.replace(" ","+") : dest.lat+","+dest.lng
	window.open(`https://www.google.com/maps/dir/?api=1&origin=${org}&destination=${des}&travelmode=${mode}`)
}

/**
 * Function that calculates the great circle distance between two points (Shortest distance on Earth)
 * @param {Shape({lat: Number, lng: Number})} p1 Coordinates for point 1
 * @param {Shape({lat: Number, lng: Number})} p2 Coordinates for point 2
 * @returns {Number} Distance in meters
 */
export function circleDistance(p1, p2) {
	console.log(p1,p2)
	const R = 6371e3; // metres
	const { lat: lat1, lng: lon1 } = p1;
	const { lat: lat2, lng: lon2 } = p2;
	const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  
	const a =
	  Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
	  Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
	const d = R * c; // in metres
	return d;
  }
  
  export async function geocode(address) {
	// Handle failure case
	if (typeof address !== "string")
	  throw new TypeError(
		"The address argument in geocode function should be a String."
	  );
	return await fetch(
	  `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsKey}`
	)
	  .then((res) => res.json())
	  .then((res) => {
		if (res.status !== "OK") throw new Error("Location not found");
		else return res;
	  })
	  .then((res) => res.results[0].geometry.location)
	  .catch((err) => {
		throw new Error("Error connecting to the Google Maps service, " + err);
	  });
  }

  export async function distanceAndTime(from,to,departure_time="now",fct){
	var service = new window.google.maps.DistanceMatrixService();
	let ffrom = extractPos(from,'object')
	let fto = extractPos(to,'object')
	let departure = new Date(departure_time).getTime()
	var result;
	return service.getDistanceMatrix(
		{
		  origins: [ffrom],
		  destinations: [fto],
		  //departureTime: departure,
		  travelMode: window.google.maps.TravelMode.DRIVING,
		  //unitSystem: google.maps.UnitSystem.METRIC,
		  avoidHighways: false,
		  avoidTolls: false,
		},
		(rep, status) => {
			if(status === "OK"){
				console.log("response matrix = ",rep,status)
				let rslt = {
					distance:rep.rows[0]['elements'][0]['distance'] ? rep.rows[0]['elements'][0]['distance']['value'] : null,
					duration:rep.rows[0]['elements'][0]['duration'] ? rep.rows[0]['elements'][0]['duration']['value'] : null
				}
				fct && fct(rslt)
				return rslt
			}
			else{
				alert("Impossible de calculer la distance !")
				throw new Error("Impossible de calculer la distance")
			}
		}
  	)
	  /*return await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${ffrom}&destinations=${fto}${departure}&key=${googleMapsKey}`,{mode:'no-cors'})
	  	.then(prm => prm.json())
		.then(rep =>{
			if(rep.status === "OK"){
				return {
					distance:rep.rows[0]['elements'][0]['distance'] ? rep.rows[0]['elements'][0]['distance']['value'] : null,
					duration:rep.rows[0]['elements'][0]['duration'] ? rep.rows[0]['elements'][0]['duration']['value'] : null
				}
			}
			else{
				throw new Error("Impossible de calculer la distance")
			}
		})
		.then(resp=>{ return resp })
		.catch((err) => {
			throw new Error("Error connecting to the Google Maps service, " + err);
		});*/
  }
  
  /**
   * Function that parses a string and extracts a latitude, longitude object from it
   * @param {String} address The string to parse
   */
export function extractPos(address,format="text") {
	let position;
	if (typeof address === "string") {
	  try {
		position = JSON.parse(address.replace(/(.+){(.+)}/, "{$2}"));
	  } catch (e) {
		return null;
	  }
	} else {
	  position = address && address.lat ? address : null;
	}
	return position && position.lat 
	? (format === "text" ? Object.values(position).join(",") : position)
	: null
}
  /**
   * Function that parses a string address and delete the position part from it
   * @param {String} address The string to parse
   */
  export function extractAddress(address) {
	let position;
	if (typeof address === "string") {
		position = address.replace(/(.+){(.+)}/, "$1");  
	} 
	else {
	  position = null
	}
	return position
}

  