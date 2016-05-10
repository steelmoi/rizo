/**
 * 
 */

Handlebars.registerHelper('isSale', function(gridName, options){
	if(String(gridName) === 'tblVentas')
		return options.fn(this);
	else
		return options.inverse(this);
});

Handlebars.registerHelper("formatCurrency", function(Precio, Cantidad){
	/*var subtotal =  String(parseFloat(Precio * Cantidad).toFixed(2));
	console.log("formatCurrency :" + subtotal);
	return new HandleBars.SafeString(subtotal);*/
	console.log("Precio :" + Precio);
	return new Handlebars.SafeString("1200");
});


