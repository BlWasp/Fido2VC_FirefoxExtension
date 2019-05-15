browser.contextMenus.create({
	id: "sign",
	title: "Sign the VP"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId == "sign") {
		browser.tabs.executeScript({
			file: "sendVP.js"
		});
	}
});