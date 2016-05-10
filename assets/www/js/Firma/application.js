// JavaScript Document
var sigCapture = null;

$(document).ready(function(e) {
	
});

function onSubmitClick( event ) {
	if ( verifyEmail() )
	{
		$("#feedback").html( "Sending..." );
		var email = $("#email").val();
		var sig = sigCapture.toString();
		alert(sig);
		document.getElementById('imgSignature').setAttribute( 'src', 'data:image/png;base64,' + sig );
		var data = { "method":"submitSignature",
					 "email":email,
					 "signature":sig,
					 "returnformat":"json" };
		
		var url = "http://myserver.com/path/to/cfc/Services.cfc";
		$.ajax({
 		  type: 'POST',
		  url: url,
		  data:data,
		  success: requestSuccess,
		  error: requestError
		});
	}	
	else {	
		$("#feedback").html( "Please enter a valid email address." );
	}
	
}

function tomarSignature() {
	var sig = sigCapture.toString();
	var p = new firma();
		
	p.Id_asignacion_ruta = objUsuario.Id_asignacion_Ruta;
	p.Id_usuario = objUsuario.Id_Usuario;
	p.Numero_imei = g_imei;

	var index = sig.indexOf( "," )+1;
    dataString = sig.substring( index );
	
    objUsuario.firma = dataString;    	
    p.Firma_Venta = objUsuario.firma;
    
    if(objUsuario.operacion == TIPOVENTA.NOVENTA && noVenta != null)
    {
    	noVenta.Firma = objUsuario.firma
    	p.Id_tipo = 3;
    	p.Folio = noVenta.id_noventa;
    	btnNoVenta_Click();    
    }    
    else
    {
    	if(objVentas != null)
    	{
    		objVentas.firma = objUsuario.firma;
    		p.Id_tipo = objVentas.id_tipo_venta + OFFSET_OPERACION;
    		p.Folio = objVentas.folio;
    	}
	    if(String(objUsuario.firma).length > 0)
	    	GuardaFirma(objUsuario.id_operacion, objUsuario.operacion, objUsuario.firma);
	    
	    if(ONLINE)
	    	EnviarFirma(objUsuario.id_operacion, objUsuario.operacion, p);
	    
	    ImprimirVenta();
    }
    /*document.getElementById(image).setAttribute( 'src', 'data:image/png;base64,' + dataString ); */
}

function limpiarSignature(canvasid) {
	//document.getElementById(image).setAttribute( 'src', '');
	//alert("limpiarSignature canvasid:" + canvasid);
	sigCapture = null;
	sigCapture = new SignatureCapture( canvasid );
}

function onCancelClick( event ) {
	clearForm();
}

function clearForm() {
	$("#email").val( "" );
	sigCapture.clear();
	$("#feedback").html( "" );
}

function requestSuccess( data, textStatus, jqXHR ) {
	clearForm();
	$("#feedback").html( "Thank you." );
}

function requestError( jqXHR, textStatus, errorThrown ) {
	$("#feedback").html( "Error: " + errorThrown );
}

function verifyEmail() {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( $("#email").val() );
}

