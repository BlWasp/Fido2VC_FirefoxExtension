/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

function utf8_to_b64(str) {
 	// console.log(str);
	return window.btoa(unescape(encodeURIComponent(str)));
}

function getStructEncoding(struct) {
	let enc = new TextEncoder();
	return enc.encode(struct); 
}

function hexString(buffer) {
	const byteArray = new Uint8Array(buffer);

 	const hexCodes = [...byteArray].map(value => {
		const hexCode = value.toString(16);
		const paddedHexCode = hexCode.padStart(2, '0');
		return paddedHexCode;
	});

	return hexCodes.join('');
}

/*
  Make a VP from VCs
  Hash the VP and sign it
  Return an array with the Base64 VP and the hash signature
*/
var toReturn;
function makeVP() {
	var payload = {"iss": "did:example:ebfeb1f712ebc6f1c276e12ec21",
		"jti": "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
		"aud": "did:example:4a57546973436f6f6c4a4a57573",
		"iat": "1541493724",
		"exp": "1573029723",
		"nonce": "343s$FSFDa-",
		"vp": {
			"@context": [
				"https://www.w3.org/2018/credentials/v1",
				"https://www.w3.org/2018/credentials/examples/v1"
			],
			"type": ["VerifiablePresentation"],
			"verifiableCredential": []
		}
	};
	const getListToSend = browser.storage.local.get('listVCs');
	getListToSend.then(function(vc) {
		for (var loopVC of vc['listVCs']) {
			payload['vp']['verifiableCredential'].push(loopVC);
		}
		var b64Payload = utf8_to_b64(JSON.stringify(payload));

		window.crypto.subtle.digest('SHA-256', getStructEncoding(b64Payload)).then(function(hashVP) {
			var proof = {};
			proof['type'] = "externalHash";
			proof['created'] = new Date();
			proof['hash'] = hexString(hashVP);
			payload['proof'] = proof;
			b64Payload = utf8_to_b64(JSON.stringify(payload));
			sendViaXHR(b64Payload);

	      /*const credentialID = browser.storage.local.get("spStorage");
	      credentialID.then(function(cred) {
	        var credID = cred.spStorage[0].credential_id;
	      	console.log(credID);
	        var signatureOptions = {challenge: hashVP,
	                                timeout: 60000,
	                                allowCredentials: [{ type: "public-key", id: _base64ToArrayBuffer(credID) }]
	                                };
	        navigator.credentials.get({"publicKey" : signatureOptions}).then(function(credentials) { 
	          console.log("get OK");
	          proof['hash'] = credentials.response['signature'];
	          payload['proof'] = proof;
	          b64Payload = utf8_to_b64(JSON.stringify(payload));
	          console.log("Signature done !");
	          return b64Payload;
	        });
	      });*/
		});
	});
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


/*
	Send the array from makeVP to the SP server
*/
function sendViaXHR(data) {
	var url; 
	const struc = browser.storage.local.get("spStorage");
	struc.then(function(item){
		url = "https://example.com:5000/sendVP";
		// console.log(item.spStorage[0]);
		var xhrVP = new XMLHttpRequest();
		xhrVP.open("POST", url, true);

		xhrVP.onreadystatechange = function() {
			if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
				console.log("VP sent with success !");
				alert("VP sent with success !");
			}
		}
		xhrVP.send(data);
	});
}

makeVP();