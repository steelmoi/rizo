
//00:18:9A:22:CC:EF
var LectorCB = function() {};

LectorCB.prototype.connect = function (successCallback, failureCallback, mac) {
	console.log("En prototipo------------------");
	return cordova.exec(successCallback, failureCallback, 'LectorCB', 'connect', [mac]);
};

/*Baracoda.prototype.isConnected = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'Baracoda', 'isConnected', []);
};*/

LectorCB.prototype.disconnect = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'LectorCB', 'disconnect', []);
};

LectorCB.prototype.leerCodigo = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'LectorCB', 'leerCodigo', []);
};
//-------------------------------------------------------------------
cordova.addConstructor(function() {
	cordova.addPlugin('lectorCB', new LectorCB());
});
