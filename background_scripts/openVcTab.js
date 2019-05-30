browser.runtime.onMessage.addListener(notify);

function notify(message) {
	if(message.buttonVP != null){
		const struc = browser.storage.local.get("spStorage");
		struc.then(function(item){
			var spStorage = item;
			spStorage.spStorage[0]['urlToPOST'] = message.buttonVP;
			browser.storage.local.set(spStorage);
		});
		browser.tabs.create({url: "/TabVCs/exemple.html"});
	}
}

function sendViaXHR() {
  var js = {
  	"titre" : "FIFA19"
  };
  let url = "https://example.com:5000/sendVP";
  var xhrVP = new XMLHttpRequest();
  xhrVP.open("POST", url, true);

  xhrVP.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("Request send");
    }
  }
  xhrVP.send(js);
}