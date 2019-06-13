/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

/*
	Fill the user_token which identify the transaction
	It is provided by the SP and used by the IDP when you select the VC you want
*/
const struc = browser.storage.local.get("spStorage");
struc.then(function(item){
	document.getElementById("TokenID").value = item.spStorage[0].user_token;
});
