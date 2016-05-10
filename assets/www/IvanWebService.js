function METODOS(){}

METODOS.METODO_OBTENERALMACENINVENTARIO 			= 'ObtenerAlmacenInventario';
METODOS.METODO_OBTENERUSUARIOS 						= 'ObtenerUsuarios';
METODOS.METODO_OBTENERNEGOCIOS 						= 'ObtenerNegocios';
METODOS.METODO_OBTENERLISTASPRECIOS 				= 'ObtenerListasPrecios';
METODOS.METODO_OBTENERVERSION 						= 'ObtenerVersion';
METODOS.METODO_OBTENERINFORMACIONIMPRESION 			= 'ObtenerInformacionImpresion';
METODOS.METODO_OBTENERASIGNACIONRUTAUSUARIOS		='ObtenerAsignacionRutaUsuarios';
METODOS.METODO_OBTENERDESCUENTOS 					= 'ObtenerDescuentos';
METODOS.METODO_OBTENERTABLAS 						= 'ObtenerTablas';
METODOS.METODO_ENVIARVENTAS 						= 'EnviarVentas';
METODOS.METODO_CANCELARVENTAS						= 'CancelarVentas';
METODOS.METODO_OBTENERMOVIMIENTOS					= 'ObtenerMovimientos';
METODOS.METODO_OBTENERMOVIMIENTOSOUT				= 'MovimientoOut';
METODOS.METODO_ENVIARCIERRE 						= 'ObtenerCierredelDia';
METODOS.METODO_OBTENERDETALEASIGNACION 				= 'ObtenerDetalleAsignacion';
METODOS.METODO_AGREGARPAGOS 						= 'AgregarPagos';
METODOS.METODO_OBTENERVALIDACION 					= 'ObtenerValidacion';
METODOS.METODO_CONFIRMASINCRO 						= 'ObtenerConfirmacionDeSincronizacion';
METODOS.METODO_MOVIMIENTODET						= 'ObtenerMovimientosDet';
METODOS.METODO_OBTENERVENTAS						= 'ObtenerVentas';
METODOS.METODO_INFOCIA								= 'ObtenerConfiguracionCompania';
METODOS.METODO_CANCELPAGOS							= 'CancelPagos';

var TIMEOUT	=	1200000;
var xmlHttpTimeout= null;

function getObjectClass(obj) {
    if (obj && obj.constructor && obj.constructor.toString) {
        var arr = obj.constructor.toString().match(
            /function\s*(\w+)/);

        if (arr && arr.length == 2) {
            return arr[1];
        }
    }

    return typeof(obj);
}

function IvanWebService(url){
    this.url = url;        
    this.result = "";
    this.request = "";
    this.methodName = "";
    
    this.inciado = false;

    this.client = new XMLHttpRequest();

    clearTimeout(xmlHttpTimeout);
}

IvanWebService.prototype.onDone = function(){};
IvanWebService.prototype.onAbort = function(){};

IvanWebService.prototype.call = function(methodName, async, methodParams){
    this.methodName = methodName;
    
    var reqbody = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"  +
    "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "<soap:Body>" +
            "<" + this.methodName + " xmlns=\"http://tempuri.org/\">";
            
    for(var i=0;i<methodParams.length;i++)
    {
        if(i % 2 == 0) {
            argName = methodParams[i];
        }
        else{
            reqbody += "<" + argName + ">";
            reqbody += this.writeVarValue(methodParams[i]);
            reqbody += "</" + argName + ">";
        }
    }
                                  
    reqbody += "</" + this.methodName + ">" +
        "</soap:Body>" +
    "</soap:Envelope>";
    reqbody = String(reqbody);
    var parentThis = this;

    var client = new XMLHttpRequest();
    client.open("POST", this.url, async);
    client.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    client.setRequestHeader("SOAPAction", "http://tempuri.org/" + this.methodName);
    client.onreadystatechange = function() {
    	console.log("call readyState:" + client.readyState);
    	console.log("call status :" +client.status );
        if (client.readyState == 4) {
            parentThis.result = client.responseText;
            if (parentThis.onDone && typeof(parentThis.onDone) == "function") {
                parentThis.onDone();
            }
            //NOTE: this in here refers to var client, that's why we need to use parentThis instead
            if(client.status != 200)
        	{
            	parentThis.ajaxTimeout();
        	}
        }
    } 
    client.send(reqbody);
}

