/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
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

var jsonStruc2 = {
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
      "type": "Other",
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

// IL MANQUE LE RETOUR !!!!!!!!!!!!!!
/*
  Make a VP from VCs
  Hash the VP and sign it
  Return an array with the Base64 VP and the hash signature
*/
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
  });
  console.log(payload);
  
  let b64Payload = utf8_to_b64(JSON.stringify(payload));

  window.crypto.subtle.digest('SHA-256', getStructEncoding(b64Payload)).then(function(hashVP) {
    let proof = {};
    proof['type'] = "externalHash";
    proof['created'] = new Date();
    proof['hash'] = hexString(hashVP);
    payload['proof'] = proof;
    // console.log(JSON.stringify(payload));
    b64Payload = utf8_to_b64(JSON.stringify(payload));

    const credentialID = browser.storage.local.get("spStorage");
    credentialID.then(function() {
      var signatureOptions = {challenge: _base64ToArrayBuffer(b64Payload),
                              timeout: 60000,
                              allowCredentials: [{ type: "public-key", id: credentialID['credential_id'] }]
                              };
      navigator.credentials.get({"publicKey" : signatureOptions}).then(function(credentials) {
        console.log("Signature done !");
        return [b64Payload,credentials];
      }).catch(function (err) {
            console.log("Error navigator.credentials.get, wrong credentialID...");
            toSend = 4;
      });
    })
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
function sendViaXHR() {
  let url = document.location.href;
  var xhrVP = new XMLHttpRequest();
  xhrVP.open("POST", url, true);
  // xhrVP.setRequestHeader("json", );

  xhrVP.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("Request send");
    }
  }
  xhrVP.send(makeVP());
}