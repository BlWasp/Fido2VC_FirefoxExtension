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
*/
function parser(policyStruct) {
	let type = policyStruct['authz_policy'][0][1];
	if (type == "cnf") {
		let urn = policyStruct['authz_policy'][0]['cnf']['allOf'][0]['oneOf'][0]['att'][0]['attType'];
		let partUrn = urn.split(':');
		let valUrn = partUrn[2];
		//TODO
	}
}



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