/**
 * 
 */

function ConsultarObtenerCompania(pIdEmpresa)
{
	console.log("consumiendo...");
	var wws = new IvanWebService(WSURL);
	var parameters = new Array("IdCompania", pIdEmpresa, "msj", "");	           
	wws.callWCF(METODOS.METODO_INFOCIA, false, parameters, INTERFAZ_SERVICIO);
	var retVal = false;
	retVal = wws.result;
	
	LeerXmlCiaParam(retVal);
}

function LeerXmlCiaParam(xml)
{
	var nombreParam = '';
	var total = 0;
	var objUsuarioV = null;
	
	 $(xml).find('ObtenerConfiguracionCompaniaResult').each(            
	            function() {
	                $(this).find("a\\:cat_configuracion").each(
	                        function() {
	                        	console.log();
	                            var nombre=  $(this).find("a\\:nombre").text();
	                            
	                            if(nombre.length > 0)
	                            {	                       
	                                if(objUsuarioV == null)
	                                    objUsuarioV = new USUARIO();
	                                
	                                nombreParam = $(this).find("a\\:nombre").text();
	                                if(nombreParam == 'version'){
	                                    objUsuarioV.version = $(this).find("a\\:valor").text();
	                                    objUsuarioV.parametros['version'] = objUsuarioV.version;            
	                                    objUsuario.parametros['version'] = objUsuarioV.version;
	                                    objUsuario.version = objUsuarioV.version;
	                                }else if(nombreParam == 'password_settings') {
	                                    objUsuarioV.parametros['password_settings'] = $(this).find("a\\:valor").text();
	                            	}else if(nombreParam == 'transfer')
	                            		objUsuarioV.parametros['transfer_auto'] = $(this).find("a\\:valor").text();
	                            	else
	                            		objUsuarioV.parametros[nombreParam] = $(this).find("a\\:valor").text();
	                                	                               
	                                total++;
	                            }
	                        }
	                );
	            }
	    );

	if(total > 0)
	{
		/*if(objUsuarioV.version.length>0)
		{
		    AgregaRegistros(1);
		    ActualizaUsuarioVersion(objUsuarioV.version);
		}*/
		
		
	    objUsuarioV.parametros['requiereFirma'] = objUsuario.parametros['requiereFirma'];
	    objUsuarioV.parametros['requiereLogo']= objUsuario.parametros['requiereLogo'];
	    //objUsuarioV.parametros['transfer_auto']= objUsuario.parametros['transfer_auto'];
	    objUsuario.parametros['password_settings'] = objUsuarioV.parametros['password_settings'] || DEFAULT_CLAVE;
	    objUsuario.parametros['requiereLogo'] = objUsuarioV.parametros['requiereLogo'] === undefined ? '-1' : objUsuarioV.parametros['requiereLogo'];
	    objUsuario.parametros['transfer_auto'] = objUsuarioV.parametros['transfer_auto'];
	    
	    objUsuario.parametros['price'] = objUsuarioV.parametros['price'];
	    objUsuario.parametros['list_price'] = objUsuarioV.parametros['list_price'];	    

	    AgregaRegistros(getTotalPropiedades(objUsuario.parametros));
	    ActualizaParametrosWS(objUsuario.parametros);
	}  else if(_.isEmpty(xml)) {
    	Alerta("Error to Network");
    	errorNetwork = true;
    	navigator.notification.activityStop();
    }
	else 
		summary += "Parameters: 0 \n";
}

function ConsultaListasPrecios(pId_distribuidor){
	var wws = new IvanWebService(WSURL);
	var parameters = new Array("id_distribuidor", pId_distribuidor);
	wws.callWCF(METODOS.METODO_OBTENERLISTASPRECIOS, false, parameters, INTERFAZ_SERVICIO);
	var retVal = false;
	retVal = wws.result;
	LeerXmlListaDePrecios(retVal);
}

