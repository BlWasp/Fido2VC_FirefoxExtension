/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

const struc = browser.storage.local.get("spStorage");
struc.then(function(item){
	document.getElementById("TokenID").value = item.spStorage[0].user_token;
});
