/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

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
	console.log(item);
}

/*
	This array will store the local storage for verification
*/
var structArrayHistory = [];
var utfArray = []; // Will get back the array from the Idp with the structure convert in UTF-8
var storageToSend = [];
var issuer;

/* Variables for the VCs parser */
var dictionary = {};
var vcIsValid = true;

/*
	Take the URL where the JSON structure is stored
	Prepare a XHR request and send it to the server to take the whole JSON-LD or payload structure
*/
var structJSONfromURL;
function getRespFromIDP(){
	browser.storage.local.remove('storageToSend');
	browser.webRequest.onBeforeRequest.removeListener(getRespFromIDP);
	var xmlHttp = new XMLHttpRequest();
	let reqURL = "https://example.com:5000/verifiable_credentials";
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        	structJSONfromURL = xmlHttp.response;
        	console.log(structJSONfromURL);
        	if (checkStrucValidity(structJSONfromURL,"payload")) {
				const getHistoryFromLocal = browser.storage.local.get("structArrayHistory");
				getHistoryFromLocal.then(function(settings) {
					addStorageHistory(settings);
				});
				const getSendFromLocal = browser.storage.local.get("storageToSend");
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
	Convert Base64 to UTF-8
*/
function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
}

function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64.replace(/_/g, '/').replace(/-/g, '+'));
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

var jwt = {
  "credential_id": "6zvkPy5CSgxxRAn0Dy4AwY3ccCzzA7ysw8U7mmtJ_SRqfHmdWWNHqcMZw1UWbwMRpAWG-L8r8bwDh0u-3eB1Vg", 
  "issuer": "Mairie de Balma", 
  "user_token": "1193ac57-d053-4d5d-aee5-e5046101f1f4", 
  "vcList": [
    "eyJhbGciOiAiUlMyNTYiLCAidHlwIjogIkpXVCIsICJraWQiOiAiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JR2ZNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0R05BRENCaVFLQmdRRHlvVkF6RkZ6WG1VYWVrOXM2SCtpckgraWFcbkVseFcrSDdUaXlTTXF5WWpRM1h2WGE2WEN5VTAwMitUMnhkSVNuVWJ3ZHBJd21zdE1ONzNqOGYzcnJGUXBOKzVcbkRmaGZwRndYZHNrdkhrcXNtRDcydjJWWkJIUmV2bG0vMGFjcjkrY0p0N09RQklLWlZGNzVYcGl2Z2RLaVMvVUdcbks3QldOdERHeVVBT0JkZWNYUUlEQVFBQlxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tIn0.eyJ2YyI6IHsiY3JlZGVudGlhbFN1YmplY3QiOiB7ImZ1bGxOYW1lIjogIkJvaXZpbiBCZXJ0cmFuZCJ9LCAiQGNvbnRleHQiOiBbImh0dHBzOi8vd3d3LnczLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwgImh0dHA6Ly9leGFtcGxlLmNvbS9wZXJzb25fc2NoZW1hLmpzb24iXSwgInR5cGUiOiBbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwgIlBlcnNvbiJdLCAiY3JlZGVudGlhbFNjaGVtYSI6IHsidHlwZSI6ICJKc29uU2NoZW1hVmFsaWRhdG9yMjAxOCIsICJpZCI6ICJodHRwOi8vZXhhbXBsZS5jb20vcGVyc29uX3NjaGVtYS5qc29uIn19LCAic3ViIjogIjExOTNhYzU3LWQwNTMtNGQ1ZC1hZWU1LWU1MDQ2MTAxZjFmNCIsICJpc3MiOiAiTWFpcmllIGRlIEJhbG1hIiwgImp0aSI6ICJiMTY0YjVjMi0xYjg3LTRhZWUtOWMwNy1hODk4ZTJjZmUyYmUiLCAiZXhwIjogMTU3NzgzMzE5OSwgImlhdCI6IDE1NTg5NjczODR9.eGVRLvRen9peyH-YOYEKgGFNi3FGhMHK7whitqLbBFpNPJjF2cNPp2brx6S1sB_5XC51hmXpK9kPS6ha74_OAFh2K4Lg_jKqQpiMVMGt0emdZgygVsAFiGfFnAgaZcjcZqImfvYE6S8drMdnCrvUiH-ACMstb2hj-zHCvtI3cVc", 
    "eyJhbGciOiAiUlMyNTYiLCAidHlwIjogIkpXVCIsICJraWQiOiAiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1JR2ZNQTBHQ1NxR1NJYjNEUUVCQVFVQUE0R05BRENCaVFLQmdRRHlvVkF6RkZ6WG1VYWVrOXM2SCtpckgraWFcbkVseFcrSDdUaXlTTXF5WWpRM1h2WGE2WEN5VTAwMitUMnhkSVNuVWJ3ZHBJd21zdE1ONzNqOGYzcnJGUXBOKzVcbkRmaGZwRndYZHNrdkhrcXNtRDcydjJWWkJIUmV2bG0vMGFjcjkrY0p0N09RQklLWlZGNzVYcGl2Z2RLaVMvVUdcbks3QldOdERHeVVBT0JkZWNYUUlEQVFBQlxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tIn0.eyJ2YyI6IHsiY3JlZGVudGlhbFN1YmplY3QiOiB7ImZ1bGxBZGRyZXNzIjogIjYsIFJ1ZSBQaWVycmUgQm9ubmV0IDMxMTMwIEJhbG1hIn0sICJAY29udGV4dCI6IFsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiLCAiaHR0cDovL2V4YW1wbGUuY29tL3BlcnNvbl9zY2hlbWEuanNvbiJdLCAidHlwZSI6IFsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCAiUGVyc29uIl0sICJjcmVkZW50aWFsU2NoZW1hIjogeyJ0eXBlIjogIkpzb25TY2hlbWFWYWxpZGF0b3IyMDE4IiwgImlkIjogImh0dHA6Ly9leGFtcGxlLmNvbS9wZXJzb25fc2NoZW1hLmpzb24ifX0sICJzdWIiOiAiMTE5M2FjNTctZDA1My00ZDVkLWFlZTUtZTUwNDYxMDFmMWY0IiwgImlzcyI6ICJNYWlyaWUgZGUgQmFsbWEiLCAianRpIjogIjE1NmUyYjA5LWE1ZTctNDI4ZS05YjhkLWMzNDM1NmUwNWVmYyIsICJleHAiOiAxNTc3ODMzMTk5LCAiaWF0IjogMTU1ODk2NzM4NH0.Uy8nrNnBQ1D9ceuyjjXr-8HqNDlX1FhuFBevP9g8ZYYtGHb4VjbdGoEMIqR0Cg1QXhsv1Yb44s9OFTPF5bOWF8m_CO1JKp8g-cTxrB3Ktz5FOj9LvMH-vpWeMiHvoHiVjFm5SQReGYovIxu4s1S4-POeRBLCOB3Sya50gcf7KZ8"
  ]
}