function LeerXmlListaDePrecios(xml)
{
    var total = 0, index =0;
    var aPrecios = new Array();
    
    if(g_isdebug)console.log("LeerXmlListaDePrecios: " + xml);
    
    $(xml).find('ObtenerListasPreciosResult').each(            
            function() {
                $(this).find("a\\:v_lista_precios").each(
                        function() {                        
                            index++;                            
                        	var id_lista_precios_enc = $(this).find("a\\:id_lista_precios_enc").text();
                        	if(g_isdebug)console.log("LeerXmlListaDePrecios index: " + index + "|id_lista_precios_enc:" + id_lista_precios_enc);
                            if(String(id_lista_precios_enc).length > 0)
                            {   
                                var objPrecios = new PRECIO();
                               
                                objPrecios.id_lista_precios_enc = id_lista_precios_enc;
                                objPrecios.id_producto = $(this).find("a\\:id_producto").text();
                                objPrecios.precio_caja_final_max = $(this).find("a\\:precio_caja_final_max").text();
                                objPrecios.precio_caja_final_min = $(this).find("a\\:precio_caja_final_min").text();
                                objPrecios.precio_caja_regular = $(this).find("a\\:precio_caja_regular").text();
                                
                                objPrecios.codigo_producto = $(this).find("a\\:codigo_producto").text();
                                objPrecios.id_distribuidor = $(this).find("a\\:id_distribuidor").text();
                                objPrecios.id_unidad_medida = $(this).find("a\\:id_unidad_medida").text();
                                objPrecios.nombre_producto = $(this).find("a\\:nombre_producto").text();
                                objPrecios.unidad_medida = $(this).find("a\\:unidad_medida").text();
                                objPrecios.status_venta = $(this).find("a\\:status_venta").text();
                                
                                aPrecios[aPrecios.length] = objPrecios;
                                total++;
                                if(g_isdebug)console.log("LeerXmlListaDePrecios index: " + index + "|total:" + total);
                            }
                        }
                );
            }
    );
	
    if(g_isdebug)console.log("Total de precios:" + total);
	if(total>0)
	{
		if(objUsuario.downloadManual === false)
		{
			EliminaPrecios();
			AgregaRegistros(total);
			GuardaPrecios(aPrecios);
		} else {
			UpdatePrecios();
			AgregaRegistros(total);
			GuardaPreciosWS(aPrecios);
		}
	}  else if(_.isEmpty(xml)) {
    	Alerta("Error to Network");
    	errorNetwork = true;
    	navigator.notification.activityStop();
    } else 
		summary += "List Price: 0 \n";
}

function ConsultaAlmacenInventario(pId_Almacen){
    var wws = new IvanWebService(WSURL);
    var parameters = new Array("IdAlmacen",pId_Almacen);    
    wws.callWCF(METODOS.METODO_OBTENERALMACENINVENTARIO, false, parameters, INTERFAZ_SERVICIO);     
    
    var retVal = false;
    retVal = wws.result;
    LeerXmlProductos(retVal);
}

function LeerXmlProductos(xml)
{
    //xml = replaceAll(xml, 'a:', '');
    var aProductos = new Array();
    $(xml).find('ObtenerAlmacenInventarioResult').each(            
            function() {
                $(this).find("a\\:v_almacen_inventario").each(
                        function() {                        
                            var id_producto = $(this).find("a\\:id_producto").text();
                            if(id_producto.length > 0)
                            {   
                                var objProducto = new PRODUCTO();

                                objProducto.Clave = $(this).find("a\\:clave").text();
                                objProducto.Existencia = $(this).find("a\\:existencia").text();
                                objProducto.Id_Almacen= $(this).find("a\\:id_almacen").text();
                                objProducto.Id_producto = id_producto;
                                objProducto.Nombre_producto = $(this).find("a\\:nombre").text();
                                objProducto.id_categoria = $(this).find("a\\:id_categoria").text();
                                objProducto.Categoria = $(this).find("a\\:categoria").text();
                                objProducto.caja = $(this).find("a\\:cajas").text();
                                //objProducto.Precio = $(this).find("a\\:precio_caja_final").text();
                                objProducto.id_unidad_medida = parseInt($(this).find("a\\:id_unidad_medida").text());
                                objProducto.nombre_unidad_medida = $(this).find("a\\:nombre_unidad_medida").text();
                                objProducto.Lote = $(this).find("a\\:lote").text();
                                objProducto.Id_almacen_inventario = $(this).find("a\\:id_almacen_inventario").text();
                                objProducto.Precio = $(this).find("a\\:precio_unidad").text(); 
                                
                                aProductos[aProductos.length] = objProducto;
                            }
                        }
                );
            }
    );
    
    if(aProductos.length > 0)
    {
    	if(objUsuario.downloadManual === false)
        {
    		EliminaProductos();
    		AgregaRegistros(aProductos.length);
            GuardaProductos(aProductos);
        } else {
        	AgregaRegistros(aProductos.length);
            GuardaProductosWS(aProductos);
        }        
    }  else if(_.isEmpty(xml)) {
    	Alerta("Error to Network");
    	errorNetwork = true;
    	navigator.notification.activityStop();
    } else 
		summary += "Inventory: 0 \n";
}

function ConsultarInformacionImpresion(pIdDistribuidor)
{
	var wws = new IvanWebService(WSURL);
	var parameters = new Array("IdDistribuidor",pIdDistribuidor);    
    wws.callWCF(METODOS.METODO_OBTENERINFORMACIONIMPRESION, false, parameters, INTERFAZ_SERVICIO);	    
    var retVal = false;
    retVal = wws.result;
    
    LeerXmlInformacionImpresion(retVal);    
}

