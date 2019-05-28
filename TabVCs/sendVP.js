function initElement()
{
	var p = document.getElementById("makeVP");
	p.onclick = getVCsChecked;
};

var listVCs = [];
function getVCsChecked()
{
	var checkboxes = document.getElementsByClassName('vcAvailable');
	var vals = [];
	const vcFromStorage = browser.storage.local.get('storageToSend');
	vcFromStorage.then(function(settings) {
		for (var i=0, n=checkboxes.length;i<n;i++) 
		{
			if (checkboxes[i].checked) 
			{
			    vals.push(checkboxes[i].id);
			    console.log(settings['storageToSend'][checkboxes[i].id][1]);
			    listVCs.push(settings['storageToSend'][checkboxes[i].id][1]);
			}
		}
		const storeListVC = browser.storage.local.get('listVCs');
		storeListVC.then(function(vc) {
			storeList(vc);
		});
		document.write("<div> " + vals  + " </div>");
		document.write("<div> " + listVCs  + " </div>");
	});
}

function storeList(vc) {
	if (!vc.listVCs) {
		browser.storage.local.set({listVCs});
	} else {
		for (var loopListVC of vc.listVCs) {
			listVCs.push(loopListVC);
		}
		browser.storage.local.set({listVCs});
	}
}

initElement();