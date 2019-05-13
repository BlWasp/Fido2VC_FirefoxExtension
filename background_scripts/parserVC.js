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

/**
 * Check the correct syntax of a VC and store attributes (Where????)
 *
 * @param      JsonObject  jsonObject  The VC in json format
 */
function parseVC(jsonObject){

	// Around 11, I'll check it later
	if(Object.keys(jsonObject).length > 15){
		document.write("Error : Unknown field(s).")
		return;
	}
    
	verifyContexts(jsonObject['@context']);
	verifyType(jsonObject['type']);
    verifyIssuanceDate(jsonObject['issuanceDate']);
	verifyExpirationDate(jsonObject['expirationDate']);
    verifyIssuer(jsonObject['issuer']);
    verifyRefreshService(jsonObject['refreshService']);
	verifyTermsOfUse(jsonObject['termsOfUse']);
	verifyTransferable(jsonObject['nonTransferable']);
	verifyCredentialStatus(jsonObject['credentialStatus']);
	verifyCredentialSubject(jsonObject['credentialSubject']);

    if(!vcIsValid){
    	document.write("Error. VC not valid.\n");
    	return;
    }
}

/**
 *
 * Verify if the contexts are known
 *
 * @param      StringArray  contexts  The contexts contained in the VC
 */
function verifyContexts(contexts) {
	if(contexts == null){
		document.write("Error : no @contexts property.\n");
		vcIsValid = false;
	}
	if(contexts[0] != 'https://www.w3.org/2018/credentials/v1'){
		document.write("Error. First @context property value is not https://www.w3.org/2018/credentials/v1\n");
		vcIsValid = false;
	}

	// To do : check if the issuers are well known (in the local storage)

	dictionary['contexts'] = contexts;
}

/**
 * Verify if there is at less one type and the the VC type is present
 *
 * @param      {Array}  type    The types use in the VC
 */
function verifyType(types){
	if(types == null){
		document.write("Error: VC type is not present.");
		vcIsValid = false;
		return;
	}
	if(!types.includes('VerifiableCredential')){
		document.write("Error : VC do not contains VerifiableCredential type");
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
		document.write("Error: Issuance date is not present.");
		vcIsValid = false;
		return;
	}
	validateDateFormat(issuanceDate);
    if(Date.now() < Date.parse(issuanceDate)){
    	document.write("Warning : the VC is valid from " + issuanceDate);
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
    	document.write("Error: Expiration date is in wrong format.");
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
		document.write("Error: VC does not contain an issuer.");
		vcIsValid = false;
		return;
	}

	// To do : where the issuers are located?

	dictionary['issuer'] = issuer; 
}

/**
 * Verify if the VC is still valid
 *
 * @param      String  expirationDate  The expiration date of the VC
 */
function verifyExpirationDate(expirationDate){
	if(expirationDate == null){
		document.write("Error: Expiration date is not present.");
		vcIsValid = false;
		return;
	}
	validateDateFormat(expirationDate);
	 if(Date.now() > Date.parse(expirationDate)){
    	document.write("Error: VC has expired since " + expirationDate);
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
		document.write("Warning: VC is privacy invasive and has refreshService");
		dictionary['refreshService'] = refreshService;
	}
}

// To do
function verifyTermsOfUse(termsOfUse){
	if(termsOfUse != null){
		if(termsOfUse['type'] == null){
			document.write("Error: Terms of use does not have a type.");
			vcIsValid = false;
			return;
		}
		if(termsOfUse['type'].localeCompare("nonTransferable", 'en', {sensitivity: 'base'}) == 0){
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
			document.write("Error: Unknown value for non transferrable property.");
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
			document.write("Error: status does not contain an ID.");
			vcIsValid = false;
			return;
		}
		if(credentialStatus['type'] == null){
			document.write("Error: status does not contain a type.");
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
		document.write("Error : VC subject is not present.");
		vcIsValid = false;
		return;
	}
	dictionary['idSubject'] = credentialSubject['id'];
	if(credentialSubject['currentStatus'] != null){
		if(credentialSubject['currentStatus'] != 'Revoked' && credentialSubject['currentStatus'] != 'Disputed'){
			document.write("Error: Unknown VC status.");
			vcIsValid = false;
			return;
		}
		if(credentialSubject['currentStatus'] === 'Disputed'){
			document.write("The VC with id " + dictionary['idSubject'] + " is disputed by subject " + dictionary['issuer']);
		}
		if(credentialSubject['currentStatus'] === 'Revoked'){
			document.write("The VC with id " + dictionary['idSubject'] + " is revoked");
		}
	}
	dictionary['credentialSubject'] = credentialSubject;
}
