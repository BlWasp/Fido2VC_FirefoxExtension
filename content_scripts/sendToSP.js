function openRequestedPopup() {
	browser.runtime.sendMessage({"buttonVP": "Ouverture de la page montrant les VCs en stock"});
}

var btn = document.getElementById("home");
btn.onclick = function() {
  	openRequestedPopup();
}