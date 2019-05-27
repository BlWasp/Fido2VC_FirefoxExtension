const struc = browser.storage.local.get("spStorage");
struc.then(function(item){
  document.getElementById("TokenID").value = item.spStorage[0].user_token;
});
