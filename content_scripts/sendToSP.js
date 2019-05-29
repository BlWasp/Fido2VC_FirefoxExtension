var btn = document.getElementById("sendVP");

function openRequestedPopup() {
	browser.runtime.sendMessage({"buttonVP": btn.value});
}

btn.onclick = function() {
  	openRequestedPopup();
}