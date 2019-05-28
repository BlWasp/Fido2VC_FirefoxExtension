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
function makeVP(VC) {
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
  for (var loopArguments of VC) {
    payload['vp']['verifiableCredential'].push(loopArguments);
  }
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
  All the section bellow is about notification
*/
window.addEventListener('load', function() {
  Notification.requestPermission(function (status) {
    if (Notification.permission !== status) {
      Notification.permission = status;
    }
  });
});

console.log(Notification.permission);

if (window.Notification && Notification.permission === "granted") {
  var notif = new Notification("Click here to sign and send the VP");
  notif.onclick = function(event) {
    makeVP([jsonStruc,jsonStruc2]);
  }
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
  xhrVP.send(makeVP(jsonStruc,jsonStruc2));
}


var publicKey = {
  // The challenge is produced by the server; see the Security Considerations
  challenge: new Uint8Array([21,31,105]),

  // Relying Party:
  rp: {
    name: "ACME Corporation"
  },

  // User:
  user: {
    id: Uint8Array.from(window.atob("MIIBkzCCATigAwIBAjCCAZMwggE4oAMCAQIwggGTMII="), c=>c.charCodeAt(0)),
    name: "alex.p.mueller@example.com",
    displayName: "Alex P. Müller",
    icon: "https://pics.example.com/00/p/aBjjjpqPb.png"
  },

  // This Relying Party will accept either an ES256 or RS256 credential, but
  // prefers an ES256 credential.
  pubKeyCredParams: [
    {
      type: "public-key",
      alg: -7 // "ES256" as registered in the IANA COSE Algorithms registry
    },
    {
      type: "public-key",
      alg: -257 // Value registered by this specification for "RS256"
    }
  ],

  timeout: 60000,  // 1 minute
  excludeCredentials: [], // No exclude list of PKCredDescriptors
  extensions: {"loc": true}  // Include location information
                                           // in attestation
};


function test() {
  // Note: The following call will cause the authenticator to display UI.
  navigator.credentials.create({publicKey})
    .then(function (newCredentialInfo) {

      var options = {
        // The challenge is produced by the server; see the Security Considerations
        challenge: new Uint8Array([4,101,15]),
        timeout: 60000,  // 1 minute
        allowCredentials: [{ type: "public-key", id: _base64ToArrayBuffer(newCredentialInfo['id']) }]
      };

      navigator.credentials.get({ "publicKey": options })
          .then(function (assertion) {
            console.log("navigator.credentials.get OK");
            console.log("Signature : " + String.fromCharCode.apply(null, new Uint8Array(assertion.response['signature'])));
          // Send assertion to server for verification
      }).catch(function (err) {
          console.log("Error navigator.credentials.get")
          // No acceptable credential or user refused consent. Handle appropriately.
      });
      // Send new credential info to server for verification and registration.
    }).catch(function (err) {
      console.log(err);
      // No acceptable authenticator or user refused consent. Handle appropriately.
    });
}