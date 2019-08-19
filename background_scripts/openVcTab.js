/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK

								Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/
*/


browser.runtime.onMessage.addListener(notify);

function notify(message) {
	if(message.buttonVP != null){
		const struc = browser.storage.local.get("spStorage");
		struc.then(function(item){
			var spStorage = item;
			spStorage.spStorage[0]['urlToPOST'] = message.buttonVP;
			browser.storage.local.set(spStorage);
		});
		browser.tabs.create({url: "/TabVCs/tabVC.html"});
	}
}