/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

const struc = browser.storage.local.get("storageToSend");
struc.then(function(item){
 	var tabVCs = item.storageToSend;
 	console.log(tabVCs);
 	for (var i = 0; i < tabVCs.length; i++) {
		var credential = Object.keys(tabVCs[i][0].credentialSubject)[0];
		var issuer = tabVCs[i][0]['issuer'];
		document.getElementById('listVC').innerHTML += "<input class='vcAvailable' type='checkbox' id='" + i + "'>" + credential + " ----> from " + issuer + "</br>";
	}
});







