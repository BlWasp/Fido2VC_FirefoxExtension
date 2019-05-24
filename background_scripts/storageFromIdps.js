/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/


/*
	Default test JSON-LD structure with proof
*/
var jsonStruc = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1"
  ],
  "id": "http://example.gov/credentials/3732",
  "type": ["VerifiableCredential", "UniversityDegreeCredential"],
  "issuer": "https://example.edu",
  "issuanceDate": "2010-01-01T19:73:24Z",
  "credentialSubject": {
    "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
    "degree": {
      "type": "BachelorDegree",
      "name": "<span lang='fr-CA'>Baccalauréat en musiques numériques</span>"
    }
  },
  "proof": {
    "type": "RsaSignature2018",
    "created": "2018-06-18T21:19:10Z",
    "verificationMethod": "https://example.com/jdoe/keys/1",
    "signatureValue": "BavEll0/I1zpYw8XNi1bgVg/sCneO4Jugez8RwDg/+MCRVpjOboDoe4SxxKjkCOvKiCHGDvc4krqi6Z1n0UfqzxGfmatCuFibcC1wpsPRdW+gGsutPTLzvueMWmFhwYmfIFpbBu95t501+rSLHIEuujM/+PXr9Cky6Ed+W3JT24="
  }
}

/*
	Default test payload structure with proof
*/
var payloadStruct = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpleGFtcGxlOmFiZmUxM2Y3MTIxMjA0MzFjMjc2ZTEyZWNhYiNrZXlzLTEifQ.eyJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJqdGkiOiJodHRwOi8vZXhhbXBsZS5lZHUvY3JlZGVudGlhbHMvMzczMiIsImlzcyI6ImRpZDpleGFtcGxlOmFiZmUxM2Y3MTIxMjA0MzFjMjc2ZTEyZWNhYiIsImlhdCI6IjE1NDE0OTM3MjQiLCJleHAiOiIxNTczMDI5NzIzIiwibm9uY2UiOiI2NjAhNjM0NUZTZXIiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3czLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9leGFtcGxlLmNvbS9leGFtcGxlcy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZGVncmVlIjp7InR5cGUiOiJCYWNoZWxvckRlZ3JlZSIsIm5hbWUiOiJCYWNoZWxvciBvZiBTY2llbmNlIGluIE1lY2hhbmljYWwgRW5naW5lZXJpbmcifX19fQ.ZVr7y8JREGqA2hwL_eSfMgjaLwwwq1rGU6j3JgltZp_BoKrBcIZxT8-f8pahiX8uMRZb4eg_qj_TJ59f-64_Qd5qOfYiO2iGRZ2HMitcFbPHj8_fW0zISFQVMK7EauSuUmmm48xiRTUkM0tOeU4IgmoNHRBtrs23f5exHinundQ3etaC0B-Nl3-qNS9pQWZARW9kG_UIvVvYJdZOV94pEv5ws8aU3-3Cabr-ivn-4_PcqF8rVuu-XK5qZBag90UCx7-7NQorre2CeJIiOwUryuCNWvUqzOEiCJayqk1-HJy51UBIPUbYnogo064Aw35NeQKJd4VssJlIUhTI1-SjSQ";

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
	Key importation section. Public is for final goal, Private is just for test purpose
