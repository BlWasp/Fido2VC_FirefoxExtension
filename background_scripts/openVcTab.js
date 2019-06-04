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