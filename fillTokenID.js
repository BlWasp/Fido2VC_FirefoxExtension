var tokenID = browser.storage.local.get('spStorage').BPCE['user_token']; // Get tokenID from local storage
document.getElementById("TokenID").value = tokenID;
