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
	Default test JWT structure with proof
*/
var jwtStruct = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpleGFtcGxlOmFiZmUxM2Y3MTIxMjA0MzFjMjc2ZTEyZWNhYiNrZXlzLTEifQ.eyJzdWIiOiJkaWQ6ZXhhbXBsZTplYmZlYjFmNzEyZWJjNmYxYzI3NmUxMmVjMjEiLCJqdGkiOiJodHRwOi8vZXhhbXBsZS5lZHUvY3JlZGVudGlhbHMvMzczMiIsImlzcyI6ImRpZDpleGFtcGxlOmFiZmUxM2Y3MTIxMjA0MzFjMjc2ZTEyZWNhYiIsImlhdCI6IjE1NDE0OTM3MjQiLCJleHAiOiIxNTczMDI5NzIzIiwibm9uY2UiOiI2NjAhNjM0NUZTZXIiLCJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3czLm9yZy8yMDE4L2NyZWRlbnRpYWxzL3YxIiwiaHR0cHM6Ly9leGFtcGxlLmNvbS9leGFtcGxlcy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiVW5pdmVyc2l0eURlZ3JlZUNyZWRlbnRpYWwiXSwiY3JlZGVudGlhbFN1YmplY3QiOnsiZGVncmVlIjp7InR5cGUiOiJCYWNoZWxvckRlZ3JlZSIsIm5hbWUiOiJCYWNoZWxvciBvZiBTY2llbmNlIGluIE1lY2hhbmljYWwgRW5naW5lZXJpbmcifX19fQ.ZVr7y8JREGqA2hwL_eSfMgjaLwwwq1rGU6j3JgltZp_BoKrBcIZxT8-f8pahiX8uMRZb4eg_qj_TJ59f-64_Qd5qOfYiO2iGRZ2HMitcFbPHj8_fW0zISFQVMK7EauSuUmmm48xiRTUkM0tOeU4IgmoNHRBtrs23f5exHinundQ3etaC0B-Nl3-qNS9pQWZARW9kG_UIvVvYJdZOV94pEv5ws8aU3-3Cabr-ivn-4_PcqF8rVuu-XK5qZBag90UCx7-7NQorre2CeJIiOwUryuCNWvUqzOEiCJayqk1-HJy51UBIPUbYnogo064Aw35NeQKJd4VssJlIUhTI1-SjSQ";

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
var structJSONfromURL;
function getStructFromURL(url) {
	let reqURL = url;
	let req = new XMLHttpRequest();
	req.open('GET', reqURL);
	req.responseType = 'json';
	req.send();

	req.onload = function() {
		structJSONfromURL = req.response;
	}
}

/*
	Convert Base64 to ASCII
*/
function b64_to_utf8( str ) {
  return decodeURIComponent(escape(window.atob( str )));
}

/*
	Encode the JSON structure for signature validity purpose
*/
function getStructEncoding(struct) {
	let enc = new TextEncoder();
	return enc.encode(struct); 
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
	When a new JSON-LD or JWT structure is received this function check the validity with the proof
	Also check de expiration validity
*/
// let signature;
let concat;
async function checkStrucValidity(structToAnalyse/*,publicKey,privateKey*/) {
	// var result = false;
	if (structToAnalyse['@context'] == structToAnalyse[0]) { // If it's a JSON-LD structure
		// let proof = structToAnalyse.proof.signatureValue; // Recovers only the proof part
		// var withoutProof = JSON.parse(JSON.stringify(structToAnalyse));
		// delete withoutProof.proof;
		// concat = JSON.stringify(withoutProof); // Recovers all the payload without the proof
		// let encoded = getStructEncoding(concat);
		// getStructFromURL(JSON.stringify(structToAnalyse.proof.verificationMethod)); //Take the public key
		// let publicKey = key;
		// result = await window.crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, proof, encoded);
		// console.log(result);
	
	} else{ // If it's a JWT structure
		/* Divide the Base64 structure according to the '.' and take the header, the payload and the proof
		Concates the header and the payload with a "."
		Encode everythings with an ArrayBuffer for the cyrpto function and then verify the proof with the public key */
		
		let parts = structToAnalyse.split('.');
		let header = parts[0];
		let data = parts[1];
		let proof = parts[2];
		let encodedProof = getStructEncoding(proof);

		// console.log(header);
		// console.log(data);

		concat = header.concat('.').concat(data); // JSON.stringify(header).concat(JSON.stringify(data)); // Concat the header with the payload
		// console.log(concat);
		let encoded = getStructEncoding(concat);

		let headerString = b64_to_utf8(header);
		getStructFromURL(headerString.kid); //Take the public key from the URI
		await window.crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5",},publicKey,encodedProof,encoded).then(function(result) {
			console.log(result);
		});
		// await window.crypto.subtle.sign({name: "RSASSA-PKCS1-v1_5",},privateKey,encoded).then(function(signature) {
		// 	console.log(new Uint8Array(signature));
		// 	window.crypto.subtle.verify({name: "RSASSA-PKCS1-v1_5",},publicKey,signature,encoded)
		// 	.then(function(result) {
		// 		console.log(result);
		// 	});
		// });
	}

	// if (!result) {
	// 	onError(result);
	// 	return "Error : bad structure";
	// }
}


/*
	Check stored structure and store default structure if needed
*/
function checkSettings(settings) {
	if(!settings.structJSONfromURL) {
		browser.storage.local.set({structJSONfromURL});
	}
}

/*
	Main part
*/
// getStructFromURL('https://example.com');
// importPublicKey(jwtStruct,pemEncodedPublicKey);
// generateRSAKey(jwtStruct);
checkStrucValidity(jwtStruct);

// const getStructFromLocal = browser.storage.local.get();
// getStructFromLocal.then(checkSettings, onError);
/*
	End main part
*/