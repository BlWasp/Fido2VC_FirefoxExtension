/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK

								Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/
*/

var btn = document.getElementById("sendVP");

function openRequestedPopup() {
	browser.runtime.sendMessage({"buttonVP": btn.value}); // "buttonVP" : btn.value
}

btn.onclick = function() {
  	openRequestedPopup();
}