IvanWebService.prototype.writeVarValue = function(clObj)
{
    var typ = getObjectClass(clObj);
    
    if(typ.toLowerCase() == "boolean" || typ.toLowerCase() == "string" || typ.toLowerCase() == "number"){
        var ret = clObj;
    }
    else if(typ.toLowerCase() == "date"){
        var d = clObj.getDate();
        var m = clObj.getMonth();
        m += 1; //month is zero based
        var y = clObj.getFullYear();
        
        var h = clObj.getHours();
        var i = clObj.getMinutes();
        var s = clObj.getSeconds();
        
        var ret = y + "-";
        if(m<10) ret += "0" + m + "-"; else ret += m + "-";
        if(d<10) ret += "0" + d + "T"; else ret += d + "T";
        if(h<10) ret += "0" + h + ":"; else ret += h + ":";
        if(i<10) ret += "0" + i + ":"; else ret += i + ":";
        if(s<10) ret += "0" + s; else ret += s;                
    }
    else if(typ.toLowerCase() == "array"){        
        var ret="";
        
        for(i=0;i<clObj.length;i++)
        {
            ret += this.writeVarValue(clObj[i]);
        }                
    }
    else{                
        var ret = "<" + typ + ">";
        
        for (var member in clObj) {
            ret += "<" + member + ">" + this.writeVarValue(clObj[member]) + "</" + member + ">";            
        }
        ret += "</" + typ + ">";                
    }
    
    return ret;
}

function getNameInstance(obj)
{
    //if(obj instanceof ventas)
      //  return 'ventas';
    
    if(obj instanceof VentasDet)
        return 'VentasDet';
    else if(obj instanceof MovimientosDet)    	
    	return 'MovimientosDet';
    else if(obj instanceof PagosRuta)
    	return 'PagosRuta';
    return '';
}

IvanWebService.prototype.writeVarValueObject = function(clObj, esRecursivo)
{
    var typ = getObjectClass(clObj);
    
    if(typ.toLowerCase() == "boolean" || typ.toLowerCase() == "string" || typ.toLowerCase() == "number"){
        var ret = clObj;
    }
    else if(typ.toLowerCase() == "date"){
        var d = clObj.getDate();
        var m = clObj.getMonth();
        m += 1; //month is zero based
        var y = clObj.getFullYear();
        
        var h = clObj.getHours();
        var i = clObj.getMinutes();
        var s = clObj.getSeconds();
        
        var ret = y + "-";
        if(m<10) ret += "0" + m + "-"; else ret += m + "-";
        if(d<10) ret += "0" + d + "T"; else ret += d + "T";
        if(h<10) ret += "0" + h + ":"; else ret += h + ":";
        if(i<10) ret += "0" + i + ":"; else ret += i + ":";
        if(s<10) ret += "0" + s; else ret += s;                
    }
    else if(typ.toLowerCase() == "array"){        
        var ret="";
        
        for(i=0;i<clObj.length;i++)
        {
            ret += this.writeVarValueObject(clObj[i], true);
        }                
    }
    else{                
        var ret = "";
        var name = '';
        
        if(typ !=='object')
            ret = "<" + typ + ">";
        else{
            name = getNameInstance(clObj);
            if(name !== ''){
                if(esRecursivo)
                    ret = '<riz:' + name + '>';
                else
                    ret = '<tem:' + name + '>';
            }
        }
        
        for (var member in clObj) {
            
                ret += "<riz:" + member + ">" + this.writeVarValueObject(clObj[member], false) + "</riz:" + member + ">";
            
        }
        if(typ !=='object')
            ret += "</" + typ + ">";
        else
            if(name !== ''){
                if(esRecursivo)
                    ret += '</riz:' + name + '>';
                else
                    ret += '</tem:' + name + '>';
            }
    }
    
    return ret;
};

