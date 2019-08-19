/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK

								Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/
*/

/*
	This script is used if we want to make the Fido2 signature with JavaScript
	It is not used currently
*/

browser.runtime.onMessage.addListener(sign);

function sign(request) {
	if(request.greeting == 'send VP') {
		browser.tabs.executeScript({
			file: "/content_scripts/sendVP.js"
		});
	}
}