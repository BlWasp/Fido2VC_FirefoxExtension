/*
	Default test JSON-LD structure
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
	Default test JWT structure with proof
*/
var header = {
    "alg": "RS256",
    "typ": "JWT",
    "kid": "did:example:abfe13f712120431c276e12ecab#keys-1"
};
var data = {
  "sub": "did:example:ebfeb1f712ebc6f1c276e12ec21",
  "jti": "http://example.edu/credentials/3732",
  "iss": "did:example:abfe13f712120431c276e12ecab",
  "iat": "1541493724",
  "exp": "1573029723",
  "nonce": "660!6345FSer",
  "vc": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "type": ["VerifiableCredential", "UniversityDegreeCredential"],
    "credentialSubject": {
      "degree": {
        "type": "BachelorDegree",
        "name": "<span lang='fr-CA'>Baccalauréat en musiques numériques</span>"
      }
    }
  }
};

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
	Take the URL where the JSON structure is stored
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
	Encode the JWT structure with signature validity purpose
*/
var encStruct;
function getStructEncoding(struct) {
	let enc = new TextEncoder();
	encStruct = enc.encode(struct);
}
/*
	When a new JSON-LD or JWT structure is received this function check the validity with the proof
	Also check de expiration validity
*/
function checkStrucValidity(key,signature) {
	let concat = JSON.stringify(header).concat(JSON.stringify(data));
	getStructEncoding(concat);
	let encoded = encStruct;
	// signature = await window.crypto.subtle.sign("HMAC",key,encoded);
	let result = window.crypto.subtle.verify("HMAC", key, signature, encoded);
	console.log(result);
}

// Generate un HMAC key. Only for test purpose.
// let signature;
// window.crypto.subtle.generateKey(
// {
// 	name: "HMAC",
// 	hash: {name: "SHA-256"}
// },
//   	true,
// 	["sign", "verify"]
// ).then((key) => {
// 	checkStrucValidity(key,signature);
// });

/*
	Check stored structure and store default structure if needed
*/
function checkSettings(settings) {
	if(!settings.strucJSONfromURL) {
		browser.storage.local.set({strucJSONfromURL});
	}
}

// getStruct('https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json');
// const getStructFromLocal = browser.storage.local.get();
// getStructFromLocal.then(checkSettings, onError);
// getStruc.then(onGot, onError);