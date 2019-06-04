/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

var btn = document.getElementById("sendVP");

function openRequestedPopup() {
	browser.runtime.sendMessage({"buttonVP": btn.value}); // "buttonVP" : btn.value
}

btn.onclick = function() {
  	openRequestedPopup();
}