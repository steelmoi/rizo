
//00:18:9A:22:CC:EF
var Baracoda = function() {};

Baracoda.prototype.connect = function (successCallback, failureCallback, mac) { 
	return cordova.exec(successCallback, failureCallback, 'Baracoda', 'connect', [mac]);
};

/*Baracoda.prototype.isConnected = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'Baracoda', 'isConnected', []);
};*/

Baracoda.prototype.disconnect = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'Baracoda', 'disconnect', []);
};

Baracoda.prototype.leerCodigo = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'Baracoda', 'leerCodigo', []);
};
//-------------------------------------------------------------------
cordova.addConstructor(function() {
	cordova.addPlugin('baraCoda', new Baracoda());
});