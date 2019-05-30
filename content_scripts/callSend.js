/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

window.addEventListener('load', function() {
	Notification.requestPermission(function (status) {
		if (Notification.permission !== status) {
			Notification.permission = status;
		}
	});
});


var btn = document.getElementById("makeVP"); // id = makeVP

function openNotification() {
	// console.log(Notification.permission);

	if (window.Notification && Notification.permission === "granted") {
		var notif = new Notification("Click here to sign and send the VP");
		notif.onclick = function(event) {
			browser.runtime.sendMessage({greeting: "send VP"});
		}
	}
}

btn.onclick = function() {
  	openNotification();
}




