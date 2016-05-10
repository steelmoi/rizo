function LoadViewPaymentCustomer() {
	var rst = {Customers: []};
	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait we are getting customer information.");
	LimpiaArray(rptPagos);
	$( "#popupPanel" ).popup( "close" );
	OcultarDiv('aGuardar');
	OcultarDiv('afooter');
	
	loadTemplateHBS('SearchCustomerPay', 'Payments', rst, 
			function() {					
				loadCustomerForPayments();
			}
		);	
}

function loadCustomerForPayments() {	
	var rst = {Customers: []};
	
	ObtieneNegociosCombo(objUsuario.Id_Ruta,FILTER_COMBO,
			function(tx, results)
			{ 
		       //salert(results.rows.length);
				if(results.rows.length>0)
				{
					rst.Customers = convertResult2JsonAray(results);					
				}

				loadPartialTemplateHBS('partial/list-customers', 'customersContent', rst,
					function() {
						objUsuario.operacion = TIPOVENTA.PAYMENTS;
						navigator.notification.activityStop();
						$.mobile.silentScroll(0);
					}
				);
			}
	);
}

function goToPaymentView(id_cliente) {
	MuestraDiv('payments');
	MuestraDiv('aGuardar');
	OcultarDiv('searchCustomer');
	$('#Cliente').val(id_cliente);
	ObtieneCliente(id_cliente);
	aPagos = new Array();
	LimpiaArray(rptPagos);
}

function cancelPayView() {
	MuestraDiv('searchCustomer');
	OcultarDiv('payments');
	aPagos = new Array();
	OcultarDiv('aGuardar');
	clienteSeleccionado = null;
	clearPay();
}

function clearPay() {
	LimpiaArray(rptPagos);
	$('#txtFactura').val('');
	$('#txtNumCheque').val('');
	$('#txtTotal').val('');
	$('#txtMonto').val('');
	$('#txtComentarios').val('');
	BorraGrid('tblPagos');
}

function cmbFiltroPay_Change(cmbFiltro)
{
	
	var all = false;
	if($("#cmbFiltro").val() === 'Otros')
		all = true;
	
	FILTER_COMBO = all;
	
	loadCustomerForPayments("cmbNegocio");
}

function txtFacturaPay_blur()
{
	if($('#txtFactura').val() === '')
		return;
		
	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Invoice ...");
	ObtieneFactura($('#txtFactura').val(),
			function(tx, results)
			{
				if(results.rows.length > 0){
					if(g_isdebug)
						console.log("txtFactura_blur results.rows.item(0).tipo_venta:" + results.rows.item(0).tipo_venta + "objVentas.id_cliente:" + objVentas.objCliente.id_cliente);
					
					if(results.rows.item(0).tipo_venta === TIPOVENTA.VENTA && $('#Cliente').val() ==  results.rows.item(0).id_cliente)
					{
						navigator.notification.activityStop();
						$("#txtMonto").val(results.rows.item(0).monto_total);
						$("#hfTotalFactura").val(results.rows.item(0).monto_total);
						$("#txtTotal").val(results.rows.item(0).monto_total);
						DeshabilitaInput('txtTotal');
					} else {
						navigator.notification.activityStop();
						$("#txtMonto").val("");
						$('#txtFactura').val("");
						$("#hfTotalFactura").val("");
						Alerta("The invoice can not be paid or the invoice is not for this customer");
					}
				}else
					ConsultaFacturaOnLinePay($('#txtFactura').val());
			},
			function()
			{
		
			}
	);
	
}

function ConsultaFacturaOnLinePay(factura)
{
	if(g_isdebug)
		console.log("ConsultaFacturaOnLine factura:"+ factura)
		;
	var wws= new IvanWebService(WSURL); 
    var parameters = new Array("factura", factura, "msj", "");
    
    navigator.notification.activityStop();
    navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Invoices...");
        
    wws.callWCF(METODOS.METODO_OBTENERVENTAS, false, parameters, INTERFAZ_SERVICIO);
    var retVal = false;
    retVal= wws.result;
    
    LeerXmlObtenerVentaPay(retVal);
}

