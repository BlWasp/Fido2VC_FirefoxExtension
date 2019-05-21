/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

browser.contextMenus.create({
	id: "sign",
	title: "Sign this VP"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == "sign") {
		browser.tabs.executeScript({
			file: "/background_scripts/sendVP.js"
		});
	}
});