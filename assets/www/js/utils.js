/**
 * 
 */

function ControlaDiv(revelar, titulo, callback)
{
    //Si es el mismo no lo muestra
   /* if(String(curWindow) == String(revelar))
        return;*/
    
    if(String(revelar) == 'Inicio'){
        //$("#spVentas").text('');
        titulo = '';
        $("#sVersion").text('Version: ' + objUsuario.parametros['version']);
    }
    
    if(existeValor(VENTANAS, String(revelar))){
        MuestraDiv("aGuardar");
    }else{
        OcultarDiv("aGuardar");
    }    
    
    curWindow = revelar;
    CargaVentana(revelar, titulo, callback);
    
    //OcultarDiv('popupPanel');
}

function CargaVentana(plantilla, titulo, callback)
{   
	$("#spVentas").text(titulo);
	/*$.get("plantillas/" + plantilla + ".html", function(htmlPlantilla)
        {
            $("#contenido").empty();
            $("#contenido").append(htmlPlantilla).trigger('create');
            if (callback!=undefined) {
                callback(); 
            }
        });*/
	$.ajax({
		url: "plantillas/" + plantilla + ".html",
		success: function(data) {  			  
			$("#contenido").empty();
			$("#contenido").append(data).trigger('create');
			if (callback!=undefined)
				callback();
		},
		dataType: "text"
	});   
}

function resetOptionConf()
{
	//_.each(manu.options, function(option){option.isSelected=false;});
}

function convertResult2JsonAray(results)
{
	var v_array = [];
	
	 for(var i = 0; i < results.rows.length; i++)
		 v_array.push(results.rows.item(i));	
	
	return v_array;
}

function loadTemplateHBS(plantilla, titulo, dtSource, callback)
{
	$("#spVentas").text(titulo);
	
	 curWindow = plantilla;
	$.ajax({
		url: "plantillas/" + plantilla + ".html",
		success: function(data) {
			  var template = Handlebars.compile(data);

			$("#contenido").empty();
			$("#contenido").append(template(dtSource)).trigger('create');
			if (callback!=undefined)
				callback();
		},
		dataType: "text",
		error: function(er){
			console.log("loadTemplateHBS error:" + er);
		}
	}); 
}

function loadPartialTemplateHBS(plantilla, container, dtSource, callback)
{
	$.ajax({
		url: "plantillas/" + plantilla + ".html",
		success: function(data) {
		    var template = Handlebars.compile(data);

		    if(g_isdebug)
		    {
		    	console.log(JSON.stringify(dtSource));
		    	console.log(template(dtSource));
		    }
		    
			$("#"+container).empty();
			$("#"+container).append(template(dtSource)).trigger('create');
			if (callback!=undefined)
				callback();
		},
		dataType: "text",
		error: function(er){
			console.log("loadTemplateHBS error:" + er);
		}
	}); 
}

function MuestraDiv(revelar)
{    
    $('#'+revelar).show("fast");
}

function OcultarDiv(ocultar)
{
    //alert(ocultar);
    $('#'+ocultar).hide("fast");    
}

function FechaActual()
{
    var currentTime = new Date();
    var monthCur = currentTime.getMonth() + 1;
    monthCur = padding_left(String(monthCur), "0", 2);
    var dayCur = currentTime.getDate();
    dayCur = padding_left(String(dayCur), "0", 2);
    var yearCur = padding_left(currentTime.getFullYear(), "0", 4);

    var hora = currentTime.getHours();
    hora = padding_left(String(hora), "0", 2);
    var minutos = currentTime.getMinutes();
    minutos= padding_left(String(minutos), "0", 2);
    var segundos = currentTime.getSeconds();
    segundos = padding_left(String(segundos), "0", 2);
    
    return yearCur + "-" + monthCur + "-" + dayCur + " " + hora + ":"+minutos+":"+segundos;
}

