browser.runtime.onMessage.addListener(notify);

function notify(message) {
	if(message.buttonVP != null){
		browser.tabs.create({url: "/TabVCs/exemple.html"});
	}
}
