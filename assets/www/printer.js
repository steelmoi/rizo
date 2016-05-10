

var Printer = function() {};

Printer.prototype.connect = function (successCallback, failureCallback, mac, type) { 
	return cordova.exec(successCallback, failureCallback, 'Printer', "connect", [mac, type]);
};

Printer.prototype.isConnected = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'Printer', 'isConnected', []);
};

Printer.prototype.disconnect = function(successCallback, failureCallback){
	return cordova.exec(successCallback, failureCallback, 'Printer', 'disconnect', []);
};

Printer.prototype.printText = function(successCallback, failureCallback, text, row, col){
	return cordova.exec(successCallback, failureCallback, 'Printer', 'printText', [text, row, col]);
};

Printer.prototype.printImage = function(successCallback, failureCallback, x, y, width, height){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'printImage', [x, y, width, height]);
};

Printer.prototype.addDocument = function(successCallback, failureCallback, font){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'addDocument', [font]);
};

Printer.prototype.addTextDocument = function(successCallback, failureCallback, index, text, row, col){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'addTextDocument', [index, text, row, col]);
};

Printer.prototype.addLineDocument = function(successCallback, failureCallback, index, len, row, col){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'addLineDocument', [index, len, row, col]);
};

Printer.prototype.addImageDocument = function(successCallback, failureCallback, index, row, col, width, height, codigo){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'addImageDocument', [index, row, col, width, height, codigo]);
};

Printer.prototype.printDocument = function(successCallback, failureCallback, index){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'printDocument', [index]);
};

Printer.prototype.printAllDocuments = function(successCallback, failureCallback){
    return cordova.exec(successCallback, failureCallback, 'Printer', 'printAllDocuments', []);
};

//PrinterZebra nombre del plugin, printTextXY funcion que invocara en java
//-------------------------------------------------------------------
cordova.addConstructor(function() {
	cordova.addPlugin('Printer', new Printer());
});