function FechaActualFormato()
{
    var currentTime = new Date();
    var monthCur = currentTime.getMonth() + 1;
    monthCur = padding_left(String(monthCur), "0", 2);
    var dayCur = currentTime.getDate();
    dayCur = padding_left(String(dayCur), "0", 2);
    var yearCur = padding_left(currentTime.getFullYear(), "0", 4);

    var hora = currentTime.getHours();
    hora = padding_left(String(hora), "0", 2);
    var minutos = currentTime.getMinutes();
    minutos= padding_left(String(minutos), "0", 2);
    var segundos = padding_left(String(currentTime.getSeconds(), "0", 2));
    
    return monthCur + "/" + dayCur + "/" + yearCur + " " + hora + ":"+minutos;
}

function FechaFormato(strFecha, strFormato, strHora)
{
//YYYY-mm-dd
	var aFecha = new Array();
	var aFechaAux = new Array();
	var aHora = new Array();
	if(String(strFecha).indexOf(' ') >= 0)
	{	
		aFechaAux = strFecha.split(' ');
		aFecha = String(aFechaAux[0]).split('-');
	}else
		aFecha = strFecha.split('-');
	aHora = strHora.split(':');
	
	var hhmm = " "+ aHora[0] + ':'+ aHora[1];
	
	if(strFormato == "MM-dd-yyyy")
		return aFecha[1] + "-" + aFecha[2] + "-" + aFecha[0] + hhmm;
	if(strFormato == "MM/dd/yyyy")
		return aFecha[1] + "/" + aFecha[2] + "/" + aFecha[0] + hhmm;
	if(strFormato == "dd/MM/yyyy")
		return aFecha[2] + "/" + aFecha[1] + "/" + aFecha[0] + hhmm;
	if(strFormato == "dd-MM-yyyy")
		return aFecha[2] + "-" + aFecha[1] + "-" + aFecha[0] +hhmm;
	if(strFormato == "yyyy-MM-dd")
		return aFecha[0] + "-" + aFecha[1] + "-" + aFecha[2] + hhmm;
	if(strFormato == "yyyy/MM/dd")
		return aFecha[0] + "/" + aFecha[1] + "/" + aFecha[2] + hhmm;
	return strFecha + hhmm;
}

function padding_left(s, c, n) {
    if (!s || !c || s.length >= n) {
        return s;
    }

    var max = (n - s.length) / c.length;
    for ( var i = 0; i < max; i++) {
        s = c + s;
    }

    return s;
}
function padding_right(s, c, n) {
    if (!s || !c || s.length >= n) {
        return s;
    }

    var max = (n - s.length) / c.length;
    for ( var i = 0; i < max; i++) {
        s += c;
    }

    return s;
}

var vibrate = function() {
    navigator.notification.vibrate(0);
};

var beep = function() {
    navigator.notification.beep(2);
};

function ValidaNulo(lista, nodo)
{   
    var error = '';
    try
    {
        if(lista.getElementsByTagName(nodo)[0] != null && 
                lista.getElementsByTagName(nodo)[0].childNodes[0] != null)
            return lista.getElementsByTagName(nodo)[0].childNodes[0].nodeValue;
    }
    catch(err)
    {
        error="Error description: " + err.message + "\n\n";
        error+= "nodo:" + nodo + "lista:" + lista;
        alert(error);
    }

    return '';
}

function Alerta(mensaje){
	navigator.notification.alert(mensaje, null, NOMBRE_APLICACION, BOTON_OK);
}

function replaceAll(text, busca, reemplaza)
{
    while (text.toString().indexOf(busca) != -1)
        text = text.toString().replace(busca,reemplaza);

    return text;
}

function ControlaCheckbox(nombreCheck, valor)
{
    $("input#" + nombreCheck).attr("checked", valor).checkboxradio("refresh");
    //$("input[type='radio']").attr("checked",true).checkboxradio("refresh");
    /*var aInput = document.getElementById(nombreCheck);
    alert(aInput.length);
    for(var i=0; i < aInput.length; i++)
        if(aInput[i].type === 'radio')
            alert("checked:" +aInput[i].checked + "|id:" + aInput[i].id);*/
     
}

function Controlali(control, pos, display)
{
	// inline --  none
	document.getElementById(control).children[pos].style.display=display;
	
	}

function trim (myString)
{
	return myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
}

function HabilitaInput(nombreInput)
{
	$("#"+nombreInput).removeAttr("disabled");	
}