*/
function str2ab(str) {
	const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
    	bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

const pemEncodedPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnzyis1ZjfNB0bBgKFMSvvkTtwlvBsaJq7S5wA+kzeVOVpVWwkWdVha4s38XM/pa/yr47av7+z3VTmvDRyAHcaT92whREFpLv9cj5lTeJSibyr/Mrm/YtjCZVWgaOYIhwrXwKLqPr/11inWsAkfIytvHWTxZYEcXLgAXFuUuaS3uF9gEiNQwzGTU1v0FqkqTBr4B8nW3HCN47XUu0t8Y0e+lf4s4OxQawWD79J9/5d3Ry0vbV3Am1FtGJiJvOwRsIfVChDpYStTcHTCMqtvWbV6L11BWkpzGXSW4Hv43qa+GSYOD2QU68Mb59oSk2OB+BtOLpJofmbGEGgvmwyCI9MwIDAQAB
-----END PUBLIC KEY-----`;

const pemEncodedPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDD0tPV/du2vftjvXj1t/gXTK39sNBVrOAEb/jKzXae+Xa0H+3LhZaQIQNMfACiBSgIfZUvEGb+7TqXWQpoLoFR/R7MvGWcSk98JyrVtveD8ZmZYyItSY7m2hcasqAFiKyOouV5vzyRe87/lEyzzBpF3bQQ4IDaQu+K9Hj5fKuU6rrOeOhsdnJc+VdDQLScHxvMoLZ9Vtt+oK9J4/tOLwr4CG8khDlBURcBY6gPcLo3dPU09SW+6ctX2cX4mkXx6O/0mmdTmacr/vu50KdRMleFeZYOWPAEhhMfywybTuzBiPVIZVP8WFCSKNMbfi1S9A9PdBqnebwwHhX3/hsEBt2BAgMBAAECggEABEI1P6nf6Zs7mJlyBDv+Pfl5rjL2cOqLy6TovvZVblMkCPpJyFuNIPDK2tK2i897ZaXfhPDBIKmllM2Hq6jZQKB110OAnTPDg0JxzMiIHPs32S1d/KilHjGff4Hjd4NXp1l1Dp8BUPOllorR2TYm2x6dcCGFw9lhTr8O03Qp4hjn84VjGIWADYCk83mgS4nRsnHkdiqYnWx1AjKlY51yEK6RcrDMi0Th2RXrrINoC35sVv+APt2rkoMGi52RwTEseA1KZGFrxjq61ReJif6p2VXEcvHeX6CWLx014LGk43z6Q28P6HgeEVEfIjyqCUea5Du/mYb/QsRSCosXLxBqwQKBgQD1+fdC9ZiMrVI+km7Nx2CKBn8rJrDmUh5SbXn2MYJdrUd8bYNnZkCgKMgxVXsvJrbmVOrby2txOiqudZkk5mD3E5O/QZWPWQLgRu8ueYNpobAX9NRgNfZ7rZD+81vh5MfZiXfuZOuzv29iZhU0oqyZ9y75eHkLdrerNkwYOe5aUQKBgQDLzapDi1NxkBgsj9iiO4KUa7jvD4JjRqFy4Zhj/jbQvlvM0F/uFp7sxVcHGx4r11C+6iCbhX4u+Zuu0HGjT4d+hNXmgGyxR8fIUVxOlOtDkVJa5sOBZK73/9/MBeKusdmJPRhalZQfMUJRWIoEVDMhfg3tW/rBj5RYAtP2dTVUMQKBgDs8yr52dRmT+BWXoFWwaWB0NhYHSFz/c8v4D4Ip5DJ5M5kUqquxJWksySGQa40sbqnD05fBQovPLU48hfgr/zghn9hUjBcsoZOvoZR4sRw0UztBvA+7jzOz1hKAOyWIulR6Vca0yUrNlJ6G5R56+sRNkiOETupi2dLCzcqb0PoxAoGAZyNHvTLvIZN4iGSrjz5qkM4LIwBIThFadxbv1fq6pt0O/BGf2o+cEdq0diYlGK64cEVwBwSBnSg4vzlBqRIAUejLjwEDAJyA4EE8Y5A9l04dzV7nJb5cRak6CrgXxay/mBJRFtaHxVlaZGxYPGSYE6UFS0+3EOmmevvDZQBf4qECgYEA0ZF6Vavz28+8wLO6SP3w8NmpHk7K9tGEvUfQ30SgDx4G7qPIgfPrbB4OP/E0qCfsIImi3sCPpjvUMQdVVZyPOIMuB+rV3ZOxkrzxEUOrpOpR48FZbL7RN90yRQsAsrp9e4iv8QwB3VxLe7X0TDqqnRyqrc/osGzuS2ZcHOKmCU8=
-----END PRIVATE KEY-----`;



function importPublicKey(structToAnalyse,pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    window.crypto.subtle.importKey(
    	"spki",
    	binaryDer,
    	{
        	name: "RSASSA-PKCS1-v1_5",
        	hash: "SHA-256"
    	},
      	true,
      	["verify"]
    ).then(function(publicKey) {
    	// importPrivateKey(structToAnalyse,publicKey,pemPrivate);
    	checkStrucValidity(structToAnalyse,publicKey);
    })
    .catch(function(err) {
    	console.error(err);
    });
}

function importPrivateKey(structToAnalyse,publicKey,pemPrivate) {
	// fetch the part of the PEM string between header and footer
	const pemHeader = "-----BEGIN PRIVATE KEY-----";
	const pemFooter = "-----END PRIVATE KEY-----";
	const pemContents = pemPrivate.substring(pemHeader.length, pemPrivate.length - pemFooter.length);
	// base64 decode the string to get the binary data
	const binaryDerString = window.atob(pemContents);
	// convert from a binary string to an ArrayBuffer
	const binaryDer = str2ab(binaryDerString);

	return window.crypto.subtle.importKey(
		"pkcs8",
    	binaryDer,
    	{
			name: "RSASSA-PKCS1-v1_5",
      		// Consider using a 4096-bit key for systems that require long-term security
      		modulusLength: 2048,
      		publicExponent: new Uint8Array([1, 0, 1]),
      		hash: "SHA-256",
    	},
    	true,
    	["sign"]
  	).then(function(privateKey){
		checkStrucValidity(structToAnalyse,publicKey,privateKey);
	})
	.catch(function(err){
    	console.error(err);
	});
}
/*
	End of import
*/

/*
	Generate a private and a public RSA keys with SHA-256 for test purpose
*/
function generateRSAKey(structToAnalyse) {
	return window.crypto.subtle.generateKey(
	{
		name: "RSASSA-PKCS1-v1_5",
		modulusLength: 2048,
		publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		hash: {name: "SHA-256"}
	},
	false,
	["sign", "verify"]
	).then(function(key) {
		checkStrucValidity(structToAnalyse, key.publicKey, key.privateKey);
	})
	.catch(function(err) {
		console.error(err);
	});
}

/*
	This array will store the local storage for verification
*/
var structArrayHistory = [];
var utfArray = []; // Will get back the array from the Idp with the structure convert in UTF-8
var storageToSend = [];
var issuer;

/*
	Take the URL where the JSON structure is stored
	Prepare a XHR request and send it to the server to take the whole JSON-LD or payload structure
*/
var structJSONfromURL;
function getRespFromIDP(){
	console.log("jkfjkfhkjfsjkfdskjhfsjkfjkjfkskjfds");
	browser.webRequest.onBeforeRequest.removeListener(getRespFromIDP);
	var xmlHttp = new XMLHttpRequest();
	let reqURL = "https://example.com:5000/verifiable_credentials";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        	structJSONfromURL = xmlHttp.response;
        	console.log(structJSONfromURL);
        	if (checkStrucValidity(structJSONfromURL,"payload")) {
				const getHistoryFromLocal = browser.storage.local.get(structArrayHistory);
				getHistoryFromLocal.then(function(settings) {
					addStorageHistory(settings);
				});
				const getSendFromLocal = browser.storage.local.get(storageToSend);
				getSendFromLocal.then(function(settings) {
					addStorageToSend(settings);
				});
			}

            browser.webRequest.onBeforeRequest.addListener(
 				getRespFromIDP,
 				{urls: ["https://example.com/verifiable_credentials"]}
 			);
        }
    }
	xmlHttp.open("GET", reqURL, true); // true for asynchronous 
	xmlHttp.responseType = 'json';
	xmlHttp.send(null);
}

