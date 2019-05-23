var windowObjectReference;
	function openRequestedPopup() {
		 /* var url = "file:///exemple.html";
		  //var url = "testEnvoiVP";
		  windowObjectReference = window.open(
		    url,
            "NouvelleFenetre","resizable=yes,scrollbars=yes,status=yes"
		  );
		  if(windowObjectReference == null){
		  	console.log("Ah shit, here we go again...");
		  }*/
		  let newWindow = open('', 'example', 'width=300,height=300');
		  newWindow.focus();

		  newWindow.onload = function() {
			  let html = `<div style="font-size:30px">Welcome!</div>`;
			  newWindow.document.body.insertAdjacentHTML('afterbegin', html);
		  };
	}

var btn = document.getElementById("home");
btn.onclick = function() {
  openRequestedPopup();
}