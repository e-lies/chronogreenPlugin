export function Itinerary(orig,dest,mode="car"){
	console.log(orig,dest)
	//adapter selon qu'on donne une adresse ou un latlng
	let org = typeof orig === "string" ? orig.replace(" ","+") : orig.lat+","+orig.lng
	let des = typeof dest === "string" ? dest.replace(" ","+") : dest.lat+","+dest.lng
	window.open(`https://www.google.com/maps/dir/?api=1&origin=${org}&destination=${des}&travelmode=${mode}`)
}