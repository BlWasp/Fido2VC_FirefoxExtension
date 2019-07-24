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


var vpReadyToSign = {};
/*
  Make a VP from VCs
  Hash the VP and sign it
  Return an array with the Base64 VP and the hash signature
*/
function makeVP(port) {
	var payload = {"jti": "urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5",
		"aud": "did:example:4a57546973436f6f6c4a4a57573",
		"nbf": "1541493724",
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
	// console.log(getListToSend);
	getListToSend.then(function(vc) {
		for (var loopVC of vc['listVCs']) {
			payload['vp']['verifiableCredential'].push(loopVC);
		}
		var b64Payload = utf8_to_b64(JSON.stringify(payload));

		window.crypto.subtle.digest('SHA-256', getStructEncoding(b64Payload)).then(function(hashVP) {
			var proof = {};
			proof['type'] = "externalHash";
			proof['created'] = new Date();
			payload['proof'] = proof;

			const credentialID = browser.storage.local.get("spStorage");
			credentialID.then(function(cred) {
				let credID = cred.spStorage[0].credential_id;
				let sendJSON = {"hash": hexString(hashVP), "cred": credID, "rp": "example.com"};
				port.postMessage(sendJSON);

				console.log("Struct send to sign");
				vpReadyToSign = payload;

				// proof['hash'] = "Test";
				// payload['proof'] = proof;
				// b64Payload = utf8_to_b64(JSON.stringify(payload));
					
				// sendViaXHR(b64Payload);

				// var signatureOptions = {challenge: hashVP,
				// 						timeout: 60000,
				// 						allowCredentials: [{ type: "public-key", id: _base64ToArrayBuffer(credID) }]
				// 						};
				// navigator.credentials.get({"publicKey" : signatureOptions}).then(function(credentials) { 
				// 	console.log("get OK");
				// 	proof['hash'] = credentials.response['signature'];
				// 	payload['proof'] = proof;
				// 	b64Payload = utf8_to_b64(JSON.stringify(payload));
				// 	console.log("Signature done !");
					
				// 	sendViaXHR(b64Payload);
				// }).catch(function(err) {
			 //    	console.error(err);
				// });
			});
		});
	});
}

// function _base64ToArrayBuffer(base64) {
// 	var binary_string =  window.atob(base64.replace(/_/g, '/').replace(/-/g, '+'));
// 	var len = binary_string.length;
// 	var bytes = new Uint8Array(len);
// 	for (var i = 0; i < len; i++)        {
// 		bytes[i] = binary_string.charCodeAt(i);
// 	}
// 	return bytes.buffer;
// }


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
		browser.storage.local.remove('storageToSend');
		browser.storage.local.remove('listVCs');
		browser.storage.local.remove('spStorage');
		xhrVP.send(data);
	});
}


/*
	When the application send the signature, it catch here
*/
function receiveMess(mess) {
	console.log("Received : " + mess);
	vpReadyToSign['proof']['hash'] = mess;
	console.log(vpReadyToSign);
	let b64Payload = utf8_to_b64(JSON.stringify(vpReadyToSign));
	sendViaXHR(b64Payload);
}

/*
	Init the connection with Python application for signing purpose
*/
function init(request) {
	if(request.greeting == 'send VP') {
		var port = browser.runtime.connectNative("fido2VC_app");
		port.onMessage.addListener((response) => {
				receiveMess(response);
		});
		makeVP(port);
	}
}


/*
	Main part
*/
browser.runtime.onMessage.addListener(init);