function LeerXmlObtenerVentaPay(xml)
{	
    objVentas = new VENTAS();
    if(g_isdebug)console.log("LeerXmlObtenerVenta xml:" + xml);
	$(xml).find('ObtenerVentasResult').each(			
            function() {            	
            	var Cantidad_cajas = $(this).find('a\\:Cantidad_cajas').text();
            	if(String(Cantidad_cajas.length) > 0)
            	{
            		objVentas.totalCajas = parseFloat(Cantidad_cajas).toFixed(2);
            		objVentas.totalProductos = parseFloat($(this).find('a\\:Cantidad_productos').text()).toFixed(2);
            		objVentas.folio = $(this).find('a\\:Factura').text();
            		var aFecha = String($(this).find('a\\:Fecha_venta').text()).split(' ');
            		objVentas.fecha =  aFecha[0];
            		objVentas.hora = aFecha[1];
            		objVentas.Id_asignacion_Ruta =  parseInt($(this).find('a\\:Id_asignacion_ruta').text());
            		objVentas.id_cliente =  parseInt($(this).find('a\\:Id_cliente').text());
            		objVentas.id_tipo_venta =  parseInt($(this).find('a\\:Id_tipo_venta').text());
            		objVentas.Id_usuario =  parseInt($(this).find('a\\:Id_usuario').text());
            		objVentas.subtotal =  parseFloat($(this).find('a\\:Monto_subtotal').text()).toFixed(2);
            		
            		objVentas.Monto_descuento =  parseFloat($(this).find('a\\:Monto_descuento').text()).toFixed(2);
            		objVentas.monto_iva =  parseFloat($(this).find('a\\:Monto_iva').text()).toFixed(2);
            		objVentas.Monto_otrosdescuentos =  parseFloat($(this).find('a\\:Monto_otrosdescuentos').text()).toFixed(2);
            		objVentas.total =  parseFloat($(this).find('a\\:Monto_total').text()).toFixed(2);
            	}
                
            	 $(this).find('a\\:VentasDet').each(
                 		function() {
			                $(this).find('a\\:VentasDet').each(
			                		function() {
			                			var Id_producto = $(this).find('a\\:Id_producto').text();
			                			if(Id_producto.length > 0)
			                			{
			                				var oProducto  = new PRODUCTO();
			                				
			                				oProducto.Cantidad = parseFloat($(this).find('a\\:Cantidad').text());
			                				oProducto.CantidadCaja = parseFloat($(this).find('a\\:Cajas').text());
			                				oProducto.Id_producto = parseInt(Id_producto);
			                				oProducto.Lote = $(this).find('a\\:Lote').text();
			                				oProducto.Precio = parseFloat($(this).find('a\\:Precio_unitario').text());
			                				oProducto.subtotal = parseFloat($(this).find('a\\:Monto_subtotal').text());
			                				oProducto.total = parseFloat($(this).find('a\\:Monto_total').text());
			                				oProducto.tipo_captura =  1;
			                				oProducto.id_unidad_medida = parseInt($(this).find('a\\:Id_unidad_medida').text());
			                				oProducto.descuento = parseFloat($(this).find('a\\:Monto_descuento').text());
			                				oProducto.Monto_iva = parseFloat($(this).find('a\\:Monto_iva').text());
			                				oProducto.Id_venta = parseInt($(this).find('a\\:Id_venta').text());

			                				objVentas.id_venta = oProducto.Id_venta; 
			                				
			                				ObtienePrecioProducto(parseInt(Id_producto), objUsuario.id_distribuidor,
			                			            function(tx, results)
			                			            {
			                			    			if(g_isdebug)
			                			    				console.log("BuscaPrecioEnLista len:" + results.rows.length);
			                			                if(results.rows.length > 0)
			                			                { 
			                			                	if(g_isdebug)
				                			    				console.log("BuscaPrecioEnLista clave:" +  results.rows.item(0).codigo_producto + "nombre:" + results.rows.item(0).nombre_producto );
				                			                
			                			                	
			                			                	oProducto.Clave = results.rows.item(0).codigo_producto;
			                			                	oProducto.Nombre_producto = results.rows.item(0).nombre_producto;
			                			                }
			                			            });
			                				AgruparProductos(oProducto, false);
			                				objVentas.aProductos.push(oProducto);
			                			}
			                		}
			                )
                 		}
                 	)
            }
     );
	
	DeshabilitaInput('txtTotal');
	if(objVentas && objVentas.aProductos.length > 0)
	{
		GuardaFacturas(objVentas,
			function() {
			navigator.notification.activityStop();
			    console.log(objVentas.id_tipo_venta + "|" + TIPOVENTA.VENTA);
				if(objVentas.id_tipo_venta === TIPOVENTA.VENTA)
				{
					if(objVentas.id_cliente === clienteSeleccionado.id_cliente)
					{
						$("#txtMonto").val(objVentas.total);
						$("#hfTotalFactura").val(objVentas.total);
						$("#txtTotal").val(objVentas.total);
					} else {
						$("#txtMonto").val("");
						$('#txtFactura').val("");
						$("#hfTotalFactura").val("");
						Alerta("The invoice can not be paid or the invoice is not for this customer");
					}
				} else {
					$("#txtMonto").val("");
					//PosicionarOption("cmbNegocioPagos", 0);
					$("#hfTotalFactura").val("");						
					$("#txtFactura").val("");
					$("#txtTotal").val("");
					Alerta("The movement there is not exist or is not an invoice.");
				}
			}
		);
	} else
	{
		navigator.notification.activityStop();
		var r = confirm("Invoice there is not exist\n do you want pay?");
		if(r)
		{
			HabilitaInput('txtTotal');
			setFocus('txtTotal');
		}
	}
}


