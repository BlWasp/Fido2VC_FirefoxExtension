browser.runtime.onMessage.addListener(notify);

function notify(message) {
 	browser.tabs.create({url: "/TabVCs/exemple.html"});
}
