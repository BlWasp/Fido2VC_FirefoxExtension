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
	Encode the JSON structure for signature validity purpose
*/
function getStructEncoding(struct) {
	let enc = new TextEncoder();
	return enc.encode(struct); 
}

/*
	Decode Base64 for JWT
*/
function b64_to_utf8(str) {
	return decodeURIComponent(escape(window.atob(str)));
} 

/*
	When a new JSON-LD or JWT structure is received this function check the validity with the proof
	Also check de expiration validity
*/
// let signature;
let concat;
async function checkStrucValidity(structToAnalyse, key) {
	var result = false;
	if (structToAnalyse['@context'] == structToAnalyse[0]) { // If it's a JSON-LD structure
		let proof = structToAnalyse.proof.signatureValue; // Recovers only the proof part
		var withoutProof = JSON.parse(JSON.stringify(structToAnalyse));
		delete withoutProof.proof;
		concat = JSON.stringify(withoutProof); // Recovers all the payload without the proof
		let encoded = getStructEncoding(concat);
		getStructFromURL(JSON.stringify(structToAnalyse.proof.verificationMethod)); //Take the public key
		let publicKey = key;
		result = await window.crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, proof, encoded);
		console.log(result);
	
	} else{ // If it's a JWT structure
		// Divide the Base64 structure received with the '.' to take the header, the payload and the proof separately
		// And translate the Base64 to ASCII (in a JSON structure)
		let parts = structToAnalyse.split('.');
		let header = b64_to_utf8(parts[0]);
		console.log(header);
		let data = b64_to_utf8(parts[1]);
		console.log(data);
		let proof = parts[2];
		console.log(proof);

		concat = JSON.stringify(header).concat(JSON.stringify(data)); // Concat the header with the payload
		let encoded = getStructEncoding(concat);
		getStructFromURL(JSON.stringify(header.kid)); //Take the public key
		let publicKey = key;
		result = await window.crypto.subtle.verify("RSASSA-PKCS1-v1_5", publicKey, proof, encoded);
		console.log(result);
	}

	if (!result) {
		onError(result);
		return "Error : bad structure";
	}
}


/*
	Import a public key to test on proof
*/
  function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  const pemEncodedKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnzyis1ZjfNB0bBgKFMSv
vkTtwlvBsaJq7S5wA+kzeVOVpVWwkWdVha4s38XM/pa/yr47av7+z3VTmvDRyAHc
aT92whREFpLv9cj5lTeJSibyr/Mrm/YtjCZVWgaOYIhwrXwKLqPr/11inWsAkfIy
tvHWTxZYEcXLgAXFuUuaS3uF9gEiNQwzGTU1v0FqkqTBr4B8nW3HCN47XUu0t8Y0
e+lf4s4OxQawWD79J9/5d3Ry0vbV3Am1FtGJiJvOwRsIfVChDpYStTcHTCMqtvWb
V6L11BWkpzGXSW4Hv43qa+GSYOD2QU68Mb59oSk2OB+BtOLpJofmbGEGgvmwyCI9
MwIDAQAB
-----END PUBLIC KEY-----`;

  function importRsaKey(pem) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = str2ab(binaryDerString);

    return window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256"
      },
      true,
      ["verify"]
    );
  }
/*
	End of import
*/
// Generate un HMAC key. Only for test purpose.
// window.crypto.subtle.generateKey(
// {
// 	name: "HMAC",
// 	hash: {name: "SHA-256"}
// },
//   	true,
// 	["sign", "verify"]
// ).then((key) => {
// 	checkStrucValidity(key);
// });


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
structJSONfromURL = jwtStruct;
checkStrucValidity(structJSONfromURL);

const getStructFromLocal = browser.storage.local.get();
getStructFromLocal.then(checkSettings, onError);

// getStruc.then(onGot, onError);
/*
	End main part
*/