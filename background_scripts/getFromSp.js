/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

/*
	A default policy to make tests
*/
var policyTest = {
  "policy": {
    "type": "DNF",
    "or": [{
      "and": [{
        "issuer": {
          "value": "bank",
          "operator": "subclassOf"
        },
        "VCtype": {
          "value": "creditCard",
          "operator": "EQ"
        },
        "credentialSubject": {
          "properties" : "creditCard.type",
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
        "credentialSubject": {
          "properties" : "creditCard.type",
          "value": "Amex",
          "operator": "EQ"
        }
      }]
    },
    {
      "and": [{
        "issuer": {
          "value": "UK_university",
          "operator": "memberOf"
        },
        "VCtype": {
          "value": "NationalUnionOfStudents",
          "operator": "EQ"
        },
        "credentialSubject": {
          "properties" : "student",
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
	console.log(item);
}

/*
	The Service Provider give a JSON structure with the Policy in DNF or CNF
	This function take the structure and give it to the parser
*/
// var policy;
// function getPolicy() {
// 	let reqURL = document.location.href;
// 	let req = new XMLHttpRequest();
// 	req.open('GET', reqURL);
// 	req.responseType = 'json';
// 	req.send();

// 	req.onload = function() {
// 		policy = req.response;
// 		extractType(policy);
// 	}
// }


/*
	A solution to parse the policy structure and print it in a popup
	The functions make the difference between CNF and DNF
*/
function extractIssuer(policyStructIssuer) {
	for (var loopIssuer in policyStructIssuer) {
		if (loopIssuer == "issuer") {
			partIssuer = JSON.stringify(policyStructIssuer[loopIssuer]).split('"');
			if (partIssuer[1] == "value") {
				// console.log(partIssuer[3]);
				vc.document.write(partIssuer[3]+"<br>");
			}
			if (partIssuer[5] == "value") {
				// console.log(partIssuer[7]);
				vc.document.write(partIssuer[7]+"<br>");
			}
		}
	}
	vc.document.write("With this value and properties :<br>");
	extractCredentialSubject(policyStructIssuer);
}

function extractCredentialSubject(policyStructSubject) {
	for (var loopSubject in policyStructSubject) {
		if (loopSubject == "credentialSubject") {
			partSubject = JSON.stringify(policyStructSubject[loopSubject]).split('"');
			if (partSubject[1] == "value") {
				// console.log(partSubject[3]);
				vc.document.write("Value: "+partSubject[3]+"<br>");
			}
			if (partSubject[5] == "value") {
				// console.log(partSubject[7]);
				vc.document.write("Value : "+partSubject[7]+"<br>");
			}
			if (partSubject[1] == "properties") {
				// console.log(partSubject[3]);
				vc.document.write("Properties : "+partSubject[3]+"<br>");
			}
		}
	}
}

function extractType(policyStruct) {
	vc = open("",'popup','width=400,height=400,toolbar=no,scrollbars=yes,resizable=yes');

	// var policyStruct = policyTest;
	var type = policyStruct['policy']['type'];
	var key = Object.keys(policyStruct['policy']);
	if (type == "CNF") {
		vc.document.write("<body>We need all the sections below. One element per section is necessary to validate it.<br><br>");
		for (var and in key) {
			if (key[and] == "and") {
				for (var indexInAnd in Object.keys(policyStruct['policy'][key[and]])){
					for (var or in policyStruct['policy'][key[and]][indexInAnd]) {
						// console.log("We need one of them : ");
						vc.document.write("We need one of them :<br>");
						for (var indexInOr in policyStruct['policy'][key[and]][indexInAnd][or]) {
							for (var vcContents in policyStruct['policy'][key[and]][indexInAnd][or][indexInOr]) {
								if (vcContents == "VCtype") {
									partsStruct = JSON.stringify(policyStruct['policy'][key[and]][indexInAnd][or][indexInOr][vcContents]).split('"');
									if (partsStruct[1] == "value") {
										// console.log(partsStruct[3]);
										vc.document.write("<br>"+partsStruct[3]+"<br>");
									}
									if (partsStruct[5] == "value") {
										// console.log(partsStruct[7]);
										vc.document.write("<br>"+partsStruct[7]+"<br>");
									}
									// console.log("from ");
									vc.document.write("FROM<br>");
									extractIssuer(policyStruct['policy'][key[and]][indexInAnd][or][indexInOr]);
								}
							}
						}
					}
					// console.log("WITH THIS, ");
					vc.document.write("<br>WITH THIS, ");
				}
			}
		}
		vc.document.write("</body>");
	}
	if (type == "DNF") {
		vc.document.write("<body>We need one of the section below. All the elements are necessary to validate the section.<br><br>");
		for (var or in key) {
			if (key[or] == "or") {
				for (var indexInOr in Object.keys(policyStruct['policy'][key[or]])){
					for (var and in policyStruct['policy'][key[or]][indexInOr]) {
						// console.log("We need all of them for this section : ");
						vc.document.write("We need all of them for this section :<br>");
						for (var indexInAnd in policyStruct['policy'][key[or]][indexInOr][and]) {
							for (var vcContents in policyStruct['policy'][key[or]][indexInOr][and][indexInAnd]) {
								if (vcContents == "VCtype") {
									partsStruct = JSON.stringify(policyStruct['policy'][key[or]][indexInOr][and][indexInAnd][vcContents]).split('"');
									if (partsStruct[1] == "value") {
										// console.log(partsStruct[3]);
										vc.document.write("<br>"+partsStruct[3]+"<br>");
									}
									if (partsStruct[5] == "value") {
										// console.log(partsStruct[7]);
										vc.document.write("<br>"+partsStruct[7]+"<br>");
									}
									// console.log("from ");
									vc.document.write("FROM<br>");
									extractIssuer(policyStruct['policy'][key[or]][indexInOr][and][indexInAnd]);
								}
							}
						}
					}
					// console.log("OR, ");
					vc.document.write("<br>OR, ");
				}
			}
		}
		vc.document.write("</body>");
	}
}

/*
	Storage
*/
var spStorage = [];
function storageFromSp(settings,struct,issuer) {
	let spObject = {};
	if (!settings.spStorage) {
		spObject[issuer] = struct;
		spStorage.push(spObject);
		browser.storage.local.set({spStorage});
	} else {
		spStorage = settings.spStorage;
		spObject[issuer] = struct;
		spStorage.push(spObject);
		browser.storage.local.set({spStorage});
	}
}

function getResp(request){
	browser.webRequest.onBeforeRequest.removeListener(getResp);
	var xmlHttp = new XMLHttpRequest();
	var respURL = request.url;
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.response);
            const getSpFromLocal = browser.storage.local.get("spStorage");
            getSpFromLocal.then(function(settings) {
				storageFromSp(settings,xmlHttp.response,xmlHttp.response['issuer']);
            });
            extractType(xmlHttp.response['authz_policy']);

            browser.webRequest.onBeforeRequest.addListener(
 				getResp,
 				{urls: ["https://example.com/policy"]}
 			);
        }
    }
	xmlHttp.open("GET", respURL, true); // true for asynchronous 
	xmlHttp.responseType = 'json';
	xmlHttp.send(null);
}

// const getSpFromLocal = browser.storage.local.get("spStorage");
// getSpFromLocal.then(function(settings) {
// 	storageFromSp(settings,policyTest,"test");
// });
// const testEx = browser.storage.local.get("spStorage");
// testEx.then(onGot, onError);

/*
	Main part
*/
// browser.webRequest.onBeforeRequest.addListener(
// 	getResp,
// 	{urls: ["https://example.com/policy"]}
// );
/*
	End of main part
*/