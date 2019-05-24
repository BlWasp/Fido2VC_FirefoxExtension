function openRequestedPopup() {
	browser.runtime.sendMessage({"url": "Ouverture de la page montrant les VCs en stock"});
}

var btn = document.getElementById("home");
btn.onclick = function() {
  	openRequestedPopup();
}