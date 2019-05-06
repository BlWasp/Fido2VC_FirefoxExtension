/*
	Copyright: Copyright (c) 2019 University of Toulouse, France and
	University of Kent, UK
*/


/*
	Error logger
*/
function onError(e) {
	console.error(e);
}

/*
	Win logger
*/
function onGot(item) {
	console.log(JSON.stringify(item));
}


// const localStruct = browser.storage.local.get();
// localStruct.then(onGot, onError);