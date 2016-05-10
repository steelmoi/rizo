var nombreBD = 'rizo';
var versionBD = '1.0';
var tamanioBD = 52428800;
var displayBD = 'Sistema Rizo';
var clienteBD;
var totalRegistros = 0;

var totalSincronizar = 0;

function AbreBD()
{
	try
    {

		clienteBD = window.openDatabase(nombreBD, versionBD, displayBD, tamanioBD);
		clienteBD.transaction(verifyObjects, onErrorCallBack, onSuccessOpenDB);
    }catch(err)
    {
        alert("Error on OpenDatabase:" + err.description);
        clienteBD = null;
    }
}
var summary = '';
function successCargaInfo() {
	var error = false;
	var mensaje = 'La informacion de ';
	
    totalRegistros--;   
    if(totalRegistros == 0){        
        navigator.notification.activityStop();
    
        MuestraDiv("aMenu");        
        //si es mayor a 0 entonces sincronizo datos
        /*if(totalSincronizar > 1)
        {
            ConfirmaSincronizacion();
            totalSincronizar = 0;
        }*/ //TODO: agergar esta logica
        
        if(objUsuario.downloadManual === true)
        {
        	Alerta(summary);
        	summary = "";
        	objUsuario.downloadManual = false;
        	return;
        }
        
        ObtieneTotalRegistros(
                function(tx, results)
                {
                	if(results.rows.length > 0)
                	{
                		for(var i=0; i < aEntidades.length; i++)
                		{                			
                			switch(aEntidades[i].nombre_tabla)
                			{
                				case 'v_almacen_inventario':
                					if(parseInt(aEntidades[i].totalServer) !== parseInt(results.rows.item(0).almacen_inventario) || aEntidades[i].totalServer <= 0)
                					{
                						error = true;
                						mensaje += aEntidades[i].nombre_tabla + ',';
                					}
                					break;
                				case 'v_negocios':
                					//alert(aEntidades[i].totalServer +"|"+ results.rows.item(0).clientes);
                					if(aEntidades[i].totalServer !== results.rows.item(0).clientes || aEntidades[i].totalServer <= 0)
                					{
                						error = true;
                						mensaje += aEntidades[i].nombre_tabla + ',';
                					}
                					break;
                				case 'v_lista_precios':
                					//alert(aEntidades[i].totalServer +"|"+ results.rows.item(0).precios);
                					if(aEntidades[i].totalServer !== results.rows.item(0).precios || aEntidades[i].totalServer <= 0)
                					{
                						error = true;
                						mensaje += aEntidades[i].nombre_tabla + ',';
                					}
                					break;
                				case 'v_informacion_impresion_compania':
                					//alert(aEntidades[i].totalServer +"|"+ results.rows.item(0).impresion);
                					if(aEntidades[i].totalServer !== results.rows.item(0).impresion || aEntidades[i].totalServer <= 0)
                					{
                						error = true;
                						mensaje += aEntidades[i].nombre_tabla + ',';
                					}
                					break;                				
                			}
                		}
                		
                		if(error)
                		{
                			Alerta(mensaje+ 'no se cargo correctamente.');
                			EliminaTransacciones();
                            aEntidadesEnBD = new Array();
                            aEntidades = new Array();
                            ConsultaUsuarioLogueado();
                            ConsultaEntidades();
                			return;
                		}else{
                			MuestraDiv("aMenu");
                			/*ControlaDiv('Inicio', '', 
                					function()
                					{           
		                				$("#sVersion").text('Version: ' + objUsuario.parametros['version']);
		                				if(parseInt(objUsuario.id_tipo_ruta) === parseInt(TIPOVENTA.PREVENTA))
		                					OcultarDiv("btnVentas");
		                				else
		                					OcultarDiv("btnPreVentas");
		                				
		                				ConfirmaSincronizacion();
                					}
                			);*/
                			var rst = {
                					hasLogo :  (String(oClienteApp.Logo).length > 0),
                					Logo	:  oClienteApp.Logo
                			};
                			loadTemplateHBS('Inicio', '', rst, 
                					function()
                			        {
		                				$("#sVersion").text('Version: ' + objUsuario.parametros['version']);
		                				if(parseInt(objUsuario.id_tipo_ruta) === parseInt(TIPOVENTA.PREVENTA))
		                					OcultarDiv("btnVentas");
		                				else
		                					OcultarDiv("btnPreVentas");
		                				
		                				ConfirmaSincronizacion();
                			        }
                			);
                		}
                	}
                }, null
        );              
    }
}

function successCargaTraspasos() {
    totalRegistros--;
    //console.log("successCargaTraspasos totalRegistros:" + totalRegistros);
    if(totalRegistros == 0)        
    	PintaMovimientosAbiertos();
}

function onErrorGeneric(tx, err)
{
   alert("onErrorGeneric Error processing SQL: "+err);
}

function onErrorCargaInfo(tx, err)
{
   alert("onErrorGeneric Error processing SQL: "+err);
   totalRegistros--;
}


function errorCB(err) {
   alert("Error processing SQL: "+err.code);
}
 
function successCB() {
   //alert("success!");
}

function onErrorCallBack(tx, err)
{	
	console.log("onErrorCallBack tx:" + JSON.stringify(tx));
	console.log("onErrorCallBack err:" + err);
	alert("Error processing SQL: "+err);
	console.log("onErrorCallBack tx:" + JSON.stringify(err));
   //alert("Error processing SQL: "+err.code);
}

function onSuccessOpenDB()
{   
	//alert("onSuccessOpenDB");
}


function verifyObjects(tx)
{
    tx.executeSql(TABLAS.PARAMETROS);
	tx.executeSql(TABLAS.DESCUENTOS);
	tx.executeSql(TABLAS.IMPRESION);
	tx.executeSql(TABLAS.CLIENTES);
	tx.executeSql(TABLAS.PRECIOS);
	tx.executeSql(TABLAS.PRODUCTOS);
	tx.executeSql(TABLAS.USUARIO);
	tx.executeSql(TABLAS.MOTIVOSNC);
	tx.executeSql(TABLAS.VENTAS);
	tx.executeSql(TABLAS.DATALLEVENTA);
	tx.executeSql(TABLAS.NOTACREDITO);
	tx.executeSql(TABLAS.CANCELACIONESOFFLINE);
	tx.executeSql(TABLAS.ENTIDADES);
	tx.executeSql(TABLAS.IMPRESORA);
	tx.executeSql(TABLAS.MOVIMIENTOS);
	tx.executeSql(TABLAS.DETMOVIMIENTOS);
	tx.executeSql(TABLAS.PRODUCTOS_MALOS);
	tx.executeSql(TABLAS.PRODUCTOS_INICIAL);
	
	tx.executeSql(TABLAS.PAGOS);
	tx.executeSql(TABLAS.TMPTRANSFER);
	tx.executeSql(TABLAS.FACTURA);
	tx.executeSql(TABLAS.DETALLEFACTURA);
	tx.executeSql(TABLAS.CANCELACIONPAGOSOFFLINE);
	tx.executeSql(TABLAS.CODIGO_CLIENTE);
	
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_movimientos ON movimientos (id_ruta, id_movimiento_enc, id_destino, fecha_entrega)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_inventario ON almacen_inventario (id_producto, lote, clave)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_inventario_malo ON almacen_malo (id_producto, clave)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_tmpTransfer ON tmpTransfer (id_movimiento_enc, id_producto, lote)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_parametros ON parametros (nombre)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_precios ON precios (id_lista_precios_enc, id_producto, codigo_producto)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_impresion ON impresion (id_compania, id_distribuidor)");
	
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_factura ON factura (id_venta, id_asignacion_ruta, factura)");
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_codigocliente ON codigo_cliente (codigoCliente)");
	
	tx.executeSql("CREATE UNIQUE INDEX IF NOT EXISTS idx_pagos ON pagos (Id_asignacion_ruta,Fecha, Hora, Factura)");
	
	//tx.executeSql("UPDATE codigo_cliente SET Predeterminada=0");	
	//tx.executeSql("UPDATE codigo_cliente SET Predeterminada=1 where codigoCliente= '0000'");	
	
	//tx.executeSql("create table tmpalmacen_inventario as select * from almacen_inventario");
	//tx.executeSql("DROP TABLE almacen_inventario");
	//tx.executeSql("insert into almacen_inventario select * from tmpalmacen_inventario");
	
	//tx.executeSql("create table tmpdetalle_venta as select * from detalle_venta");
	//tx.executeSql("DROP TABLE detalle_venta");
	//tx.executeSql("insert into detalle_venta select * from tmpdetalle_venta");
	
	//tx.executeSql("create table tmpventas as select * from ventas");
	//tx.executeSql("DROP TABLE ventas");
	//tx.executeSql("insert into ventas select * from tmpventas");
	
	//tx.executeSql("UPDATE tmpTransfer SET clave=(SELECT codigo_producto FROM precios AS P WHERE P.id_producto=tmpTransfer.id_producto LIMIT 0,1) WHERE clave IS NULL");	
	/*tx.executeSql("UPDATE almacen_inventario SET clave=(SELECT codigo_producto FROM precios AS P WHERE P.id_producto=almacen_inventario.id_producto LIMIT 0,1) WHERE lote= '970' ");
	tx.executeSql("UPDATE almacen_inventario SET clave=(SELECT codigo_producto FROM precios AS P WHERE P.id_producto=almacen_inventario.id_producto LIMIT 0,1) WHERE lote= 'B1-336' ");
	tx.executeSql("UPDATE almacen_inventario SET nombre=(SELECT nombre_producto FROM precios AS P WHERE P.id_producto=almacen_inventario.id_producto LIMIT 0,1) WHERE lote= '970' ");
	tx.executeSql("UPDATE almacen_inventario SET nombre=(SELECT nombre_producto FROM precios AS P WHERE P.id_producto=almacen_inventario.id_producto LIMIT 0,1) WHERE lote= 'B1-336' ");*/
}

function validateDB()
{
    if(clienteBD != null)
        return true;
    else
        return false;        
}

function ReseteaContadorRegistros()
{
	totalRegistros = 0;
}

function AgregaRegistros(registros)
{
	totalRegistros += registros;
}

//Usuario
function EliminaUsuarios()
{
	var sql = "delete from usuarios";
	
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function GuardaUsuario(objusuario)
{
	var sql = "Insert Into usuarios (Id_Usuario, " +
				"Usuario, Password, id_distribuidor, Fecha_Ruta, " +
				"Id_Almacen, Id_asignacion_Ruta, Id_Ruta," +
				"Id_Vendedor, version, num_factura, codigo_ruta, nombre, apellidos) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; //, id_zona
	//console.log('leer GuardaUsuario:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				try{
				tx.executeSql(sql,
						[objusuario.Id_Usuario, objusuario.Usuario,
						 objusuario.Password, objusuario.id_distribuidor,
						 objusuario.Fecha_Ruta, objusuario.Id_Almacen,
						 objusuario.Id_asignacion_Ruta, objusuario.Id_Ruta,
						 objusuario.Id_Vendedor, objusuario.version, objusuario.num_factura, objusuario.codigo_ruta,
						 objusuario.nombre, objusuario.apellidos], //, objUsuario.id_zona
						 successCargaInfo, onErrorCargaInfo);
				}catch(err)
			    {
					alert("Error GuardaUsuario");
			    }
			}
	);
}

function ObtieneUsuarioAnterior(successFn, errorFN)
{
	//INNER JOIN detalle_movimientos ON M.id_movimiento_enc = detalle_movimientos.id_movimiento_enc
    var sql = "select Id_Usuario, Usuario, Password, version, impresora, id_distribuidor, Id_Almacen, Id_asignacion_Ruta, Id_Ruta, Id_Vendedor, num_factura, codigo_ruta, IFNULL(nombre, '') AS nombre, IFNULL(apellidos, '') AS apellidos, " +
            "(select count(id_venta) from ventas where ventas.id_usuario=usuarios.Id_Usuario) as TotalVentas, " +
            "(select count(id_venta) from ventas where enviada=0) as TotalVentasNoEnviadas, " +  
            "(select count(id_cancelacion) from cancelacionesoffline where cancelacionesoffline.enviada=0) as TotalCancelaciones, " +
            "(select count(id_cancelacion) from cancelacionpagosoffline where cancelacionpagosoffline.enviada=0) as TotalCancelacionesPagos, " +
            "(select count(id_movimiento_enc) from movimientos) as TotalMovimientos, " +
            "(select count(id_movimiento_enc) from movimientos where movimientos.Enviada=0 And movimientos.Abierto=0) as TotalMovimientosNoEnviados, " +
            "(select count(id_movimiento_enc) from movimientos where movimientos.Abierto=0) as TotalMovimientosCerrados, " +
            "(select count(id_pago) from pagos where pagos.Enviada=0) as TotalPagosNoEnviados " +
            "from usuarios";
    
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};
//Fin Usuarios