IvanWebService.prototype.esObjectoUnico = function(clObj)
{
    var typ = getObjectClass(clObj);
    
    
    if(typ.toLowerCase() == "boolean" || typ.toLowerCase() == "string" || typ.toLowerCase() == "number"){
    	var ret = 0;
    }
    else if(typ.toLowerCase() == "date"){
    	var ret = 0;
    }
    else if(typ.toLowerCase() == "array"){        
        var ret=0;
        
        for(var i=0;i<clObj.length;i++)
        {
            ret += this.esObjectoUnico(clObj[i]);
        }                
    }
    else{                
        var ret = 0;
        var name = '';
        
        if(typ !=='object')
            ;//ret = "<" + typ + ">";
        else{
            ret++;
        }
        
        for (var member in clObj) {            
                ret += this.esObjectoUnico(clObj[member]);            
        }        
    }
    
    return ret;
};

IvanWebService.prototype.getReturnValue = function(clObj)
{
    return this.parseVarValue(this.result, this.methodName + "Result", clObj);
}

IvanWebService.prototype.getVariableValue = function(name, clObj)    
{
    return this.parseVarValue(this.result, name, clObj);
}
    
IvanWebService.prototype.parseVarValue = function(body, name, clObj)
{        
    var start = body.indexOf("<" + name + ">"); 
    start += name.length + 2; //with < and > char
    var end = body.indexOf("</" + name + ">");   
    if(end == -1)
        body = "";
    else
        body = body.substring(start, end);
    
    var typ = getObjectClass(clObj);                
    
    if(typ.toLowerCase() == "boolean"){
        var ret = Boolean(body);
    }
    else if(typ.toLowerCase() == "string"){
        var ret = body;
    }
    else if(typ.toLowerCase() == "number"){
        var ret = Number(body);
    }
    else if(typ.toLowerCase() == "date"){
        var ret = new Date();
        ret.setFullYear(body.substring(0,4));
        ret.setMonth(body.substring(5,7) - 1);
        ret.setDate(body.substring(8,10));
        
        ret.setHours(body.substring(11,13));
        ret.setMinutes(body.substring(14,16));
        ret.setSeconds(body.substring(17,19));            
    }
    else if(typ.toLowerCase() == "array"){        
        var ret=new Array();
        if(body == "") return ret;
        
        var innerTyp = getObjectClass(clObj[0]); 
        
        var items = body.split("</" + innerTyp + ">");
        
        for(var i=0;i<items.length;i++)
        {
            items[i] += "</" + innerTyp + ">";                    
            ret[i] = this.parseVarValue(items[i], innerTyp, clObj[0]);
        }
    }
    else{                
        var ret = Object.create(clObj);
        
        for (var member in ret) {
            ret[member] = this.parseVarValue(body, member, ret[member]);            
        }
    }
            
    return ret;        
};
/*
 * POST /ServiceUnilider/UniliderService.svc/Basic HTTP/1.1
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; MS Web Services Client Protocol 2.0.50727.3634)
VsDebuggerCausalityData: uIDPo94UqCr3H09Jp3L9aQz4NnQAAAAAAu+1tnhCwUSqlemL4v52+NmyJJMsOFhHl09iLvjfFCMACQAA
Content-Type: text/xml; charset=utf-8
SOAPAction: "http://tempuri.org/IUniliderService/getdata"
Host: rizolopez.no-ip.com:81
Content-Length: 285
Expect: 100-continue
Connection: Keep-Alive
HTTP/1.1 100 Continue
<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
<soap:Body>
<getdata xmlns="http://tempuri.org/" />
</soap:Body>
</soap:Envelope>
 * */

