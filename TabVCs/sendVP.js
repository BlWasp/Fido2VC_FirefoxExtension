function initElement()
{
	var p = document.getElementById("makeVP");
	p.onclick = getVCsChecked;
};

function getVCsChecked()
{
	var checkboxes = document.getElementsByClassName('vcAvailable');
	var vals = [];
	var listVCs = [];
	for (var i=0, n=checkboxes.length;i<n;i++) 
	{
		if (checkboxes[i].checked) 
		{
		    vals.push(checkboxes[i].id);
		    listVCs.push(browser.storage.local.get('storageToSend')[checkboxes[i].id]);
		}
	}
	document.write("<div> " + vals  + " </div>");
}

initElement();