//Productos
function GuardaProductos(aProductos)
{
	var sql = "INSERT Into almacen_inventario (id_almacen_inventario, " +
				"id_almacen, id_producto, lote, clave,nombre, " +
				"id_categoria,categoria,existencia, caja, estatus, id_unidad_medida, nombre_unidad_medida, precio_unidad) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	/*var sql1 = "INSERT Into almacen_inventario (id_almacen_inventario, " +
    "id_almacen, id_producto, lote, clave,nombre, " +
    "id_categoria,categoria,existencia, caja, estatus, id_unidad_medida, nombre_unidad_medida, precio_unidad) values (";
	console.log('leer GuardaProducto:'+ sql);*/
	if(!validateDB())
	{
		AbreBD();
	}
	//console.log("GuardaProductos total:" + aProductos.length);
	clienteBD.transaction(
			function(tx){
				for(var i=0; i < aProductos.length; i++){
				var objProducto = aProductos[i];
				/*console.log("GuardaProductos sql:" + sql1 + objProducto.Id_almacen_inventario+", "+objProducto.Id_Almacen+", "+objProducto.Id_producto+", "+
                        objProducto.Lote+", "+objProducto.Clave+", "+objProducto.Nombre_producto+", "+ objProducto.Id_categoria+", "+
                        objProducto.Categoria+", "+objProducto.Existencia+", "+objProducto.caja+", 0, "+objProducto.id_unidad_medida+", "+objProducto.nombre_unidad_medida+", "+objProducto.Precio+")");*/
				try{	
				tx.executeSql(sql,
						[objProducto.Id_almacen_inventario,objProducto.Id_Almacen,objProducto.Id_producto,
						 objProducto.Lote,objProducto.Clave,objProducto.Nombre_producto, objProducto.Id_categoria,
						 objProducto.Categoria,objProducto.Existencia, objProducto.caja,0, 
						 objProducto.id_unidad_medida, objProducto.nombre_unidad_medida, objProducto.Precio], 
						 successCargaInfo, onErrorCargaInfo);
				}catch(err)
			    {
					alert("Error GuardaProductos");
			    }
				}
			}
	);
}

function GuardaProductosWS(aProductos)
{
	var sql = "INSERT OR REPLACE Into almacen_inventario (id_almacen_inventario, " +
				"id_almacen, id_producto, lote, clave,nombre, " +
				"id_categoria,categoria,existencia, caja, estatus, id_unidad_medida, nombre_unidad_medida, precio_unidad) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if(!validateDB())
	{
		AbreBD();
	}

	clienteBD.transaction(
			function(tx){
				for(var i=0; i < aProductos.length; i++){
				var objProducto = aProductos[i];				
				try{	
				tx.executeSql(sql,
						[objProducto.Id_almacen_inventario,objProducto.Id_Almacen,objProducto.Id_producto,
						 objProducto.Lote,objProducto.Clave,objProducto.Nombre_producto, objProducto.Id_categoria,
						 objProducto.Categoria,objProducto.Existencia, objProducto.caja,0, 
						 objProducto.id_unidad_medida, objProducto.nombre_unidad_medida, objProducto.Precio], 
						 successCargaInfo, onErrorCargaInfo);
				}catch(err)
			    {
					alert("Error GuardaProductos");
			    }
				
				}
				summary += 'Inventory: ' + aProductos.length + "\n";
			}
	);
}

function GuardaProductosIniciales(aProductos)
{
	var sql = "INSERT Into almacen_inicial (id_movimiento_details," +
							"nombre_tipo_movimiento," +
							"fecha_entrega," +							
							"id_almacen," + 
							"codigo_producto," +
							"nombre_producto," +
							"categoria_producto," +
							"unidad_medida," +
							"lote," +
							"cantidad, " +
							"cantidad_cajas, status, "+
							"id_asignacion_ruta) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	
	if(!validateDB())
	{
		AbreBD();
	}
	//console.log("GuardaProductos total:" + aProductos.length);
	clienteBD.transaction(
			function(tx){
				for(var i=0; i < aProductos.length; i++){
				var objProducto = aProductos[i];
				
				try{	
				tx.executeSql(sql,
						[objProducto.id_movimiento_details,objProducto.nombre_tipo_movimiento,objProducto.fecha_entrega,
						 objProducto.id_almacen,objProducto.codigo_producto,objProducto.nombre_producto, objProducto.categoria_producto,
						 objProducto.unidad_medida,objProducto.lote, objProducto.cantidad, 
						 objProducto.cantidad_cajas, objProducto.status, objProducto.id_asignacion_ruta], 
						 successCargaInfo, onErrorCargaInfo);
				}catch(err)
			    {
					alert("Error GuardaProductos");
			    }
				}
			}
	);
}

function ObtieneProductosCombo(tipo, successFn, errorFN)
{
    var sql = 	"Select id_producto, clave, lote, nombre From almacen_inventario where existencia > 0 " +
    			"UNION " +
    			"Select id_producto, codigo_producto AS clave, '' AS lote, nombre_producto AS nombre From precios WHERE status_venta=" + TIPO_PRODUCTO.COMODIN;
    
	if(!validateDB())
    {
		AbreBD();
    }
	if(tipo == TIPOVENTA.DEMO || tipo == TIPOVENTA.GENERICO)
	    	sql = "Select id_producto, codigo_producto AS clave, '' AS lote, nombre_producto AS nombre From precios WHERE status_venta=" + TIPO_PRODUCTO.VENTA;
	else if(tipo == TIPOVENTA.CREDITO)
			//sql = "Select id_producto, codigo_producto AS clave, '' AS lote, nombre_producto AS nombre From precios WHERE status_venta IN(" + TIPO_PRODUCTO.VENTA + ")"; //" +TIPO_PRODUCTO.COMODIN + ",
		sql = "Select id_producto, codigo_producto AS clave, '' AS lote, nombre_producto AS nombre From precios WHERE status_venta >= 1";// IN(" + TIPO_PRODUCTO.VENTA + ")"; //" +TIPO_PRODUCTO.COMODIN + ",
	else if(tipo == TIPOVENTA.PROMOCION)//TODO: se agrega el if para cuando es promocion solo pone los de venta del inventario 22/07/2013
		sql = 	"Select id_producto, clave, lote, nombre From almacen_inventario where existencia > 0 ";
	//console.log("ObtieneProductosCombo sql:" + sql);
	
	sql +=" ORDER BY clave ASC";
	clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql ,[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function ObtieneProductosOtro(successFn, errorFN)
{
    var sql = "Select id_producto, codigo_producto AS clave, '' AS lote, nombre_producto AS nombre From precios WHERE status_venta=" + TIPO_PRODUCTO.RIZO;
	if(!validateDB())
    {
		AbreBD();
    }
		
	//console.log("ObtieneProductosOtro sql:" + sql);
	clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql ,[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function EliminaProductos()
{
	var sql = "delete from almacen_inventario";
	//alert(sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function EliminaProductosIniciales()
{
	var sql = "delete from almacen_inicial";
	//alert(sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function ObtieneProductoId(clave, lote, tipo, successFn, errorFN)
{
    var sql = 	"Select almacen_inventario.*, 1 AS status_venta From almacen_inventario where clave=? and lote=?" ;
    			//"UNION " +
    
    if(tipo === TIPOVENTA.VENTA && clienteSeleccionado.id_lista_precio > 0 && parseInt(objUsuario.parametros['list_price']) > 0)
    {
    	sql = 	"SELECT clave, lote, id_almacen, A.id_producto, id_almacen as id_almacen_inventario, nombre, id_categoria, " +
    			"categoria, existencia, caja, estatus, A.id_unidad_medida, nombre_unidad_medida, 1 AS status_venta, IFNULL(precio_caja_regular, precio_unidad) precio_unidad " +
    			"FROM precios " +
    			"	INNER JOIN almacen_inventario A ON A.id_producto=precios.id_producto AND A.clave=precios.codigo_producto "+
    			"WHERE clave=? AND lote=? AND id_lista_precios_enc=?";
    }
    
    if(tipo == TIPOVENTA.VENTA && lote == '')
    {
    	sql = 	"Select codigo_producto AS clave, '' AS lote, 0 AS id_almacen, id_producto, " +
                "0 AS id_almacen_inventario, nombre_producto AS nombre, 0 AS id_categoria, " +
                "'' AS categoria, 0.00 AS existencia, 0.00 AS caja, 0 AS estatus, id_unidad_medida, " +
                "unidad_medida AS nombre_unidad_medida, 0.00 AS precio_unidad, status_venta From precios where codigo_producto=? And status_venta=" + TIPO_PRODUCTO.COMODIN;
    }
    if(!validateDB())
    {
        AbreBD();
    }
    
    //TODO checar alguna propiedades
    //precio_caja_regular 
    
    clienteBD.transaction(
                function(tx){
                    if(tipo == TIPOVENTA.CREDITO || tipo == TIPOVENTA.DEMO || tipo == TIPOVENTA.GENERICO)
                    {    
                        sql =   "Select codigo_producto AS clave, '' AS lote, 0 AS id_almacen, id_producto, " +
                                "0 AS id_almacen_inventario, nombre_producto AS nombre, 0 AS id_categoria, " +
                                "'' AS categoria, 0.00 AS existencia, 0.00 AS caja, 0 AS estatus, id_unidad_medida, " +
                                "unidad_medida AS nombre_unidad_medida, 0.00 AS precio_unidad, status_venta From precios where codigo_producto=?";
                        if(g_isdebug)
                        	console.log(sql + "|" + clave + "|");
                	    tx.executeSql(sql ,[clave], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                    }else {
                    	if(g_isdebug)console.log(sql + "|" +clave + "|" + lote + "|");
                    	if(g_isdebug)console.log("tipo:" + tipo + "|id_lista_precio:" + clienteSeleccionado.id_lista_precio + "|list_price:" + parseInt(objUsuario.parametros['list_price']));
                    	//TODO: aqui hay un error puesto que producto comodin solo aplica para venta
                        if((tipo == TIPOVENTA.VENTA || tipo == TIPOVENTA.PROMOCION) && lote != '')
                        {
                        	if(tipo === TIPOVENTA.VENTA && clienteSeleccionado.id_lista_precio > 0 && parseInt(objUsuario.parametros['list_price']) > 0)
                        		tx.executeSql(sql ,[clave, lote, clienteSeleccionado.id_lista_precio], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                        	else
                        		tx.executeSql(sql ,[clave, lote], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                        } else
                        	tx.executeSql(sql ,[clave], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                    }
                }
        );
}

function ActualizaExistencia(Id_producto, Lote, Cantidad, Cajas, successFn, errorFN)
{
	if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Update almacen_inventario set existencia=?, caja=? where Id_producto=? and lote=?",[Cantidad, Cajas, Id_producto, Lote],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function IngresaInventario(objProducto, Cantidad, Cajas, successFn, errorFN)
{
	var sql = "INSERT OR IGNORE Into almacen_inventario (id_almacen_inventario, " +
	"id_almacen, id_producto, lote, clave,nombre, " +
	"id_categoria,categoria,existencia, caja, estatus, id_unidad_medida, nombre_unidad_medida, precio_unidad) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                	//primero trata de guardar el producto
                	tx.executeSql(sql,
    						[objProducto.Id_almacen_inventario,objProducto.Id_almacen,objProducto.Id_producto,
    						 objProducto.Lote,objProducto.Clave,objProducto.Nombre_producto, objProducto.Id_categoria,
    						 objProducto.Categoria,objProducto.Existencia, objProducto.caja,0, 
    						 objProducto.id_unidad_medida, objProducto.nombre_unidad_medida, objProducto.Precio], 
    						 successCB, (errorFN != null ? errorFN : onErrorCallBack));
                	
                    tx.executeSql("Update almacen_inventario set existencia=(Select existencia From almacen_inventario AS I Where I.Id_producto=almacen_inventario.Id_producto and I.lote=almacen_inventario.lote) + ?, caja=(Select caja From almacen_inventario as V where V.Id_producto=almacen_inventario.Id_producto and V.lote=almacen_inventario.lote) + ? where Id_producto=? and lote=?",[Cantidad, Cajas, objProducto.Id_producto, objProducto.Lote],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function RegresaInventario(objProducto, Cantidad, Cajas, successFn, errorFN)
{
	if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                	//ya no se checa el insert               	
                    tx.executeSql("Update almacen_inventario set existencia=(Select existencia From almacen_inventario AS I Where I.Id_producto=almacen_inventario.Id_producto and I.lote=almacen_inventario.lote) - ?, caja=(Select caja From almacen_inventario as V where V.Id_producto=almacen_inventario.Id_producto and V.lote=almacen_inventario.lote) - ? where Id_producto=? and lote=?",[Cantidad, Cajas, objProducto.Id_producto, objProducto.Lote],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function IngresaInventarioMalo(objProducto, Cantidad, Cajas, successFn, errorFN)
{
	var sql = "INSERT OR IGNORE Into almacen_malo (id_almacen_inventario, " +
	"id_almacen, id_producto, lote, clave,nombre, " +
	"id_categoria,categoria,existencia, caja, estatus, id_unidad_medida, nombre_unidad_medida, precio_unidad) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                	//primero trata de guardar el producto
                	tx.executeSql(sql,
    						[objProducto.Id_almacen_inventario,objProducto.Id_almacen,objProducto.Id_producto,
    						 objProducto.Lote,objProducto.Clave,objProducto.Nombre_producto, objProducto.Id_categoria,
    						 objProducto.Categoria,objProducto.Existencia, objProducto.caja,0, 
    						 objProducto.id_unidad_medida, objProducto.nombre_unidad_medida, objProducto.Precio], 
    						 successCB, (errorFN != null ? errorFN : onErrorCallBack));
                	
                    tx.executeSql("Update almacen_malo set existencia=(Select existencia From almacen_malo AS I Where I.Id_producto=almacen_malo.Id_producto and I.lote=almacen_malo.lote) + ?, caja=(Select caja From almacen_malo as V where V.Id_producto=almacen_malo.Id_producto and V.lote=almacen_malo.lote) + ? where Id_producto=? and lote=?",[Cantidad, Cajas, objProducto.Id_producto, objProducto.Lote],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function RegresaInventarioMalo(objProducto, Cantidad, Cajas, successFn, errorFN)
{
	if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                	        	                	
                    tx.executeSql("Update almacen_malo set existencia=(Select existencia From almacen_malo AS I Where I.Id_producto=almacen_malo.Id_producto and I.lote=almacen_malo.lote) - ?, caja=(Select caja From almacen_malo as V where V.Id_producto=almacen_malo.Id_producto and V.lote=almacen_malo.lote) - ? where Id_producto=? and lote=?",[Cantidad, Cajas, objProducto.Id_producto, objProducto.Lote],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function GuardarAlmacen_Inventario(id_almacen_inventario, id_almacen, id_producto, lote, clave, nombre, id_categoria, categoria, existencia,estatus,successFn, errorFN)
{
	if(!validateDB())
	{
		AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                	/*var sql ="INSERT OR REPLACE INTO almacen_inventario (" +
            		"id_almacen_inventario, " +
            		"id_almacen, " +
            		"id_producto, " +
            		"lote, " +
            		"clave, " +
            		"nombre, " +
            		"id_categoria, " +
            		"categoria, " +
            		"existencia," +
            		"estatus) " +
            		"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"+
            		id_almacen_inventario +","+ 
            		 id_almacen+","+
            		 id_producto+","+
            		 lote+","+ 
            		 clave+","+
            		 nombre+","+ 
            		 id_categoria+","+ 
            		 categoria+","+ 
            		 existencia+","+
            		 estatus;*/
                	//console.log(sql);
                	
                    tx.executeSql("INSERT OR REPLACE INTO almacen_inventario (" +
                    		"id_almacen_inventario, " +
                    		"id_almacen, " +
                    		"id_producto, " +
                    		"lote, " +
                    		"clave, " +
                    		"nombre, " +
                    		"id_categoria, " +
                    		"categoria, " +
                    		"existencia," +
                    		"estatus) " +
                    		"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    		[id_almacen_inventario, 
                    		 id_almacen, 
                    		 id_producto, 
                    		 lote, 
                    		 clave, 
                    		 nombre, 
                    		 id_categoria, 
                    		 categoria, 
                    		 existencia,
                    		 estatus], 
                    		 successFn, 
                    		 (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
	
}

function ObtieneInventario(all,successFn, errorFN)
{
	/*var sql = 	"Select ifnull(A.id_producto, '11') AS id_producto, ifnull(A.clave, '') as clave , ifnull(A.nombre, '') as nombre, ifnull(A.lote, '') as lote,  ifnull(A.existencia, 0) + ifnull(M.existencia, 0) as existencia, ifnull(A.caja, 0) + ifnull(M.caja, 0)AS caja " +
				"From almacen_inventario AS A "+
				"	LEFT OUTER JOIN almacen_malo AS M " +
				"		ON A.id_producto=M.id_producto AND A.lote=M.lote "+
				"order by A.clave ";
	var sql = "Select id_producto, clave, nombre, lote, existencia, caja " +
"From almacen_inventario "+
"UNION " +
"Select id_producto, clave, nombre, lote, existencia, caja " +
"From almacen_malo";*/
	if(all)
	{
	var sql ="Select id_producto, clave, nombre, lote, SUM(existencia) AS existencia, SUM(caja) AS caja " +
			"From almacen_inventario "+
			" GROUP BY id_producto, clave, nombre, lote " +
			"ORDER BY clave,lote ";
	
	/*var sql ="Select id_producto, clave, nombre, lote, SUM(existencia) AS existencia, SUM(caja) AS caja FROM( " +
	"Select id_producto, clave, nombre, lote, existencia, caja " +
	"From almacen_inventario "+
	"UNION " +
	"Select id_producto, clave, nombre, lote, existencia, caja " +
	"From almacen_malo) GROUP BY id_producto, clave, nombre, lote " +
	"ORDER BY clave,lote ";
	*/
	}
	else
	{
	
	var sql="Select id_producto, clave, nombre, lote, SUM(existencia) AS existencia, SUM(caja) AS caja  " +
			"From almacen_malo GROUP BY id_producto, clave, nombre, lote " +
			"ORDER BY clave,lote ";
	}
	
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function ObtieneInventarioInicial(successFn, errorFN)
{
	var sql = 	"Select *  " +
				"From almacen_inicial  "+
				"order by codigo_producto, lote ";
	
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function ObtieneInventarioCancelacion(id_venta, successFn, errorFN)
{	
	var sql ="Select nombre, almacen_inventario.existencia as cantInventario, almacen_inventario.caja as cajaInventario, "+
			"	detalle_venta.cantidad as cantVenta, detalle_venta.caja as cajaVenta " +
			"From almacen_inventario " +
			"INNER JOIN detalle_venta on detalle_venta.id_producto= almacen_inventario.id_producto AND detalle_venta.lote= almacen_inventario.lote " +
			"WHERE detalle_venta.id_venta=?";
	
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//FIN de productos

//VENTAS
function GuardaVentas(id_asignacion_ruta, factura, id_almacen, id_usuario, id_cliente,
		monto_subtotal, monto_total, cantidad_productos, status, 
		pagada, longitud, latitude, fecha, hora, enviada, tipo_venta, Id_tipo_credito, requiere_firma,applica_credito, successFn, errorFN)
{
    var sql = "Insert Into ventas (id_asignacion_ruta, factura, id_almacen, id_usuario, id_cliente, monto_subtotal, monto_total, cantidad_productos, status, pagada, longitud, latitude, fecha, hora, enviada, tipo_venta, Id_tipo_credito, requiere_firma,applica_credito) values "+
                "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    
    //alert(idNegocio+"|"+ subtotal+"|"+  descuento+"|"+  total+"|"+  descuentoCliente+"|"+  
            //tipo_venta+"|"+  longitud+"|"+  latitude+"|"+  fecha+"|"+  hora+"|"+  folio+"|"+  status+"|"+  enviada);
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql, [id_asignacion_ruta, factura, id_almacen, id_usuario, id_cliente,
                                		monto_subtotal, monto_total, cantidad_productos, status, 
                                		pagada, longitud, latitude, fecha, hora, enviada, tipo_venta, Id_tipo_credito, requiere_firma,applica_credito], successFn, 
                                        (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function GuardaDetalleVentas(id_venta, aProductos, successFn, errorFN)
{
    var sql = "Insert Into detalle_venta (id_venta, id_producto, cantidad, lote, " +
    "precio, monto_subtotal, monto_total, tipo_captura, Id_unidad_medida, caja, descuento) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

if(!validateDB())
{
AbreBD();
}
clienteBD.transaction(
        function(tx){
            for(var i=0; i < aProductos.length; i++){
            	
            	//alert("id_venta:" +id_venta+"|Id_producto:"+ aProductos[i].Id_producto+"|Cantidad:"+aProductos[i].Cantidad+"|Lote:"+aProductos[i].Lote+"|Precio:"+
                        //aProductos[i].Precio+"|Subtotal:"+ aProductos[i].subtotal +"|Total:"+ aProductos[i].total+"|tipo_captura:"+aProductos[i].tipo_captura+"|id_unidad_medida:"+aProductos[i].id_unidad_medida +"|caja:"+ aProductos[i].caja+"|descuento:"+aProductos[i].descuento);
            	
                tx.executeSql(sql, [id_venta, aProductos[i].Id_producto,aProductos[i].Cantidad,aProductos[i].Lote,
                                    aProductos[i].Precio, aProductos[i].subtotal, aProductos[i].total, aProductos[i].tipo_captura,
                                    aProductos[i].id_unidad_medida, aProductos[i].CantidadCaja, aProductos[i].descuento], 
                                    successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
        }
);

}

function ObtieneClave(successFn, errorFN)
{
	if(!validateDB())
    {
		AbreBD();
    }
	clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select max(id_venta) as id_venta From ventas",[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function ActualizaFolioVentas(id_venta, factura, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Update ventas set factura=? where id_venta=?",[factura, id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

//actualiza estatus de venta enviada
function ActualizaEnviadaVentas(id_venta, enviada, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Update ventas set enviada=? where id_venta=?",[enviada, id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function ActualizaEnviadaCancelacion(id_venta, successFn, errorFN)
{
    
    var sql = "Update cancelacionesoffline set enviada=1 WHERE id_venta=" + id_venta;
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

//actualiza estatus de venta (activa-cancelada)
function ActualizaStatusVentas(id_venta, status, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Update ventas set status=? where id_venta=?",[status, id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

//Obtiene las ventas por fecha
function ObtieneVentasDia(opc, successFn, errorFN)//fecha
{
    var sql =   "Select id_venta, enviada, status, (select count(*) FROM cancelacionesoffline WHERE id_venta = ventas.id_venta) AS id_cancelacion, " +
                "   CASE " +
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.VENTA + " THEN '"+TIPO_TRANSACCION.VENTA+"' "+
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.DEMO + " THEN '"+TIPO_TRANSACCION.DEMO+"' "+
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.CREDITO + " THEN '"+TIPO_TRANSACCION.CREDITO+"' "+
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.PROMOCION + " THEN '"+TIPO_TRANSACCION.PROMOCION+"' "+
                "   END as Tipo, tipo_venta,  Id_tipo_credito, factura, ifnull(strftime('%m-%d-%Y', fecha) || ' ' || strftime('%H:%M', hora), strftime('%m-%d-%Y', fecha)) as fecha, codigo_cliente, Nombre, monto_total " +
                "From ventas INNER JOIN clientes ON ventas.id_cliente=clientes.id_cliente ";

    
    if(opc !== OPCVENTAS.CANCELAR)
    {
    	sql = 	sql + " UNION " +
    			"Select movimientos.id_movimiento_enc as id_venta, Enviada as enviada, 1 as status, 0 as id_cancelacion, " +
    			"'TRANSFER' as Tipo," + TIPOVENTA.GENERICO + " As tipo_venta, " + TIPOVENTA.GENERICO + " As Id_tipo_credito, " +
    			"movimientos.id_movimiento_enc AS factura, ifnull(strftime('%m-%d-%Y %H:%S', fecha_ciere), strftime('%m-%d-%Y', fecha_ciere)) AS fecha, '' as codigo_cliente, nombre as Nombre, 0.0 As monto_total " +
    			"FROM movimientos INNER JOIN detalle_movimientos on detalle_movimientos.id_movimiento_enc = movimientos.id_movimiento_enc";
    			
    } else  {
    	sql = 	sql + " UNION " +
    			"SELECT P.id_pago as id_venta, P.Enviada as enviada, " +
    			"CASE "+
    			"	WHEN id_cancelacion IS NULL THEN 1 "+
    			"	ELSE 0 "+
    			"END as status, IFNULL(id_cancelacion, 0) as id_cancelacion, " +
    			"'"+TIPO_TRANSACCION.PAGO+"' as Tipo, "+ TIPOVENTA.PAGOCANCEL +" As tipo_venta, " +TIPOVENTA.PAGOCANCEL + " As Id_tipo_credito, " +
    			"P.id_pago as factura, ifnull(strftime('%m-%d-%Y', P.Fecha) || ' ' || strftime('%H:%M', P.Hora), strftime('%m-%d-%Y', P.Fecha)) AS fecha, cl.codigo_cliente, cl.Nombre, monto As monto_total "+
    			"FROM pagos P "+
    			"	INNER JOIN clientes cl ON P.id_cliente = cl.id_cliente " +
    			" LEFT OUTER JOIN cancelacionpagosoffline C ON C.id_pago=P.id_pago "+
    			"WHERE Id_asignacion_ruta=" + objUsuario.Id_asignacion_Ruta;
    }
    
    
    //sql = sql + " ORDER BY factura";
    
    if(g_isdebug)console.log(sql);
    
    if(!validateDB())
    {
        AbreBD();
    }
    sql = sql + ' ORDER BY Fecha ';
    //Solo filtra ventas, credito y promocion, demos no se cancela
    //if(opcion === OPCVENTAS.CANCELAR)       
    //    sqlWhere = ' WHERE ventas.tipo_venta IN (' + TIPOVENTA.VENTA + ', ' + TIPOVENTA.CREDITO + ', ' + TIPOVENTA.PROMOCION + ') AND ventas.status=' + STATUSVENTAS.ACTIVA;
    
    clienteBD.transaction(            
                function(tx){
                    //console.log("ObtieneVentasDia sql:" + sql);
                    tx.executeSql(  sql , [], successFn, (errorFN != null ? errorFN : onErrorCallBack));                                        
                }
        );
}

function ObtieneVentasGeneral(tipo, successFn, errorFN)
{
    var sql =   "Select id_venta, enviada, status, (select count(*) FROM cancelacionesoffline WHERE id_venta = ventas.id_venta) AS id_cancelacion, " +
                "   CASE " +
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.VENTA + " THEN '"+TIPO_TRANSACCION.VENTA+"' "+
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.DEMO + " THEN '"+TIPO_TRANSACCION.DEMO+"' "+
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.CREDITO + " THEN '"+TIPO_TRANSACCION.CREDITO+"' "+
                "           WHEN ventas.tipo_venta = " + TIPOVENTA.PROMOCION + " THEN '"+TIPO_TRANSACCION.PROMOCION+"' "+
                "   END as Tipo, tipo_venta,  Id_tipo_credito, factura, ifnull(strftime('%m-%d-%Y', fecha) || ' ' || strftime('%H:%M', hora), strftime('%m-%d-%Y', fecha)) as fecha, codigo_cliente, Nombre, monto_total " +
                "From ventas INNER JOIN clientes ON ventas.id_cliente=clientes.id_cliente AND ventas.tipo_venta = IFNULL("+tipo+", ventas.tipo_venta)"
                " WHERE status = 1"
    
    //console.log(sql);
    if(!validateDB())
    {
        AbreBD();
    }
    sql = sql + ' ORDER BY fecha ';
    
    clienteBD.transaction(            
                function(tx){
                    //console.log("ObtieneVentasDia sql:" + sql);
                    tx.executeSql(  sql , [], successFn, (errorFN != null ? errorFN : onErrorCallBack));                                        
                }
        );
}
function ObtieneVentaId(id_venta, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select * From ventas WHERE id_venta=?",[id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

//Selecciona detalle venta por id
function ObtieneDetalleVentaId(id_venta, tipo_credito, imprimir, successFn, errorFN)
{
	
	var sql ="Select detalle_venta.cantidad, detalle_venta.caja as cajas, detalle_venta.precio, almacen_inventario.nombre AS nombre, almacen_inventario.existencia AS existencia, detalle_venta.id_producto, almacen_inventario.caja AS caja, almacen_inventario.clave, "+
				"detalle_venta.descuento, detalle_venta.monto_subtotal, detalle_venta.monto_total, detalle_venta.Id_unidad_medida, detalle_venta.lote, detalle_venta.tipo_captura, ifnull(precios.status_venta, 1) AS status_venta " +
				"From detalle_venta INNER JOIN almacen_inventario ON "+
				"detalle_venta.id_producto = almacen_inventario.id_producto And detalle_venta.lote=almacen_inventario.lote " +
				"LEFT OUTER JOIN precios ON precios.id_producto = detalle_venta.id_producto And precios.status_venta =" + TIPO_PRODUCTO.COMODIN + " " +
				"WHERE detalle_venta.id_venta=?";
	
	if(tipo_credito == TIPOCREDITO.PRODUCTOVENCIDO)
	{
		sql ="Select detalle_venta.cantidad, detalle_venta.caja as cajas, detalle_venta.precio, almacen_malo.nombre AS nombre, almacen_malo.existencia AS existencia, detalle_venta.id_producto, almacen_malo.caja AS caja, almacen_malo.clave, "+
				"detalle_venta.descuento, detalle_venta.monto_subtotal, detalle_venta.monto_total, detalle_venta.Id_unidad_medida, detalle_venta.lote, detalle_venta.tipo_captura, ifnull(precios.status_venta, 1) AS status_venta " +
				"From detalle_venta INNER JOIN almacen_malo ON "+
				"detalle_venta.id_producto = almacen_malo.id_producto And detalle_venta.lote=almacen_malo.lote " +
				"LEFT OUTER JOIN precios ON precios.id_producto = detalle_venta.id_producto And precios.status_venta =" + TIPO_PRODUCTO.COMODIN + " " +
				"WHERE detalle_venta.id_venta=?";
	}
	
	
	
	if(imprimir == 1)
	{
		sql = " Select detalle_venta.cantidad,	detalle_venta.caja as cajas, detalle_venta.precio,	precios.nombre_producto AS nombre,	detalle_venta.id_producto, " +
		"precios.codigo_producto as clave,	detalle_venta.descuento,	detalle_venta.monto_subtotal,	detalle_venta.monto_total,	detalle_venta.Id_unidad_medida,	detalle_venta.lote, " +
		"detalle_venta.tipo_captura,	ifnull(precios.status_venta, 1) AS status_venta " +
		"From	detalle_venta INNER JOIN precios ON precios.id_producto = detalle_venta.id_producto	WHERE detalle_venta.id_venta=?;";				
   }
	
	if(g_isdebug)
		console.log("SQL ObtieneDetalleVentaId: = " + sql);
	
	//alert("SQL: = " + sql);
	//console.log("TipoImpresion: "+ imprimir + " TIPO_IMPRESION.ENABLE" + TIPO_IMPRESION.ENABLE);
	
    if(!validateDB())
    {
        AbreBD();
    }
    //TODO: creo debe se un LEFT OUTER JOIN
    //Nombre_producto + " " + objVentas.aProductos[j].Cantidad + " " + objVentas.aProductos[j].Precio
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql, [id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

//obtiene las ventas offlineTODO
function ObtieneVentasDiaOffline(id_venta, successFn, errorFN)
{
    var sql = 'Select * ' +
                'From ventas where ventas.enviada=0 ORDER BY id_venta';
    
    if(id_venta != null)
    {
        sql = "Select * " +
        "From ventas Where ventas.folio='" + id_venta + "'";
    }
    
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql, [], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));                                     
                }
        );
}

function ObtieneTransaccionesPendientes(successFn, errorFN)
{
    var sql = 'SELECT   V.*, detalle_venta.id_producto, '+
                        'detalle_venta.cantidad, ' +
                        'detalle_venta.lote, ' +
                        'detalle_venta.precio, ' +
                        'detalle_venta.monto_subtotal subtotalDet, ' +
                        'detalle_venta.monto_total totalDet, '+
                        'detalle_venta.tipo_captura, '+
                        'detalle_venta.Id_unidad_medida, '+
                        'detalle_venta.caja, '+
                        '(SELECT COUNT(id_producto) FROM detalle_venta AS D WHERE V.id_venta=D.id_venta) AS TotalProductos ' +
                'FROM ventas AS V ' +
                '   INNER JOIN detalle_venta ON V.id_venta=detalle_venta.id_venta '+
                'WHERE V.enviada=0 ORDER BY V.id_venta ASC ';
    

    //console.log("ObtieneTransaccionesPendientes sql:" + sql);
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql, [], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));                                     
                }
        );
}

function ActualizaFirmaVentas(id_venta, valor, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Update ventas set requiere_firma=? where id_venta=?",[valor, id_venta], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//Fin Ventas

//Precios
function EliminaPrecios()
{
	var sql = "delete from precios";
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function UpdatePrecios()
{
	var sql = "Update precios Set status_venta = 0";
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}


function GuardaPrecios(aPrecio)
{
	var sql = "Insert Into precios (id_lista_precios_enc, " +
				"id_producto, precio_caja_final_max, precio_caja_final_min, precio_caja_regular, codigo_producto, id_distribuidor, id_unidad_medida, nombre_producto, unidad_medida, status_venta) "+
				"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	/*var sql1 = "Insert Into precios (id_lista_precios_enc, " +
	"id_producto, precio_caja_final_max, precio_caja_final_min, precio_caja_regular, codigo_producto, id_distribuidor, id_unidad_medida, nombre_producto, unidad_medida) "+
	"values (";*/
	
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				for(var i=0; i < aPrecio.length;i++)
				{
					var objPrecio = aPrecio[i];
					try{
						if(g_isdebug)
						{
							console.log('GuardaPrecio:'+ sql
								+ objPrecio.id_lista_precios_enc + ", " +
								 objPrecio.id_producto + ","+ objPrecio.precio_caja_final_max+ ", " +
								 objPrecio.precio_caja_final_min + ","+ objPrecio.precio_caja_regular+ ", " +
								 objPrecio.codigo_producto + ","+ objPrecio.id_distribuidor+ ", " +
								 objPrecio.id_unidad_medida + ","+ objPrecio.nombre_producto+ ", " +
								 objPrecio.unidad_medida+ ")" 
							);
						}
						
					tx.executeSql(sql,
							[objPrecio.id_lista_precios_enc,
							 objPrecio.id_producto, objPrecio.precio_caja_final_max,
							 objPrecio.precio_caja_final_min, objPrecio.precio_caja_regular,
							 objPrecio.codigo_producto, objPrecio.id_distribuidor, 
							 objPrecio.id_unidad_medida, objPrecio.nombre_producto, 
							 objPrecio.unidad_medida, objPrecio.status_venta], 
							 successCargaInfo, onErrorCargaInfo);
					}catch(err)
				    {
						alert("Error GuardaPrecio");
				    }
				}
			}
	);
}

function GuardaPreciosWS(aPrecio)
{
	var sql = "Insert OR Replace Into precios (id_lista_precios_enc, " +
				"id_producto, precio_caja_final_max, precio_caja_final_min, precio_caja_regular, codigo_producto, id_distribuidor, id_unidad_medida, nombre_producto, unidad_medida, status_venta) "+
				"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				for(var i=0; i < aPrecio.length;i++)
				{
					var objPrecio = aPrecio[i];
					try{
						
					tx.executeSql(sql,
							[objPrecio.id_lista_precios_enc,
							 objPrecio.id_producto, objPrecio.precio_caja_final_max,
							 objPrecio.precio_caja_final_min, objPrecio.precio_caja_regular,
							 objPrecio.codigo_producto, objPrecio.id_distribuidor, 
							 objPrecio.id_unidad_medida, objPrecio.nombre_producto, 
							 objPrecio.unidad_medida, objPrecio.status_venta], 
							 successCargaInfo, onErrorCargaInfo);
					}catch(err)
				    {
						alert("Error GuardaPrecio");
				    }
				}
				
				summary += 'List Price: ' + aPrecio.length + "\n";
			}
	);
}

function ObtienePrecio(Id_producto,Id_lista_precios_enc,successFn, errorFN)
{
	if(!validateDB())
    {
		AbreBD();
    }
	 var sql = "Select precio_caja_final as precio   From precios" +
		" WHERE id_producto = "+ Id_producto +" AND id_lista_precios_enc = " + Id_lista_precios_enc +"";
	 //console.log(sql);
	clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );	
}

function ObtienePrecioProducto(id_producto, id_distribuidor, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select * From precios where id_distribuidor=? and id_producto=?",[id_distribuidor, id_producto],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//Fin precios

//Clientes
function ObtieneClienteId(id_cliente, successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select * From clientes where id_cliente=?",[id_cliente],
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function EliminaNegocios()
{
	var sql = "delete from clientes";
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function GuardaNegocios(aClientes)
{
	var sql = "Insert Into clientes (id_cliente, " +
				"codigo_cliente, domicilio, codigo_postal, id_ruta, id_distribuidor," +
				"Nombre, telefono, ciudad, codigo_estado, dias_credito, id_lista_precio) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	if(g_isdebug)
		console.log('leer GuardaNegocio:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				for(var i=0; i< aClientes.length; i++)
				{
					var objCliente = aClientes[i];
					try{
						
						/*console.log('leer GuardaNegocio:'+ sql
								+ objCliente.id_cliente+","+ objCliente.codigo_cliente+","+
								 objCliente.domicilio+","+ objCliente.codigo_postal+","+
								 objCliente.id_ruta+","+ objCliente.id_distribuidor+","+ objCliente.Nombre+","+ objCliente.telefono
						);*/
						
					tx.executeSql(sql,
							[objCliente.id_cliente, objCliente.codigo_cliente,
							 objCliente.domicilio, objCliente.codigo_postal,
							 objCliente.id_ruta, objCliente.id_distribuidor, objCliente.Nombre, objCliente.telefono,
							 objCliente.ciudad, objCliente.codigo_estado, objCliente.dias_credito, objCliente.id_lista_precio], 
							 successCargaInfo, onErrorCargaInfo);
					}catch(err)
				    {
						alert("Error GuardaNegocio");
				    }
				}
			}
	);
}

function GuardaNegociosWS(aClientes)
{
	var sql = "INSERT OR REPLACE  Into clientes (id_cliente, " +
				"codigo_cliente, domicilio, codigo_postal, id_ruta, id_distribuidor," +
				"Nombre, telefono, ciudad, codigo_estado, dias_credito, id_lista_precio) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

	if(g_isdebug)console.log('leer GuardaNegocio:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				for(var i=0; i< aClientes.length; i++)
				{
					var objCliente = aClientes[i];
					try{
						
						/*console.log('leer GuardaNegocio:'+ sql
								+ objCliente.id_cliente+","+ objCliente.codigo_cliente+","+
								 objCliente.domicilio+","+ objCliente.codigo_postal+","+
								 objCliente.id_ruta+","+ objCliente.id_distribuidor+","+ objCliente.Nombre+","+ objCliente.telefono
						);*/
						
					tx.executeSql(sql,
							[objCliente.id_cliente, objCliente.codigo_cliente,
							 objCliente.domicilio, objCliente.codigo_postal,
							 objCliente.id_ruta, objCliente.id_distribuidor, objCliente.Nombre, objCliente.telefono,
							 objCliente.ciudad, objCliente.codigo_estado, objCliente.dias_credito, objCliente.id_lista_precio], 
							 successCargaInfo, onErrorCargaInfo);
					}catch(err)
				    {
						alert("Error GuardaNegocio");
				    }
				}
				
				summary += 'Customers: ' + aClientes.length + "\n";
			}
	);
}

function ObtieneNegociosCombo(id_ruta, todos,successFn, errorFN)
{
	var sql = "Select id_cliente, Nombre, (domicilio  || ' ' ||  ciudad || ' ' ||  codigo_estado || ' ' ||  codigo_postal) as domicilio From clientes ";
	
	if(todos)
		sql += "WHERE id_ruta<>" + id_ruta;
	else
		sql += "WHERE id_ruta=" + id_ruta;
	
	sql += " ORDER BY Nombre ASC";
	if(g_isdebug)
		console.log("ObtieneNegociosCombo sql:" +sql);
	if(!validateDB())
    {
		AbreBD();
    }
	clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//Fin Clientes

//Impresion
function GuardaImpresion(objImpresion)
{
	var sql = "Insert Into impresion (ciudad, codigo_postal, compania, " +
					"direccion, estado, fax, " +
					"id_compania, " +
					"id_distribuidor, manufacturer, nombre_comercial, pais, "+
					"po_box, telefono, toll_free,descripcion,condado)"+
				"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)";
	
	if(g_isdebug)
		console.log('leer GuardaImpresion:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
		
				try{
				tx.executeSql(sql,
						[objImpresion.ciudad, objImpresion.codigo_postal,
						 objImpresion.compania, objImpresion.direccion,
						objImpresion.estado, objImpresion.fax,
						objImpresion.id_compania, objImpresion.id_distribuidor, 
						objImpresion.manufacturer, objImpresion.nombre_comercial,
						objImpresion.pais, objImpresion.po_box, 
						objImpresion.telefono, objImpresion.toll_free, objImpresion.descripcion, objImpresion.condado ], 
						 successCargaInfo, onErrorCargaInfo);
				}catch(err)
			    {
					alert("Error GuardaImpresion");
			    }
			}
	);
}

function GuardaImpresionWS(objImpresion)
{
	var sql = "Insert OR Replace Into impresion (ciudad, codigo_postal, compania, " +
					"direccion, estado, fax, " +
					"id_compania, " +
					"id_distribuidor, manufacturer, nombre_comercial, pais, "+
					"po_box, telefono, toll_free,descripcion,condado)"+
				"values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
	
	if(g_isdebug)
		console.log('leer GuardaImpresion:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
		
				try{
				tx.executeSql(sql,
						[objImpresion.ciudad, objImpresion.codigo_postal,
						 objImpresion.compania, objImpresion.direccion,
						objImpresion.estado, objImpresion.fax,
						objImpresion.id_compania, objImpresion.id_distribuidor, 
						objImpresion.manufacturer, objImpresion.nombre_comercial,
						objImpresion.pais, objImpresion.po_box, 
						objImpresion.telefono, objImpresion.toll_free,objImpresion.descripcion,objImpresion.condado], 
						 successCargaInfo, onErrorCargaInfo);
				
				summary += 'Info Company: 1 \n';
				}catch(err)
			    {
					alert("Error GuardaImpresion");
			    }
			}
	);
}

function EliminaImpresion()
{
	var sql = "delete from impresion";
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function ObtieneImpresion(successFn, errorFN)
{
    var sql = "SELECT * FROM impresion";
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
}
//Fin de impresion

//Parametros
function InsertaParametrosIniciales(successFn, errorFN)
{   
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){ 
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('requiereFirma', '0')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('requiereLogo', '-1')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('version', '1')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('password_settings', '"+DEFAULT_CLAVE+"')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('transfer_auto', '0')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('price', '0')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                
                tx.executeSql("Insert Into parametros (nombre, valor) Values ('list_price', '0')", 
                        [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
}
function ActualizaParametros(objParametro)
{
    var sql = "Insert Into parametros (nombre, valor) Values (?, ?)";
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                totalSincronizar = totalSincronizar - getTotalPropiedades(objParametro);

                tx.executeSql("DELETE FROM parametros", [], 
                        successCargaInfo, onErrorCargaInfo);
                totalSincronizar = totalSincronizar - 1;
                for (var k in objParametro) {       
                    if (objParametro.hasOwnProperty(k)) {
                        tx.executeSql(sql,
                                [k, objParametro[k]], 
                                successCargaInfo, onErrorCargaInfo);   
                    }
                }
            }
    );
    //TODO:
    //successCB, onErrorGeneric
}

function ActualizaParametrosWS(objParametro)
{
    var sql = "Insert OR Replace Into parametros (nombre, valor) Values (?, ?)";
    var total = 0;
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                for (var k in objParametro) {       
                    if (objParametro.hasOwnProperty(k)) {

                        tx.executeSql(sql,
                                [k, objParametro[k]], 
                                successCargaInfo, onErrorCargaInfo); 
                        
                        total++;
                    }
                }
                summary += 'Parameters: ' + total + "\n"; 
            }
    );
}

function ObtieneParametros(successFn, errorFN)
{
    var sql = "select * from parametros";
    
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};

//End Parametros

//Entidades
function GuardaEntidades(aEntidades, successFn, errorFN)
{
    var sql = "INSERT OR REPLACE Into entidades (id_tabla, nombre_tabla, checksum) " +
                    "values (?, ?, ?)";

    //console.log("GuardaEntidades sql:" +sql);
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                totalSincronizar = totalSincronizar - aEntidades.length;
                for(var i = 0; i < aEntidades.length; i++){
                    var objEntidad = aEntidades[i];
                    //alert("GuardaEntidades nombre|checksum:" +objEntidad.nombre_tabla+ "|"+ objEntidad.checksum);
                    try{
                    tx.executeSql(sql, [objEntidad.id, objEntidad.nombre_tabla, objEntidad.checksum], 
                            successCargaInfo, onErrorCargaInfo);
                    }catch(err)
    			    {
    					alert("Error GuardaEntiades");
    			    }
                }
            }
    );
}

function ActualizaEntidad(objEntidad, successFn, errorFN)
{
    var sql = "update entidades set checksum=? " +
                "where id_tabla=?)";

    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                tx.executeSql(sql, [objEntidad.checksum, objEntidad.id], 
                        successCargaInfo, onErrorCargaInfo);                
            }
    );
}

function ObtieneEntidades(successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select * from entidades",[], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}
//Fin Entidades


//Motivos NC
function GuardaMotivo(objMotivo)
{
	var sql = "Insert Into motivosnc (id_motivos_nt, " +
				"nombre, id_usuario, " +
				"id_compania, fecha_creacion, " +
				"fecha_ult_act, " +
				"estatus) values (?, ?, ?, ?, ?, ?, ?)";
	
	//console.log('leer GuardaMotivo:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql,
						[objMotivo.id_motivos_nt, objMotivo.nombre,
						 objMotivo.id_usuario, objMotivo.id_compania,
						 objMotivo.fecha_creacion, objMotivo.fecha_ult_act,
						 objMotivo.estatus], 
						 successCargaInfo, onErrorCargaInfo);				
			}
	);
}

function GuardaMotivos(aMotivos)
{
	var sql = "Insert Into motivosnc (id_motivos_nt, " +
	"nombre, id_usuario, " +
	"id_compania, fecha_creacion, " +
	"fecha_ult_act, " +
	"estatus) values (?, ?, ?, ?, ?, ?, ?)";

	//console.log('leer GuardaMotivo:'+ sql);
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				for(var i=0; i < aMotivos.length; i++)
				{
					var objMotivo = aMotivos[i];			

					tx.executeSql(sql,
							[objMotivo.id_motivos_nt, objMotivo.nombre,
							 objMotivo.id_usuario, objMotivo.id_compania,
							 objMotivo.fecha_creacion, objMotivo.fecha_ult_act,
							 objMotivo.estatus], 
							 successCargaInfo, onErrorCargaInfo);
				}
			}
	);
}

function EliminaMotivosNC()
{
	var sql = "delete from motivosnc";
	
	if(!validateDB())
	{
		AbreBD();
	}
	clienteBD.transaction(
			function(tx){
				tx.executeSql(sql, [], successCB, onErrorGeneric);
			}
	);
}

function ObtieneMotivosNCCombo(successFn, errorFN)
{
	if(!validateDB())
    {
		AbreBD();
    }
	clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select id_motivos_nt, nombre From motivosnc",[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//fin motivos nc

//motivos NV
function GuardaMotivosNV(aMotivos)
{
    var sql = "Insert Into motivosnv (id_tipo_no_venta, " +
    "nombre, id_usuario, " +
    "id_compania, fecha_creacion, " +
    "fecha_ult_act, " +
    "estatus) values (?, ?, ?, ?, ?, ?, ?)";

    //console.log('leer GuardaMotivo:'+ sql);
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                for(var i=0; i < aMotivos.length; i++)
                {
                    var objMotivo = aMotivos[i];            

                    tx.executeSql(sql,
                            [objMotivo.id_motivos_nt, objMotivo.nombre,
                             objMotivo.id_usuario, objMotivo.id_compania,
                             objMotivo.fecha_creacion, objMotivo.fecha_ult_act,
                             objMotivo.estatus], 
                             successCargaInfo, onErrorCargaInfo);
                }
            }
    );
}

function EliminaMotivosNV()
{
    var sql = "delete from motivosnv";
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){
                tx.executeSql(sql, [], successCB, onErrorGeneric);
            }
    );
}

function ObtieneMotivosNVCombo(successFn, errorFN)
{
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql("Select id_tipo_no_venta, nombre From motivosnv",[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//fin motivos NV

//Cancelaciones
function GuardaCancelacion(objCancelacion, successFn, errorFN)//id_venta, longitud, latitude, fecha, hora, Id_Usuario, enviada, successFn, errorFN)
{
    var sql = "Insert Into cancelacionesoffline (id_venta, longitud, latitude, fecha, hora, Id_Usuario, enviada) " +
                "values (?, ?, ?, ?, ? ,?, ?)";
        
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [objCancelacion.id_venta, objCancelacion.longitud, 
                                            objCancelacion.latitude, objCancelacion.fecha, 
                                            objCancelacion.hora, objCancelacion.Id_Usuario, 
                                            objCancelacion.enviada], (successFn == null ? successCB : successFn), 
                                            (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

function GuardaCancelacionNC(id_venta, successFn, errorFN)
{
    var sql = "UPDATE notacredito SET status = 0 WHERE id_venta ="+id_venta+"";
        
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [], (successFn == null ? successCB : successFn), 
                                            (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

function GuardaCancelacionPagoVenta(o, successFn, errorFN)
{
    var sql = "INSERT INTO cancelacionpagosoffline (id_pago, longitud, latitude, fecha, hora, Id_Usuario, enviada) " +
    		  "SELECT id_pago, '"+o.longitud+"', '"+o.latitude+"', '"+o.fecha+"', '"+o.hora+"', "+o.Id_Usuario+", "+o.enviada+" "+
    		  "From pagos " +
    		  "INNER JOIN ventas ON ventas.factura=pagos.Factura "+
    		  "WHERE id_venta=?";
    //console.log(sql);
        
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [o.id_venta], (successFn == null ? successCB : successFn), 
                                            (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

function GuardaCancelacionPago(objCancelacion, successFn, errorFN)
{
    var sql = "Insert Into cancelacionpagosoffline (id_pago, longitud, latitude, fecha, hora, Id_Usuario, enviada) " +
                "values (?, ?, ?, ?, ? ,?, ?)";
        
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [objCancelacion.id_venta, objCancelacion.longitud, 
                                            objCancelacion.latitude, objCancelacion.fecha, 
                                            objCancelacion.hora, objCancelacion.Id_Usuario, 
                                            objCancelacion.enviada], (successFn == null ? successCB : successFn), 
                                            (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

function EliminaCancelacionOffline(id_venta, successFn, errorFN)
{
    var sql = "DELETE from cancelacionesoffline WHERE id_venta=?";
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [id_venta], successFn, (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

function ObtieneCancelacionesPendientes(id_cancelacion, successFn, errorFN)
{
	//var sql = "select * FROM cancelacionesoffline WHERE enviada=0 LIMIT 1";
	var sql = "select * FROM cancelacionesoffline WHERE enviada=0 LIMIT 1";
    
    if(id_cancelacion != null)
        sql = "select * FROM cancelacionesoffline WHERE id_cancelacion="+id_cancelacion;
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){                    
                        tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));                    
                }
        );
}

function ObtieneCancelacionesCompletasPendientes(successFn, errorFN)
{
    var sql = 'SELECT   V.*, detalle_venta.id_producto, '+
                        'detalle_venta.cantidad, ' +
                        'detalle_venta.lote, ' +
                        'detalle_venta.precio, ' +
                        'detalle_venta.monto_subtotal subtotalDet, ' +
                        'detalle_venta.monto_total totalDet, '+
                        'detalle_venta.tipo_captura , '+
                        'detalle_venta.Id_unidad_medida, '+
                        'detalle_venta.caja, '+
                        '(SELECT COUNT(id_producto) FROM detalle_venta AS D WHERE V.id_venta=D.id_venta) AS TotalProductos ' +
                'FROM ventas as V' +
                '   INNER JOIN detalle_venta ON V.id_venta=detalle_venta.id_venta '+
                '   INNER JOIN cancelacionesoffline ON V.id_venta=cancelacionesoffline.id_venta '+
                'WHERE V.enviada=1 AND cancelacionesoffline.enviada=0 ORDER BY V.id_venta ASC';
    

    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql, [], 
                            successFn, (errorFN != null ? errorFN : onErrorCallBack));                                     
                }
        );
}
//Fin Cancelaciones
/*
 * SELECT T.*, '' AS codigo_cliente " +
    			"FROM pagos T "+
    			" INNER JOIN cancelacionpagosoffline C ON c.id_pago = T.id_pago "+
    			"Where T.Enviada = 1 "+
    			" AND C.enviada = 0 Order BY id_pago ASC 
 * 
 */
function ObtienePendientes(successFn, errorFN)
{
    var sql =   "SELECT   factura, fecha, " +
                "   CASE " +
                "           WHEN tipo_venta = " + TIPOVENTA.VENTA + " THEN '"+TIPO_TRANSACCION.VENTA+"' "+
                "           WHEN tipo_venta = " + TIPOVENTA.DEMO + " THEN '"+TIPO_TRANSACCION.DEMO+"' "+
                "           WHEN tipo_venta = " + TIPOVENTA.CREDITO + " THEN '"+TIPO_TRANSACCION.CREDITO+"' "+
                "           WHEN tipo_venta = " + TIPOVENTA.PROMOCION + " THEN '"+TIPO_TRANSACCION.PROMOCION+"' "+
                "   END as tipo " +
                "FROM ventas where enviada = 0 "+
                "UNION "+
                "SELECT id_cancelacion AS factura, fecha, '"+TIPO_TRANSACCION.CANCELACION+"' AS tipo "+
                "FROM cancelacionesoffline where enviada = 0 " +
                "UNION "+
                "SELECT id_movimiento_enc AS factura, fecha_ciere AS fecha, '"+TIPO_TRANSACCION.MOVIMIENTO+"' AS tipo "+//folio
                "FROM movimientos where Enviada = 0 AND Abierto=0 "  +
                "UNION " +
                "SELECT id_pago AS factura, Fecha AS fecha, '"+TIPO_TRANSACCION.PAGO+"' AS tipo " +
                "FROM pagos where Enviada  = 0 " +
                "UNION " +
                "SELECT id_cancelacion AS factura, fecha, '"+TIPO_TRANSACCION.CANCELACIONPAY+"' AS tipo "+
                "FROM cancelacionpagosoffline where enviada = 0 ";
    //console.log("ObtienePendientes sql:" + sql);     
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

//Impresora
function ObtieneImpresoras(successFn, errorFN)
{
    var sql = "SELECT   * "+
              "FROM impresora Order BY Predeterminada Desc ";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function GuardaImpresora(objImpresora, successFn, errorFN)
{
    var sql = "INSERT OR IGNORE INTO impresora (Nombre, MAC, Tipo, Predeterminada) Values (?, ?, ?, ?)";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[objImpresora.Nombre, objImpresora.MAC, objImpresora.Tipo, objImpresora.Predeterminada],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ImpresoraPredeterminada(Id_Impresora, successFn, errorFN)
{
    var sql = "UPDATE impresora set Predeterminada=0";
    var sqlPre = "UPDATE impresora set Predeterminada=1 Where Id_Impresora=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    //quita todas las predeterminadas
                    tx.executeSql(sql,[],  successCB, (errorFN != null ? errorFN : onErrorCallBack));
                    //agrega la actual
                    tx.executeSql(sqlPre,[Id_Impresora],  successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function EliminaImpresora(Id_Impresora, successFn, errorFN)
{
    var sql = "DELETE FROM impresora Where Id_Impresora=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){             
                    tx.executeSql(sql,[Id_Impresora],  successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}
//Fin Impresora

//Movimientos-Traspasos
function ObtieneMovimientosAbiertos(successFn, errorFN)
{
    var sql = "SELECT   * "+
              "FROM movimientos Where Abierto = 1 Order BY id_movimiento_enc";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneMovimientosNoEnviados(successFn, errorFN)
{
    var sql = "SELECT   M.id_movimiento_enc, Cantidad_cajas, Cantidad, Id_producto, Id_unidad_medida, Id_usuario, Lote, "+
              "         (Select count(Id_producto) From detalle_movimientos AS D Where D.id_movimiento_enc = M.id_movimiento_enc) AS totalProductos " +
              //" COUNT(Id_producto)  AS totalProductos " +
              "FROM movimientos AS M "+
              " INNER JOIN detalle_movimientos ON M.id_movimiento_enc = detalle_movimientos.id_movimiento_enc " +
              "     Where M.Enviada = 0 Order BY M.id_movimiento_enc ASC ";
    //console.log("ObtieneMovimientosNoEnviados sql:" +sql);                   
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function Guardamovimientos(aTraspasos)
{
    var sql = "INSERT OR IGNORE INTO movimientos(id_ruta, id_asignacion_ruta, id_destino, id_estatus_movimiento, " +
						"id_movimiento_enc, id_origen, nombre, " +
						"nombre_ruta, fecha_entrega, Enviada, Abierto) Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){                	
                	for(var i = 0; i < aTraspasos.length; i++)
                	{
                		var objTraspaso = aTraspasos[i];
                		tx.executeSql(sql,[objTraspaso.id_ruta, objTraspaso.id_asignacion_ruta, objTraspaso.id_destino, objTraspaso.id_estatus_movimiento,
                		                   objTraspaso.id_movimiento_enc, objTraspaso.id_origen, objTraspaso.nombre, objTraspaso.nombre_ruta,
                		                   objTraspaso.fecha_entrega, objTraspaso.Enviada, objTraspaso.Abierto],  
                		                   successCargaTraspasos, onErrorCargaInfo);                		
                	}                	
                }
        );
}

function CierraMovimiento(id_movimiento_enc, fechaCierre ,successFn, errorFN)
{
    var sql = "UPDATE movimientos SET Abierto=0, fecha_ciere=? Where id_movimiento_enc=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[fechaCierre, id_movimiento_enc],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ActualizaEnviadaMovimiento(id_movimiento_enc ,successFn, errorFN)
{
    var sql = "UPDATE movimientos SET Enviada=1 Where id_movimiento_enc=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_movimiento_enc],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function GuardaDetalleMovimiento(id_movimiento_enc, Id_usuario, aProductos, successFn, errorFN)
{
    var sql = 	"INSERT INTO detalle_movimientos(id_movimiento_enc, Id_almacen, Id_producto, Id_unidad_medida, " +
    			"Lote, Cantidad_cajas, Cantidad, Id_usuario) Values (?, ?, ?, ?, ?, ?, ?, ?)";
                       
    if(!validateDB())
    {
        AbreBD();
    }
//console.log("GuardaDetalleMovimiento sql:" + sql);
    clienteBD.transaction(
                function(tx){
                	for(var i = 0; i < aProductos.length; i++)
                	{
                		var objProducto = aProductos[i];
                		tx.executeSql(sql,[id_movimiento_enc, objProducto.Id_almacen, objProducto.Id_producto, objProducto.id_unidad_medida,
                		                   objProducto.Lote, objProducto.CantidadCaja, objProducto.Cantidad, Id_usuario],  
                		                   successFn, (errorFN != null ? errorFN : onErrorCallBack));                		
                	}                	
                }
        );
}

function ObtieneMovimientoById(id_movimeinto, successFn, errorFN)
{
    var sql = "SELECT   M.id_movimiento_enc, detalle_movimientos.Cantidad_cajas, detalle_movimientos.Cantidad, detalle_movimientos.Id_producto, detalle_movimientos.Id_unidad_medida, Id_usuario, detalle_movimientos.Lote, "+
              "         (Select count(D.Id_producto) From detalle_movimientos AS D Where D.id_movimiento_enc = M.id_movimiento_enc) AS totalProductos " +
              " ,almacen_inventario.nombre, almacen_inventario.clave, M.fecha_ciere as fecha " +
              "FROM movimientos AS M "+
              " INNER JOIN detalle_movimientos ON M.id_movimiento_enc = detalle_movimientos.id_movimiento_enc " +
              " INNER JOIN almacen_inventario on almacen_inventario.id_producto = detalle_movimientos.Id_producto AND detalle_movimientos.Lote=almacen_inventario.lote " +
              "     Where M.id_movimiento_enc = " + id_movimeinto;
    console.log("ObtieneMovimientoById sql:" +sql);                   
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneMovimientosDescargados(id_movimiento_enc, successFn, errorFN)
{
    var sql = "SELECT   * "+
              "FROM tmpTransfer Where id_movimiento_enc=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_movimiento_enc],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function GuardaTransferDescargado(id_movimiento_enc, Id_Ruta, Id_asignacion_Ruta ,Id_Usuario, aProductos, successFn, errorFN)
{
    var sql = 	"INSERT INTO tmpTransfer(id_movimiento_enc, id_ruta, Id_asignacion_ruta, Fecha, Hora, " +
				"existencia, caja, id_almacen, id_producto, id_unidad_medida, Id_Usuario, lote, clave, nombre) Values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, null, null)";
                       
    if(!validateDB())
    {
        AbreBD();
    }
//console.log("GuardaDetalleMovimiento sql:" + sql);
    clienteBD.transaction(
                function(tx){
                	console.log("GuardaTransferDescargado total:" + aProductos.length);
                	for(var i = 0; i < aProductos.length; i++)
                	{
                		var objProducto = aProductos[i];
                		console.log("GuardaTransferDescargado pos:" + i);
                		if(i === aProductos.length -1)
                		{
                			console.log("GuardaTransferDescargado insertando ultimo");
                			tx.executeSql(sql,[id_movimiento_enc, Id_Ruta, Id_asignacion_Ruta, '', '', 
                		                   objProducto.Cantidad, objProducto.CantidadCaja , objProducto.Id_almacen, 
                		                   objProducto.Id_producto, objProducto.id_unidad_medida,
                		                   objProducto.CantidadCaja, objProducto.Lote],  
                		                   onSuccessOpenDB, (errorFN != null ? errorFN : onErrorCallBack));
                			
                			console.log("GuardaTransferDescargado actualizando clave");
                			tx.executeSql("UPDATE tmpTransfer SET clave=(SELECT codigo_producto FROM precios AS P WHERE P.id_producto=tmpTransfer.id_producto LIMIT 0,1) WHERE clave IS NULL ", 
                					[], onSuccessOpenDB, (errorFN != null ? errorFN : onErrorCallBack));
                			console.log("GuardaTransferDescargado actualizando nombre");
                			tx.executeSql("UPDATE tmpTransfer SET nombre=(SELECT nombre_producto FROM precios AS P WHERE P.id_producto=tmpTransfer.id_producto LIMIT 0,1) WHERE nombre IS NULL", 
                					[], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                			
                			
                		} else {
                			console.log("GuardaTransferDescargado insertando");
                			tx.executeSql(sql,[id_movimiento_enc, Id_Ruta, Id_asignacion_Ruta, '', '', 
                    		                   objProducto.Cantidad, objProducto.CantidadCaja , objProducto.Id_almacen, 
                    		                   objProducto.Id_producto, objProducto.id_unidad_medida,
                    		                   objProducto.CantidadCaja, objProducto.Lote],  
                    		                   onSuccessOpenDB, (errorFN != null ? errorFN : onErrorCallBack));                			                			
                		}
                	}                	
                }
        );
}

function EliminaTransferDescargado(id_movimiento_enc, successFn, errorFN)
{
    var sql = "DELETE FROM tmpTransfer Where id_movimiento_enc=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_movimiento_enc],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}
//Fin Movimientos-Traspasos

function EliminaTransacciones(successFn, errorFN)
{   
    var sqlCommando = 'DROP TABLE IF EXISTS ';
    
    var aTablas = new Array('detalle_venta', 'ventas', 'usuarios', 'clientes', 'almacen_inventario', 'precios', 'impresion', 'descuentos', 'motivosnc', 'notacredito', 'cancelacionesoffline', 'motivosnv', 'entidades', 'parametros', 'movimientos', 'detalle_movimientos', 'almacen_malo', 'almacen_inicial', 'pagos', 'cancelacionpagosoffline');
    
    if(!validateDB())
    {
        AbreBD();
    }
    clienteBD.transaction(
    		//var sql = "INSERT INTO factura SELECT ";
            function(tx){
                for(var i=0; i < aTablas.length; i++)
                {
                    tx.executeSql(sqlCommando + aTablas[i], [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
                
                verifyObjects(tx);
                //InsertaParametrosIniciales(null, null);               
            }
        );
}

//pagos
function GuardaPago(objPago, successFn, errorFN)
{
    /*var sql = 	"INSERT INTO pagos (Id_cliente, Id_asignacion_ruta, Id_distribuidor, Fecha, Hora," +
				"Id_usuario, Id_tipo_pago, Factura, monto, sobrante, monto_total, Numero_cheque, Comentarios, Enviada) Values "+
				"(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";// SELECT last_insert_rowid() AS id_pago;";
*/
    var sql = 	"INSERT OR IGNORE INTO pagos (Id_cliente, Id_asignacion_ruta, Id_distribuidor, Fecha, Hora," +
	"Id_usuario, Id_tipo_pago, Factura, monto, sobrante, monto_total, Numero_cheque, Comentarios, Enviada, parentFactura) Values "+
	"("+objPago.objPagosRuta.Id_cliente+", "+objPago.objPagosRuta.Id_asignacion_ruta+", "+
	""+objPago.objPagosRuta.Id_distribuidor+", '"+ objPago.Fecha+"', '"+objPago.Hora+"', "+ objPago.objPagosRuta.Id_usuario+", "+
	""+ objPago.objPagosRuta.Id_tipo_pago+", '"+ objPago.objPagosRuta.Factura+"', "+
	""+objPago.objPagosRuta.Monto+", "+ objPago.sobrante+", "+objPago.monto_total+", " +
	"'"+objPago.objPagosRuta.Numero_cheque+"', '"+objPago.objPagosRuta.Comentarios+"', "+objPago.Enviada+", '"+objPago.parentFactura+"')";// SELECT last_insert_rowid() AS id_pago;";
    
    if(!validateDB())
    {
        AbreBD();
    }
    
    if(g_isdebug)
    	console.log("GuardaPago sql:" + sql);
 
    clienteBD.transaction(
                function(tx){                		
                		tx.executeSql(sql,[],  
                		                   successFn, (errorFN != null ? errorFN : onErrorCallBack));
                }
        );
}

function ActualizaEnviadoPago(id_pago ,successFn, errorFN)
{
    var sql = "UPDATE pagos SET Enviada=1 Where id_pago=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }
    if(g_isdebug)
    	console.log("ActualizaEnviadoPago sql:" + sql + id_pago);
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_pago],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ActualizaEnviadoPagoCancelado(id_pago ,successFn, errorFN)
{
    var sql = "UPDATE cancelacionpagosoffline SET enviada=1 Where id_pago=?";
                       
    if(!validateDB())
    {
        AbreBD();
    }
    if(g_isdebug)
    	console.log("ActualizaEnviadoPagoCancelado sql:" + sql + id_pago);
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_pago],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtienePagosNoEnviados(successFn, errorFN)
{
    var sql = 	"SELECT *, '' AS codigo_cliente, (SELECT COUNT(id_pago) FROM pagos AS P WHERE P.Id_cliente=T.Id_cliente AND P.Enviada = 0) AS TotalPagos " +
    			"FROM pagos T Where Enviada = 0 Order BY id_pago ASC ";
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneCanclearPagosNoEnviados(successFn, errorFN)
{
    var sql = 	"SELECT T.*, '' AS codigo_cliente " +
    			"FROM pagos T "+
    			" INNER JOIN cancelacionpagosoffline C ON c.id_pago = T.id_pago "+
    			"Where T.Enviada = 1 "+
    			" AND C.enviada = 0 Order BY id_pago ASC ";
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneIdPagos(successFn, errorFN)
{
    var sql = "SELECT max(id_pago) AS id_pago FROM pagos";                   
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtienePagoPorId(id_pago, successFn, errorFN)
{
    var sql = "SELECT * FROM pagos WHERE id_pago=?";                   
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[id_pago],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtienePagosCliente(Id_cliente, successFn, errorFN)
{
    var sql = 	"SELECt P.*, codigo_cliente FROM pagos AS P " +
    			"INNER JOIN clientes AS C ON P.Id_cliente=C.id_cliente " +
    			"Where P.Id_cliente = ? Order BY P.id_pago ASC ";                   
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[Id_cliente],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtienePagosClienteFactura(Id_cliente, Factura,successFn, errorFN)
{

	var sql =  "SELECt P.*, C.codigo_cliente FROM pagos AS P " +
	       "INNER JOIN clientes AS C ON P.Id_cliente=C.id_cliente " +
	       "Where P.Id_cliente = "+Id_cliente+" AND P.Factura = '"+Factura+"' Order BY P.id_pago ASC ";
	
    if(!validateDB())
    {
        AbreBD();
    }
    //console.log("Pagos sql:" +sql, + "Id_cliente: " + Id_cliente + "Factura: " + Factura );
    //console.log("ObtienePagosClienteFactura Id_cliente:" + Id_cliente+"|Factura:" +Factura);
    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneFactura(Factura,successFn, errorFN)
{

	var sql =  "SELECT factura, monto_total, id_cliente, tipo_venta FROM ventas WHERE factura=? UNION SELECT factura, monto_total, id_cliente, tipo_venta FROM factura WHERE factura=?";
	
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[Factura, Factura],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneDetalleFactura(Factura,successFn, errorFN)
{

	var sql =  "SELECT A.id_producto, P.codigo_producto , P.nombre_producto ,A.lote, A.precio, SUM(A.monto_subtotal) AS monto_subtotal, SUM(A.monto_total) AS monto_total, SUM(A.cantidad) AS cantidad ,SUM(A.caja) as caja  FROM ( " +
				"SELECT id_producto, cantidad, lote, precio, D.monto_subtotal, D.monto_total, caja "+
				"FROM factura " +
				"	INNER JOIN detalle_factura D ON D.id_venta=factura.id_venta "+
				"WHERE factura=? " +
				"UNION " +
				"SELECT id_producto, cantidad, lote, precio, DV.monto_subtotal, DV.monto_total, caja "+
				"FROM ventas " +
				"	INNER JOIN detalle_venta DV ON DV.id_venta=ventas.id_venta "+
				"WHERE ventas.factura=? " +
				") A INNER JOIN  precios P ON A.id_producto = P.id_producto "+
				"GROUP BY A.id_producto, A.lote, A.precio, P.codigo_producto, P.nombre_producto ";
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[Factura, Factura],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function GuardaFacturas(objVentas, successFn, errorFN)
{
	var sql =  "INSERT INTO factura (	id_venta, id_asignacion_ruta, factura, id_almacen, id_usuario, id_cliente, " + 
			   "						monto_subtotal, monto_total, Monto_iva, Monto_descuento, Monto_otrosdescuentos, " +
			   "						cantidad_productos, status, pagada, longitud, latitude, fecha, hora, enviada, " +
			   "tipo_venta, Id_tipo_credito, requiere_firma)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
	
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[objVentas.id_venta, objVentas.Id_asignacion_Ruta, objVentas.folio, 0, objVentas.Id_usuario, objVentas.id_cliente,
                                       objVentas.subtotal, objVentas.total, objVentas.monto_iva,  objVentas.Monto_descuento, objVentas.Monto_otrosdescuentos,
                                       objVentas.totalCajas, 1, 0, '', '', objVentas.fecha, objVentas.hora, 1,
                                       objVentas.id_tipo_venta, objVentas.Id_tipo_credito, 0],  onSuccessOpenDB, (errorFN != null ? errorFN : onErrorCallBack));
                    
                    sql =  "INSERT INTO detalle_factura (id_venta, id_producto, cantidad, lote, precio, monto_subtotal, " +
					   "monto_total, tipo_captura, Id_unidad_medida, caja, descuento, Monto_iva) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)";
                    
                    for(var i=0; i < objVentas.aProductos.length; i++)
                    {
                    	var o = objVentas.aProductos[i];
                    	
                    	if(i < objVentas.aProductos.length -1)
                    	{                    	
                    		tx.executeSql(sql,[o.Id_venta, o.Id_producto, o.Cantidad, o.Lote, o.Precio, o.subtotal,
                                           o.total, 1, o.id_unidad_medida,  o.CantidadCaja, o.descuento, o.Monto_iva],  
                                           onSuccessOpenDB, (errorFN != null ? errorFN : onErrorCallBack));
                    	} else {
                    		tx.executeSql(sql,[o.Id_venta, o.Id_producto, o.Cantidad, o.Lote, o.Precio, o.subtotal,
                                               o.total, 1, o.id_unidad_medida,  o.CantidadCaja, o.descuento, o.Monto_iva],  
                                               successFn, (errorFN != null ? errorFN : onErrorCallBack));
                    	}
                    }
                }
        );
}
//fin pagos


///Registros
function ObtieneTotalRegistros(successFn, errorFN)
{
    var sql = "SELECT   (Select count(*) From impresion) AS impresion, " +
              "         (Select sum(caja) From almacen_inventario) AS almacen_inventario, "+
              "         (Select count(*) From precios) AS precios,"+
              "         (Select count(*) From clientes) AS clientes, "+
              //"			(Select count(*) From impresion) AS impresion, "+
              "			(SELECT SUM(detalle_venta.cantidad) FROM detalle_venta INNER JOIN ventas ON detalle_venta.id_venta= ventas.id_venta) AS ventas,"+
              "			(SELECT SUM(detalle_venta.cantidad) FROM detalle_venta INNER JOIN ventas ON detalle_venta.id_venta= ventas.id_venta INNER JOIN cancelacionesoffline ON cancelacionesoffline.id_venta=ventas.id_venta) AS cancelaciones "+ //,
              //"			(Select count(*) From motivosnc) AS motivosnc, "+
              //"			(Select count(*) From motivosnv) AS motivosnv "+
              "FROM  usuarios";
         
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}
//////////////////



function ObtieneReporteVentaDiaria(successFn, errorFN)
{
    var sql = "SELECT Id_Usuario, Usuario Vendedor, codigo_ruta AS Ruta, strftime('%Y-%m-%d', 'now') AS Fecha, 'METROPOLITANA' Area, " +
            /*"(SELECT MIN(factura) FROM ventas WHERE ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+") AS Del, " +
            "(SELECT MAX(factura) FROM ventas WHERE ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+") AS Al, " +*/
    		"(SELECT factura FROM ventas WHERE ventas.status="+STATUSVENTAS.ACTIVA+" ORDER BY id_venta ASC LIMIT 0,1) AS Del, " +
    		"(SELECT factura FROM ventas WHERE ventas.status="+STATUSVENTAS.ACTIVA+"  ORDER BY id_venta DESC LIMIT 0,1) AS Al, " + 
            "(SELECT COUNT(id_venta) FROM ventas WHERE ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+") AS Ventas, " +
            "(SELECT COUNT(id_pago) FROM pagos "+
            "	INNER JOIN ventas ON  ventas.factura = pagos.Factura "+
            " WHERE ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+" AND pagos.Id_tipo_pago="+TIPOPAGO.CHEQUE+" AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)) AS Cheques, " +
            /*"(SELECT SUM(monto) FROM pagos "+
            "	INNER JOIN ventas ON ventas.factura=pagos.Factura  "+
            " WHERE ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+" AND pagos.Id_tipo_pago="+TIPOPAGO.CHEQUE+") AS VentaCheques, " +*/
            "IFNULL((SELECT round(SUM(pagos.monto), 2) FROM pagos, ventas "+
            " WHERE ventas.factura=pagos.Factura AND ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+" AND pagos.Id_tipo_pago="+TIPOPAGO.CHEQUE+" AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)), 0.00) AS TotalVentaCheques, " +
            "IFNULL((SELECT round(SUM(monto), 2) FROM pagos "+
            "	INNER JOIN ventas ON ventas.factura=pagos.Factura  "+
            " WHERE ventas.tipo_venta="+TIPOVENTA.VENTA+" AND ventas.status="+STATUSVENTAS.ACTIVA+" AND pagos.Id_tipo_pago="+TIPOPAGO.CASH+" AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)), 0.00) AS TotalVentaEfectivo, " +
            "(SELECT COUNT(id_pago) FROM pagos "+
            " WHERE Factura NOT IN (SELECT factura FROM ventas)  AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)) AS Cobrados, " +
            "(SELECT COUNT(id_pago) FROM pagos "+
            " WHERE Factura NOT IN (SELECT factura FROM ventas) AND Id_tipo_pago="+TIPOPAGO.CHEQUE+" AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)) AS ChequesCobranza, " +
            "IFNULL((SELECT round(SUM(monto), 2) FROM pagos "+
            " WHERE Factura NOT IN (SELECT factura FROM ventas) AND Id_tipo_pago="+TIPOPAGO.CHEQUE+" AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)), 0.00) AS TotalCobranzaCheques, " +
            "IFNULL((SELECT round(SUM(monto), 2) FROM pagos "+
            " WHERE Factura NOT IN (SELECT factura FROM ventas) AND Id_tipo_pago="+TIPOPAGO.CASH+" AND id_pago NOT IN (SELECT id_pago FROM cancelacionpagosoffline)), 0.00) AS TotalCobranzaEfectivo " +
            "FROM usuarios";
    //console.log("ObtieneReporteVentaDiaria sql:" +sql);
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};


function ObtieneReportePagos(successFn, errorFN)
{
    var sql =   "SELECT monto, Factura, strftime('%Y-%m-%d', Fecha) AS Fecha, "+
    		    "		CASE WHEN Id_tipo_pago = "+ TIPOPAGO.CASH  +" THEN 'CASH' "+
    		    "			 WHEN Id_tipo_pago = "+ TIPOPAGO.CHEQUE  +" THEN 'CHEQUE' "+
    		    "       END AS TipoPago " +
            	"FROM pagos " + 
            	"WHERE id_pago not in ( select id_pago from cancelacionpagosoffline)  " +
            	"ORDER BY Id_tipo_pago, Fecha ";
    //console.log("ObtieneReporteVentaDiaria sql:" +sql 4823254);
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};

function ObtieneReporteCredito(successFn, errorFN)
{
    var sql =   "SELECT "+//factura, strftime('%Y-%m-%d', fecha) AS Fecha, "+
    	"		CASE WHEN Id_tipo_credito = "+ TIPOCREDITO.PRODUCTOBUENO  +" THEN 'BUENO' "+
    	"			 WHEN Id_tipo_credito = "+ TIPOCREDITO.PRODUCTOVENCIDO  +" THEN 'VENCIDO' "+
    	"       END AS TipoCredito, D.lote, round(SUM(D.cantidad), 2) as cantidad, round(SUM(D.caja), 2) as caja,I.codigo_producto as  clave, I.nombre_producto as nombre  " +
    			"FROM ventas V " +
    			" INNER JOIN detalle_venta D ON D.id_venta = V.id_venta "+
            	" INNER JOIN precios I ON I.id_producto = D.id_producto "+
            	"WHERE tipo_venta="+ TIPOVENTA.CREDITO + " and V.status = 1" +
            	"  GROUP BY TipoCredito, I.codigo_producto,I.nombre_producto, D.lote";
    	
    			/*"SELECT factura, strftime('%Y-%m-%d', fecha) AS Fecha, "+
    		    "		CASE WHEN Id_tipo_credito = "+ TIPOCREDITO.PRODUCTOBUENO  +" THEN 'BUENO' "+
    		    "			 WHEN Id_tipo_credito = "+ TIPOCREDITO.PRODUCTOVENCIDO  +" THEN 'VENCIDO' "+
    		    "       END AS TipoCredito, D.lote, D.cantidad, D.caja, I.clave, I.nombre " +
            	"FROM ventas V "+
            	" INNER JOIN detalle_venta D ON D.id_venta = V.id_venta "+
            	" INNER JOIN almacen_inventario I ON I.id_producto = D.id_producto "+
            	"WHERE tipo_venta="+ TIPOVENTA.CREDITO +" AND Id_tipo_credito="+TIPOCREDITO.PRODUCTOBUENO+" " +
            	"UNION ALL "+
            	"SELECT factura, strftime('%Y-%m-%d', fecha) AS Fecha, "+
    		    "		CASE WHEN Id_tipo_credito = "+ TIPOCREDITO.PRODUCTOBUENO  +" THEN 'BUENO' "+
    		    "			 WHEN Id_tipo_credito = "+ TIPOCREDITO.PRODUCTOVENCIDO  +" THEN 'VENCIDO' "+
    		    "       END AS TipoCredito, D.lote, D.cantidad, D.caja, I.clave, I.nombre " +
            	"FROM ventas V "+
            	" INNER JOIN detalle_venta D ON D.id_venta = V.id_venta "+
            	" INNER JOIN almacen_malo I ON I.id_producto = D.id_producto "+
            	"WHERE tipo_venta="+ TIPOVENTA.CREDITO +" AND Id_tipo_credito="+TIPOCREDITO.PRODUCTOVENCIDO+" " +
            	";";//"ORDER BY Id_tipo_credito, Fecha";
    			 */
    if(g_isdebug)
    console.log("ObtieneReporteCredito sql:" +sql);
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};


function ObtieneCodigoCliente(successFn, errorFN)
{
    var sql =   "SELECT * "+    		    
            	"FROM codigo_cliente " +
            	"WHERE Predeterminada =?";

    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [1], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};

function ObtieneCodigoClienteByCod(codigo, successFn, errorFN)
{
    var sql =   "SELECT * "+    		    
            	"FROM codigo_cliente " +
            	"WHERE codigoCliente =?";

    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [codigo], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};

function EstableceCodigoCliente(codigo, successFn, errorFN)
{
    var sql =   "UPDATE "+    		    
            	"codigo_cliente " +
            	"SET Predeterminada=1 " +
            	"WHERE codigoCliente =?";

    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [codigo], successFn, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
};

function InsertaCodigoClientes(errorFN) {	
	if(!validateDB())
    {   
        AbreBD();
    }
	
    clienteBD.transaction(
            function(tx){ 
                tx.executeSql("Insert OR ignore Into codigo_cliente (codigoCliente, NombreCliente, Url, Predeterminada, Logo) Values ('1000', 'Rizo Lopez', 'http://rizolopez.no-ip.com/RizoService/RizoService.svc', 0, 'images/DonFrancisco.jpg')", 
                        [], successCB, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert OR ignore Into codigo_cliente (codigoCliente, NombreCliente, Url, Predeterminada, Logo) Values ('2000', 'Rizo Lopez Dist', 'http://rizolopez.no-ip.com/RizoService/RizoService.svc', 0, 'images/DonFrancisco.jpg')", 
                        [], successCB, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert OR ignore Into codigo_cliente (codigoCliente, NombreCliente, Url, Predeterminada, Logo) Values ('3000', 'QuesMex', 'http://quesmex.no-ip.net//RizoService/RizoService.svc', 0, 'images/QuesMex.jpg')", 
                        [], successCB, (errorFN != null ? errorFN : onErrorCallBack));
                tx.executeSql("Insert OR ignore Into codigo_cliente (codigoCliente, NombreCliente, Url, Predeterminada, Logo) Values ('0000', 'Demo', 'http://rizolopez.no-ip.com/RizoService/RizoService.svc', 0, 'images/DonFrancisco.jpg')", 
                        [], successCB, (errorFN != null ? errorFN : onErrorCallBack));
            }
    );
}


function GuardarNotaCredito(objNotaCredito, successFn, errorFN)
{
    var sql = "INSERT OR IGNORE INTO notacredito (id_venta, factura, monto, status) Values (?, ?, ?, ?)";
                       
    if(!validateDB())
    {
        AbreBD();
    }

    clienteBD.transaction(
                function(tx){
                    tx.executeSql(sql,[objNotaCredito.Id_venta, objNotaCredito.Factura, objNotaCredito.Monto, objNotaCredito.Status],  successFn, (errorFN != null ? errorFN : onErrorCallBack));                                   
                }
        );
}

function ObtieneCreditoByCod(invoice, successFn, errorFN)
{
    var sql =   " SELECT ventas.*, IFNULL(notacredito.status, 0) as Aplicada FROM ventas "+
    			"LEFT JOIN notacredito ON notacredito.factura= ventas.factura "+
    			" WHERE tipo_venta = "+TIPOVENTA.CREDITO+" AND ventas.status = 1 "+
    			" AND ventas.factura = '"+ invoice +"' ";

    console.log("ObtieneCreditoByCod sql:" +sql);
    
    if(!validateDB())
    {   
        AbreBD();
    }
    clienteBD.transaction(
            function(tx){   
                tx.executeSql(sql, [], successFn, (errorFN != null ? errorFN : onErrorCallBack));    
            }
    );
};

