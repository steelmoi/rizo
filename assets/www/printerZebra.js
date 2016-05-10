

var PrinterZebra = function() {};

PrinterZebra.prototype.connect = function (successCallback, failureCallback, mac) { 
	return cordova.exec(successCallback, failureCallback, 'PrinterZebra', "connect", [mac]);
};

PrinterZebra.prototype.isConnected = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'PrinterZebra', 'isConnected', []);
};

PrinterZebra.prototype.disconnect = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'PrinterZebra', 'disconnect', []);
};

PrinterZebra.prototype.printText = function(successCallback, failureCallback, text){
	return cordova.exec(successCallback, failureCallback, 'PrinterZebra', 'printText', [text]);
};

//PrinterZebra nombre del plugin, printTextXY funcion que invocara en java
//-------------------------------------------------------------------
cordova.addConstructor(function() {
	cordova.addPlugin('printerZebra', new PrinterZebra());
});