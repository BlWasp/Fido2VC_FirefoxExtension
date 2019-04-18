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
	The Service Provider give a JSON-LD structure with the wanted attributs and the context
	The value of the attributs is empty
	This function recovers the empty attributs
*/
var emptyStruct;
function getEmptyField(url) {
	let reqURL = url;
	let req = new XMLHttpRequest();
	req.open('GET', reqURL);
	req.responseType = 'json';
	req.send();

	req.onload = function() {
		emptyStruct = req.response;
	}
}

/*
	A solution to parse the different JSON-LD structure in the database
	After parsing, just take the needed attributs
*/
function parser(struct) {
	
	//console.log(JSON.stringify());
}

/*
	Fill the structure sends by the SP with the values found with the parser
*/
function fillFields() {
	localStruct.then()
}