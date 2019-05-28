/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/


/*
  All the section bellow is about notification
*/
window.addEventListener('load', function() {
	Notification.requestPermission(function (status) {
		if (Notification.permission !== status) {
			Notification.permission = status;
		}
	});
});

// console.log(Notification.permission);

if (window.Notification && Notification.permission === "granted") {
	var notif = new Notification("Click here to sign and send the VP");
	notif.onclick = function(event) {
		browser.runtime.sendMessage({greeting: "send VP"});
	}
}