function DeshabilitaInput(nombreInput)
{
	$("#"+nombreInput).attr("disabled", "disabled");
}

function SeleccionaCheck(nombreCheck)
{
	
}

function setFocus(inputName)
{
	$('#'+inputName).focus();
	
}

function centrar(texto, maximo)
{
	var len = texto.length;
	var offset = 0;
	var centrada = texto;
	
	offset = maximo - len;
	//alert("offset:"+offset);
	if(offset > 2){
		offset = parseInt(offset/2);
		centrada = padding_left(texto, ' ', offset + len);
	}
	
	return centrada;
}

function padLeft(texto, total, caracter)
{
	var centrada = '';
	for(var pos =0; pos < total; pos++)
		centrada =  centrada + caracter;
	return centrada + texto;
}

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
};
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,"");
};
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,"");
};

function ObtieneNombreTransaccion(id_tipo_venta)
{
	switch(id_tipo_venta)
	{
		case TIPOVENTA.VENTA:
			if(TIPOVENTA.GENERICO != objUsuario.operacion)
				return TITULOS.VENTAS;
			else
				return TITULOS.TRASPASO;
		case TIPOVENTA.DEMO:
			return TITULOS.DEMO;
		case TIPOVENTA.CREDITO:
			return TITULOS.CREDITO;
		case TIPOVENTA.PROMOCION:
			return TITULOS.PROMOCION;
		default:
			return "";
	}
}

function ShowSpinner(text)
{
	OcultarDiv("aGuardar");
	OcultarDiv("aMenu");
	$.mobile.utils.showWaitBox("a", text);
}

function HideSpinner()
{
	$.mobile.utils.hideWaitBox();
	MuestraDiv("aMenu");
	MuestraDiv("aGuardar");	
}

function LimpiaArray(aDatos)
{	
	for(var i=0; i < aDatos.length; i++)
		aDatos.pop();
}

function LimpiaArrayGrupo(aGrupos)
{
    for(var i=0; i < aGrupos.length; i++)
    {
    	LimpiaArray(aGrupos[i]);
    }
}

function formatNumber(num,prefix)  
{  
    //num = Math.round(parseFloat(num)*Math.pow(10,2))/Math.pow(10,2);
    prefix = prefix || '';  
    num += '';  
    var splitStr = num.split('.');  
    var splitLeft = splitStr[0];  
    var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '.00';  
    splitRight = splitRight + '00';  
    splitRight = splitRight.substr(0,3);  
    var regx = /(\d+)(\d{3})/;  
    while (regx.test(splitLeft)) 
    {  
        splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');  
    }  
    return prefix + splitLeft + splitRight;  
}

function  breakLine(str, maximo, numDocument, y, col, incremento)
{
	var cad  = "";
	if(str == null)
		return y;
	if(trim(str).length <= 0)
		return y;

	//buscamos el espacio
	var aPalabras = new Array();
	aPalabras =  str.split(' ');
	//si tiene length, entoces tiene espacios
	if(aPalabras.length > 1 && str.indexOf(" ") >= 0)
	{
		for(var i =0; i< aPalabras.length; i++)
		{
			if(cad.length + aPalabras[i].length <= maximo)
			{
				cad += aPalabras[i];
				if(cad.length + 1 < maximo)
						cad += " ";
			}else
			{
				window.plugins.Printer.addTextDocument(null,null,numDocument,  cad , y, col);
				cad = "";
				y += incremento;
				for(var j=i; j < aPalabras.length; j++)
					cad += aPalabras[j] + " ";
									
				return breakLine(trim(cad), maximo, numDocument, y, col, incremento);
			}
		}
	}else{
		//no hay espacios, rompe por letras
		str = trim(str);
		if(str.length >= maximo)
		{
			window.plugins.Printer.addTextDocument(null,null,numDocument,  str.substring(0, maximo) , y, col);
			cad = str.substring(maximo, str.length);
		}else{
			window.plugins.Printer.addTextDocument(null,null,numDocument,  str.substring(0, str.length) , y, col);
			cad = str.substring(maximo, str.length);
		}
		y += incremento;
		return breakLine(cad, maximo, numDocument, y, col, incremento);
	}
	return y;
}