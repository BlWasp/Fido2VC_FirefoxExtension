/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

/*
	A default policy to make tests
*/
var policyTest = {
  "policy": {
    "type": "CNF",
    "and": [{
      "or": [{
        "issuer": {
          "value": "bank",
          "operator": "subclassOf"
        },
        "VCtype": {
          "value": "creditCard",
          "operator": "EQ"
        },
        "credentialSubject.creditCard.type": {
          "value": "Visa",
          "operator": "EQ"
        },
        "expirationDate": {
          "value": "2019-06-01T",
          "operator": "GT"
        }
      },
      {
        "issuer": {
          "value": "bank",
          "operator": "subclassOf"
        },
        "VCtype": {
          "value": "creditCard",
          "operator": "EQ"
        },
        "credentialSubject.creditCard.type": {
          "value": "Amex",
          "operator": "EQ"
        }
      }]
    },
    {
      "or": [{
        "issuer": {
          "value": "UK_university",
          "operator": "memberOf"
        },
        "VCtype": {
          "value": "NationalUnionOfStudents",
          "operator": "EQ"
        },
        "credentialSubject.student": {
          "operator": "Present"
        },
        "expirationDate": {
          "value": "2019-06-01T",
          "operator": "GT"
        }
      }]
    }]
  }
}

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
	The Service Provider give a JSON structure with the Policy in DNF or CNF
	This function take the structure and give it to the parser
*/
var policy;
function getPolicy(url) {
	let reqURL = url;
	let req = new XMLHttpRequest();
	req.open('GET', reqURL);
	req.responseType = 'json';
	req.send();

	req.onload = function() {
		policy = req.response;
		parser(policy);
	}
}

/*
	A solution to parse the policy structure and verify the attributs
	In a first time the function takes the value and the operator of each part of the credential
	Then the two array are gave to the verification function
*/
function parser(policyStruct) {
	let type = policyStruct['policy']['type'];
	if (type == "CNF") {
		var key = Object.keys(policyStruct['policy']);
		// console.log(key);
		var valuePart = [];
		var operatorPart = [];
		for (var and in key) {
	  		if (key[and] == "and") {
	    		for (var indexInAnd in Object.keys(policyStruct['policy'][key[and]])){
	      			//console.log(indexInAnd);
	      			for (var or in policyStruct['policy'][key[and]][indexInAnd]) {
	        			//console.log(or);
	        			for (var indexInOr in policyStruct['policy'][key[and]][indexInAnd][or]) {
	          				//console.log(indexInOr);
	          				for (var vcContents in policyStruct['policy'][key[and]][indexInAnd][or][indexInOr]) {
					            //console.log(vcContents);
					            //console.log(JSON.stringify(policyStruct['policy'][key[and]][indexInAnd][or][indexInOr][vcContents]));
					            partsStruct = JSON.stringify(policyStruct['policy'][key[and]][indexInAnd][or][indexInOr][vcContents]).split('"');
					            if (partsStruct[1] == "value") {
					            	valuePart.push(partsStruct[3]);
					            	// console.log(valuePart);
					            }
					            if (partsStruct[5] == "operator") {
					            	operatorPart.push(partsStruct[7]);
					            	// console.log(operatorPart);
					            }
					            if (partsStruct[1] == "operator") {
					            	operatorPart.push(partsStruct[3]);
					            	// console.log(operatorPart);
					            }
	            
					            /*for (var loop6 in policyStruct['policy'][key[and]][indexInAnd][or][indexInOr][vcContents]) {
					              	console.log(loop6);
					            }*/
          					}
        				}
      				}
    			}
  			}
		}
	}
}


// parser(policyTest);


/*
	Main part
*/
browser.webRequest.onBeforeRequest.addListener(
	getPolicy,
	{urls: ["https://fido/policy/*"]},
	["blocking"]
);
/*
	End of main part
*/