/*
	When a new JSON-LD or payload structure is received this function check the validity with the proof
	Also check de expiration validity
*/
async function checkStrucValidity(structToAnalyse,type) {
	if (type == "JWT") {  // If it's a payload structure
		storageToSend.splice(0,storageToSend.length);
		utfArray.splice(0,utfArray.length);
		for (var loopListVC of structToAnalyse['vcList']) {
			/* Divide the Base64 structure according to the '.' and take the header, the payload and the proof
			Concates the header and the payload with a "."
			Encode everythings with an ArrayBuffer for the cyrpto function and then verify the proof with the public key */
			let parts = loopListVC.split('.');
			let header = parts[0];
			let payload = parts[1];
			let proof = parts[2];
			let data = header.concat('.',payload);
			let payloadUTF = JSON.parse(b64_to_utf8(payload));
			if (!parseVC(JWTtoJSLD(payloadUTF))) {
				console.log("Problem with VC parser");
				return false;
			} 
			console.log("VC parse OK");
			let headerUTF = JSON.parse(b64_to_utf8(header));
			let pem = headerUTF.kid;
			// fetch the part of the PEM string between header and footer
		    const pemHeader = "-----BEGIN PUBLIC KEY-----";
			const pemFooter = "-----END PUBLIC KEY-----";
			const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
			var pkey = pemContents.replace("\\n","");
			await window.crypto.subtle.importKey(
				"spki",
				_base64ToArrayBuffer(pkey),
				{
				    name: "RSASSA-PKCS1-v1_5",
				    hash: "SHA-256"
				},
				    true,
				    ["verify"]
			).then(async function(publicKey) {
			    await window.crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5",},publicKey,_base64ToArrayBuffer(proof),str2ab(data)).then(function(result) {
					if (!result) {
						console.log("Errrooooor crypto.....");
						utfArray.splice(0,utfArray.length);
						storageToSend.splice(0,storageToSend.length);
						return result;
					}
					console.log("Good signature au bon endroit!");
					issuer = payloadUTF['vc']['issuer'];
					storageToSend.push([payloadUTF['vc'],loopListVC]);
					// console.log("Le storage to Send : " + storageToSend);
					utfArray.push(JSON.stringify(headerUTF)+"."+JSON.stringify(payloadUTF));
				}).catch(function(err) {
					console.log(err);
				});
			}).catch(function(err) {
			    console.error(err);
			});
		}
		return true;
	} else{ // If it's a JSON-LD structure
		null;
	}
}

// checkStrucValidity(jwt,"JWT").then(function() {
// 	const getSendFromLocal = browser.storage.local.get("storageToSend");
// 	getSendFromLocal.then(function(settings) {
// 		addStorageToSend(settings);
// 		const test = browser.storage.local.get("storageToSend");
// 		test.then(function(vals) {
// 			console.log(vals['storageToSend'][0][1]);
// 		});
// 	});
// });


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
		vcIsValid = true;
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
