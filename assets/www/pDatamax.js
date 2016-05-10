

var PrinterDatamax = function() {};

PrinterDatamax.prototype.connect = function (successCallback, failureCallback, mac) { 
	return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', "connect", [mac]);
};

PrinterDatamax.prototype.isConnected = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'isConnected', []);
};

PrinterDatamax.prototype.disconnect = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'disconnect', []);
};

PrinterDatamax.prototype.printText = function(successCallback, failureCallback, text, row, col){
	return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'printText', [text, row, col]);
};

PrinterDatamax.prototype.addDocument = function(successCallback, failureCallback, font){
    return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'addDocument', [font]);
};

PrinterDatamax.prototype.addTextDocument = function(successCallback, failureCallback, index, text, row, col){
    return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'addTextDocument', [index, text, row, col]);
};

PrinterDatamax.prototype.addLineDocument = function(successCallback, failureCallback, index, len, row, col){
    return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'addLineDocument', [index, len, row, col]);
};

PrinterDatamax.prototype.addImageDocument = function(successCallback, failureCallback, index, pathImage, row, col){
    return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'addImageDocument', [index, pathImage, row, col]);
};

PrinterDatamax.prototype.printDocument = function(successCallback, failureCallback, index){
    return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'printDocument', [index]);
};

PrinterDatamax.prototype.printAllDocuments = function(successCallback, failureCallback){
    return cordova.exec(successCallback, failureCallback, 'PrinterDatamax', 'printAllDocuments', []);
};

//PrinterZebra nombre del plugin, printTextXY funcion que invocara en java
//-------------------------------------------------------------------
cordova.addConstructor(function() {
	cordova.addPlugin('printerDatamax', new PrinterDatamax());
});