var vcIsValid = true;

function parseVC(jsonObject){
	verifyContexts(jsonObject['@contexts']);
}

function verifyContexts(contexts) {
	if(contexts === 'undefined'){
		document.write("Error : no @contexts property.");
		vcIsValid = false;
		return;
	}
	if(contexts[0] != 'https://www.w3.org/2018/credentials/v1'){
		document.write("Error. First @context property value is not https://www.w3.org/2018/credentials/v1");
		vcIsValid = false;
		return;
	}

	// To do : check if the issuers are well knows (in the local storage)


function issuanceDateCheck(issuanceDate){
	if(issuanceDate === 'undefined'){
		document.write("Error: Issuance date is not present.");
		vcIsValid = false;
		return;
	}
}