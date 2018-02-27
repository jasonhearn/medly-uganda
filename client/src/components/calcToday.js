export default function requireAuth() {
	var today = new Date();
	var dd = 14 //today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yy = today.getFullYear().toString().substr(2);
	console.log(yy)
	if (dd<10) { dd='0'+dd } 
	if (mm<10) { mm='0'+mm } 
	return today = yy+'-'+mm+'-'+dd;
}