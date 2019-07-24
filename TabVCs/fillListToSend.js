/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/

function initElement()
{
	var p = document.getElementById("makeVP");
	p.addEventListener("click", getVCsChecked);
};

/*
	Read the checkboxes selected and add the VCs in the listVCs storage
*/
var listVCs = [];
function getVCsChecked()
{
	// browser.storage.local.remove('listVCs');
	var checkboxes = document.getElementsByClassName('vcAvailable');
	var vals = [];
	const vcFromStorage = browser.storage.local.get('storageToSend');
	vcFromStorage.then(function(settings) {
		for (var i=0, n=checkboxes.length;i<n;i++) 
		{
			console.log(i);
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
		document.write("Envoi en cours...")
	});
	window.close();
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