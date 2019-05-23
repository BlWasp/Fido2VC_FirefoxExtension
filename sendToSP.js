var windowObjectReference;
	function openRequestedPopup() {
		  var url = browser.extension.getURL("exemple.html");
		  windowObjectReference = window.open(
		    url,
            "NouvelleFenetre","resizable=yes,scrollbars=yes,status=yes"
		  );
		  if(windowObjectReference == null){
		  	console.log("Ah shit, here we go again...");
		  }
	}

var btn = document.getElementById("home");
btn.onclick = function() {
  openRequestedPopup();
}