/*
var structJSONfromURL;
function getStructFromURL(request) {
	let reqURL = request.url;
	let req = new XMLHttpRequest();
	req.open('GET', reqURL);
	req.responseType = 'json';
	req.send();

	req.onload = function() {
		structJSONfromURL = req.response;
		if (checkStrucValidity(structJSONfromURL,"payload")) {
			const getHistoryFromLocal = browser.storage.local.get();
			getHistoryFromLocal.then(function(settings) {
				addStorageHistory(settings,structJSONfromURL);
			});
		}
	}
}*/


/*
	Convert Base64 to UTF-8
*/
function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}

/*
	Encode the JSON structure for signature validity purpose
*/
function getStructEncoding(struct) {
	let enc = new TextEncoder();
	return enc.encode(struct); 
}


/*
	When a new JSON-LD or payload structure is received this function check the validity with the proof
	Also check de expiration validity
*/
// let signature;
let concat;
function checkStrucValidity(structToAnalyse,type) {
	// var result = false;
	if (type == "payload") {  // If it's a payload structure
		for (var loopListVC of structToAnalyse['vcList']) {
			/* Divide the Base64 structure according to the '.' and take the header, the payload and the proof
			Concates the header and the payload with a "."
			Encode everythings with an ArrayBuffer for the cyrpto function and then verify the proof with the public key */
			let parts = loopListVC.split('.');
			let header = parts[0];
			let data = parts[1];
			let dataUTF = JSON.parse(b64_to_utf8(data));

			if (!parseVC(JWTtoJSLD(dataUTF))) {
				console.log("Problem with VC parser");
				return false;
			}
			// let schemaURL = dataUTF['vc']['credentialSchema']['id'];
			// let schemaReq = new XMLHttpRequest();
			// schemaReq.open('GET', schemaURL);
			// schemaReq.responseType = 'json';
			// schemaReq.send();
			
			// schemaReq.onload = function() { //Take the schema from the URI
			// 	let schemaVerif = schemaReq.response;
			// 	if (verifySchema(schemaVerif,dataUTF['vc'])) {

					console.log("VC parse OK");
					let proof = parts[2];
					let encodedProof = getStructEncoding(proof);

					concat = header.concat('.').concat(data); // Concat the header with the payload
					let encoded = getStructEncoding(concat);

					let headerUTF = JSON.parse(b64_to_utf8(header));
					let publicKey = headerUTF.kid;
					window.crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5",},publicKey,encodedProof,encoded).then(function(result) {
						if (!result) {
							onError(result);
							utfArray.splice(0,utfArray.length);
							storageToSend.splice(0,storageToSend.length);
							return result;
						}
						issuer = dataUTF['vc']['issuer'];
						storageToSend.push(dataUTF['vc']);
						utfArray.push(JSON.stringify(headerUTF)+"."+JSON.stringify(dataUTF)); // For the history
						// return result;
					});

			// 	}
			// }
		}
		return true;
		
		
		// await window.crypto.subtle.sign({name: "RSASSA-PKCS1-v1_5",},privateKey,encoded).then(function(signature) {
		// 	console.log(new Uint8Array(signature));
		// 	window.crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5",},publicKey,signature,encoded)
		// 	.then(function(result) {
		// 		console.log(result);
		// 	});
		// });
	} else{ // If it's a JSON-LD structure
	}
}