IvanWebService.prototype.callWCF = function(methodName, async, methodParams, IService){
    this.methodName = methodName;
    var i=0;

    var reqbody = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"  +
    "<soap:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
        "<soap:Body>" +
            "<" + this.methodName + " xmlns=\"http://tempuri.org/\">";
            
    for(i=0;i<methodParams.length;i++)
    {
        if(i % 2 == 0) {
            argName = methodParams[i];
        }
        else{
            reqbody += "<" + argName + ">";
            reqbody += this.writeVarValue(methodParams[i]);
            reqbody += "</" + argName + ">";
        }
    }
                                  
    reqbody += "</" + this.methodName + ">" +
        "</soap:Body>" +
    "</soap:Envelope>";
    reqbody = String(reqbody);
    var parentThis = this;
    
    try{
    	if(g_isdebug)
    		console.log("callWCF:"+reqbody);

    parentThis.client.open("POST", this.url+'/Basic', async);
    parentThis.client.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    parentThis.client.setRequestHeader("SOAPAction", 'http://tempuri.org/' + IService + '/' + this.methodName);
    parentThis.client.onreadystatechange = function() {
    	console.log("callWCF readyState:" + parentThis.client.readyState);
    	console.log("callWCF status :" + parentThis.client.status );
        if (parentThis.client.readyState == 4) {        
            parentThis.result = parentThis.client.responseText;
            if (parentThis.onDone && typeof(parentThis.onDone) == "function") {
                parentThis.onDone();
            }
            
            if(parentThis.client.status != 200)
        	{
            	try {            		
                	parentThis.client.abort();
                	console.log(JSON.stringify(parentThis.client));
            	} catch(Err) {
            		console.log("Error:" + Err);
            	}
            	
            	
        	}
            //NOTE: this in here refers to var client, that's why we need to use parentThis instead            
        }
    };
    
    parentThis.client.send(reqbody);
    console.log("Envio");
    }catch (err){
    	Alerta("Error de Red");
    	parentThis.result = '';
        if (parentThis.onDone && typeof(parentThis.onDone) == "function") {
            parentThis.onDone();
        }
    }
    //this.request = reqbody;
    //return;
};

IvanWebService.prototype.callWCFObject = function(methodName, async, methodParams, IService){
    this.methodName = methodName;
    
    var reqbody = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"  +
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/" xmlns:riz="http://schemas.datacontract.org/2004/07/RizoServicio">' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
            "<tem:" + this.methodName + ">";
            
    for(var i=0;i<methodParams.length;i++)
    {
        if(i % 2 == 0)
            argName = methodParams[i];
        else{
            //si el nombre del parametro viene  vacio
            //debe tratarse de un objeto por lo que tomara el nombre de la instacia
            if(argName !== '')
                reqbody += "<tem:" + argName + ">";
            if(g_isdebug)
            	console.log("Total objetos:"+this.esObjectoUnico(methodParams[i]));
            if(this.esObjectoUnico(methodParams[i]))
            	reqbody += this.writeVarValueObject(methodParams[i], true);
            else
            	reqbody += this.writeVarValueObject(methodParams[i], false);
            if(argName !== '')
                reqbody += "</tem:" + argName + ">";
        }
    }
                                  
    reqbody += "</tem:" + this.methodName + ">" +
        "</soapenv:Body>" +
    "</soapenv:Envelope>";
    reqbody = String(reqbody);
    var parentThis = this;

    if(g_isdebug)
    	console.log("VENTAS:"+reqbody);
       // alert(reqbody);     

    try {
	    //var client = new XMLHttpRequest();
	    parentThis.client.open("POST", this.url+'/Basic', async);
	    parentThis.client.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	    //parentThis. client.timeout = TIMEOUT;
	    parentThis.client.setRequestHeader("SOAPAction", 'http://tempuri.org/' + IService + '/' + this.methodName);
	    
	    parentThis.client.onreadystatechange = function() {
	    	console.log("callWCFObject readyState:" + parentThis.client.readyState);
	    	console.log("callWCFObject status :" + parentThis.client.status );
	        if (parentThis.client.readyState == 4) {
	        	if(parentThis.client.status == 200)
	        	{     
	        		clearTimeout(xmlHttpTimeout);
	        	}
	            parentThis.result = parentThis.client.responseText;
	            if (parentThis.onDone && typeof(parentThis.onDone) == "function") {
	                parentThis.onDone();
	            }
	            //NOTE: this in here refers to var client, that's why we need to use parentThis instead
	            if(parentThis.client.status != 200)
	        	{
	            	parentThis.client.abort();
	        	}
	        }
	    };
	    //console.log("ventas:" +reqbody);
	    //alert(reqbody);
	    //parentThis.client.timeout = TIMEOUT;
	    xmlHttpTimeout=setTimeout(this.ajaxTimeout,TIMEOUT);
	    parentThis.client.ontimeout = function () { alert("No fue posible conectar al server"); };
	    
	    parentThis.client.send(reqbody);
    } catch(Err) {
    	parentThis.result = '';
        if (parentThis.onDone && typeof(parentThis.onDone) == "function") {
            parentThis.onDone();
        }
    }
};

IvanWebService.prototype.ajaxTimeout = function (){
	if(this.inciado)
	{
		//console.log("Request timed out");   
		this.client.abort();
		alert("Request timed out");
	}
};


