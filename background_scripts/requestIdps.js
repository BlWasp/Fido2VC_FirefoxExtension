/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/


/*
	Ask to the Idp for specifics attributs
*/
var attrNeeded;
function needAttributs(request) {
	let reqURL = request.url;
	let req = new XMLHttpRequest();
	req.open('POST',reqURL);
	req.send('param1=' + attrNeeded);

	// req.addEventListner('readystatechange', function() {
	// 	if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {

	// 	}
	// });
}


browser.webRequest.onBeforeRequest.addListener(
	needAttributs,
	{urls: ["https://fido/generateStruct/*"]},
	["blocking"]
);