function btnAddPay_Click()
{
	if($("#txtFactura").val() == '')
	{
		Alerta('Type a invoice');
		setFocus('txtFactura');
		return;
	}
	
	if($("#txtTotal").val() == '')
	{
		Alerta('Type an Total');
		setFocus('txtTotal');
		return;
	}

	if(isNaN($("#txtTotal").val()))
	{
		Alerta('Type a correct total');
		setFocus('txtTotal');
		return;
	}

	if(parseFloat($("#txtTotal").val()) <= 0.00)
	{
		Alerta('The Total can not 0 or less than 0');
		setFocus('txtTotal');
		return;
	}
	

	if($("#txtMonto").val() == '')
	{
		Alerta('Type an amount');
		setFocus('txtMonto');
		return;
	}

	if(isNaN($("#txtMonto").val()))
	{
		Alerta('Type a correct amount');
		setFocus('txtMonto');
		return;
	}

	if(parseFloat($("#txtMonto").val()) <= 0.00)
	{
		Alerta('The amount can not 0 or less than 0');
		setFocus('txtMonto');
		return;
	}
	
	if(parseFloat($("#txtMonto").val()) > parseFloat($("#txtTotal").val()) )
	{
		Alerta('The Amount can not less than the Total');
		setFocus('txtTotal');
		return;
	}
	

	if($("#cmbTipoPago").val() == '')
	{
		Alerta('Select a type');
		setFocus('cmbTipoPago');
		return;
	}

	if($("#cmbTipoPago").val() == '2')
	{
		if($('#txtNumCheque').val() == '')
		{
			Alerta('Type a code customer');
			setFocus('cmbTipoPago');
			return;
		}
	}
	
	var objPago = new PAGO();
	var strFechaActual = FechaActual();
	var aFecha = strFechaActual.split(' ');
	
	var aPagosConf = new Array();
	aPagosConf = String($("#hfPagos").val()).split('@');

	objPago.Enviada = 0;
	objPago.Fecha = aFecha[0];
	objPago.Hora = aFecha[1];		
	objPago.id_pago = 0;
	if(g_isdebug) console.log("btnAgregarPago_Click TIPOVENTA.VENTA:" + TIPOVENTA.VENTA + "|pagosVentas:" + (objVentas ? objVentas.pagosVentas : "N/A"));
	/*if(objVentas != null && objVentas.pagosVentas === TIPOVENTA.VENTA)
		objPago.codigo_cliente =objVentas.objCliente.codigo_cliente; 
	else*/
	objPago.codigo_cliente = '';

	objPago.objPagosRuta.Comentarios = $("#txtComentarios").val();
	objPago.objPagosRuta.Factura = $("#txtFactura").val();
	objPago.objPagosRuta.Fecha_creacion = strFechaActual;
	objPago.objPagosRuta.Id_asignacion_ruta = objUsuario.Id_asignacion_Ruta;
	objPago.objPagosRuta.Id_cliente = parseInt($("#Cliente").val());
	objPago.objPagosRuta.Id_distribuidor = objUsuario.id_distribuidor;
	objPago.objPagosRuta.Id_tipo_pago = parseInt($("#cmbTipoPago").val());
	objPago.objPagosRuta.Numero_cheque = $('#txtNumCheque').val();
	objPago.objPagosRuta.Id_usuario = objUsuario.Id_Usuario;
	objPago.objPagosRuta.Monto = parseFloat($("#txtMonto").val()).toFixed(2);
	objPago.monto_total = parseFloat($("#txtTotal").val()).toFixed(2);

	if(g_isdebug)console.log("btnAgregarPago_Click iniciando proceso");	

	//objPago.monto_total = parseFloat(aPagosConf[2]).toFixed(2);
	aPagos[aPagos.length] = objPago;
	aPagos[aPagos.length-1].id = aPagos.length-1;
	if(g_isdebug)console.log("btnAgregarPago_Click es venta");

// valida si la factura ya tiene un pago y si es asi cuanto lleva
	var totalPagos = parseFloat(ValidaTotalPago(objPago.objPagosRuta.Factura)).toFixed(2);
	if(g_isdebug)console.log("btnAgregarPago_Click validando importe objVentas.total:" + objVentas.total+"|totalPagos:" +totalPagos);
	if(g_isdebug)console.log("btnAgregarPago_Click aPagos.length:" + aPagos.length);
	var montoPagar = parseFloat($('#txtTotal').val());
	if(totalPagos <= montoPagar)
	{
		if(g_isdebug)console.log("btnAgregarPago_Click aPagos.length:" + aPagos.length);
		ListaPagoscliente();
		clearPayForm()
	}
	else
	{
		if(g_isdebug)console.log("btnAgregarPago_Click aPagos.length:" + aPagos.length);
		aPagos = aPagos.slice(0,aPagos.length-1);
		if(g_isdebug)console.log("btnAgregarPago_Click aPagos.length:" + aPagos.length);
		Alerta("The amount of this invoice : " + objPago.objPagosRuta.Factura +"\n can not more than: "+ objVentas.montoPagar);
		return;
	}
}

function clearPayForm() {
	$("#txtMonto").val("");
	$("#hfTotalFactura").val("");						
	$("#txtFactura").val("");
	$("#txtTotal").val("");
	DeshabilitaInput('txtTotal');
}

function btnPrintPagos_click() {
	if(rptPagos.length > 0 )
		Impresion();
	else
		Alerta("first save the pay");
}