function LeerXmlInformacionImpresion(xml)
{   
    $(xml).find('ObtenerInformacionImpresionResult').each(
            function() {
                $(this).find("a\\:v_informacion_impresion_compania").each(
                        function() {                        
                            var compania=  $(this).find("a\\:compania").text();
                            if(compania.length > 0)
                            {   
                                var objImpresion = new IMPRESION();
                                                                
                                objImpresion.ciudad = $(this).find("a\\:ciudad").text();
                                objImpresion.codigo_postal = $(this).find("a\\:codigo_postal").text();
                                objImpresion.compania = compania;
                                objImpresion.direccion = $(this).find("a\\:direccion").text();
                                objImpresion.estado = $(this).find("a\\:estado").text();
                                objImpresion.fax = $(this).find("a\\:fax").text();
                                objImpresion.id_compania = $(this).find("a\\:id_compania").text();
                                objImpresion.id_distribuidor = $(this).find("a\\:id_distribuidor").text();
                                objImpresion.manufacturer = $(this).find("a\\:manufacturer").text();
                                objImpresion.nombre_comercial = $(this).find("a\\:nombre_comercial").text();
                                objImpresion.pais = $(this).find("a\\:pais").text();
                                objImpresion.po_box = $(this).find("a\\:po_box").text();
                                objImpresion.telefono = $(this).find("a\\:telefono").text();
                                objImpresion.toll_free = $(this).find("a\\:toll_free").text();                                                           
                                objImpresion.descripcion = $(this).find("a\\:descripcion").text();
                                objImpresion.condado = $(this).find("a\\:condado").text();     
                                
                                if(objUsuario.downloadManual === false)
                                {
                                	GuardaImpresion(objImpresion);
                                    aImpresion[aImpresion.length] = objImpresion;	
                                } else {
                                	aImpresion = [];
                                	
                                	AgregaRegistros(1);
                                	GuardaImpresionWS(objImpresion);
                                    aImpresion[aImpresion.length] = objImpresion;
                                }
                            }
                        }
                );
            }
    );
	
    if(_.isEmpty(xml) && objUsuario.downloadManual) {
    	Alerta("Error to Network");
    	errorNetwork = true;
    	navigator.notification.activityStop();
    }
}

function ConsultaNegociosXDia(pid_distribuidor){
    var wws = new IvanWebService(WSURL);
    var parameters = new Array("id_distribuidor",pid_distribuidor);
    wws.callWCF(METODOS.METODO_OBTENERNEGOCIOS, false, parameters, INTERFAZ_SERVICIO);
    
    var retVal = false;
    //wws.result = ConsumeWS(wws.request, WSURL, false, METODOS.METODO_OBTENERNEGOCIOS);
    retVal = wws.result;
    
    LeerXmlNegocios(retVal);
}

function LeerXmlNegocios(xml)
{
    var aClientes = new Array();
    $(xml).find('ObtenerNegociosResult').each(
            function() {
                $(this).find("a\\:v_negocios").each(
                        function() {                        
                            var id_cliente = $(this).find("a\\:id_cliente").text();
                            if(id_cliente.length > 0)
                            {   
                                var objCliente = new CLIENTE();

                                objCliente.codigo_cliente = $(this).find("a\\:codigo_cliente").text();
                                objCliente.codigo_postal = $(this).find("a\\:codigo_postal").text();
                                objCliente.domicilio= $(this).find("a\\:domicilio").text();
                                objCliente.id_cliente = id_cliente;
                                objCliente.id_ruta = $(this).find("a\\:id_ruta").text();
                                objCliente.Nombre = $(this).find("a\\:nombre").text();
                                objCliente.telefono = $(this).find("a\\:telefono").text();
                                objCliente.id_distribuidor = $(this).find("a\\:id_distribuidor").text();
                                
                                objCliente.ciudad = $(this).find("a\\:ciudad").text();
                                objCliente.codigo_estado = $(this).find("a\\:codigo_estado").text();
                                objCliente.id_distribuidor = $(this).find("a\\:dias_credito").text();
                                objCliente.id_lista_precio = $(this).find("a\\:id_lista_precio").text();
                                
                                if(objCliente.id_lista_precio === undefined || objCliente.id_lista_precio === null)
                                	objCliente.id_lista_precio = 0;
                                
                                aClientes[aClientes.length] = objCliente;                                                       
                            }
                        }
                );
            }
    );

    //alert("Total clientes:" + aClientes.length);//445
    if(aClientes.length)
    {
    	if(objUsuario.downloadManual === false)
        {
    		EliminaNegocios();
    		AgregaRegistros(aClientes.length);
    		GuardaNegocios(aClientes);
        } else {
        	AgregaRegistros(aClientes.length);
    		GuardaNegociosWS(aClientes);
        }
    } else if(_.isEmpty(xml)) {
    	Alerta("Error to Network");
    	errorNetwork = true;
    	navigator.notification.activityStop();
    } 
    else 
    {
    	summary += "Customers: 0 \n";
    }
}

