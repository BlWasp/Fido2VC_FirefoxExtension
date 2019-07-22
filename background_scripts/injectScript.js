/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

browser.runtime.onMessage.addListener(sign);

function sign(request) {
	if(request.greeting == 'send VP') {
		browser.tabs.executeScript({
			file: "/content_scripts/sendVP.js"
		});
	}
}