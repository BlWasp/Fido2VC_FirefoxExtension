/*
	Default test JSON structure
*/
// var strucJson = {
// 	"@context" : [
// 		"https://www.w3.org/2018/credentials/v1",
// 		"https://schema.org",
// 	],
// 	"id": "http://example.edu/credentials/58473",
// 	"type": ["VerifiableCredential", "Person"],
// 	"credentialSubject": {
// 		"id": "did:example:a1b2c3d4",
// 		"alumniOf": "Example University"
// 	}
// }

/*
	Error logger
*/
function onError(e) {
	console.error(e);
}

/*
	Win logger
*/
function onGot(item) {
	console.log(JSON.stringify(item));
}

/*
	Take the URL where the JSON-LD structure is stored
	Prepare a XHR request and send it to the server to take the whole JSON-LD structure
*/
var strucJSONfromURL;
function getStruct(url) {
	let reqURL = url;
	let req = new XMLHttpRequest();
	req.open('GET', reqURL);
	req.responseType = 'json';
	req.send();

	req.onload = function() {
		strucJSONfromURL = req.response;
	}
}

/*
	Check stored structure and store default structure if needed
*/
function checkStruc(settings) {
	if(!settings.strucJSONfromURL) {
		browser.storage.local.set({strucJSONfromURL});
	}
}

getStruct('https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json');
const getStructFromLocal = browser.storage.local.get();
getStructFromLocal.then(checkStruc, onError);
// getStruc.then(onGot, onError);