/*
	When the JSON structure is received it contains a "schema" attribut
	This function provides a schema verification between the payload of the VC and the schema
*/
function verifySchema(schema,payload) {
	let properties = schema['properties'];
	for (var attributs in payload) {
		for (var checkAttributs in properties) {
			if (attributs == checkAttributs) {
				console.log("Valide attributs");
				if (typeof(payload[attributs]) == schema['properties'][checkAttributs]['type']) {
					if (typeof(payload[attributs]) == "object") {
						if (!verifySchema(schema['properties'][checkAttributs],payload[attributs])) {
							return false;
						}
					}
          			console.log("Valide type");
				} else {
					console.log("Not valide type");
					return false;
				}
			}
		}
	}
	return true;
}


/*
	Verify the structArrayHistory to check if the structure is not already present
*/
function loopArray(structToFind) {
	console.log(structArrayHistory.length);
	for (struct in structArrayHistory) {
		if (JSON.stringify(structArrayHistory[struct]) == JSON.stringify(structToFind)) {
			return true;
		}
	}
	return false;
}

/*
	This 2 functions allow to store the VCs received from the issuers for history purpose
*/

/*
	Add the new structure in the structArrayHistory
*/
function pushArrayHistory(structToPush,issuer) {
	let historyObject = {};
	historyObject[issuer] = structToPush;
	structArrayHistory.push(historyObject);
}

/*
	Allow to add the new payload structures to the history array in the local storage
	If no array already exist, it is create, else it's just a push
*/
function addStorageHistory(settings) {
	if(!settings.structArrayHistory) {
		// console.log("No array");
		pushArrayHistory(utfArray,issuer);
		browser.storage.local.set({structArrayHistory});
	} else {
		// console.log("Else");
		structArrayHistory = settings.structArrayHistory;
		pushArrayHistory(utfArray,issuer);
		browser.storage.local.set({structArrayHistory});
	}
}


/*
	This function allows to store the VCs to send
*/
function addStorageToSend(settings) {
	if(!settings.storageToSend) {
		browser.storage.local.set({storageToSend});
	} else {
		for (var loopStorageToSend of settings.storageToSend) {
			storageToSend.push(loopStorageToSend);
		}
		browser.storage.local.set({storageToSend});
	}
}


/*
	Main part
*/
// importPublicKey(payloadStruct,pemEncodedPublicKey);
// generateRSAKey(payloadStruct);
browser.webRequest.onBeforeRequest.addListener(
	getRespFromIDP,
	{urls: ["https://example.com/verifiable_credentials"]}
);

/*
	End main part
*/



/*
	All the section above is the VC parser
	It will make some verification for the VC validity
*/
var dictionary = {};
var vcIsValid = true;

var vc = {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1"
    ],
    "id": "http://example.edu/credentials/1872",
    "type": [
      "VerifiableCredential",
      "Person",
      "Car"
    ],
    "issuer": "https://example.edu/issuers/565049",
    "issuanceDate": "2010-01-01T19:13:24Z",
    "expirationDate": "2020-01-01T20:00:00Z",
    "credentialSubject": {
      "id": "did:example:ebfeb1f712ebc6f1c276e12ec21",
      "address": "56 avenue des Champs Elysées",
      "telephone": "+33123456789",
      "vehicleIdentificationNumber": "123456789",
      "vehicleInteriorColor": "grey",
      "degree" : {
      		"place" : "Toulouse",
            "Domaine" : "Sport"
      },
      "currentStatus": "Revoked",
      "statusReason": {
      	"@value": "Address is out of date",
      	"@language": "en"
   	  }
    },
    "nonTransferable": "True",
    "termsOfUse" : {
    "type": "IssuerPolicy",
    "id": "http://example.com/policies/credential/4"},
    "refreshService": {
    	"id": "https://example.edu/refresh/3732",
    	"type": "ManualRefreshService2018"
  	},
    "nonTransferable": "True",
    "credentialStatus": {
    	"id": "https://example.edu/status/24",
    	"type": "CredentialStatusList2017"
  	}
};

function JWTtoJSLD(payload){
	var vc = payload['vc'];
	vc['id'] = payload['jti'];
	vc['issuer'] =  payload['iss'];
	vc['credentialSubject']['id'] = payload['sub'];
	vc['expirationDate'] = new Date(payload['exp']* 1000);
	vc['issuanceDate'] = new Date(payload['iat']* 1000);
	return vc;
}

/**
 * Check the correct syntax of a VC and store attributes (Where????)
 *
 * @param      JsonObject  jsonObject  The VC in json format
 */
function parseVC(jsonObject){

	// Around 15, I'll check it later
	if(Object.keys(jsonObject).length > 15){
		console.log("Error : Unknown field(s).")
		return false;
	}
    
	//verifyContexts(jsonObject['@context']);
	verifyType(jsonObject['type']);
    verifyIssuanceDate(jsonObject['issuanceDate']);
	verifyExpirationDate(jsonObject['expirationDate']);
    //verifyIssuer(jsonObject['issuer']);
    verifyRefreshService(jsonObject['refreshService']);
	verifyTermsOfUse(jsonObject['termsOfUse']);
	verifyTransferable(jsonObject['nonTransferable']);
	verifyCredentialStatus(jsonObject['credentialStatus']);
	verifyCredentialSubject(jsonObject['credentialSubject']);

	if(!vcIsValid){
		console.log("Error. VC not valid.\n");
		return false;
	}

	return true;
}

/**
 *
 * Verify if the contexts are known
 *
 * @param      StringArray  contexts  The contexts contained in the VC
 */
function verifyContexts(contexts) {
	if(contexts == null){
		console.log("Error : no @contexts property.\n");
		vcIsValid = false;
	}
	if(contexts[0] != 'https://www.w3.org/2018/credentials/v1'){
		console.log("Error. First @context property value is not https://www.w3.org/2018/credentials/v1\n");
		vcIsValid = false;
	}

	let knownContexts = browser.storage.local.get('knownContexts');

	for(var i = 1; i < contexts.length; i++)
	{
     	if(!knownContexts.includes(contexts[i])){
     		console.log("Error : " + contexts[i] + " is not known.");
     		vcIsValid = false;
     		return;
     	}
	}
	dictionary['contexts'] = contexts;
}

/**
 * Verify if there is at less one type and that the VC type is present
 *
 * @param      {Array}  type    The types use in the VC
 */
function verifyType(types){
	if(types == null){
		console.log("Error: VC type is not present.");
		vcIsValid = false;
		return;
	}
	if(!types.includes('VerifiableCredential')){
		console.log("Error : VC do not contains VerifiableCredential type");
		vcIsValid = false;
		return;
	}

	dictionary['type'] = types;
}

/**
 * Verify if the VC is valid yet
 *
 * @param      String  issuanceDate  The issuance date of the VC
 */
function verifyIssuanceDate(issuanceDate){
	if(issuanceDate == null){
		console.log("Error: Issuance date is not present.");
		vcIsValid = false;
		return;
	}
	validateDateFormat(issuanceDate);
    if(Date.now() < Date.parse(issuanceDate)){
    	console.log("Warning : the VC is valid from " + issuanceDate);
    }
    dictionary['issuanceDate'] = issuanceDate;
}

/**
 * Check if a date is valid
 *
 * @param      String  date    A date
 */
function validateDateFormat(date){
	let d = Date.parse(date);
    if(isNaN(d)){
    	console.log("Error: Expiration date is in wrong format.");
        vcIsValid = false;
        return;
    }
}

/**
 * Verify if the issuer is well known
 *
 * @param      String  issuer  The issuer of the VC
 */
function verifyIssuer(issuer){
	if(issuer == null){
		console.log("Error: VC does not contain an issuer.");
		vcIsValid = false;
		return;
	}

	let trustedIssuers = browser.storage.local.get("trustedIssuers");
	if(trustedIssuers.includes(issuer)){
		dictionary['issuer'] = issuer; 
	}
	else{
		console.log("Error : the issuer is not trusted");
		vcIsValid = false;
	}
}

/**
 * Verify if the VC is still valid
 *
 * @param      String  expirationDate  The expiration date of the VC
 */
function verifyExpirationDate(expirationDate){
	if(expirationDate == null){
		console.log("Error: Expiration date is not present.");
		vcIsValid = false;
		return;
	}
	validateDateFormat(expirationDate);
	 if(Date.now() > Date.parse(expirationDate)){
    	console.log("Error: VC has expired since " + expirationDate);
    }
    dictionary['expirationDate'] = expirationDate;
}

/**
 * Verify if the VC has a refreshed service
 *
 * @param      Object  refreshService  The refresh service
 */
function verifyRefreshService(refreshService){
	if(refreshService != null){
		console.log("Warning: VC is privacy invasive and has refreshService");
		dictionary['refreshService'] = refreshService;
	}
}

// To do
function verifyTermsOfUse(termsOfUse){
	if(termsOfUse != null){
		if(termsOfUse['type'] == null){
			console.log("Error: Terms of use does not have a type.");
			vcIsValid = false;
			return;
		}
		if(termsOfUse['type'] == 'nonTransferable'){
			// How to find the holder?????
		}

	}
	dictionary['termsOfUse'] = termsOfUse;
}

/**
 * Verify if the VC is transferable or not
 *
 * @param      Boolean  transferable  yes or no
 */
function verifyTransferable(transferable){
	if (transferable != null) {
		if(transferable != 'True'){
			vcIsValid = false;
			console.log("Error: Unknown value for non transferrable property.");
			return;
		}else{
			dictionary['transferable'] = new Boolean(true);
		}
	}
}

/**
 * Verify the corrects attributes of credential status if it's present
 *
 * @param      Object  credentialStatus  The credential status
 */
function verifyCredentialStatus(credentialStatus){
	if(credentialStatus != null){
		if(credentialStatus['id'] == null){
			console.log("Error: status does not contain an ID.");
			vcIsValid = false;
			return;
		}
		if(credentialStatus['type'] == null){
			console.log("Error: status does not contain a type.");
			vcIsValid = false;
			return;
		}
		dictionary['credentialStatus'] = credentialStatus;
	}
}

/**
 * Verify if the informations about the subject are valid
 *
 * @param      {<type>}  credentialSubject  The credential subject
 */
function verifyCredentialSubject(credentialSubject){
	if(credentialSubject == null){
		console.log("Error : VC subject is not present.");
		vcIsValid = false;
		return;
	}
	dictionary['idSubject'] = credentialSubject['id'];
	if(credentialSubject['currentStatus'] != null){
		if(credentialSubject['currentStatus'] != 'Revoked' && credentialSubject['currentStatus'] != 'Disputed'){
			console.log("Error: Unknown VC status.");
			vcIsValid = false;
			return;
		}
		if(credentialSubject['currentStatus'] === 'Disputed'){
			console.log("The VC with id " + dictionary['idSubject'] + " is disputed by subject " + dictionary['issuer']);
		}
		if(credentialSubject['currentStatus'] === 'Revoked'){
			console.log("The VC with id " + dictionary['idSubject'] + " is revoked");
		}
	}
	dictionary['credentialSubject'] = credentialSubject;
}
