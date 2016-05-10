//Variable Globales
var objUsuario;
var objPrecios;
var objUsuarioPrevio = null;
var aEntidades = new Array();
var aEntidadesEnBD = new Array();
var aImpresion = new Array();
var aImpresoras = new Array();

var g_enviando = true;
var g_socketid = -1;
var g_bluetoothPlugin = null;
var estaImpreso = false;

var PosicionObtenida=0; // Bandera Para Posicion Obtenida
var PosicionGPS; // Variable que contiene los valores actuales del GPS

//variables  ocupadas temporalmente para las ventas
var clienteSeleccionado =  null;
var productoSeleccionado = null;
var objVentas = null;
var aPagos = new Array();
var rptPagos = new Array();

var curWindow = '';
var g_isdebug = false;
var g_imei = '99000334832640';
var g_procesando_venta = false;
var g_procesando_pagos = false;

var g_socketid = -1;

var ONLINE = 1;
var g_buscarImpresora = false;
var estaConectado = false;

var timerFunction = null;
var offlineFunction = null;

var otroCliente = false;
var linea = "--------------------------------------------------------------------";
//var _imprimir = 0;
//Eventos
var g_procesando_transaccion = false;
var preimpresion = false;
var oClienteApp = null;

function BTConectado()
{
	navigator.notification.activityStart(NOMBRE_APLICACION, "Search Devices.");
	if(g_buscarImpresora)
		g_bluetoothPlugin.discoverDevices(BTDispositivos, BTSinDispositivos);
}

function BTFalla()
{
	alert('Error enabling BT: ' + error);
}

function BTDispositivos(devices)
{
	navigator.notification.activityStop();
	$('#bt-devices-select').html('');

	for ( var i = 0; i < devices.length; i++)
	{
		$('#bt-devices-select').append(
				$('<option value="' + devices[i].address + '">'
						+ devices[i].address + " (" + devices[i].name+ ")" + '</option>'));
	}
	PosicionarOption("bt-devices-select", 0);
}

function BTSinDispositivos(error)
{
	navigator.notification.activityStop();
	alert('Error: ' + error);
}

function btnEntrar_Click()
{
    var txtUsuario = document.getElementById('txtUsuario');
    var txtPassword = document.getElementById('txtPassword');    
    var pendientes = false;
    
    
    if(txtUsuario.value === CADENAVACIA)
    {
        Alerta('Type a user');        
        setFocus('txtUsuario');
        return;
    }
    if(txtPassword.value === CADENAVACIA)
    {
        Alerta('Type password');        
        setFocus('txtPassword');
        return;
    }
    
    objUsuario = new USUARIO();
    if(objUsuario != null)
    {
        navigator.notification.activityStart(NOMBRE_APLICACION, "Log In....");          

        objUsuario.Clave = txtUsuario.value;        
        objUsuario.Password = txtPassword.value;            

        if(objUsuarioPrevio.loggueado)
        {
            if(objUsuarioPrevio.usuarioPrevio.impresora != undefined && objUsuarioPrevio.usuarioPrevio.impresora != null)
                objUsuario.impresora = objUsuarioPrevio.usuarioPrevio.impresora;
            else
                objUsuario.impresora = '';
        }else
            objUsuario.impresora = '';
        
        document.addEventListener("online", onOnline, false);
        
        if(ONLINE==1)
        {
        	/**
        	 *Casos de inicio de sesion: 
        	 * Caso 1: Nadie se ha logueado, lo que procede es descargar todo de forma normal
        	 */
        	if(objUsuarioPrevio.usuarioPrevio.Id_Usuario === 0)
        	{           
        		ConsultaAsignacionRutaUsuarios(objUsuario.Clave, objUsuario.Password, pendientes);
        	}else
        	{
        		IniciaOffline();          
        	} 
        }else {
        	if(objUsuarioPrevio.usuarioPrevio.Id_Usuario === 0)
        	{
        		navigator.notification.activityStop();
        		Alerta("Internet services unable");        		
        		return;
        	}
        	IniciaOffline();
        }
    }
}

function btnSync_click()
{
	var rst = {};
	OcultarDiv('afooter');
	resetOptionConf();
	rst.options = offline_menu;
	
	loadTemplateHBS('partial/Sync', TITULOS.SYNC, rst,
    		function()
    		{
				$( "#popupPanel" ).popup( "close" );
				
				$( "#tblInventario" ).table( "refresh" );
    		}
    );
}

function btnSyncData_Click()
{
	var total = 0;
	$("input:checkbox:checked").each(function(){
		total++;
	});
	
	if(total === 0)
	{
		Alerta("Select an option");
		return;
	}
    ReseteaContadorRegistros();
    objUsuario.downloadManual = true;
    errorNetwork = false;
    summary = "";
	$("input[type=checkbox]:checked").each(function(){
		var option = _.first(_.where(offline_menu, {name: $(this).val()}));
		
		if(option && !errorNetwork)
		{
			navigator.notification.activityStart(NOMBRE_APLICACION, "Sync: " +  option.label);
			switch(option.catalog)
			{
				case 'Parameter':
					ConsultarObtenerCompania(objUsuario.id_compania || 1);
					break;
				case 'Inventory':
					ConsultaAlmacenInventario(objUsuario.Id_asignacion_Ruta);
					break;
				case 'Precio':
					ConsultaListasPrecios(objUsuario.id_distribuidor);
					break;
				case 'Impresion':
					ConsultarInformacionImpresion(objUsuario.id_distribuidor);
					break;
				case 'Negocios':
					ConsultaNegociosXDia(objUsuario.id_distribuidor);
					break;
					
			}
		}
	});
	
	errorNetwork = false;
}



function btnVentas_Click(tipo_venta)
{	
	FILTER_COMBO = false;
    var titulo = '';
    if(objUsuario== null)
    	alert("Nulo");
    else
    	objUsuario.operacion = parseInt(tipo_venta);    

    switch(parseInt(objUsuario.operacion))
    {
	    case TIPOVENTA.VENTA:
	    	Controlali('ulvta',1,'inline');
	    	Controlali('ulvta',2,'inline');
	    	titulo = TITULOS.VENTAS;
	    	break;
	    case TIPOVENTA.DEMO:
	    	Controlali('ulvta',1,'none');
	    	Controlali('ulvta',2,'none');
	    	titulo = TITULOS.DEMO;
	    	break;    
	    case TIPOVENTA.CREDITO:
	    	Controlali('ulvta',1,'none');
	    	Controlali('ulvta',2,'none');
	    	titulo = TITULOS.CREDITO;
	    	break;
	    case TIPOVENTA.PROMOCION:
	    	Controlali('ulvta',1,'none');
	    	Controlali('ulvta',2,'none');
            titulo = TITULOS.PROMOCION;
            break;
    }
    
  
    /*
    if(curWindow == VENTANAS[0])
    {
    	  if(g_isdebug)
		    	console.log("curWindow :" + curWindow);
    	  
    	$("#spVentas").text(titulo);
    	GPSgetCurrentPosition();
    	$( "#popupPanel" ).popup( "close" );
    	LimpiarVenta(null);
   
    	MuestraDiv('clientesVentas');
    	OcultarDiv('vtaPrincipal');
    	OcultarDiv('divTipoProducto');
    	OcultarDiv('divTipoCredito');
    	OcultarDiv('vtaAuxiliar');
   
    	
    	//Si es demo se pone visible la opcion rizo/otro
        if(objUsuario.operacion == TIPOVENTA.DEMO)
        {
     	   ControlaCheckbox('rbRizo', true);
     	   MuestraDiv('divTipoProducto');
        }else if(objUsuario.operacion == TIPOVENTA.CREDITO)
            MuestraDiv('divTipoCredito');              
        
    	return;
    }
    */
    ControlaDiv(VENTANAS[0], titulo,
            function()
            {
    			
    			MuestraDiv("productAdd");		
    			//MuestraDiv("productPay");
    			
		    	OcultarDiv("productPay");
		    	OcultarDiv("ventas_pagos");
		
    			$( "#popupPanel" ).popup( "close" );
                GPSgetCurrentPosition();
                //LlenaComboProductos('cmbProducto');
                LlenaListaClientesVentasNegocios('cmbNegocio');
               // LlenaComboNegocios('cmbNegocio', false);
                                
                LimpiarVenta(null);
                LlenaComboImpresion();
               //$("#txtCodigoBarras").val("12150/3AY-334/5");//TODO:QUITAR
                
                drawGridSale('tblVentas', objVentas.aProductos ? objVentas.aProductos : []);
               
               //Si es demo se pone visible la opcion rizo/otro
               if(objUsuario.operacion == TIPOVENTA.DEMO)
               {
            	   ControlaCheckbox('rbRizo', true);
            	   MuestraDiv('divTipoProducto');
               }else if(objUsuario.operacion == TIPOVENTA.CREDITO)
            	   MuestraDiv('divTipoCredito'); 
                //else if(objUsuario.operacion == TIPOVENTA.VENTA)
                   //MuestraDiv('divNotaCredito');
            }
    );
	
    MuestraDiv('divTipoCredito');
}

function btnSearchInvoice_Click()
{
	OcultarDiv("aGuardar");
	OcultarDiv("afooter");
	var dtSource = {};
	
	loadTemplateHBS("SearchInvoice", TITULOS.SEARCHINVOICE, dtSource, 
			function()
    		{
				objUsuario.operacion = TIPOVENTA.SEARCHINVOICE;
				$( "#popupPanel" ).popup( "close" );
    		}
	);
}

function optNC_click()
{
	  var total = 0;
	var chNC = $("#optNC");
	
	//si no ha seleccionado ningun cliente no hace nada
	if(negocioSeleccionado == null)
	    return;
	
	if (chNC.is (':checked'))
	{
		var cantidad = -1;
		var montoTotal = 0.0;
	//	do{
			var invoice = 0;
			var mensaje = 	//objProducto.Nombre_producto + "\n" +
							"Type Invoice: \n";
			invoice = prompt(mensaje, "");
			//Cancel
			if(cantidad == null)
				return false;
			if(isNaN(cantidad))
				cantidad = -1;
		
			if(g_isdebug)
				console.log("NotaCredito Invoice:" + invoice + "|Cantidad:" + cantidad);
		   if(invoice != null)
			   {
			   
			ObtieneCreditoByCod(invoice, 
				function(tx, results)
				{
				 total = results.rows.length;
				 
				 if(g_isdebug)
					console.log("NotaCredito Total:" + total);						
						if(total > 0) 
						{
							if(clienteSeleccionado.id_cliente === results.rows.item(0).id_cliente)
							{
								if(results.rows.item(0).Aplicada === 0)
								{
									for(var i=0; i < total; i++)
									{
										cantidad = parseFloat(results.rows.item(i).monto_total);

										if(g_isdebug)
											console.log("NotaCredito Invoice:" + invoice + "|Cantidad:" + cantidad + "|Total:" + total + "|objVentas.total:" + objVentas.total);

										if(objVentas.total >= cantidad)
										{
											if(objVentas != null)
											{
												var amountPay = objVentas.total - cantidad;
												objVentas.notaCredito = 1;
												objVentas.importeNC = cantidad *-1;
												objVentas.Reference = invoice;
												objVentas.montoPagar = parseFloat(amountPay).toFixed(2);
												$("#txtRef").val(invoice);								    	    
												$("#txtNC").val(objVentas.importeNC);
												$("#txtAmountPay").val(parseFloat(amountPay).toFixed(2));
											} 
										}
										else
										{
											$("#optNC").prop( "checked" , false).checkboxradio('refresh');
											var _total = isNaN(objVentas.Monto_total) ? 0 : objVentas.Monto_total;
											Alerta("The amount credit: $" + cantidad + "can not be more than the total invoice $" + _total );
										}

									}
								} else {
									Alerta('The credit was applied');
								}
							} else {
								Alerta('The credit is not for this customer');
							}
			             } else {
			            	 (g_isdebug)
						 		console.log("optNC is:" + chNC.is( ":checked" ) + "optNC prop" + chNC.prop( "checked" ));		
			            	 
			            	 //if(chNC.is( ":checked" ))
			            		 	$("#optNC").prop( "checked" , false).checkboxradio('refresh');
			            	 Alerta('Codigo no valido');
							
							
						}
					}
				);
			
			
			   }
		   		else
		   		{
		   			//if(chNC.is( ":checked" ))
		   				$("#optNC").prop( "checked" , false).checkboxradio('refresh');
		   		}
		   
		//}while(cantidad > 0 );// || cantidad > objProducto.Cantidad);
		
		
		//if(cantidad > 0)
			//{
				
		
			//}
		}
		else
		{
			navigator.notification.confirm(
					' \n The credit will be delete of the invoice.\n Do you want continue?',
					function(buttonIndex){				
						if(buttonIndex == 1)
						{					
							objVentas.notaCredito = 0;
							objVentas.importeNC = 0.0;
							objVentas.Reference = '';
							objVentas.montoPagar = parseFloat(objVentas.total).toFixed(2);
							$("#txtRef").val("0.00");							
							$("#txtNC").val("0.00");
					    	$("#txtAmountPay").val(parseFloat(objVentas.total).toFixed(2));
					    	$("#optNC").prop( "checked" , false).checkboxradio('refresh');
					    	
						}
						else
						{
							$("#optNC").prop( "checked" , true).checkboxradio('refresh');
						}
					},
					NOMBRE_APLICACION,
					'Yes,No'
			);
		}
	
}


function GetMensaje()
{
	
	
	}

function SearchInvoice()
{
	var num_invoice =  $("#txtInvoice").val();
	
	if(String(num_invoice).length === 0)
	{
		Alerta("Proporcione un numero de invoice");
		return;
	}
	
	navigator.notification.activityStart(NOMBRE_APLICACION, "Get Information...");
	ObtieneFactura(num_invoice,
			function(tx, results)
			{
				if(results.rows.length > 0){
					if(results.rows.item(0).tipo_venta === TIPOVENTA.VENTA)
					{
						objVentas = new VENTAS();
						objVentas.folio = results.rows.item(0).factura;
						objVentas.id_tipo_venta = results.rows.item(0).tipo_venta;
						objVentas.total = results.rows.item(0).monto_total;
						objVentas.montoPagar = results.rows.item(0).monto_total;
						objVentas.id_cliente = results.rows.item(0).id_cliente;
						objVentas.objCliente = new CLIENTE();
						objVentas.objCliente.id_cliente = results.rows.item(0).id_cliente;
						ObtieneDetalleFactura(num_invoice, 
								function (txt, result)
								{
									for(var j=0; j < result.rows.length; j++)
									{
										var oProduct = new PRODUCTO();
										oProduct.Id_producto = result.rows.item(j).id_producto;
										oProduct.Cantidad = parseFloat(result.rows.item(j).cantidad).toFixed(2);
										oProduct.Lote = result.rows.item(j).lote;
										oProduct.Precio = parseFloat(result.rows.item(j).precio).toFixed(2);
										oProduct.subtotal = parseFloat(result.rows.item(j).monto_subtotal).toFixed(2);
										oProduct.total = parseFloat(result.rows.item(j).monto_total).toFixed(2);
										oProduct.CantidadCaja = result.rows.item(j).caja;
										
										if(g_isdebug)
											console.log("ObtieneDetalleFactura Clave:" + result.rows.item(j).codigo_producto + "|Nombre_producto:" + result.rows.item(j).nombre_producto);
										oProduct.Clave = result.rows.item(j).codigo_producto;
										oProduct.Nombre_producto = result.rows.item(j).nombre_producto;
        			                	
										objVentas.aProductos.push(oProduct);
									}
									GotoSaleWindow();
								}
						);
						
					} else {
						navigator.notification.activityStop();
						$("#txtInvoice").val("");						
						Alerta("This invoice is not a Sale");
					}
				}else
					ConsultaFacturaOnLine(num_invoice);
			},
			function()
			{
		
			}
	);	
}

function GotoPayFromSale()
{
	$("#hfPagos").val(objVentas.id_cliente+'@'+objVentas.folio+'@'+objVentas.total);
	objUsuario.operacion = TIPOVENTA.SEARCHINVOICE;
	$("#hfTotalFactura").val(objVentas.total);
	btnPagos_Click(objVentas.id_cliente, objVentas.folio, objVentas.total);	
}

function GotoSaleWindow()
{
	navigator.notification.activityStop();
	ControlaDiv(VENTANAS[0], TITULOS.VENTAS,
            function()
            {
				OcultarDiv("aGuardar");
				OcultarDiv("clientesVentas");
				OcultarDiv("productAdd");
				MuestraDiv("ventas_");
				MuestraDiv("productPay");
    			$( "#popupPanel" ).popup( "close" );
                GPSgetCurrentPosition();					                
                
                LlenaListaClientesVentasNegocios('cmbNegocio');
                
                drawGridSale('tblVentas', objVentas.aProductos ? objVentas.aProductos : []);
                $("#txtFactura").val(objVentas.folio);
               
               //Si es demo se pone visible la opcion rizo/otro
               if(objUsuario.operacion == TIPOVENTA.DEMO)
               {
            	   ControlaCheckbox('rbRizo', true);
            	   MuestraDiv('divTipoProducto');
               }else if(objUsuario.operacion == TIPOVENTA.CREDITO)
                   		MuestraDiv('divTipoCredito');
               //else if(objUsuario.operacion == TIPOVENTA.VENTA)
              		//MuestraDiv('divNotaCredito');
            }
    );	
}

function btnRptVentasDiarias_click()
{
	var rst ={};
	rst.GranTotalC = 0;
	rst.GranTotal  = 0;
	OcultarDiv('afooter');
	ObtieneReporteVentaDiaria(
			function(txt, result)
			{
				if(result.rows.length)
					rst = result.rows.item(0);
				else
					rst = {};
				if(g_isdebug) console.log(JSON.stringify(rst));
				rst.TotalVenta 		= parseFloat(rst.TotalVentaCheques + rst.TotalVentaEfectivo).toFixed(2);
				rst.CobranzaVenta 	= parseFloat(rst.TotalCobranzaCheques + rst.TotalCobranzaEfectivo).toFixed(2);
				rst.TotalCheques 	= parseFloat(rst.TotalVentaCheques +rst.TotalCobranzaCheques).toFixed(2);
				rst.TotalEfectivo 	= parseFloat(rst.TotalVentaEfectivo + rst.TotalCobranzaEfectivo).toFixed(2);
				rst.GranTotal 		= parseFloat(parseFloat(rst.TotalVenta) + parseFloat(rst.CobranzaVenta)).toFixed(2);
				rst.GranTotalC		= rst.ChequesCobranza +rst.Cheques;
				if(g_isdebug) console.log(JSON.stringify(rst));
				loadTemplateHBS('rptVentaDiaria', TITULOS.RPTVENTASDIA, rst,
			    		function()
			    		{
							$( "#popupPanel" ).popup( "close" );
			    		}
			    );
			}
	);
}

function btnRptPagos_click()
{
	var rst ={};
	rst.Pagos = [];
	rst.NoTotalCheques = 0;				
	rst.TotalCheques = 0;				
	rst.TotalEfectivo = 0;				
	rst.GranTotal = 0;
	   
	OcultarDiv("aGuardar");
	OcultarDiv("afooter");

	ObtieneReportePagos(
			function(txt, result)
			{
				if(result.rows.length)
				{
					for(var i=0; i < result.rows.length; i++)
					{
						var row = result.rows.item(i);
						rst.Pagos.push({'Factura': row.Factura, 'monto': parseFloat(row.monto).toFixed(2), 'TipoPago':row.TipoPago, 'Fecha': row.Fecha});
					}
				}
				
				var aEfectivo = _.where(rst.Pagos, {TipoPago : 'CASH'});
				_.each(aEfectivo, 
					function(pago){
						rst.TotalEfectivo += parseFloat(pago.monto);
					}
				);
				rst.TotalEfectivo = parseFloat(rst.TotalEfectivo).toFixed(2);
				
				var aCheque = _.where(rst.Pagos, {TipoPago : 'CHEQUE'});
				_.each(aCheque, 
					function(pago){
						rst.TotalCheques += parseFloat(pago.monto);
					}
				);
				rst.TotalCheques = parseFloat(rst.TotalCheques).toFixed(2);

				rst.NoTotalCheques = aCheque.length;
				rst.GranTotal = parseFloat(parseFloat(rst.TotalCheques) + parseFloat(rst.TotalEfectivo)).toFixed(2);

				loadTemplateHBS('rptPagos', TITULOS.RPTPAGOS, rst,
			    		function()
			    		{
							$( "#popupPanel" ).popup( "close" );
			    		}
			    );
			}
	);
}

function btnRptCreditos_click() {
	var rst ={};
	rst.CreditosBuenos = [];
	rst.CreditosMalos = [];
	rst.cantBueno = 0.0;
	rst.cajasBueno = 0.0;
	rst.cantMalo = 0.0;
	rst.cajasMalo = 0.0;
	OcultarDiv('afooter');   
	ObtieneReporteCredito(
			function(txt, result)
			{
				if(result.rows.length)
				{
					var r = convertResult2JsonAray(result);
					rst.CreditosBuenos = _.where(r, {TipoCredito : 'BUENO'});
					rst.CreditosMalos = _.where(r, {TipoCredito : 'VENCIDO'});
					
					 if(g_isdebug)
						 console.log(JSON.stringify(rst));
					
					if(rst.CreditosBuenos.length > 0)
					{
							rst.cantBueno = (rst.CreditosBuenos).map(function(item){return item.cantidad;}).reduce(function(memo, n){return memo +n;})
							rst.cajasBueno = (rst.CreditosBuenos).map(function(item){return item.caja;}).reduce(function(memo, n){return memo +n;})	
					}
					
					if(rst.CreditosMalos.length > 0)
					{
		    		rst.cantMalo = (rst.CreditosMalos).map(function(item){return item.cantidad;}).reduce(function(memo, n){return memo +n;})
		    		rst.cajasMalo = (rst.CreditosMalos).map(function(item){return item.caja;}).reduce(function(memo, n){return memo +n;})	
		    		if(g_isdebug)
					 console.log("btnRptCreditos_click  rst.cantMalo:" + rst.cantMalo + " rst.cajasMalo:" + rst.cajasMalo);
				
		    		
					}
				}
				
				loadTemplateHBS('rptCreditos', TITULOS.RPTCREDITOS, rst,
			    		function()
			    		{
							$( "#popupPanel" ).popup( "close" );
			    		}
			    );
			}
	);
}

function btnAccounts_Click()
{	
	var rst = {accounts: []};
	MuestraDiv("aMenu");
	OcultarDiv("aGuardar");	
	//MuestraDiv("clientesVentas");
	
	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait we are getting the information!.");
	loadTemplateHBS('Accounts', 'ACCOUNTS', rst, 
		function(){
			ObtieneNegociosCombo(objUsuario.Id_Ruta,FILTER_COMBO,
					function(tx, results)
					{
						$( "#popupPanel" ).popup( "close" );
						rst.accounts = convertResult2JsonAray(results);
						loadPartialTemplateHBS('partial/list-account', 'list-accounts', rst, undefined);
						navigator.notification.activityStop();
					}, null
			);
		}
	);	
}

function LlenaListaClientesVentasNegocios(nombreCombo)
{
	var theme = 'b';
	var podcastList = "";
	var count =  0, pos=0;
	
	var combo = '#'+nombreCombo;
	
	var sel = $(combo);
    
	
	$(combo).html('');	
	$(combo)[0].options.length = 0;
	$(combo).empty();
	 $('option', combo).remove();
	$(combo).append($('<option selected="selected" value="">Select a customer</option>'));	
	
	count =  $('#lvClienteVentas li').size();
	
	if(count > 0)
	{
		$("#lvClienteVentas").find("li").remove();
		$("#lvClienteVentas").listview("refresh");
	}
	
	MuestraDiv("aMenu");
	//OcultarDiv("btnBack");
	OcultarDiv("aGuardar");
	//OcultarDiv("aImprimir");
	//OcultarDiv("btnCancel");
	
	//OcultarDiv("ventas");
	if(objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
		MuestraDiv("clientesVentas");
	else
		MuestraDiv("vtaPrincipal");
	
	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait we are getting customer information.");	
	ObtieneNegociosCombo(objUsuario.Id_Ruta,FILTER_COMBO,
			function(tx, results)
			{ 
		       //salert(results.rows.length);
				if(results.rows.length>0)
				{					
					for ( var i = 0; i < results.rows.length; i++)
					{											
						$(combo).append(
								$('<option value="' + results.rows.item(i).id_cliente + '">'
										+ results.rows.item(i).id_cliente+'/'+ results.rows.item(i).Nombre + '</option>'));
												
						if(objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
						{
							podcastList += '<li data-theme="'+theme+'"><a href="#" onClick="btnClienteVentaDetalle('+results.rows.item(i).id_cliente+');"> ' +//<img src="./images/clientes.ico">								
							//'<p><strong>' + String(results.rows.item(i).id_cliente) +'/'+  String(results.rows.item(i).Nombre) +'</strong></p>'+
							'<h1>' + String(results.rows.item(i).id_cliente) +'/'+  String(results.rows.item(i).Nombre) +'</h1>'+
							'<p><br><strong>' + results.rows.item(i).domicilio +'</strong></p>';	
							 podcastList += '</a></li>';
						}
						  if(g_isdebug)
						    	console.log("ObtieneNegociosCombo podcastList:" + podcastList);
					}
					
					$("lvClienteVentas").empty();
					$('#lvClienteVentas').append(podcastList);							
					$('#lvClienteVentas').listview('refresh');					
				}
				navigator.notification.activityStop();
				
				if(objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
					PosicionarOption(nombreCombo, pos);
				else
					PosicionarOptionXValue(nombreCombo, objVentas.id_cliente);
				//LimpiarVenta(null);
			}, null
	);	
}


function btnClienteVentaDetalle(id_negocio)
{
	OcultarDiv("clientesVentas");
	
	MuestraDiv('vtaPrincipal');
	MuestraDiv("aMenu");
	MuestraDiv("aGuardar");	
	MuestraDiv('afooter');	
	//OcultarDiv("aImprimir");
	//OcultarDiv("btnCancel");
	
	negocioSeleccionado = false;
	PosicionarOptionXValue("cmbNegocio", id_negocio);
	cmbNegocio_Change(document.getElementById("cmbNegocio"));

	// Buscar Credito.
	
	drawGridSale('tblVentas', objVentas.aProductos ? objVentas.aProductos : []);
	$.mobile.silentScroll(0);
}

function cmbFiltro_Change(cmbFiltro)
{
	
	var all = false;
	if($("#cmbFiltro").val() === 'Otros')
		all = true;
	
	FILTER_COMBO = all;
	
	if(g_isdebug)
		console.log("cmbFiltro_Change:" + FILTER_COMBO);
	
   LlenaListaClientesVentasNegocios("cmbNegocio");
}

function cmbNegocio_Change(combo)
{	
    var index = combo.selectedIndex; 
	if(index > 0)
	{
		//si hay un negocio seleccionado, se manda la advertencia
		if(clienteSeleccionado !== null)
		{
			//Si es el mismo negocio seleccionado no hace nada
			
			if(clienteSeleccionado.id_cliente === combo.value)
			{
				return;
			}
			//si hay productos en el grid que pregunte si se borra o no
			if(objVentas != null && objVentas.aProductos.length >0)
		    {
    			navigator.notification.confirm(
    					'If you change the customer, \n All the information will be delete.\n Do you want continue?',
    					function(buttonIndex){				
    						if(buttonIndex == 1)
    						{							
    							LimpiarVenta(null);
    							objVentas = new VENTAS();
    							//objVentas.tipo_venta = objUsuario.operacion;
    							objVentas.id_tipo_venta = objUsuario.operacion;
    							ObtieneCliente(combo.value);    							 						
    							PosicionarOption("cmbNegocio", index);
    							PosicionarOption("cmbProducto", 0);
    						}else
    						{
    						    objVentas.objCliente = clienteSeleccionado;
    						    PosicionarOptionXTexto("cmbNegocio", clienteSeleccionado.id_cliente+'/'+ clienteSeleccionado.Nombre);
    						}
    					},
    					NOMBRE_APLICACION,
    					'Yes,No'
    			);
		    }else
		    {
		        objVentas = new VENTAS();
		        objVentas.id_tipo_venta = objUsuario.operacion;
		        ObtieneCliente(combo.value);
		    }
		}else
		{
		    objVentas = new VENTAS();
		    ObtieneCliente(combo.value);
		    objVentas.id_tipo_venta = objUsuario.operacion;
		}
		//De lo contrario se busca el negocio como se hace una linea arriba
    }else
    {
        objVentas = new VENTAS();
        objVentas.tipo_venta = objUsuario.operacion;
		clienteSeleccionado = null;
		objVentas.objCliente = null;		
		PosicionarOption("cmbProducto", 0);
	}
	GPSgetCurrentPosition();
}

function cmbProducto_Change(combo)
{	
	if(combo != null)
		$("#txtLote").val('');
	
	var chkManual = $("#chkManual");
	
	//Valida el cliente solo si no es traspaso
	if(objUsuario.operacion != TIPOVENTA.GENERICO)
	{
		if(clienteSeleccionado == null)
		{		
			if(combo != null)
				PosicionarOption(combo.id, 0);
			Alerta("Select a customer.");
			return;
		}
	}
	
	if (chkManual.is (':checked'))
	{
		$("#txtCantidad").val("");
		$("#txtCajas").val("");
		//TODO:cajasPosicionarOption('txtCajas', 0);
		
		//Si es otro toma de los text
		var rbOtro = $("#rbOtro");
		if (rbOtro.is (':checked'))
		{			
			if($("#txtCodigo").val() !== '')
			BuscaProductoEnCatalogo($("#txtCodigo").val() + "/" + "", TIPO_CAPTURA.MANUAL);
		}
		else if(combo.selectedIndex > 0)
		{			
			if(TIPOVENTA.CREDITO == objUsuario.operacion)						
				BuscaProductoEnCatalogo(combo.value, TIPO_CAPTURA.MANUAL);			
			else
				BuscaProductoEnCatalogo(combo.value, TIPO_CAPTURA.MANUAL);
		}
	}else{
		if($("#txtCodigo").val() !== '' && $("#txtLote").val() !== '')
			BuscaProductoEnCatalogo($("#txtCodigo").val() + "/" + $("#txtLote").val(), TIPO_CAPTURA.LECTOR);
	}
	GPSgetCurrentPosition();
}

function btnMenu()
{
	ControlaDiv('Menu', 'Menu', null);
}

function txtCodigoBarras_keyDown(e, txtCodigo)
{	
	var clave = '';
	var lote = '';
	var cantidad = '';
	var cajas= 1;
	var fCantidad = 0.0;
	var iCajas = 0;
	
	//Valida el cliente solo si no es traspaso
	if(objUsuario.operacion != TIPOVENTA.GENERICO)
	{
		if(clienteSeleccionado == null)
		{       
			//TODO:limpiar el text
			PosicionarOption("cmbProducto", 0);
			Alerta("Select a customer.");
			return;
		}
	}
	
	var evt = e || window.event;
    // "e" is the standard behavior (FF, Chrome, Safari, Opera),
    // while "window.event" (or "event") is IE's behavior
	//console.log("Pulsado:"+evt.keyCode);
    if ( evt.keyCode !== 13 )
    {
        productoSeleccionado = null;
    	return;
    }
	
	if(txtCodigo.value === '')
	{
		productoSeleccionado = null;
		Alerta('Scane a barcode');
		//txtCodigo.focus();
		setFocus('txtCodigoBarras');
		return;
	}
	else
	{
		txtCodigo.value = String(txtCodigo.value).toUpperCase();
		txtCodigo.value = trim(txtCodigo.value);
		var aProducto = txtCodigo.value.split("/");		
		var totalElemento =  aProducto.length;

		if(totalElemento >= 3)
		{
			clave = padding_left(aProducto[0], '0', 3);
			lote = aProducto[1] ;
						
			$("#txtCodigo").val(clave);
			$("#txtLote").val(lote);
			
			
			//tarima
			if(totalElemento ==4)
			{
				cantidad = aProducto[3];
				cajas = aProducto[2];
				
				//06062013
				//Si trae punto, es decimal
				if(String(cajas).indexOf('.') >= 0)
				{
				    Alerta('Incorrect Code');
				    txtCodigo.value = '';
				    $("#txtCodigo").val('');				    
		            $("#txtLote").val('');
		            $("#txtPrecio").val('');
                    $("#txtCantidad").val('');
                    PosicionarOption('txtCajas', 0);
				    return;
				}
				fCantidad = parseFloat(cantidad).toFixed(2);
				iCajas = parseInt(cajas);
				//console.log("textos cajas:" + cajas + "|cantidad:" + cantidad);
				//console.log("cajas:" + iCajas + "|cantidad:" + fCantidad);
				if(iCajas > fCantidad)
                {
                    Alerta('Incorrect Code');
                    $("#txtCodigo").val('');
                    $("#txtLote").val('');
                    $("#txtPrecio").val('');
                    $("#txtCantidad").val('');
                    PosicionarOption('txtCajas', 0);
                    txtCodigo.value = '';
                    return;
                }
				//06062013
				
				$("#txtCajas").val(cajas);
				//TODO:cajasPosicionarOptionXTexto('txtCajas', cajas);
				DeshabilitaInput("txtCajas");
			}else
			{
				cantidad = aProducto[2];
			    //$("#txtCajas").removeAttr("disabled");
				DeshabilitaInput("txtCajas");
			    $("#txtCajas").val("1");
				//TODO:cajasPosicionarOptionXTexto('txtCajas', '1');
			}
			
			$("#txtCantidad").val(cantidad);
			//BuscarProducto(clave,lote,cantidad);
			cmbProducto_Change(null);
		}
		else{
			productoSeleccionado = null;
			Alerta("The code is incorrect");
			$("#txtCodigoBarras").val("");
		}			

		setFocus('txtCodigoBarras');
	}
}

function chkManual_click()
{
	var chkManual = $("#chkManual");
	if (chkManual.is (':checked'))
	{
		DeshabilitaInput("txtCodigoBarras");
		
		
		HabilitaInput("txtCantidad");
		HabilitaInput("txtCajas");
		HabilitaInput("cmbProducto");		
	}else
	{		
		HabilitaInput("txtCodigoBarras"); 
				
		DeshabilitaInput("txtCantidad");		
		DeshabilitaInput("txtCajas");
		DeshabilitaInput("cmbProducto");		
	}
	productoSeleccionado = null;
	
	$("#txtCantidad").val("");		
	$("#txtCajas").val("");
	$("#txtCodigo").val("");		
	$("#txtLote").val("");
	$("#txtPrecio").val("");
}

function btnAgregar_Click(nombreGrid)
{
	if(g_isdebug)
		console.log("btnAgregar_Click agregando");
	var objProducto = null;
	var pos  = -1;
	var encontrado = false;
	var cantidad = 0.0, cajas= 0, precio = 0.0;
	
	var valida = true;
	
	//checa si elradio de otro esta chequeado, deshabilita las validaciones
	var rbOtro = $("#rbOtro");
	if (rbOtro.is (':checked'))
		valida = false;	
	
	if(isNaN($("#txtCantidad").val()))
	{
		Alerta("Incorrect Amount");
		return;
	}
	
	if(isNaN($("#txtCajas").val()))
	{
		Alerta("Incorrect Boxes");
		return;
	}
	
	//Valida que las cajas no traigan decimales, manual 21062013 
	if(String($("#txtCajas").val()).indexOf('.') >= 0)
    {
        Alerta('The number of boxes are incorrect');        
        return;
    }
	
	if(isNaN($("#txtPrecio").val()))
	{
		Alerta("Incorrect Price");
		return;
	}
	
	//Estaba al inicio se cambio 21062013
	if(objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.GENERICO)
    {
        productoSeleccionado.Id_almacen = objUsuario.Id_Almacen;
        if(productoSeleccionado.Lote == '')
        {
            $("#txtLote").val(String($("#txtLote").val()).toUpperCase());
            productoSeleccionado.Lote = $("#txtLote").val(); 
            $("#txtCodigo").val(productoSeleccionado.Clave+"/"+ productoSeleccionado.Lote);     
        }
    }
	
	GPSgetCurrentPosition();
	if($("#txtCodigo").val() !== '' && $("#txtLote").val() !== '')
	{
		if($("#txtCantidad").val() !== '' && $("#txtCajas").val() !== '')
		{
			cantidad = parseFloat($("#txtCantidad").val());
			cajas = parseInt($("#txtCajas").val());
			
			if(cantidad <= 0.0)
			{
				Alerta('Quantity can not be zero.');
				return;
			}

			if(cajas < 0)
			{
				Alerta('Boxes can not be less than zero');
				return;
			}
			
			if(cajas > cantidad)
			{
				Alerta("Boxes can not be more than weigth/pieces");
				return
			}

			if($("#txtPrecio").val() === '')
			{
				Alerta('Type price.');
				return;
			}
			precio = parseFloat($("#txtPrecio").val());
			
			//TODO: valida que el precio sea mayor a 0, checar si debe ir, si es generico entra en 0
			if(g_isdebug)
				console.log("btnAgregar_Click operacion:"+ objUsuario.operacion + "|GENERIC:" + TIPOVENTA.GENERICO+"|precio:" +precio);
			if(precio <= 0.00  && objUsuario.operacion != TIPOVENTA.GENERICO)
			{
				Alerta("The price have to be more than zero");				
				return;
			}
			//Si esta prendida la variable valida
			if(valida && objUsuario.operacion != TIPOVENTA.GENERICO)
			{
				if(g_isdebug)
					console.log("btnAgregar_Click productoSeleccionado.tipo_precio:"+productoSeleccionado.tipo_precio+ "|TIPO_PRECIO.LISTA:"+TIPO_PRECIO.LISTA);
				if(productoSeleccionado.tipo_precio == TIPO_PRECIO.LISTA)
				{
					if(g_isdebug)
						console.log("btnAgregar_Click precio_caja_final_min:"+productoSeleccionado.objPrecio.precio_caja_final_min+ "|precio_caja_final_max:"+productoSeleccionado.objPrecio.precio_caja_final_max);
					if(precio < productoSeleccionado.objPrecio.precio_caja_final_min
							|| precio > productoSeleccionado.objPrecio.precio_caja_final_max)
					{
						//Alerta("El precio no debe ser menor o mayor al rango configurado");
						Alerta("Price less "+ String(parseFloat(productoSeleccionado.objPrecio.precio_caja_final_min).toFixed(2)) +" and  high " + String(parseFloat(productoSeleccionado.objPrecio.precio_caja_final_max).toFixed(2)));
						return;
					}
				}
			}
			
			//Si es credito o demo no se valida el inventario, tambien si es traspaso
			if(objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.GENERICO || productoSeleccionado.status_venta == TIPO_PRODUCTO.COMODIN)
				valida = false;
			
			//alert("Cantidad:" + cantidad + "|maximoUnidad" + productoSeleccionado.maximoUnidad);
			//Si las cantidades son menores a los m�ximo o no se debe validar pasa
			if(cantidad <= productoSeleccionado.maximoUnidad || valida==false)
			{   
				//alert("cajas:" + cajas + "|maximoCaja" + productoSeleccionado.maximoCaja);
				if(cajas <= productoSeleccionado.maximoCaja || valida==false)
				{
					if(objVentas.aProductos.length === 0)
					{
						pos = 0;
						objProducto = CreaCopiaProducto(productoSeleccionado);
					}else
					{
						//Aqui ya no busca coincidencia pues siempre debe ir separado
						//pos = BuscaProductoEnGrid(productoSeleccionado.Id_producto, productoSeleccionado.Lote);	                
						if(pos === -1)
						{
							pos = objVentas.aProductos.length;
							objProducto = CreaCopiaProducto(productoSeleccionado);
						}else
						{
							encontrado = true;
							objProducto = objVentas.aProductos[pos];
							objProducto.Cantidad = parseFloat(objProducto.Cantidad) + cantidad;
							objProducto.CantidadCaja = parseFloat(objProducto.CantidadCaja) + cajas;
						}			
					}
					//ADD: 19062013 se agrega para ver si se compone lo de los centavos
					//TODO: posiblmente aqui debiera tomar el precio del text
					objProducto.Precio = parseFloat($("#txtPrecio").val()).toFixed(2);
					
					productoSeleccionado.Precio = parseFloat($("#txtPrecio").val()).toFixed(2);
					//TODO checar si aqui se decrementa
					productoSeleccionado.maximoUnidad = productoSeleccionado.Existencia - objProducto.Cantidad;
					productoSeleccionado.maximoCaja = productoSeleccionado.caja - objProducto.CantidadCaja;

					objVentas.aProductos[pos] = objProducto;
					AgruparProductos(objProducto, true);
					//LlenaGridVentas(pos, encontrado, nombreGrid);
					drawGridSale(nombreGrid, objVentas.aProductos);
										
					DeshabilitaInput("cmbProducto");
					HabilitaInput('txtCodigoBarras');
					HabilitaInput('chkManual');
					ControlaCheckbox("chkManual", false);
					
					ControlaCheckbox("rbRizo", true);								
					ControlaCheckbox('rbOtro', false);//TODO: bastante puerco, pero de lo contrario no funciona
					
					setFocus('txtCodigoBarras');
				}else
				{
					if(productoSeleccionado.tipo_captura == TIPO_CAPTURA.LECTOR)
						LimpiaTextVenta();
					//$("#txtCodigoBarras").val();
					Alerta('Boxes are more than weigth');	
				}
			}else{
				if(productoSeleccionado.tipo_captura == TIPO_CAPTURA.LECTOR)
					LimpiaTextVenta();
				//$("#txtCodigoBarras").val();
				Alerta('Insufficient stock');
			}
		}else
			Alerta('Type Weight/Pieces and Boxes.');
	}else{
		Alerta('Select a product');
		//txtCodigoBarras.focus();
		setFocus('txtCodigoBarras');
	}
}

function btnGuardaVenta_Click()
{		
	if(objVentas == null)
		return;
	if(PosicionObtenida === 0)
	    GPSgetCurrentPosition();

	if(objVentas.objCliente == null)
	{
		Alerta("Select a customer");
		return;
	}
	
	if(objVentas.tabIndex === 0)
	{
		if(objVentas.aProductos == null || objVentas.aProductos.length <=0)
		{
			Alerta("Add products.");
			return;
		}
		
		if(objUsuario.operacion == TIPOVENTA.CREDITO && $("#cmbTipoCredito").val() === '-1')
		{
		    Alerta("Select a credit");
	        return;
		}
		
		objVentas.Id_tipo_credito = parseInt($("#cmbTipoCredito").val());
	
		g_procesando_venta = true;
		RegistraVenta();
	} else if(objVentas.tabIndex === 3) {
		objVentas.hasSign = true;
		//Save sign
	}
}

function btnGuardaOpc()
{
	if(g_isdebug)
		console.log("btnGuardaOpc PAGINAS.PANELFIRMA:" + PAGINAS.PANELFIRMA + "|curWindow:" + curWindow + "|");
    switch(curWindow)
    {
        case VENTANAS[0]:
        	//Si es falso, lanza la venta, de lo contrario se interrumpio el alert y lo vuelve a poner
        	if(g_procesando_venta == false)
        		btnGuardaVenta_Click();
        	else
        		Alerta("The invoice has been saved!!");
        
            break;
/*        case VENTANAS[1]:
            btnGuardarPanelFirma_Click();
            break;*/
        case VENTANAS[2]:
            btnGuardaParametros_Click();
            break;
        case VENTANAS[3]:
        	btnGuardaImpresora_Click();
            break;
        case PAGINAS.PANELFIRMA:
        	btnImprimir_Click();
        	break;
        case PAGINAS.PAGOS:
        case 'SearchCustomerPay':
        	if(g_procesando_pagos == false)
        		btnPagar_Click();
        	else
        		Alerta("The Payment has been saved!!"); 
        	break;
    }

    
}

function btnReImprimir_Click(opc)
{
	preimpresion = true;
    //var fecha = FechaActual().split(' ');
    var tituloBtn = '';
    var tituloVentana = '';    
    
    if(opc === TIPOVENTA.REIMPRIMIR)
    {
        tituloBtn = 'Print a Copy';
        tituloVentana = TITULOS.REIMPRIMIR;
    }else if(opc === OPCVENTAS.CANCELAR)
    {
        tituloBtn = 'Cancel';
        tituloVentana = TITULOS.CANCELARVTA;
        g_procesando_venta = false;
    	g_procesando_pagos = false;
    }
    
    OcultarDiv('afooter');

    /*if(curWindow ==PAGINAS.REIMPRIMIR)
    {
    	$( "#popupPanel" ).popup( "close" );
    	$("#spVentas").text(tituloVentana);
    	$('#btnOpcVenta').text(tituloBtn).button("refresh");
    	LlenaGridReimpresion(opc);
    	return;
    }*/
    if(g_isdebug)
    	console.log("btnReImprimir_Click opc:" + opc);
    ControlaDiv(PAGINAS.REIMPRIMIR, tituloVentana,
        function()
        {
    		$( "#popupPanel" ).popup( "close" );
        	LlenaComboImpresion();
        	objUsuario.operacion = opc;    
            
        $('#btnOpcVenta').text(tituloBtn).button("refresh");
        //$("#spVentas").text(tituloVentana);
        
        LlenaGridReimpresion(opc);
    });
}

function btnRptVentas_Click(opc)
{
    //var fecha = FechaActual().split(' ');
    var tituloBtn = '';
    var tituloVentana = '';
    var rptOpc = 0;;
    OcultarDiv('afooter');
    tituloBtn = 'Print Report';
    switch(opc)
    {
    	case TIPOVENTA.RPTVENTAS:
    		tituloVentana = TITULOS.VENTAS + ' REPORT';
    		rptOpc = TIPOVENTA.VENTA;
    		break;
    	case TIPOVENTA.RPTDEMO:
    		tituloVentana = TITULOS.DEMO + 'REPORT';
    		rptOpc = TIPOVENTA.DEMO;
    		break;
    	case TIPOVENTA.RPTCREDITOS:
    		tituloVentana = TITULOS.CREDITO + ' REPORT';
    		rptOpc = TIPOVENTA.CREDITO;
    		break;
    	case TIPOVENTA.RPTPROMOCION:
    		tituloVentana = TITULOS.PROMOCION + 'REPORT';
    		rptOpc = TIPOVENTA.PROMOCION;
    		break;
    	case TIPOVENTA.RPTGENERAL:
    		tituloVentana = 'SUMMARY REPORT';
    		rptOpc = TIPOVENTA.GENERAL;
    		break;
    	default:
    		tituloVentana = TITULOS.RPTVENTAS;
    }
    

    ControlaDiv(PAGINAS.RPTVENTAS, tituloVentana,
        function()
        {
    		$( "#popupPanel" ).popup( "close" );
        	LlenaComboImpresion();
        	objUsuario.operacion = opc;    
            
        $('#btnOpcVenta').text(tituloBtn).button("refresh");
                
        LlenaGridReimpresionGeneral(rptOpc);
    });
}
//para el cambio de imagen a check, se agrego pos
function btnQuitar_Click(nombreTabla, pos)
{
	var container =  $("#"+nombreTabla).find('.table.table-striped');// document.getElementById(nombreTabla);	

	if(!container || container.length === 0)
		return;
	
	var tblDatos = container[0];
	var total = tblDatos.rows.length;
	
	if(g_isdebug)
		console.log("btnQuitar_Click total:" + total + "|total en array:" + objVentas.aProductos.length);
	for(var i= total; i > 1 ; i--)
	{
		var check = tblDatos.rows[i-1].cells[0].childNodes[0].children.length === 1 ? tblDatos.rows[i-1].cells[0].childNodes[0].children[0] : tblDatos.rows[i-1].cells[0].childNodes[0];
		//var check = tblDatos.rows[i-1].cells[0].childNodes[0];
		if(g_isdebug)console.log("btnQuitar_Click check: "+ tblDatos.rows[i-1].cells[0].innerHTML);
		if(g_isdebug)console.log("btnQuitar_Click check: "+ check);
		if(check)
		{
			if(g_isdebug)console.log("btnQuitar_Click checked: "+ check.checked);
			if(check.checked)
			{
				if(g_isdebug)console.log("btnQuitar_Click before delete: "+ objVentas.aProductos);
				//tblDatos.deleteRow(i-1);
				objVentas.aProductos.splice(i-2, 1);
				if(g_isdebug)console.log("btnQuitar_Click after delete: "+ objVentas.aProductos);
			}
		}
	}
	if(g_isdebug)
		console.log("btnQuitar_Click total total en array after:" + objVentas.aProductos.length);
	//Se vuelven a agrupar los productos, antes se limpian los array
	objVentas.aProductosAgrupados = [];//new Array();
	objVentas.aProductosAgrupadosHeader = [];//new Array();
	
	for(var i = 0; i < objVentas.aProductos.length; i++)
		AgruparProductos(objVentas.aProductos[i], false);//TODO: el segundo parametro al parecer no se ocupa
	
	var aProductos = [];
	_.each(objVentas.aProductosAgrupadosHeader,
		function(group){
			_.each(group, function(p){
				p.subtotal= parseFloat(p.Cantidad * p.Precio).toFixed(2);
				aProductos.push(p);
			});
		}
	);
	
	drawGridSale(nombreTabla, aProductos);
	
	//Se invoca el calculo de totales
	ObtieneTotalVenta();
	
	PosicionarOption("cmbProducto", 0);
}

function btnQuitarPago_Click(nombreTabla)
{
	var tblDatos = document.getElementById(nombreTabla);
	var total = tblDatos.rows.length;

	if(g_isdebug)
		console.log("btnQuitarPago_Click total:" + total);

	//Si es venta valida, y si tiene mas de un pago
	if(objVentas != null && objVentas.pagosVentas == TIPOVENTA.VENTA && total > 1)
	{
		for(var i= total; i > 1 ; i--)
		{
			var check = tblDatos.rows[i-1].cells[0].childNodes[0];
			if(check != null)
			{
				if(check.checked)
				{
					var index  = parseInt(check.value);
					if(g_isdebug)
					{
						console.log("btnQuitarPago_Click chequeado id:" + aPagos[index].id + "|i:" + i + "|index:" +index);
						console.log("btnQuitarPago_Click chequeado parentId:" + aPagos[index].parentId == null ? "nulo" : aPagos[index].parentId + "|child:" + aPagos[index].childId == null ? "nulo" : aPagos[index].childId);
					}
					//Si no es hijo ni padre, no tiene liga por lo tanto debe borra todos
					if(aPagos[index].parentId == null && aPagos[index].childId == null)
					{
						if(g_isdebug)
							console.log("btnQuitarPago_Click es nodo libre, quito todo");
						if(index == aPagos.length -1)
							BorraElementoArrayPago(aPagos[index].id);
						else
							aPagos = new Array();
					}else
					{
						if(g_isdebug)
							console.log("btnQuitarPago_Click es nodo ligado");
						//Si childId es no nul, es padre
						if(aPagos[index].childId != null)
						{
							if(g_isdebug)
								console.log("btnQuitarPago_Click es padre");
							//borra sus hijos
							BorraElementoArrayPago(aPagos[index].childId);
							//Borra el padre
							BorraElementoArrayPago(aPagos[index].id);
							//Si parentId es no nulo, es hijo
						}else if(aPagos[index].parentId != null){
							if(g_isdebug)
								console.log("btnQuitarPago_Click  es hijo");
							var parentId = aPagos[index].parentId;
							//borra los hijos
							BorraElementoArrayPago(aPagos[index].id);
							//Borra el padre
							BorraElementoArrayPago(parentId);
						}else{
							if(g_isdebug)
								console.log("btnQuitarPago_Click else");
							BorraElementoArrayPago(aPagos[index].id);
						}
					}
					//aPagos.splice(i-2, 1);
					break;
				}
			}
		}
	}else		
	{	//Solo quita el pago

		for(var i= total; i > 1 ; i--)
		{
			var check = tblDatos.rows[i-1].cells[0].childNodes[0];
			if(check != null)
			{
				if(check.checked)
				{					
					aPagos.splice(i-2, 1);
				}
			}
		}
	}
	if(objVentas != null && objVentas.pagosVentas == TIPOVENTA.VENTA)
		$("#txtFactura").val(objVentas.folio);
	
	ListaPagoscliente();
}

function BorraElementoArrayPago(id)
{
	if(g_isdebug)
		console.log("Eliminando id:" + id);
	for(var i =0; i < aPagos.length; i++)
		if(aPagos[i].id == id)
			aPagos.splice(i, 1);
}

function btnOpcVenta_Click()
{
	var id = '';
	if($('#tblVentasDia >tbody >tr').length <= 1)
	{
	    Alerta('There are not movements.');
	    return;
	}

    var valSeleccionado = $("input[name='group1']:checked").val();
    
    if(valSeleccionado === null || valSeleccionado === undefined)
    {
    	Alerta("Select an invoice");
    	return;
    }
    
    var llaves = valSeleccionado.split('|');
    if(g_isdebug)
    	console.log("btnOpcVenta_Click llaves.length:"+llaves.length);
    
    //alert("btnOpcVentas llaves[0]: " + llaves[0]);
    //alert("btnOpcVentas llaves[1]: " + llaves[1]);
    
    if(llaves.length == 2){    	
    	Reimprimir(llaves[0], llaves[1]);
    }
    else if(llaves.length == 4)
    {     
    	if(g_procesando_venta == true)
    	{
    		navigator.notification.activityStart(NOMBRE_APLICACION, "Cancel Invoices...");
    		return;
    	}
    	objUsuario.operacion = parseInt(llaves[2]);
        navigator.notification.confirm(
                'Do you want cancel the movement?',
                function(buttonIndex)
                {   
                    if(buttonIndex == 1)
                    {                           
                    	g_procesando_venta = true;
                    	ValidaInventarioACancelar(llaves[0], llaves[1], llaves[3]);                        
                    }else
                    	g_procesando_venta = false;
                },
                NOMBRE_APLICACION,
                'Yes,No'
        );            
    }
}

function btnOpcVentaGeneral_Click()
{
	var id = '';
	if($('#tblVentasDia >tbody >tr').length <= 1)
	{
	    Alerta('There are no movements.');
	    return;
	}
	Impresion();
}

function btnRptInventario_Click(opc)
{
	OcultarDiv('afooter');
	var titulo = '';
	var all =  false;
	var rst = {};
    rst.items = [];

	objUsuario.operacion = opc;
	rst.inventory = true;
	rst.total = 0.0;
	rst.totalCajas = 0.0;

	switch(parseInt(objUsuario.operacion))
	{
	case TIPOVENTA.RPTINVENTARIO:
		titulo = TITULOS.RPTINVENTARIO;
		all = true;		
		break;
	case TIPOVENTA.RPTCREDITOS:		    	
		titulo = TITULOS.RPTCREDITOS;		
		break;    
	}
    
    navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Inventary...");
    ObtieneInventario(all,
            function(tx, results)
            {
    			 try {
		    	 rst.items = convertResult2JsonAray(results);		    	 
		    	 
		    	 if(results.rows.length > 0)
		    	 {
		    		 rst.total = (rst.items).map(function(item){return item.existencia;}).reduce(function(memo, n){return memo +n;})
		    		 rst.totalCajas = (rst.items).map(function(item){return item.caja;}).reduce(function(memo, n){return memo +n;})		    	 
		    	 }
		    	 
		    	 rst.total = parseFloat(rst.total).toFixed(2);
		    	 rst.totalCajas = parseFloat(rst.totalCajas).toFixed(2);
		    	 
		    	 loadTemplateHBS('Inventario', titulo, rst,
		    	    		function()
		    	    		{
		    		 			LlenaComboImpresion();
					    		$("#spRuta").text(objUsuario.codigo_ruta);
					            $("#spFecha").text(FechaActualFormato());
					            $( "#popupPanel" ).popup( "close" );
					            
					            navigator.notification.activityStop();
		    	    		}
		    	    );
    			 }catch (err){console.log(err);alert("error:" + err);}
            },
            function(){
            	 navigator.notification.activityStop();
            }
    );
}

function btnInvInicial_Click(opc)
{
	var rst = {};
    rst.items = [];
    rst.initial = true;
    objUsuario.operacion = opc;
    rst.total = 0.0;
	rst.totalCajas = 0.0;
        
    var tblNombre = 'tblInventario';

    navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Inventory...");
    ObtieneInventarioInicial(
            function(tx, results)
            {
            	 rst.items = convertResult2JsonAray(results);
            	 
            	 if(results.rows.length > 0)
            	 {
            		 rst.total = (rst.items).map(function(item){return item.cantidad;}).reduce(function(memo, n){return memo +n;})
            		 rst.totalCajas = (rst.items).map(function(item){return item.cantidad_cajas;}).reduce(function(memo, n){return memo +n;})		    	 
            	 }
            	 
		    	 rst.total = parseFloat(rst.total).toFixed(2);
		    	 rst.totalCajas = parseFloat(rst.totalCajas).toFixed(2);
            	 
            	 loadTemplateHBS('Inventario', 'Inventario Inicial', rst,
		    	    		function()
		    	    		{
		    		 			LlenaComboImpresion();
					    		$("#spRuta").text(objUsuario.codigo_ruta);
					            $("#spFecha").text(FechaActualFormato());
					            $( "#popupPanel" ).popup( "close" );
					            
					            navigator.notification.activityStop();
		    	    		}
		    	    );
            }
    );
}

//TODO: checar esta funcionalidad
function btnImpInventario_Click()
{

    if($('#tblInventario >tbody >tr').length <= 0){
        Alerta('There are not products!!');
        return;
    }      
    
    //TODO aqui debe llamr la rutina de imprimir
    //VoucherInventario();
    Impresion();
}

function btnImpPayments_Click()
{
	if(!aImpresion || aImpresion.length === 0)
		LlenaComboImpresion();
	
	if($('#tblPayments >tbody >tr').length <= 0){
        Alerta('There are not payments!.');
        return;
    }
	
	objUsuario.operacion = TIPOVENTA.RPTPAGOS;
	
	Impresion();
}

function btnImpVtaDiaria_Click()
{
	if(!aImpresion || aImpresion.length === 0)
		LlenaComboImpresion();
	
	if($('#tblRuta >tbody >tr').length <= 0){
        Alerta('There are not payments!');
        return;
    }
	
	objUsuario.operacion = TIPOVENTA.RPTVTADIARIA;
	
	Impresion();
}

function btnImpRptCredits_Click()
{
	if(!aImpresion || aImpresion.length === 0)
		LlenaComboImpresion();
	
	if($('#resales_credits >tbody >tr').length <= 0 || $('#return_credits >tbody >tr').length <= 0){
        Alerta('There are not Credits!');
        return;
    }
	
	objUsuario.operacion = TIPOVENTA.RERPORTCREDITS;
	
	Impresion();
}

function btnPendientes_Click()
{    
	OcultarDiv('afooter');
    navigator.notification.activityStart(NOMBRE_APLICACION, "Getting transactions...");
    ControlaDiv(PAGINAS.PENDIENTES, TITULOS.NOENVIADAS,
            function()
            {
    			$( "#popupPanel" ).popup( "close" );
                BorraGrid('tblNoEnviadas');                
                ObtienePendientes(
                        function(tx, results)
                        {
                            if(results.rows.length > 0)
                            {                                                                            
                                for(var i = 0; i < results.rows.length; i++)
                                {                                                          
                                    var htmlRow = ''; 
                                    var trClass = 'filaAlternativa';
                                    if(i%2 == 1)
                                        trClass = 'filaNormal';  
            
                                    htmlRow = "<tr class='"+trClass+"'>";
                                    htmlRow += "<td>"+ results.rows.item(i).factura +"</td>";
                                    htmlRow += "<td>"+ results.rows.item(i).fecha +"</td>";
                                    htmlRow += "<td>"+ results.rows.item(i).tipo+"</td>";
                                    htmlRow += "</tr>";
                                    $("#tblNoEnviadas").append(htmlRow);
                                }
                            }else
                                Alerta("There are not transactions.");                            
                            navigator.notification.activityStop();           
                        }
                        ,null
                );
            }
    );
}

function btnProductos_Click(divOcultar, divMostrar, Grid)
{
	var nombreGrid = Grid;
	
	if(objVentas == null)
	{
		Alerta("Select a customer");
		return;
	}
	
	OcultarDiv(divOcultar);
	OcultarDiv('afooter');
	//Se realiza una copia de los productos desglozados
	objVentas.aProductosAuxiliar = CreaCopiaArrayProductos(objVentas.aProductos);

	MuestraDiv(divMostrar);

	BorraGrid(nombreGrid);
	
	/*for(var i=0; i < objVentas.aProductos.length; i++)
		CreaFilaEnGrid(objVentas.aProductos[i], nombreGrid, i);*/
		
	drawGridSale(nombreGrid, objVentas.aProductos);
	
	if(objUsuario.operacion != TIPOVENTA.GENERICO)
	    OcultarDiv('aGuardar');
	
	setFocus('txtCodigoBarras');
}

function btnTab_Click(tanNum)
{
	switch(tanNum)
	{
		case 0: // info
			objVentas.tabIndex = tanNum;
			window.CustomNativeAccess.CambiaVista(SCREEN_ORIENTATION.PORTRAIT);
			OcultarDiv('divNotaCredito');
			OcultarDiv('venta_pagos');
			OcultarDiv('PanelDeFirma');
			OcultarDiv('contenedor_pizarra');
			MuestraDiv('vtaPrincipal');
			MuestraDiv('afooter');	
			curWindow = VENTANAS[0] ;
			break;
		case 1: // pay
			window.CustomNativeAccess.CambiaVista(SCREEN_ORIENTATION.PORTRAIT);
			objVentas.tabIndex = -1;
			if(objVentas.id_venta != 0)
			{
				if(objVentas != null)
				{
					objVentas.pagosVentas = objUsuario.operacion;
					objVentas.tabIndex = tanNum;
				}
				//g_procesando_pagos = false;
				OcultarDiv('divNotaCredito');
				OcultarDiv('vtaPrincipal');
				OcultarDiv('PanelDeFirma');
				OcultarDiv('contenedor_pizarra');
				MuestraDiv('venta_pagos');
				MuestraDiv('afooter');
				$("#txtFactura").val(objVentas.folio);
				$("#txtMonto").val(objVentas.montoPagar);
				$("#hfPagos").val(objVentas.objCliente.id_cliente+'@'+objVentas.folio+'@'+objVentas.montoPagar);
				$("#hfTotalFactura").val(objVentas.montoPagar);
				DeshabilitaInput('txtFactura');
				curWindow = PAGINAS.PAGOS;
			}
			else
				{
				 Alerta("you need to save the invoice!!");
				}
			
			break;
		case 2: // credit
			objVentas.tabIndex = -1;
			if(objVentas != null)
			{			
				objVentas.tabIndex = tanNum;
			}
			window.CustomNativeAccess.CambiaVista(SCREEN_ORIENTATION.PORTRAIT);
			OcultarDiv('venta_pagos');
			OcultarDiv('vtaPrincipal');
			OcultarDiv('PanelDeFirma');
			OcultarDiv('contenedor_pizarra');
			
			MuestraDiv('afooter');
			MuestraDiv('divNotaCredito');
			break;
		case 3:
			if(objVentas.id_venta != 0)
			{
				if(!objVentas.hasSign)
				{
					objVentas.tabIndex = tanNum;
					OcultarDiv('venta_pagos');
					OcultarDiv('vtaPrincipal');
					OcultarDiv('divNotaCredito');
					MuestraDiv('afooter');
					MuestraDiv('PanelDeFirma');
				} else {
					Alerta("The sign already exist!!");
				}
				
				Firma();
			}else
			{
				 Alerta("you need to save the invoice!!");
			}
			break;
	}
}

function Firma(){
	window.CustomNativeAccess.CambiaVista(SCREEN_ORIENTATION.LANDSCAPE);			 
	var intervalID = window.setInterval(
			function() {
				window.clearInterval(intervalID);
				navigator.notification.activityStop();
				limpiarSignature('pizarra');
				//  MuestraDiv('btnCancel');
			},
			500
	);			 
}


function btnAceptarVta_Click(nombreGridSrc, nombreGridDest, validar)
{	
	if(g_isdebug)
	{
		console.log("btnAceptarVta_Click nombreGridSrc:" + nombreGridSrc + "|nombreGridDest:" + nombreGridDest+"|");
		console.log("btnAceptarVta_Click validar:" + validar + "|len:" + $('#'+nombreGridSrc+' tbody >tr').length);
	}
	if(($('#'+nombreGridSrc+' tbody >tr').length <= 0) && (true === validar))
	{
		Alerta("Select a product");
		return;
	}
	
	OcultarDiv("vtaAuxiliar");
	MuestraDiv("vtaPrincipal");
	MuestraDiv('afooter');
	
	BorraGrid(nombreGridDest);
	var aProductos = [];//new Array();
	
	/*for(var j=0; j < objVentas.aProductosAgrupadosHeader.length; j++)
	{	
		aProductos = objVentas.aProductosAgrupadosHeader[j];		
		for(var i=0; i < aProductos.length; i++)
			CreaFilaEnGrid(aProductos[i], nombreGridDest, i);
	}*/
	_.each(objVentas.aProductosAgrupadosHeader,
		function(group){
			_.each(group, function(p){
				p.subtotal= parseFloat(p.Cantidad * p.Precio).toFixed(2);
				aProductos.push(p);
			});
		}
	);
	
	drawGridSale(nombreGridDest, aProductos);
	
	if(objUsuario.operacion != TIPOVENTA.GENERICO)
        MuestraDiv('aGuardar');
	
	// Segun soluciona el desface de la pantalla.
	$.mobile.silentScroll(0);
}

function btnCancelarVta_Click(nombreGridSrc, nombreGridDest)
{
	MuestraDiv("afooter");
	//Como se cancela se quita todo el detallle
	// y se agregan los productos que estaban inicialmente
	objVentas.aProductos = CreaCopiaArrayProductos(objVentas.aProductosAuxiliar);
	
	//Se limpia el auxiliar
	objVentas.aProductosAuxiliar = [];//new Array();
	
	//Se vuelven a agrupar los productos, antes se limpian los array
	objVentas.aProductosAgrupados = [];//new Array();
	objVentas.aProductosAgrupadosHeader = [];//new Array();
	
	for(var i = 0; i < objVentas.aProductos.length; i++)
		AgruparProductos(objVentas.aProductos[i], false);//TODO: el segundo parametro al parecer no se ocupa
	
	//se invoca el evento de aceptar para que haga el render
	btnAceptarVta_Click(nombreGridSrc, nombreGridDest, false);
	
	//Se invoca el calculo de totales
	ObtieneTotalVenta();
	
	if(objUsuario.operacion != TIPOVENTA.GENERICO)
        MuestraDiv('aGuardar');
}

function rbRizo_click()
{
	HabilitaInput('txtCodigoBarras');
	HabilitaInput('chkManual');
	DeshabilitaInput('cmbProducto');
	ControlaCheckbox('chkManual', false);
	
	$("#txtCodigoBarras").val("");
	$("#txtCodigo").val("");
	$("#txtLote").val("");
	$("#txtCantidad").val("");
	$("#txtCajas").val("");
	//TODO:cajasPosicionarOption("txtCajas", 0);
	
	ControlaCheckbox('rbOtro', false);
	ControlaCheckbox('rbRizo', true);
	
	productoSeleccionado = null;
}

function rbOtro_click()
{
	DeshabilitaInput('txtCodigoBarras');
	DeshabilitaInput('chkManual');
	DeshabilitaInput('cmbProducto');
	ControlaCheckbox('chkManual', true);
	
	HabilitaInput('txtPrecio');
	HabilitaInput('txtCajas');
	HabilitaInput('txtCantidad');
	HabilitaInput("txtLote");
	
	$("#txtCodigoBarras").val("");	
	$("#txtLote").val("");
	$("#txtCantidad").val("");
	$("#txtCajas").val("");
	//TODO:cajasPosicionarOption("txtCajas", 0);
	
	ControlaCheckbox('rbOtro', true);
	ControlaCheckbox('rbRizo', false);
	
	productoSeleccionado = new PRODUCTO();
	ObtieneProductosOtro(
			function(tx, results){
	            if(results.rows.length > 0)
	            {
	            	productoSeleccionado.Id_producto = results.rows.item(0).id_producto;
	            	productoSeleccionado.Clave = results.rows.item(0).clave;
	            	productoSeleccionado.Lote = results.rows.item(0).lote;
	            	productoSeleccionado.Nombre_producto = results.rows.item(0).nombre_producto;
	            	
	            	$("#txtCodigo").val(productoSeleccionado.Clave);
	            	
	            	//TODO:checar esta llamada, posiblemente no deba ir aqui
	            	cmbProducto_Change(null);
	            }else{
	            	productoSeleccionado = null;
	            	Alerta("No existe el producto OTRO");
	            	return;
	            }	               
			},
			function(){
				Alerta('Error rbOtro_click');
			}
	);	
}

function rbGerico_click(radio)
{
	if(g_isdebug)
		console.log("rbGerico_click id:" + radio.id);
	ControlaCheckbox(radio.id, true);
}

function btnMovimientos_Click()
{
	if(ONLINE == 0)
	{
		Alerta("Check your internet connection");
		return;
	}

	//TODO:validar que no haya traspasos pendientes
	ObtieneMovimientosNoEnviados(
	        function(tx, results)
            {
                if(results.rows.length > 0)
                {                            
                    Alerta("There are movements to send\n, We will send the information");                    
                    ProcesaMovimientoPendientes(results);
                }else{
                    var wws= new IvanWebService(WSURL);
                    
                    navigator.notification.activityStart(NOMBRE_APLICACION, "Wait getting the information");
                    
                    var parameters = new Array("id_asignacion_ruta", objUsuario.Id_asignacion_Ruta, "msj", "");
                        
                    wws.callWCF(METODOS.METODO_OBTENERMOVIMIENTOS, false, parameters, INTERFAZ_SERVICIO);
                    var retVal = false;
                    retVal= wws.result;
                    
                    if(g_isdebug)
                    	console.log("btnMovimientos_Click retVal:"+ retVal);
                    LeerXmlTraspasos(retVal);
                }
            }
	);
}

function btnTraspasos_Click(tipo_operacion)
{
    objUsuario.operacion = tipo_operacion;

    ControlaDiv(PAGINAS.TRASPASO, TITULOS.TRASPASO,
            function(){
    			$( "#popupPanel" ).popup( "close" );
                //Primero saca los guardads en la bd que aun no se le da entrada
                PintaMovimientosAbiertos();
        
                GPSgetCurrentPosition();
                LlenaComboProductos('cmbProducto');
                //LlenaComboNegocios('cmbNegocio');
                //LlenaComboCajas('txtCajas');
        
                LimpiarVenta(null);
                LlenaComboImpresion();
                OcultarDiv('aGuardar');    
                OcultarDiv('afooter');    
            }
    );
}

function btnEntrarTraspaso_Click(divOcultar, divMostrar, Grid)
{
	if(g_isdebug)
		console.log("btnEntrarTraspaso_Click len:" + $('#tblTraspasos >tbody >tr').length);
	if($('#tblTraspasos >tbody >tr').length < 1)
	{
		Alerta("There are not movements");
		return;
	}	
	
    var valSeleccionado = $("input[name='rbTraspaso']:checked").val();
    
    if(valSeleccionado === null || valSeleccionado === undefined)
    {
    	Alerta("Selecct a movement");
    	return;
    }
    
    
    HabilitaInput('txtCodigoBarras');
    HabilitaInput('chkManual');
    DeshabilitaInput('cmbProducto');
    
    if(g_isdebug)
    	console.log("btnEntrarTraspaso_Click valSeleccionado:" + valSeleccionado);
    objVentas = new VENTAS();
    objVentas.id_movimiento_enc = parseInt(valSeleccionado);
    objVentas.Id_usuario = objUsuario.Id_Usuario;
    
    // Si tiene activa la bandera, consulta localmente l movimiento
    if(objUsuario.parametros['transfer_auto'] === '1')
    {
    	ObtieneMovimientosDescargados(parseInt(valSeleccionado),
    			function(txt, result)
    			{
    				if(result.rows.length > 0)
    				{
    					for(var i = 0; i < result.rows.length; i++)
    					{
    						var item = result.rows.item(i);
    						var oProducto  = new PRODUCTO();
            				
            				oProducto.Cantidad = parseFloat(item.existencia);
            				oProducto.Id_almacen = parseInt(item.id_almacen);
            				oProducto.Id_producto = parseInt(item.id_producto);                				
            				oProducto.Lote = item.lote;
            				oProducto.CantidadCaja = parseFloat(item.caja);                			
            				oProducto.id_unidad_medida = parseInt(item.id_unidad_medida);
            				oProducto.Nombre_producto = item.nombre;
            				oProducto.Clave = item.clave
            				oProducto.Precio = 0.0;
            				oProducto.subtotal = 0.0;
            				
            				objVentas.aProductos.push(oProducto);
    					}
    					//lo pinta
    					btnProductos_Click(divOcultar, divMostrar, Grid);
    				} else
    					//Consulta el WS
    					getDetalleMovimiento(valSeleccionado, divOcultar, divMostrar, Grid);
    			},
    			function()
    			{
    				alert("Error!!")
    			}
    	);
    } else
    	btnProductos_Click(divOcultar, divMostrar, Grid);
}

function btnAceptarTraspaso_Click(nombreGridSrc, GridTrapasos)
{	
	var cantidad = 0.00;
	var cajas  = 0.00;
	
	if(g_isdebug)
		console.log("btnAceptarTraspaso_Click nombreGridSrc:" + nombreGridSrc + "|");
	
	//if(($('#'+nombreGridSrc+' >tbody >tr').length <= 0))
	if(objVentas.aProductos.length === 0)
	{
		Alerta("Select a product");
		return;
	}
	if(g_procesando_venta == true)
	{
		navigator.notification.activityStart(NOMBRE_APLICACION, "Wait, Sending information");
		return;
	}
	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait, Sending information");
	g_procesando_venta = true;
	objVentas.fecha = FechaActual();
	//Guarda el detalle del movimiento
	GuardaDetalleMovimiento(objVentas.id_movimiento_enc, objVentas.Id_usuario, objVentas.aProductos);
	
	//Actualiza el inventario
	for(var i=0; i < objVentas.aProductos.length; i++)
	{	
		if(g_isdebug)
		{
			console.log("btnAceptarTraspaso_Click lote:" + objVentas.aProductos[i].Lote+"|Id_producto:" + objVentas.aProductos[i].Id_producto);
			console.log("btnAceptarTraspaso_Click Existencia:" + objVentas.aProductos[i].Existencia+"|caja:" + objVentas.aProductos[i].caja);
			console.log("btnAceptarTraspaso_Click CantidadCaja:" + objVentas.aProductos[i].CantidadCaja+"|Cantidad:" + objVentas.aProductos[i].Cantidad);
		}
		cantidad = parseFloat(objVentas.aProductos[i].Existencia) + parseFloat(objVentas.aProductos[i].Cantidad);                                   
		cajas =parseInt(objVentas.aProductos[i].caja) + parseInt(objVentas.aProductos[i].CantidadCaja);

		cantidad = parseFloat(cantidad).toFixed(2);
		cajas = parseInt(cajas);

		if(g_isdebug)
			console.log("btnAceptarTraspaso_Click cantidad:" + cantidad+"|cajas:" + cajas);		
		//Actualiza el inventario
		//ActualizaExistencia(objVentas.aProductos[i].Id_producto, objVentas.aProductos[i].Lote, cantidad, cajas);
		IngresaInventario(objVentas.aProductos[i], cantidad, cajas);
	}
	
	//Cambia el campo Abierto a 0
	CierraMovimiento(objVentas.id_movimiento_enc, objVentas.fecha);
	
	//Borra el transfer de temporal si se descargó en automatico
	EliminaTransferDescargado(objVentas.id_movimiento_enc);
	
	//Quita el moviento cerrado de la lista
	/*var tblDatos = document.getElementById(GridTrapasos);
	var total = tblDatos.rows.length;
	
	for(var i= total; i > 1 ; i--)
	{
		var check = tblDatos.rows[i-1].cells[0].childNodes[0];
		if(check != null)
		{		    
			if(check.checked)
			{			  
				tblDatos.deleteRow(i-1);
				break;
			}
		}
	}*/
	
	//Si est� en linea manda el traspaso
	if(ONLINE == 1)
	{
		EnviarTraspaso(objVentas);
	}
	
	ImprimirVenta();
	
	btnCancelarTraspaso_Click();
	navigator.notification.activityStop();
	g_procesando_venta = false;
	Alerta("The Information sent correct");
	
	PintaMovimientosAbiertos();
}

function btnCancelarTraspaso_Click()
{
  //Se resetea la venta
    //objVentas = new VENTAS();
    OcultarDiv("TraspasoAuxiliar");
    MuestraDiv("TraspasosPrincipal");
    navigator.notification.activityStop();
    g_procesando_venta = false;
}

function btnbuscarDispositivos_Click()
{
	g_bluetoothPlugin.enable(BTConectado, BTFalla);
}

function btnImpresora_Click()
{   
	OcultarDiv('afooter');
    ControlaDiv(PAGINAS.IMPRESORA, TITULOS.IMPRESORA,
        function(){
    		$( "#popupPanel" ).popup( "close" );
    		g_buscarImpresora = true;
    		btnbuscarDispositivos_Click();
            //Primero saca los guardados en la bd que aun no se le da entrada
            PintaImpresoras();
            
            MuestraDiv('aGuardar');
        }
    );
}

function btnPredeterminada_Click(id_impresora)
{
	ImpresoraPredeterminada(id_impresora,
			function()
			{
				BorraGrid('tblPrinters');
				PintaImpresoras();
			}
	);
}

function btnGuardaImpresora_Click()
{
	if($("#txtNombreImp").val()=='')
	{
		Alerta("Get the information name!");
		return;
	}
	
	//Debe guardar
	var objImpresora = new IMPRESORA();
	objImpresora.MAC = $("#bt-devices-select").val();
	objImpresora.Nombre = $("#txtNombreImp").val();
	objImpresora.Predeterminada = aImpresoras.length == 0 ? 1 : 0;
	objImpresora.Tipo = $("#cmbTipoImpresora").val();
	
	GuardaImpresora(objImpresora,
			function()
			{
				PintaImpresoras();
			},
			function()
			{
				Alerta("Error to save information");
			}
	);
	
	$("#txtNombreImp").val("");
}

function txtFactura_blur(txtValor)
{
	if(txtValor.value === '')
		return;
	
	//if($("#cmbNegocioPagos").val() ==='')
	//{
		//Alerta("Select a customer");
		//txtValor.value = '';
		//return;
	//}
	
	
	
	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Invoice ...");
	ObtieneFactura(txtValor.value,
			function(tx, results)
			{
				if(results.rows.length > 0){
					if(g_isdebug)
						console.log("txtFactura_blur results.rows.item(0).tipo_venta:" + results.rows.item(0).tipo_venta + "objVentas.id_cliente:" + objVentas.objCliente.id_cliente);
					
					if(results.rows.item(0).tipo_venta === TIPOVENTA.VENTA && objVentas.objCliente.id_cliente ==  results.rows.item(0).id_cliente)
					{
						navigator.notification.activityStop();
						$("#txtMonto").val(results.rows.item(0).monto_total);
						//PosicionarOptionXValue("cmbNegocioPagos", results.rows.item(0).id_cliente);
						$("#hfTotalFactura").val(results.rows.item(0).monto_total);						
					} else {
						navigator.notification.activityStop();
						$("#txtMonto").val("");
						txtValor.value = "";
						//PosicionarOption("cmbNegocioPagos", 0);
						$("#hfTotalFactura").val("");
						Alerta("The invoice can not be paid or the invoice is not for this customer");
					}
				}else
					ConsultaFacturaOnLine(txtValor.value);
			},
			function()
			{
		
			}
	);
	
}

function txtLote_Blur(txtValor)
{   
	//alert("Producto Valor: ");
	
	txtValor.value = String(txtValor.value).toUpperCase();
	if(g_isdebug)
		console.log("txtLote_Blur txtValor.value:" + txtValor.value);
	if(productoSeleccionado != null)
	{
		if(g_isdebug)
			console.log("txtLote_Blur no nulo");
		if(txtValor.value != '')
			productoSeleccionado.Lote = txtValor.value;		
		
		if($("#txtCodigo").val() != '' && txtValor.value != '')			
			BuscaPrecioEnLista(productoSeleccionado.Id_producto, productoSeleccionado.Lote, objUsuario.id_distribuidor);
		
		$("#txtCodigo").val(productoSeleccionado.Clave + "/" + txtValor.value);
		
		//var chkManual = $("#chkManual");
		//if (chkManual.is (':checked'));
		
		//si es traspaso y manual, deshabilita precio y lo pone en 0.00
		if(objUsuario.operacion != TIPOVENTA.GENERICO)
		{
			$("#txtPrecio").val("0.0");
		}
	}else{
		if(g_isdebug)
			console.log("txtLote_Blur producto null");
	}
}

function btnCierre_Click()
{
	OcultarDiv('afooter');
    var objUsuarioPrevio = new LOGIN();
    ObtieneUsuarioAnterior(
            function(tx, results)
            { 
            	$( "#popupPanel" ).popup( "close" );
                if(results.rows.length > 0)
                {                   
                    objUsuarioPrevio.usuarioPrevio.Id_Usuario = results.rows.item(0).Id_Usuario;
                    objUsuarioPrevio.usuarioPrevio.Clave = results.rows.item(0).Usuario;                   
                    objUsuarioPrevio.usuarioPrevio.Password = results.rows.item(0).Password;
                    objUsuarioPrevio.usuarioPrevio.version = results.rows.item(0).version;
                    objUsuarioPrevio.usuarioPrevio.impresora = results.rows.item(0).impresora;
                    objUsuarioPrevio.usuarioPrevio.Id_Vendedor = results.rows.item(0).Id_Vendedor;
                    objUsuarioPrevio.usuarioPrevio.Id_Ruta = results.rows.item(0).Id_Ruta;
                    objUsuarioPrevio.usuarioPrevio.id_distribuidor = results.rows.item(0).id_distribuidor;
                    objUsuarioPrevio.usuarioPrevio.Id_asignacion_Ruta = results.rows.item(0).Id_asignacion_Ruta;
                    objUsuarioPrevio.usuarioPrevio.Id_Almacen = results.rows.item(0).Id_Almacen;
                    objUsuarioPrevio.usuarioPrevio.Id_Vendedor = results.rows.item(0).Id_Vendedor;
                    objUsuarioPrevio.usuarioPrevio.num_factura = results.rows.item(0).num_factura;
                    objUsuarioPrevio.usuarioPrevio.codigo_ruta = results.rows.item(0).codigo_ruta;
                                        
                    objUsuarioPrevio.TotalVentas = results.rows.item(0).TotalVentas;                    
                    objUsuarioPrevio.TotalVentasNoEnviadas = results.rows.item(0).TotalVentasNoEnviadas;
                    objUsuarioPrevio.TotalCancelaciones = results.rows.item(0).TotalCancelaciones;
                    objUsuarioPrevio.TotalMovimientos = results.rows.item(0).TotalMovimientos;
                    objUsuarioPrevio.TotalMovimientosNoEnviados = results.rows.item(0).TotalMovimientosNoEnviados;
                    objUsuarioPrevio.TotalMovimientosCerrados = results.rows.item(0).TotalMovimientosCerrados;
                    objUsuarioPrevio.TotalPagosNoEnviados = results.rows.item(0).TotalPagosNoEnviados;
                    objUsuarioPrevio.TotalCancelacionesPagos = results.rows.item(0).TotalCancelacionesPagos;
                    
                    /*alert("objUsuarioPrevio.TotalVentas:" + objUsuarioPrevio.TotalVentas);
                    alert("objUsuarioPrevio.TotalVentasNoEnviadas:" + objUsuarioPrevio.TotalVentasNoEnviadas);
                    alert("objUsuarioPrevio.TotalCancelaciones:" + objUsuarioPrevio.TotalCancelaciones);
                    alert("objUsuarioPrevio.TotalMovimientos:" + objUsuarioPrevio.TotalMovimientos);
                    alert("objUsuarioPrevio.TotalMovimientosNoEnviados:" + objUsuarioPrevio.TotalMovimientosNoEnviados);
                    alert("objUsuarioPrevio.TotalMovimientosCerrados:" + objUsuarioPrevio.TotalMovimientosCerrados);
                    alert("objUsuarioPrevio.TotalPagosNoEnviados:" + objUsuarioPrevio.TotalPagosNoEnviados);*/
                    
                    objUsuarioPrevio.loggueado = true;
                    
                    if(ONLINE == 1)
                        VerificaCierre(objUsuarioPrevio);
                    else
                        Alerta('We can not send the daily close\nCheck your internet services.');
                }
                                
            }, function()
            {
                alert('Error btnCierre_Click');
            }
    );
}

function btnEnviarPedientes_Click()
{
   if($('#tblNoEnviadas >tbody >tr').length <= 1){
       Alerta("There are not transaction");
       return;
   }
   
   navigator.notification.activityStart(NOMBRE_APLICACION, "Wait, Getting information");
   
   clearTimeout(offlineFunction);
   
   ObtieneMovimientosNoEnviados(
           function(tx, results)
           {
               if(results.rows.length > 0)                                                                                 
                   ProcesaMovimientoPendientes(results);
               else
            	   VerificaTransacionesPendientes();
           }
   );  
   
}

function btnImprimir_Click()
{
	 navigator.notification.confirm(
             'Esta seguro que desea usar esta firma?. No se podra modificar.',
             function(buttonIndex)
             {   
                 if(buttonIndex == 1)
                 {
                	 objVentas.image = getImagenFirma();
                	 if(objVentas.image != null)
                     {
                		 objVentas.srcImage = navigator.camera.DestinationType.FILE_URI;
                		 if(g_isdebug)
                			 console.log("btnImprimir_Click objVentas.srcImage:" + objVentas.srcImage);
                     }else
                    	 Impresion();
                 }//else
                	// LimpiarVenta();
             },
             NOMBRE_APLICACION,
             'Si,No'
     );            	
}

function btnPagos_Click(id_cliente, factura, monto)
{
	if(g_isdebug)console.log("btnPagos_Click objUsuario.operacion:" + objUsuario.operacion + "|objVentas:" + (objVentas ? "venta" : "null"));
	if(objVentas != null)
		objVentas.pagosVentas = objUsuario.operacion;
	
	LlenaComboImpresion();
	aPagos = new Array();
	
    //objUsuario.operacion = TIPOVENTA.PAGOS;
    var aPagosParametros = new Array();
    
    ControlaDiv(PAGINAS.PAGOS, TITULOS.PAGOS,
            function(){
                GPSgetCurrentPosition();
                $( "#popupPanel" ).popup( "close" );
                MuestraDiv('aGuardar');
                if(id_cliente != null)
                {
                	if(g_isdebug)
                		console.log("btnPagos_Click no es nulo id_cliente");
                	aPagosParametros[0] = id_cliente;
                	aPagosParametros[1] = factura;
                	aPagosParametros[2] = monto;
                	$("#hfPagos").val(aPagosParametros.join('@'));
                	
                	//ListaPagoscliente(id_cliente);
                	if(objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
                		objVentas.pagosVentas =1;
                	else
                		$("#hfTotalFactura").val(monto);
                	
                	MuestraDiv('btnCancelarPagos');
                } else{
                	$("#hfPagos").val('');
                	OcultarDiv('btnCancelarPagos');
                }
                objUsuario.operacion = TIPOVENTA.PAGOS;

                if(objVentas != null)
                {
                	if(g_isdebug)
                		console.log("btnPagos_Click objVentas no es nulo otroCliente:" + otroCliente);
                	LlenaComboNegocios('cmbNegocioPagos', FILTER_COMBO);
                	//es venta ocuta el boton otro
                	OcultarDiv('btnOtrosClientes');
                } else
                {
                	if(g_isdebug)
                		console.log("btnPagos_Click objVentas es nulo");
                	//Pago directo, muestra boton otros
                	MuestraDiv('btnOtrosClientes');
                	LlenaComboNegocios('cmbNegocioPagos', false);
                }
                    
                DeshabilitaInput('txtNumCheque');
                //Si tiene mas de un dato, quiee decir que viene de una venta
                //cliente@factura@monto
                if(aPagosParametros.length > 0)
                {
                	objVentas.ventaConPago = true;
                	$("#txtFactura").val(aPagosParametros[1]);
                	$("#txtMonto").val(aPagosParametros[2]);
                	DeshabilitaInput('txtFactura');
                }else {
                	$("#txtFactura").val('');
                	$("#txtMonto").val('0.00');
                	HabilitaInput('txtFactura');
                	objVentas.ventaConPago = false;
                }     
            }
    );
}

function cmbTipoPago_Change(combo)
{
	if(combo.value == '1')
		DeshabilitaInput('txtNumCheque');
	else
	{
		HabilitaInput('txtNumCheque');
		setFocus('txtNumCheque');
	}
	$('#txtNumCheque').val('');
}

function btnPagar_Click()
{		
	var i = 0, pos = 0;
	var total  = 0;
	LlenaComboImpresion();
	if(aPagos.length ==0)
	{
		Alerta('Please, insert the payment');
		return;
	}
	//navigator.notification.activityStart(NOMBRE_APLICACION, "Registrando pago");
	ShowSpinner("Save information");
	g_procesando_pagos = true;
	total = aPagos.length;
	for(i = 0; i < total; i++)
	{
	GuardaPago(
			aPagos[i],
			function(tx)
			{
				ObtieneIdPagos(
						function(tx, results)
						{							
							if(results.rows.length >0)
			    			{
								var id_pago = parseInt(results.rows.item(0).id_pago);
								//console.log("btnPagar_Click id_pago:" + id_pago);
								//console.log("btnPagar_Click aPagos[pos]:" + aPagos[pos] + "|pos:" + pos);
								aPagos[pos].id_pago = id_pago;
								pos++;
								
								if(pos == total)
								{
									if(ONLINE == 1)
										EnviarPago(aPagos);					    			
									Alerta('Payment save correct');

									$('#txtNumCheque').val('');
									$('#txtFactura').val('');
									$('#txtMonto').val('');
									$('#txtComentarios').val('');
									//BorraGrid("tblPagos");
									g_procesando_venta = false;
								}			    				
			    			}else
			    				Alerta('Error save payment');
							HideSpinner();
							//navigator.notification.activityStop();
							//pregunta impresion solo si viene de una venta
							if(objVentas != null && objVentas.pagosVentas == TIPOVENTA.VENTA)
							{
								if(pos == total)
								{
									g_procesando_pagos = true;
									objUsuario.operacion = objVentas.pagosVentas;
									objVentas.aPagos = aPagos;
									//ImprimirVenta();
								}
							}else{
								if(pos == total)
								{
									g_procesando_pagos = true; // checar
									HideSpinner();
									if(objUsuario.operacion == TIPOVENTA.PAYMENTS)
									{
										rptPagos = aPagos;										
									}
								}
							}
						},
						function ()
						{
							HideSpinner();
							//navigator.notification.activityStop();
							Alerta('Error to get the payment code');
						}
				);				
			},
			function()
			{
				HideSpinner();
				//navigator.notification.activityStop();
				Alerta('Error to insert the payment');
			}
	);
	}
}

function cmbNegocioPagos_change(cmbNegocio)
{
	if(cmbNegocio.value != '')
	{
		$("#hfPagos").val(cmbNegocio.value+'@@0.00');
		$("#txtFactura").val('');
		$("#txtNumCheque").val('');
		$("#txtMonto").val('0.00');
		//ListaPagoscliente(cmbNegocio.value);
	}
}

function btnAgregarPago_Click()
{
	if($("#txtFactura").val() == '')
	{
		Alerta('Type a invoice');
		setFocus('txtFactura');
		return;
	}

	if($("#cmbNegocioPagos").val() == VALOR_INICIALCMBCLIENTE)
	{
		Alerta('Select a customer');
		setFocus('cmbNegocioPagos');
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

	if($("#cmbNegocioPagos").val() == '')
	{
		Alerta('Select a customer');
		setFocus('cmbNegocioPagos');
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
	
	// array que guarda la info de  $("#hfPagos").val(objVentas.objCliente.id_cliente+'@'+objVentas.folio+'@'+objVentas.montoPagar);
	//$("#hfTotalFactura").val(objVentas.montoPagar);
	var aPagosConf = new Array();
	aPagosConf = String($("#hfPagos").val()).split('@');

	objPago.Enviada = 0;
	objPago.Fecha = aFecha[0];
	objPago.Hora = aFecha[1];		
	objPago.id_pago = 0;
	if(g_isdebug) console.log("btnAgregarPago_Click TIPOVENTA.VENTA:" + TIPOVENTA.VENTA + "|pagosVentas:" + (objVentas ? objVentas.pagosVentas : "N/A"));
	if(objVentas != null && objVentas.pagosVentas === TIPOVENTA.VENTA)
		objPago.codigo_cliente =objVentas.objCliente.codigo_cliente; 
	else
		objPago.codigo_cliente = '';

	objPago.objPagosRuta.Comentarios = $("#txtComentarios").val();
	objPago.objPagosRuta.Factura = $("#txtFactura").val();
	objPago.objPagosRuta.Fecha_creacion = strFechaActual;
	objPago.objPagosRuta.Id_asignacion_ruta = objUsuario.Id_asignacion_Ruta;
	objPago.objPagosRuta.Id_cliente = objVentas.objCliente.id_cliente;// parseInt($("#cmbNegocioPagos").val());
	objPago.objPagosRuta.Id_distribuidor = objUsuario.id_distribuidor;
	objPago.objPagosRuta.Id_tipo_pago = parseInt($("#cmbTipoPago").val());
	objPago.objPagosRuta.Numero_cheque = $('#txtNumCheque').val();
	objPago.objPagosRuta.Id_usuario = objUsuario.Id_Usuario;
	objPago.objPagosRuta.Monto = parseFloat($("#txtMonto").val()).toFixed(2);
	//objPago.monto_total = parseFloat(aPagosConf[2]).toFixed(2);

	if(g_isdebug)console.log("btnAgregarPago_Click iniciando proceso");
	//Si es venta valida
	
	if(objVentas != null && objVentas.id_tipo_venta === TIPOVENTA.VENTA)
	{	// monto de la factura que viene del control que esta oculto
		objPago.monto_total = parseFloat(aPagosConf[2]).toFixed(2);
		aPagos[aPagos.length] = objPago;
		aPagos[aPagos.length-1].id = aPagos.length-1;
		if(g_isdebug)console.log("btnAgregarPago_Click es venta");
	
	// valida si la factura ya tiene un pago y si es asi cuanto lleva
		var totalPagos = parseFloat(ValidaTotalPago(objPago.objPagosRuta.Factura)).toFixed(2);
		if(g_isdebug)console.log("btnAgregarPago_Click validando importe objVentas.total:" + objVentas.total+"|totalPagos:" +totalPagos);
		if(g_isdebug)console.log("btnAgregarPago_Click aPagos.length:" + aPagos.length);
		
		if(totalPagos <= objVentas.montoPagar)
		{
			if(g_isdebug)console.log("btnAgregarPago_Click aPagos.length:" + aPagos.length);
			ListaPagoscliente();
			
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
	else
	{
			Alerta("The invoice  : " + objPago.objPagosRuta.Factura +"\n can not be paid");
			return;
	}
}

function btnCancelarPagos_Click()
{
	aPagos = new Array();
	
	if(objVentas != null)
	{
		if(objVentas.pagosVentas !== TIPOVENTA.SEARCHINVOICE)
		{
			objUsuario.operacion = objVentas.pagosVentas;
			objVentas.aPagos = new Array();
			ImprimirVenta();
		} else 
			btnSearchInvoice_Click();
	}
}

function btnOtrosClientes_Click()
{
	//if(objVentas != null)
	//{
		if(clienteSeleccionado != null)
		{
			navigator.notification.confirm(
		            'The information will be delete\n Do you want continue?',
		            function(buttonIndex)
		            {               
		                if(buttonIndex == 1)
		                {
		                	if(objUsuario.operacion === TIPOVENTA.PAGOS)
		                	{
		                		otroCliente = true;		                		
		                		LlenaComboNegocios('cmbNegocioPagos', true);
		                		//TODO: debe limpiar los pagos
		                	}else
		                	{
		                		otroCliente = true;
		                		LimpiarVenta(true);
			        			LlenaComboNegocios('cmbNegocio', true);
		                	}		                	             
		                }
		            },
		            NOMBRE_APLICACION,
		            'Yes,No'
		    );			
		}else
		{
			if(objUsuario.operacion === TIPOVENTA.PAGOS)
				LlenaComboNegocios('cmbNegocioPagos', true);
			else
				LlenaComboNegocios('cmbNegocio', true);
			
			otroCliente = true;
		}
}

function txtCajas_Blur(txtValor)
{  
    if(String(txtValor.value).indexOf('.') >= 0)
    {
        Alerta("The amount is incorrect.");
        txtValor.value = '';
        return;
    }
}

function btnEliminarImpresora_Click(id_impresora)
{
	navigator.notification.confirm(
		            'Do you want delete the printer?',
		            function(buttonIndex)
		            {
		                if(buttonIndex == 1)
		                {
							EliminaImpresora(id_impresora,
								function(){
									if(aImpresoras.length > 1)
									{		
										btnPredeterminada_Click(aImpresoras[1].id_impresora);
									}else
										PintaImpresoras();
								},
								function(){
									Alerta("Error to delete the printer");
								} 
							);
		                }
		            },
		            NOMBRE_APLICACION,
		            'Yes,No'
		    );	
}
//Fin Eventos

//Envio de transacciones
function RegistraVenta()
{
	var id_venta = 0;
	var cantidad = 0.0, cajas=0.0;
	
	//27102013: se pone variable booleana, tratando de evitar la duplicidad
	//No hay un patron para replicarlo pero este if podr�a ayudar
	if(g_procesando_transaccion)
		return;
	
	objVentas.fecha = FechaActual();
	var fechaHora = objVentas.fecha.split(' ');
	
	if(PosicionGPS != null && PosicionObtenida === 1 && g_isdebug==false)
	{
	    objVentas.latitude = (PosicionGPS.coords.latitude == null) ? "0" : PosicionGPS.coords.latitude;
	    objVentas.longitude = (PosicionGPS.coords.longitude == null) ? "0" : PosicionGPS.coords.longitude;
	}else{
		objVentas.latitude = "0";
		objVentas.longitude = "0";
    }
	
	if(isNaN(objUsuario.Id_Ruta))
    {
		g_procesando_venta = false;
        navigator.notification.activityStop();
        Alerta("Error id_ruta incorrect");
        return;
    }
	
	objVentas.Id_Almacen = objUsuario.Id_Almacen;
	objVentas.Id_asignacion_Ruta = objUsuario.Id_asignacion_Ruta;
	objVentas.Id_usuario = objUsuario.Id_Usuario;
	objVentas.Id_distribuidor = objUsuario.id_distribuidor;
    
	objVentas.id_tipo_venta = objUsuario.operacion;
	objVentas.hora = fechaHora[1];
	//navigator.notification.activityStart(NOMBRE_APLICACION, "Registrando venta...");
	ShowSpinner("Save information...");
	g_procesando_transaccion = true;
	
	objUsuario.num_factura = parseInt(objUsuario.num_factura) + 1;
	objVentas.folio = parseInt(objUsuario.num_factura);
	GuardaVentas(objVentas.Id_asignacion_Ruta, String(objVentas.folio),objVentas.Id_Almacen, objVentas.Id_usuario, 
			objVentas.objCliente.id_cliente, objVentas.subtotal, objVentas.total, objVentas.totalProductos, objVentas.status, 0,
			objVentas.longitude, objVentas.latitude, fechaHora[0], fechaHora[1], ESTADOTRANSACCION.NOENVIADA,
			objVentas.id_tipo_venta, objVentas.Id_tipo_credito, 0, objVentas.notaCredito,
            function(tx)
            {
                ObtieneClave(
                		function(tx, results)
                		{
                			if(results.rows.length >0)
                			{
                				id_venta = parseInt(results.rows.item(0).id_venta);
                				if(isNaN(id_venta))
                				{
                					HideSpinner();
                				    //navigator.notification.activityStop();
                				    g_procesando_venta = false;
                	                g_procesando_transaccion = false;
									Alerta("Error Saving information, incorrecto code");
                	                return;
                				}                				
                				if(id_venta > 0)
                				{
                					
                					//Guardar Nota Credito
                					if(objUsuario.operacion == TIPOVENTA.VENTA && objVentas.notaCredito == 1)
     								{
                					
                						var objNotaCredito = new NotasCredito();
                						objNotaCredito.Id_venta =  id_venta;
                						objNotaCredito.Factura = objVentas.Reference;
                						objNotaCredito.Id_cliente = objVentas.objCliente.id_cliente;
                						objNotaCredito.Monto = objVentas.importeNC;
                						objNotaCredito.Status = 1; // aplicado
			                    	
                						GuardarNotaCredito(objNotaCredito);
     								}
									
                					GuardaDetalleVentas(id_venta, objVentas.aProductos);
                					objVentas.id_venta = id_venta;                				
                					
                					//objUsuario.num_factura = parseInt(objUsuario.num_factura) + 1;
                					
                					//Si es demo no modifica inventario
                					if(objUsuario.operacion != TIPOVENTA.DEMO)
                					{
                						for(var j = 0; j < objVentas.aProductosAgrupados.length; j++)
                						{
                							var aProductos = objVentas.aProductosAgrupados[j];
                							for(var i=0; i < aProductos.length;i++)
                							{
                								//Si es venta o promocion decrementa
                								if(objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.PROMOCION)
                								{
                									cantidad = parseFloat(aProductos[i].Existencia) - parseFloat(aProductos[i].Cantidad);                					
                									cajas =parseInt(aProductos[i].caja) - parseInt(aProductos[i].CantidadCaja);

                									cantidad = parseFloat(cantidad).toFixed(2);
                									cajas = parseInt(cajas);
                									
                									if(aProductos[i].status_venta != TIPO_PRODUCTO.COMODIN)
                									    ActualizaExistencia(aProductos[i].Id_producto, aProductos[i].Lote, cantidad, cajas);
                									//SI es credito incrementa
                								}else if(objUsuario.operacion == TIPOVENTA.CREDITO)
                								{
                									cantidad = parseFloat(aProductos[i].Existencia) + parseFloat(aProductos[i].Cantidad);                                   
                									cajas =parseInt(aProductos[i].caja) + parseInt(aProductos[i].CantidadCaja);

                									cantidad = parseFloat(cantidad).toFixed(2);
                									cajas = parseInt(cajas);
                									if(aProductos[i].status_venta != TIPO_PRODUCTO.COMODIN)
                									{
                									    if(objVentas.Id_tipo_credito == TIPOCREDITO.PRODUCTOVENCIDO)
                									        IngresaInventarioMalo(aProductos[i], cantidad, cajas);
                									    else
                									        IngresaInventario(aProductos[i], cantidad, cajas);
                									}
                								}
                							}
                						}
                					}
                					
                					 OcultarDiv("aGuardar");
                					//objVentas.folio = parseInt(objUsuario.num_factura);                					
                					//ActualizaFolioVentas(id_venta, String(objVentas.folio));
                					                					
                					//Si esta online se manda la venta al host
                					//if(ONLINE==1)                				 
                						EnviarVenta(objVentas);                					                				
                					
                					Alerta("Information save correct.");
                					g_procesando_transaccion = false;
                					preimpresion = true;
                					//AgregaPago(objVentas.objCliente.id_cliente, objVentas.folio, objVentas.total);
                				}else{
                					g_procesando_venta = false;
									g_procesando_transaccion = false;
                					Alerta("The information not save correct.");
                					return;
                				}
                			}else
                			{
							g_procesando_transaccion = false;
                				g_procesando_venta = false;
                				Alerta("We could not save the information");                				
                			}
                			HideSpinner();
                			//navigator.notification.activityStop();
                		}
                );
            },
            function()
            {
            	HideSpinner();
            	g_procesando_venta = false;
				g_procesando_transaccion = false;
                //navigator.notification.activityStop();
                Alerta("The information not save correct");                
            }
    );
}

function EnviarVenta(pObjVentas)
{
	var aDetalle = new Array();

	var wws = new IvanWebService(WSURL);

	var objVenta = new ventas();

	g_enviando = true;

	objVenta.Cantidad_cajas=pObjVentas.totalCajas;
	objVenta.Cantidad_productos=pObjVentas.totalProductos;
	objVenta.Estatus= pObjVentas.status;
	objVenta.Factura= pObjVentas.folio;
	objVenta.Facturada=1;
	objVenta.Fecha_venta= pObjVentas.fecha;
	objVenta.Id_asignacion_ruta= pObjVentas.Id_asignacion_Ruta;
    objVenta.Id_cliente= pObjVentas.objCliente.id_cliente;
    objVenta.Id_ruta= objUsuario.Id_Ruta;
    objVenta.Id_tipo_venta= pObjVentas.id_tipo_venta;//TODO: OFFSET_OPERACION
    objVenta.Id_usuario= pObjVentas.Id_usuario;
    objVenta.Imei= g_imei;
    objVenta.Latitud= pObjVentas.latitude;
    objVenta.Longitud = pObjVentas.longitude;
    objVenta.Monto_descuento = 0.0;
    objVenta.Monto_iva = 0.0;
    objVenta.Monto_otrosdescuentos = 0.0;
    objVenta.Monto_subtotal = pObjVentas.subtotal;
    objVenta.Monto_total = pObjVentas.total;
    objVenta.Pagada = 0;//TODO: checar cuando va 1
    objVenta.Id_tipo_credito = pObjVentas.Id_tipo_credito;

	for(var i=0; i < pObjVentas.aProductos.length; i++)
	{
		var objDetalle =  new VentasDet();
		//objDetalle.Id_unidad_medida = pObjVentas.aProductos[i].id_unidad_medida;
		
		objDetalle.Cajas = pObjVentas.aProductos[i].CantidadCaja;
		objDetalle.Cantidad= pObjVentas.aProductos[i].Cantidad;
		objDetalle.Estatus=1;
		objDetalle.Fecha_venta =  pObjVentas.fecha;
		objDetalle.Id_producto= pObjVentas.aProductos[i].Id_producto;
		objDetalle.Id_unidad_medida= pObjVentas.aProductos[i].id_unidad_medida;
		objDetalle.Id_usuario= pObjVentas.Id_usuario;
		objDetalle.Id_venta = pObjVentas.id_venta;
		objDetalle.Lote= pObjVentas.aProductos[i].Lote;
		objDetalle.Monto_descuento = 0.0;
		objDetalle.Monto_iva = 0.0;
		objDetalle.Monto_subtotal = pObjVentas.aProductos[i].subtotal;
		objDetalle.Monto_total = pObjVentas.aProductos[i].total;
		objDetalle.Precio_unitario = pObjVentas.aProductos[i].Precio;
		objDetalle.Automatico = parseInt(pObjVentas.aProductos[i].tipo_captura) == TIPO_CAPTURA.LECTOR ? 1 : 0;

		aDetalle[aDetalle.length] = objDetalle;
	}

	//Como se pasa un objeto en el primer parametro no se especifica el nombre del mismo lo toma de la instacia
	//para el segundo caso se trata de un array por lo que tomara el nombre del parametro y dentro de este tag
	//agregara los objetos con sus respectivo nombre
	if(pObjVentas.status === STATUSVENTAS.ACTIVA)
	{           
		wws.callWCFObject(METODOS.METODO_ENVIARVENTAS, false, new Array("ventas", objVenta, "ventas_detalle", aDetalle, "msj", ""), INTERFAZ_SERVICIO);

	}else{        
		wws.callWCFObject(METODOS.METODO_CANCELARVENTAS, false, new Array("ventas", objVenta, "msj", ""), INTERFAZ_SERVICIO);
	}
	var retVal = false;
	retVal = wws.result;
	var objError = new ERROR();

	if(retVal != null)
	{
	    //alert("Ventas:" + retVal);
		if(pObjVentas.status === STATUSVENTAS.ACTIVA)
		{
			objError = LeerXmlRespuestaTransaccion(retVal, "EnviarVentasResponse", "EnviarVentasResult");
		}else{
			objError = LeerXmlRespuestaTransaccion(retVal, "CancelarVentasResponse", "CancelarVentasResult");
		}
		if(objError.numError === SUCCESS){
			if(pObjVentas.status === STATUSVENTAS.ACTIVA)
				ActualizaEnviadaVentas(pObjVentas.id_venta, ESTADOTRANSACCION.ENVIADA);
			else{    			
				//EliminaCancelacionOffline(pObjVentas.id_venta);
				ActualizaEnviadaCancelacion(pObjVentas.id_venta);
				//TODO: verificar si aqui se debe cambiar el status
				ActualizaStatusVentas(pObjVentas.id_venta, STATUSVENTAS.CANCELADA);
			}
			if(curWindow == PAGINAS.PENDIENTES)
				EliminaFilaTabla("tblNoEnviadas",  pObjVentas.folio, pObjVentas.status == STATUSVENTAS.ACTIVA ? pObjVentas.id_tipo_venta : TIPOVENTA.CANCELACION);
		}else
			if(objError.msj !== '')
				Alerta("Error:" + objError.msj);
	}
	g_enviando = false;
	
	LimpiaArray(aDetalle);
}

function EnviarTraspaso(pObjVentas)
{
	var aDetalle = new Array();
	var wws = new IvanWebService(WSURL);

	g_enviando = true;
	
	for(var i=0; i < pObjVentas.aProductos.length; i++)
	{
		var objDetalle =  new MovimientosDet();
		
		objDetalle.Cantidad_cajas = pObjVentas.aProductos[i].CantidadCaja;
		objDetalle.Cantidad= pObjVentas.aProductos[i].Cantidad;		
		objDetalle.Id_almacen= pObjVentas.aProductos[i].Id_almacen;
		objDetalle.Id_producto= pObjVentas.aProductos[i].Id_producto;
		objDetalle.Id_unidad_medida = pObjVentas.aProductos[i].id_unidad_medida;		
		objDetalle.Id_usuario =  pObjVentas.Id_usuario;
		objDetalle.Lote= pObjVentas.aProductos[i].Lote;
		
		aDetalle[aDetalle.length] = objDetalle;
	}


	wws.callWCFObject(METODOS.METODO_OBTENERMOVIMIENTOSOUT, false, new Array("id_movimiento_enc", pObjVentas.id_movimiento_enc, "movimientoDetail", aDetalle, "msj", ""), INTERFAZ_SERVICIO);
	
	var retVal = false;
	retVal = wws.result;
	var objError = new ERROR();

	if(g_isdebug)
		console.log("retVal:" + retVal);
	if(retVal != null)
	{
		objError = LeerXmlRespuestaTransaccion(retVal, "MovimientoOutResponse", "MovimientoOutResult");
		if(objError.numError === SUCCESS){			
		{	
			ActualizaEnviadaMovimiento(pObjVentas.id_movimiento_enc);
			if(curWindow == PAGINAS.PENDIENTES)
				EliminaFilaTabla("tblNoEnviadas",  pObjVentas.id_movimiento_enc, TIPOVENTA.GENERICO);
		}
		}else
			Alerta("Error:" + objError.msj);
	}
	g_enviando = false;
	LimpiaArray(aDetalle);
}

function EnviarPago(pObjPago)
{
	var wws = new IvanWebService(WSURL);
	
	g_enviando = true;
	var aPagos = new Array();
	
	for(var i=0; i < pObjPago.length; i++)
		aPagos[i] = pObjPago[i].objPagosRuta;

	wws.callWCFObject(METODOS.METODO_AGREGARPAGOS, false, new Array("pagos", aPagos, "msj", ""), INTERFAZ_SERVICIO);
	
	var retVal = false;
	retVal = wws.result;
	var objError = new ERROR();

	if(g_isdebug)
		console.log("retVal:" + retVal);
	if(retVal != null)
	{
		objError = LeerXmlRespuestaTransaccion(retVal, "AgregarPagosResponse", "AgregarPagosResult");
		if(objError.numError === SUCCESS){
			for(var i=0; i < pObjPago.length; i++)
			{
				if(g_isdebug)
					console.log("EnviarPago pObjPago[i].id_pago:" + pObjPago[i].id_pago);
			    ActualizaEnviadoPago(pObjPago[i].id_pago);
			    if(curWindow == PAGINAS.PENDIENTES)
					EliminaFilaTabla("tblNoEnviadas",  pObjPago[i].id_pago, TIPOVENTA.PAGOS);
			}
		}else
			Alerta("Error:" + objError.msj);
	}
	g_enviando = false;
	LimpiaArray(aPagos);
}

function EnviarCancelarPago(oPago, id_pago)
{
	var wws = new IvanWebService(WSURL);	
	g_enviando = true;

	wws.callWCFObject(METODOS.METODO_CANCELPAGOS, false, new Array("p", oPago, "msj", ""), INTERFAZ_SERVICIO);
	
	var retVal = false;
	retVal = wws.result;
	var objError = new ERROR();

	if(g_isdebug)console.log("retVal:" + retVal);
	if(retVal != null)
	{
		objError = LeerXmlRespuestaTransaccion(retVal, "CancelPagosResponse", "CancelPagosResult");
		if(objError.numError === SUCCESS){			
			if(g_isdebug)console.log("EnviarCancelarPago id_pago:" + id_pago);
			ActualizaEnviadoPagoCancelado(id_pago);
		    if(curWindow == PAGINAS.PENDIENTES)
				EliminaFilaTabla("tblNoEnviadas", id_pago, TIPOVENTA.PAGOCANCEL);			
		}else
			Alerta("Error:" + objError.msj);
	}
	g_enviando = false;
}

function EnviarCierre()
{
    navigator.notification.activityStart(NOMBRE_APLICACION, "Wait, Sending daily close...");
    var wws = new IvanWebService(WSURL);
    
    wws.callWCFObject(METODOS.METODO_ENVIARCIERRE, false, new Array("IdAsignacionRuta", objUsuario.Id_asignacion_Ruta, "IdUsuario", objUsuario.Id_Usuario, "msj", ""), INTERFAZ_SERVICIO);
    
    var retVal = false;
    retVal = wws.result;
    var objError = new ERROR();
    var isClosed = false;
    
    if(retVal != null)
    {
        objError = LeerXmlRespuestaTransaccion(retVal, "ObtenerCierredelDiaResponse", "ObtenerCierredelDiaResult");        
        if(objError.numError === SUCCESS)
        {
        	OcultarDiv('aMenu');
        	if(g_isdebug)
        		console.log("EnviarCierre Elimina");
            EliminaTransacciones(
            		function()
            		{
            			isClosed = true;
            			if(g_isdebug)console.log("EnviarCierre logueado");                        
            		},
            		function()
            		{
            			
            		}
            );            
            Alerta('The information save correct.');
            if(isClosed) {
            	aEntidadesEnBD = new Array();
                ConsultaUsuarioLogueado();
                if(g_isdebug)console.log("EnviarCierre entidades");
                ConsultaEntidades();
            }
            //ControlaDiv('login', TITULOS.INICIO, null);
            ObtieneCodigoCliente(
            	function(tx, result) {    		
            		if(result.rows.length > 0) {
            			var i = 0;
            			oClienteApp.codigoCliente = result.rows.item(i).codigoCliente;
            			oClienteApp.Logo = result.rows.item(i).Logo;
            			oClienteApp.NombreCliente = result.rows.item(i).NombreCliente;
            			oClienteApp.Predeterminada = result.rows.item(i).Predeterminada;
            			oClienteApp.Url = result.rows.item(i).Url;
            			WSURL = result.rows.item(i).Url;
            			GotoLogin();
            		} else {
            			InsertaCodigoClientes();
            			curWindow = 'codigo-cliente';
            			WSURL = '';
            			GotoRegistro();
            		}
            	}
            );
            
        }else
            Alerta('Error to send the information:\n' + objError.msj);
    }
    navigator.notification.activityStop();
}

function LeerXmlRespuestaTransaccion(xml, rootName, tagName)
{
	var objError = new ERROR();
	try
    {
	    $(xml).find(String(rootName)).each(            
	            function() {
	                objError.numError = $(this).find(tagName).text();
	                objError.msj = $(this).find("msj").text();
	            }
	    );
    }catch(err)
    {
        objError.numError = '0';
        objError.msj = 'Error al Parsear';
    }
	return objError;
}

function ValidaInventarioACancelar(id_venta, enviada, id_tipo_credito)
{
	var satisface = true;
	if(g_isdebug) console.log("ValidaInventarioACancelar");
	//Si es credito y es producto bueno, checa si el inventario satisface la cancelacion
	if(objUsuario.operacion == TIPOVENTA.CREDITO && id_tipo_credito == TIPOCREDITO.PRODUCTOBUENO)
	{
		ObtieneInventarioCancelacion(id_venta,
			function(tx, results){
			if(g_isdebug) console.log("ValidaInventarioACancelar len:" + results.rows.length );
				if(results.rows.length > 0)
				{
					for(var i=0; i < results.rows.length; i++)
					{
						if(g_isdebug)
						{		console.log("ValidaInventarioACancelar cantInventario:" + parseFloat(results.rows.item(i).cantInventario).toFixed(2) + "|cantVenta:" + parseFloat(results.rows.item(i).cantVenta).toFixed(2));
						console.log("ValidaInventarioACancelar cajaInventario:" + parseInt(results.rows.item(i).cajaInventario) + "|cajaVenta:" + parseInt(results.rows.item(i).cajaVenta));
						}
						if(parseFloat(results.rows.item(i).cantInventario).toFixed(2) < parseFloat(results.rows.item(i).cantVenta).toFixed(2) || 
								parseInt(results.rows.item(i).cajaInventario) < parseInt(results.rows.item(i).cajaVenta)	
						)
						{
							satisface = false;
							break;
						}
					}
					if(satisface)
					{
						GPSgetCurrentPosition();
	                    CancelarVenta(id_venta, enviada, id_tipo_credito);
	                    $("input[name='group1']:checked").attr('disabled', 'disabled');
	                    id = $("input[name='group1']:checked").attr('id');
	                    ControlaCheckbox(id, false);
					}else
						Alerta("no se puede cancelar debido a que el inventario del credito esta incompleto");
				}else
				{
					Alerta("ssss");
				}
			},
			function(){
				Alerta("Error ObtieneInventarioCancelacion");
			}
		);
	}else{
		GPSgetCurrentPosition();
		if(g_isdebug)
			console.log("CancelarVenta id_venta:" + id_venta + "|enviada:" + enviada + "|id_tipo_credito:" + id_tipo_credito );
		
        CancelarVenta(id_venta, enviada, id_tipo_credito);
        $("input[name='group1']:checked").attr('disabled', 'disabled');
        id = $("input[name='group1']:checked").attr('id');
        ControlaCheckbox(id, false);
	}
}

function CancelarVenta(id_venta, enviada, id_tipo_credito)
{
    var aFechaHora = FechaActual().split(' ');
    var longitud = '';
    var latitude = '';
    
    if(g_isdebug)console.log("CancelarVenta id_venta:" + id_venta + "|enviada:" + enviada + "|id_tipo_credito:" + id_tipo_credito);
    
    ShowSpinner("Cancel Movements...");
    
    if(PosicionGPS != null && PosicionObtenida === 1 && g_isdebug==false)
    {
        latitude = (PosicionGPS.coords.latitude == null) ? "0" : PosicionGPS.coords.latitude;
        longitud = (PosicionGPS.coords.longitude == null) ? "0" : PosicionGPS.coords.longitude;
    }else{
    	latitude = "0";
        longitud = "0";
    }
    
    var objCancelacion = new CANCELACION();
    objCancelacion.id_venta = id_venta; 
    objCancelacion.longitud = longitud;
    objCancelacion.latitude = latitude;
    objCancelacion.fecha = aFechaHora[0];
    objCancelacion.hora = aFechaHora[1];
    objCancelacion.Id_Usuario = objUsuario.Id_Usuario;
    objCancelacion.enviada = ESTADOTRANSACCION.NOENVIADA;
    objCancelacion.id_tipo_credito =  id_tipo_credito;
    
    if(g_isdebug)console.log("CancelarVenta objUsuario.operacion:" + objUsuario.operacion + "|PAGOS:"+TIPOVENTA.PAGOCANCEL);
    
    if(objUsuario.operacion === TIPOVENTA.PAGOCANCEL)
    {
    	GuardaCancelacionPago(objCancelacion);
    	//Se hace el envio unicamente si el pago fue previamente enviado
		if(parseInt(enviada) === ESTADOTRANSACCION.ENVIADA)
		{
			//si esta enviada y esta online se envia al host
			if(ONLINE===1)
			{
				if(g_isdebug)console.log("CancelarVenta Enviar pago");
				ObtienePagoPorId(id_venta,
					function(tx, result) {
						if(result.rows.length > 0)
						{
							var oPago  = new p();
							var row = result.rows.item(0);							
														
							oPago.Comentarios = row.Comentarios;
							oPago.Factura = row.Factura;
							oPago.Fecha_creacion = row.Fecha + ' ' + row.Hora;
							oPago.Id_asignacion_ruta = row.Id_asignacion_ruta;
							oPago.Id_cliente = row.Id_cliente;
							oPago.Id_distribuidor = row.Id_distribuidor;
							oPago.Id_tipo_pago = row.Id_tipo_pago;
							oPago.Id_usuario = row.Id_usuario;
							oPago.Monto = row.monto;
							oPago.Numero_cheque = row.Numero_cheque;
							
							EnviarCancelarPago(oPago, id_venta);
						}
						g_procesando_venta = false;
					},
					function() {
						alert("Error Getting the payment");
						g_procesando_venta = false;
					}
				);				
			    
			}else
				g_procesando_venta = false;
		}else
			g_procesando_venta = false;
		
    } else {
    	//Siempre se guarda la cancelacion y se decrementa el inventario
	    GuardaCancelacion(objCancelacion);
	    //TODO: valida si no es demo, por que demo no afecta inventario, checar si es necesario la validacion
	    if(objUsuario.operacion != TIPOVENTA.DEMO) // && parseInt(id_tipo_credito) != TIPOCREDITO.PRODUCTOVENCIDO
	        ActualizaInventarioCancelado(id_venta, id_tipo_credito);
	    
	    if(objUsuario.operacion === TIPOVENTA.VENTA)
	    {
	    	GuardaCancelacionNC(id_venta);
	    	GuardaCancelacionPagoVenta(objCancelacion);
	    }
	    
	    //Se hace el envio unicamente si la venta fue previamente enviada
		if(parseInt(enviada) === ESTADOTRANSACCION.ENVIADA)
		{	    
			if(g_isdebug)console.log("CancelarVenta no enviada");
			//cambiamos estatus a la venta a cancelada
			ActualizaStatusVentas(id_venta, STATUSVENTAS.CANCELADA);
			//si esta enviada y esta online se envia al host
			if(ONLINE===1)
			{
				if(g_isdebug)console.log("CancelarVenta Enviar");
			    RegitrarCancelacion(objCancelacion);
			    g_procesando_venta = false;
			}else
				g_procesando_venta = false;
		}else
			g_procesando_venta = false;		    	
    }
	
	HideSpinner();
}

function ActualizaInventarioCancelado(id_venta, id_tipo_credito)
{
	//TODO: solo aqui se debe sacar de la tabla  de inventario vencido
    var total = 0;
    var _imprimir = 0;
    if(g_isdebug)
    	console.log("ActualizaInventarioCancelado id_venta:" + id_venta + "|id_tipo_credito:" + id_tipo_credito + "|objUsuario.operacion:" + objUsuario.operacion);
    ObtieneDetalleVentaId(id_venta, id_tipo_credito,_imprimir,
            function(tx, results)
            {
                total = results.rows.length;
                if(g_isdebug)
                	console.log("ActualizaInventarioCancelado total:" + total);
                //alert("ActualizaInventarioCancelado total:" + total);
                if(total > 0)
                {                    
                	objVentas = new VENTAS();
                    for(var i=0; i < total; i++)
                    {   
                        var objProducto = new PRODUCTO();
                        
                        objProducto.Clave = results.rows.item(i).clave;
                        objProducto.Lote = results.rows.item(i).lote;
                        objProducto.Id_producto = results.rows.item(i).id_producto;
                        objProducto.Existencia = results.rows.item(i).existencia;  // existencia inventario
                        objProducto.caja = results.rows.item(i).caja;              // caja inventario
                        objProducto.Cantidad = results.rows.item(i).cantidad;      // cantidad venta
                        objProducto.CantidadCaja = results.rows.item(i).cajas;     // cajas venta
                        objProducto.status_venta = results.rows.item(i).status_venta;
                        
                        if(g_isdebug)
                        {
                        	console.log("ActualizaInventarioCancelado objProducto.Clave:" + objProducto.Clave + "objProducto.lote:" + objProducto.Lote + "|objProducto.Id_producto:" + objProducto.Id_producto + "|objProducto.Existencia:" + objProducto.Existencia + "|objProducto.caja:" + objProducto.caja + "|objProducto.Cantidad:" + 
                        		objProducto.Cantidad + "|objProducto.CantidadCaja:" + objProducto.CantidadCaja + "|objProducto.status_venta:" + objProducto.status_venta);
                        	alert("ActualizaInventarioCancelado objProducto.Clave:" + objProducto.Clave + "objProducto.lote:" + objProducto.Lote + "|objProducto.Id_producto:" + objProducto.Id_producto + "|objProducto.Existencia:" + objProducto.Existencia + "|objProducto.caja:" + objProducto.caja + "|objProducto.Cantidad:" + 
                        		objProducto.Cantidad + "|objProducto.CantidadCaja:" + objProducto.CantidadCaja + "|objProducto.status_venta:" + objProducto.status_venta);
                        }
                        
                        AgruparProductos(objProducto, false);
                        
                        objVentas.aProductos[objVentas.aProductos.length] = objProducto;
                    }
                    
                    if(g_isdebug)
                    	console.log("ActualizaInventarioCancelado objVentas.aProductosAgrupados.length:" + objVentas.aProductosAgrupados.length);
                    //Actualiza inventario
                    if(objVentas.aProductosAgrupados.length > 0)
                    {
	                    for(var j = 0; j < objVentas.aProductosAgrupados.length; j++)
						{
							var aProductos = objVentas.aProductosAgrupados[j];
							if(g_isdebug)
								console.log("ActualizaInventarioCancelado aProductos.length:" + aProductos.length);
							for(var i=0; i < aProductos.length;i++)
							{
								if(g_isdebug)
									console.log("ActualizaInventarioCancelado j:" + j + "|i:" + i + "|Id_producto:" + aProductos[i].Id_producto);
								//Si es venta o promocion incrementa
								if(objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.PROMOCION)
								{
									if(g_isdebug)
										console.log("ActualizaInventarioCancelado venta|promocion aProductos[i].status_venta:" + aProductos[i].status_venta);
									cantidad = parseFloat(aProductos[i].Existencia) + parseFloat(aProductos[i].Cantidad);                					
									console.log("ActualizaInventarioCancelado venta|promocion aProductos[i].cantidad:" + cantidad);
									cajas =parseInt(aProductos[i].caja) + parseInt(aProductos[i].CantidadCaja);
									console.log("ActualizaInventarioCancelado venta|promocion aProductos[i].cajas:" + cajas);
	
									cantidad = parseFloat(cantidad).toFixed(2);
									cajas = parseInt(cajas);
									console.log("ActualizaInventarioCancelado venta|promocion aProductos[i].cantidad:" + cantidad);
									console.log("ActualizaInventarioCancelado venta|promocion aProductos[i].cajas:" + cajas);
	
									//alert("Actualizar Existencia:" + aProductos[i].Existencia + "|cantidad:"+cantidad);
									//alert("Actualizar caja:" + aProductos[i].caja + "|cajas:" + cajas);
									console.log("ActualizaInventarioCancelado venta|promocion aProductos[i].Id_producto:" + aProductos[i].Id_producto + "aProductos[i].Lote:" + aProductos[i].Lote + "cantidad:" + cantidad + "cajas:" + cajas );
									if(aProductos[i].status_venta != TIPO_PRODUCTO.COMODIN)
										ActualizaExistencia(aProductos[i].Id_producto, aProductos[i].Lote, cantidad, cajas);
									//SI es credito decrementa
								}else if(objUsuario.operacion == TIPOVENTA.CREDITO)
								{
									if(g_isdebug)
										console.log("ActualizaInventarioCancelado credito aProductos[i].status_venta:" + aProductos[i].status_venta + "|id_tipo_credito:"+id_tipo_credito);
									cantidad = /*parseFloat(aProductos[i].Existencia) -*/ parseFloat(aProductos[i].Cantidad);                                   
									cajas =/*parseFloat(aProductos[i].caja) -*/ parseInt(aProductos[i].CantidadCaja);
	
									cantidad = parseFloat(cantidad).toFixed(2);
									cajas = parseInt(cajas);
									if(g_isdebug)
										console.log("ActualizaInventarioCancelado credito cantidad:" + cantidad + "|cajas:"+cajas);
									if(aProductos[i].status_venta != TIPO_PRODUCTO.COMODIN)
									{
										if(id_tipo_credito == TIPOCREDITO.PRODUCTOVENCIDO)
											RegresaInventarioMalo(aProductos[i], cantidad, cajas);
										else
											RegresaInventario(aProductos[i], cantidad, cajas);
									}
								}
							}
						}
                    }else{
                    	Alerta("There are no products to update");
                    }
               
                    LimpiaArray(objVentas.aPagos);
            		LimpiaArray(objVentas.aProductos);
            		LimpiaArray(objVentas.aProductosAuxiliar);
            		LimpiaArrayGrupo(objVentas.aProductosAgrupados);
            		LimpiaArrayGrupo(objVentas.aProductosAgrupadosHeader);
            		
                    objVentas = null;
                                        
                    /*var cantidad = 0.00;
                    var cajas = 0.00;
                    if(objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.PROMOCION)
                    {
                        cantidad = parseFloat(results.rows.item(i).existencia) + parseFloat(results.rows.item(i).cantidad);                    	
                        cajas = parseFloat(results.rows.item(i).caja) + parseFloat(results.rows.item(i).cajas);
                    }else if(objUsuario.operacion == TIPOVENTA.CREDITO)
                    {
                        cantidad = parseFloat(results.rows.item(i).existencia) - parseFloat(results.rows.item(i).cantidad);                     
                        cajas = parseFloat(results.rows.item(i).caja) - parseFloat(results.rows.item(i).cajas);
                    }
                    
					cantidad = parseFloat(cantidad).toFixed(2);
					cajas = parseFloat(cajas).toFixed(2);
					
					//alert("Actualizando existencia:" + parseFloat(results.rows.item(i).existencia) +"|cantidad:"+ parseFloat(results.rows.item(i).cantidad));
                    //alert("Actualizando caja:" + parseFloat(results.rows.item(i).caja) +"|cajas:"+ parseFloat(results.rows.item(i).cajas));
					
					//alert("Actualizando cantidad:" + cantidad +"|cajas:"+ cajas);
                    //var cantidad = parseInt(results.rows.item(i).Existencia) + parseInt(results.rows.item(i).cantidad);
                    ActualizaExistencia(results.rows.item(i).id_producto, results.rows.item(i).lote, cantidad, cajas);*/                                       
                }
                navigator.notification.activityStop();
                Alerta("Movement canceled correct");
            }, function(){navigator.notification.activityStop();}
    );
}

function RegitrarCancelacion(objCancelacion)
{
	if(g_isdebug)console.log("RegitrarCancelacion objCancelacion.id_venta:" + objCancelacion.id_venta);
    var id_cliente = 0;
    var _imprimir = 0;
    var objVenta = new VENTAS();
    ObtieneVentaId(objCancelacion.id_venta,
            function(tx, results)
            {        
                if(results.rows.length >0)
                {      
                	if(g_isdebug)console.log("RegitrarCancelacion results.rows.length:" + results.rows.length);
                    id_cliente = results.rows.item(0).id_cliente;
                    objVenta.id_venta = objCancelacion.id_venta;
                    objVenta.objCliente = new CLIENTE();
                    objVenta.objCliente.id_cliente = id_cliente;
                    
                    objVenta.subtotal = results.rows.item(0).monto_subtotal;
                    objVenta.total = results.rows.item(0).monto_total;                   
                    //objVenta.descuento = 0.0;
                    //objVenta.otrosdescuento  = results.rows.item(0).otrosdescuento;
                    objVenta.tipo_venta = results.rows.item(0).tipo_venta;
                    objVenta.longitude = objCancelacion.longitud;
                    objVenta.latitude = objCancelacion.latitude;
                    objVenta.fecha = objCancelacion.fecha + ' ' + objCancelacion.hora;
                    
                    objVenta.folio = results.rows.item(0).factura;
                    objVenta.status = STATUSVENTAS.CANCELADA;
                    objVenta.enviada = results.rows.item(0).enviada;                   
                    
                    objVenta.Id_Almacen = results.rows.item(0).id_almacen;
                    objVenta.Id_asignacion_Ruta = results.rows.item(0).id_asignacion_ruta;
                                        
                    //objVenta.importeNC = results.rows.item(0).monto;
                    //objVenta.Id_distribuidor = results.rows.item(0).Id_distribuidor;
                    //objVenta.id_motivont = results.rows.item(0).id_motivos_nt;
                    
                    objVenta.Id_usuario = objCancelacion.Id_Usuario;
                    objVenta.Id_tipo_credito = objCancelacion.id_tipo_credito;
                    
                    ObtieneDetalleVentaId(objVenta.id_venta, TIPOCREDITO.PRODUCTOBUENO,_imprimir,
                            function(tx, results)
                            {                                       
                                if(results.rows.length>0)
                                {                                   
                                    for(var i= 0; i < results.rows.length; i++)
                                    {
                                        /*var objProducto = new PRODUCTO();                                        
                                        objProducto.Id_producto = results.rows.item(i).id_producto;
                                        objProducto.Precio = results.rows.item(i).precio.toFixed(2);
                                        objProducto.Cantidad = results.rows.item(i).cantidad;   
                                        objProducto.CantidadCaja = results.rows.item(i).cajas;
                                        objProducto.descuento = parseFloat(results.rows.item(i).descuento).toFixed(2);
                                        objProducto.subtotal = parseFloat(results.rows.item(i).monto_subtotal).toFixed(2);
                                        objProducto.total = parseFloat(results.rows.item(i).monto_total).toFixed(2);
                                        objProducto.id_unidad_medida = results.rows.item(i).Id_unidad_medida;
                                        objProducto.tipo_captura = results.rows.item(i).tipo_captura;
                                        objProducto.Lote = results.rows.item(i).lote;
                                        
                                        objVenta.aProductos[objVenta.aProductos.length] = objProducto;*/
                                        
                                        objVenta.totalProductos += parseInt(results.rows.item(i).cantidad);//objProducto.Cantidad;
                                        objVenta.totalCajas += parseInt(results.rows.item(i).cajas);//objProducto.CantidadCaja;
                                    }
                                    EnviarVenta(objVenta);
                                    
                                    
                                }
                            }, null
                    );
                }
            }, null
    );
}

function ReEnviarTraspasos(id_movimiento_enc)
{
	if(g_isdebug)
		console.log("ReEnviarTraspasos");
    if(g_enviando == true)
        return;
    
    g_enviando = true;
	var total = 0;
	if(g_isdebug)
		console.log("ReEnviarTraspasos ...");
	ObtieneMovimientosNoEnviados( 
			function(tx, results)
			{
				total = results.rows.length;
				if(g_isdebug)
					console.log("ReEnviarTraspasos total:" + total);
				if(total > 0)
				{
					navigator.notification.activityStart(NOMBRE_APLICACION, "Wait sending tranfer");
					 var aTrapasos = new Array();
					    var totalProductos = 0;
					    
					    for(var i = 0; i < results.rows.length; i++)
					    {
					        var objVenta = new VENTAS();
					        objVenta.id_movimiento_enc = results.rows.item(i).id_movimiento_enc;
					        objVenta.Id_usuario = results.rows.item(i).Id_usuario;
					        totalProductos = results.rows.item(i).totalProductos;              
					        
					        var aProductos = new Array();
					        for(var j = 0; j < totalProductos; j++)
					        {
					            var objProducto = new PRODUCTO();
					            
					            objProducto.CantidadCaja = results.rows.item(i+j).Cantidad_cajas;            
					            objProducto.Cantidad = results.rows.item(i+j).Cantidad;               
					            objProducto.Id_almacen = objUsuario.Id_Almacen;            
					            objProducto.Id_producto = results.rows.item(i+j).Id_producto;            
					            objProducto.id_unidad_medida = results.rows.item(i+j).Id_unidad_medida;            
					            //objProducto.Id_usuario =  results.rows.item(i).Id_usuario;
					            objProducto.Lote= results.rows.item(i+j).Lote;            
					            aProductos[aProductos.length] = objProducto;
					        }
					        
					        objVenta.aProductos = aProductos;        
					        aTrapasos[aTrapasos.length] = objVenta;
					            
					        i += totalProductos - 1;
					        break;
					    } 
					    if(g_isdebug)
					    	console.log("ReEnviarTraspasos Enviando");
					    EnviarTraspaso(aTrapasos[0]);
						onPause();					
						
						if(g_isdebug)
							console.log("ReEnviarTraspasos total:" + total + "|totalProductos:" + totalProductos);
					if(id_movimiento_enc==null && total <=totalProductos)
					{
					    onPause();
					    g_enviando = false;
					    ReEnviarVenta(null);
					    navigator.notification.activityStop();
					}
				}else
				{
					if(g_isdebug)
						console.log("ReEnviarTraspasos no hay trasapasos renvio ventas");
					onPause();
				    navigator.notification.activityStop();
					g_enviando = false;
					if(id_movimiento_enc==null)
						ReEnviarVenta(null);
				}
			},
			function()
			{
				onPause();
				if(g_isdebug)
					console.log("ERROR OFFLINE reenviar traspasos");
			    //alert("Error enviando offline");
				g_enviando = false;
				navigator.notification.activityStop();
			}
	);
}

function ReEnviarVenta(id_venta)
{
	if(g_isdebug)
		console.log("ReEnviarVenta");
	var _imprimir = 0;
    if(g_enviando == true)
        return;
    
    g_enviando = true;
	var total = 0;
	if(g_isdebug)
		console.log("ReEnviarVenta ...");
	ObtieneVentasDiaOffline(id_venta,
			function(tx, results)
			{
				total = results.rows.length;
				if(total > 0)
				{
					navigator.notification.activityStart(NOMBRE_APLICACION, "Wait sending information...");
					for(var i=0; i < 1;i ++)
					{
						 var objVenta = new VENTAS();
					        var objCliente = new CLIENTE();
					        
					        objCliente.id_cliente = results.rows.item(i).id_cliente;
					        objVenta.objCliente = objCliente;
					        
					       	objVenta.status= results.rows.item(i).status;
					        
					        objVenta.folio= results.rows.item(i).factura;
					        objVenta.Facturada=1;
					        objVenta.fecha = results.rows.item(i).fecha + " " + results.rows.item(i).hora;
					        objVenta.Id_asignacion_Ruta= results.rows.item(i).id_asignacion_ruta;
					        objVenta.Id_cliente= results.rows.item(i).id_cliente;
					        objVenta.Id_ruta= objUsuario.Id_Ruta;
					        objVenta.id_tipo_venta = results.rows.item(i).tipo_venta;
					        objVenta.Id_usuario= results.rows.item(i).id_usuario;
					        objVenta.Imei= g_imei;
					        objVenta.latitude= results.rows.item(i).latitude;
					        objVenta.longitude = results.rows.item(i).longitud;
					        objVenta.Monto_descuento = 0.0;
					        objVenta.Monto_iva = 0.0;
					        objVenta.Monto_otrosdescuentos = 0.0;
					        objVenta.subtotal = results.rows.item(i).monto_subtotal;
					        objVenta.total = results.rows.item(i).monto_total;
					        objVenta.Pagada = 0;//TODO: checar cuando va 1
					        objVenta.Id_tipo_credito = results.rows.item(i).Id_tipo_credito;
					        objVenta.id_venta = results.rows.item(i).id_venta;  
					        
					        
					        totalProductos = results.rows.item(i).TotalProductos;
						
						ObtieneDetalleVentaId(objVenta.id_venta, TIPOCREDITO.PRODUCTOBUENO,_imprimir,
								function(tx, results)
								{										
									if(results.rows.length>0)
									{									
										for(var i= 0; i < results.rows.length; i++)
										{
											var objProducto = new PRODUCTO();                                        
											objProducto.Id_producto = results.rows.item(i).id_producto;
											objProducto.Precio = results.rows.item(i).precio.toFixed(2);
											objProducto.Cantidad = results.rows.item(i).cantidad;   
											objProducto.CantidadCaja = parseInt(results.rows.item(i).cajas);
											objProducto.descuento = parseFloat(results.rows.item(i).descuento).toFixed(2);
											objProducto.subtotal = parseFloat(results.rows.item(i).monto_subtotal).toFixed(2);
											objProducto.total = parseFloat(results.rows.item(i).monto_total).toFixed(2);
											objProducto.id_unidad_medida = results.rows.item(i).Id_unidad_medida;
											objProducto.tipo_captura = results.rows.item(i).tipo_captura;
											objProducto.Lote = results.rows.item(i).lote;

											objVenta.aProductos[objVenta.aProductos.length] = objProducto;

											objVenta.totalProductos += objProducto.Cantidad;
											objVenta.totalCajas +=  objProducto.CantidadCaja;
										}
										
										EnviarVenta(objVenta);
										navigator.notification.activityStop();
										onPause();
									}
								}, function(){Alerta("Error Sending information");}
						);
					}
					
					if(id_venta==null && total <=1)
					{
					    onPause();
					    g_enviando = false;
					    ReEnviarCancelaciones(null);
					    navigator.notification.activityStop();
					}
				}else
				{
					if(g_isdebug)
						console.log("ReEnviarVenta no hay venta reenvia cancelaciones");
					onPause();
				    navigator.notification.activityStop();
					g_enviando = false;
					if(id_venta==null)
						ReEnviarCancelaciones(null);
				}
			},
			function()
			{
				onPause();
				if(g_isdebug)
					console.log("ERROR OFFLINE");
			    //alert("Error enviando offline");
				g_enviando = false;
				navigator.notification.activityStop();
			}
	);
}

function ReEnviarCancelaciones(id_cancelacion)
{
	if(g_isdebug)
		console.log("ReEnviarCancelaciones");
    if(g_enviando==true)
        return;
    var aCancelaciones = new Array();
    
    g_enviando = true;
    
    if(g_isdebug)
    	console.log("ReEnviarCancelaciones ...");
    ObtieneCancelacionesPendientes(id_cancelacion, 
            function(tx, results)
            {
    			if(g_isdebug)
    				console.log("ReEnviarCancelaciones results.rows.length:" + results.rows.length);
                if(results.rows.length > 0)
                {
                    navigator.notification.activityStart(NOMBRE_APLICACION, "Espere reenviando Cancelaciones");
                    for(var i =0; i < results.rows.length; i++)
                    {
                        var objCancelacion = new CANCELACION();
                        objCancelacion.id_venta = results.rows.item(i).id_venta; 
                        objCancelacion.longitud = results.rows.item(i).longitud;
                        objCancelacion,latitude = results.rows.item(i).latitude;
                        objCancelacion.fecha = results.rows.item(i).fecha;
                        objCancelacion.hora = results.rows.item(i).hora;
                        objCancelacion.Id_Usuario = results.rows.item(i).Id_Usuario;

                        aCancelaciones[aCancelaciones.length] = objCancelacion;
                    }
                    for(var j=0; j < aCancelaciones.length; j++)
                        RegitrarCancelacion(aCancelaciones[j]);
                    ReEnviarPagos(null);
                    g_enviando = false;
                    navigator.notification.activityStop();
                }else{
                	if(g_isdebug)
                		console.log("ReEnviarCancelaciones no hay cancelaciones reenviando pagos");
                    g_enviando = false;
                    ReEnviarPagos(null);
                }
            }, function()
            {
                g_enviando = false;
            	alert('Error en consulta ObtieneCancelacionesPendientes');
            }
    );
}

function ReEnviarPagos(id_pago)
{
	if(g_isdebug)
		console.log("ReEnviarPagos");
	if(g_enviando == true)
		return;

	g_enviando = true;
	var total = 0;
	ObtienePagosNoEnviados( 
			function(tx, results)
			{
				total = results.rows.length;
				if(total > 0)
				{
					navigator.notification.activityStart(NOMBRE_APLICACION, "Wait sending payments");
					var aPagos = new Array();
					var totalPagos = 0;

					if(g_isdebug)
						console.log("ReEnviarPagos results.rows.length:" + results.rows.length);
					for(var i = 0; i < results.rows.length; i++)
					{
						totalPagos = results.rows.item(i).TotalPagos;
						if(g_isdebug)
							console.log("ReEnviarPagos totalPagos:" + totalPagos + "|i:"+i);
						var aPago = new Array();
						for(var j = 0; j < totalPagos; j++)
						{
							if(g_isdebug)
								console.log("ReEnviarPagos j:" + j + "|i:"+i);
							var objPago = CreaObjetoPago(results.rows.item(i+j));
							aPago[aPago.length] = objPago;
						}

						i += totalPagos - 1;
						aPagos[aPagos.length] = aPago;
					} 

					EnviarPago(aPagos[0]);
					onPause();									
					navigator.notification.activityStop();					
				}else
				{
					onPause();
					navigator.notification.activityStop();
					g_enviando = false;					
				}
			},
			function()
			{
				onPause();
				if(g_isdebug)
					console.log("ERROR OFFLINE reenviar pagos");
				//alert("Error enviando offline");
				g_enviando = false;
				navigator.notification.activityStop();
			}
	);
}
//Fin Envio de transacciones

//Funciones genericas
function LlenaGridReimpresion(opc)
{
	var granTotal = 0.0;
	var totalVentas = 0.0;
	var totalDemos = 0.0;
	var totalCreditos = 0.0;
	var totalPromos = 0.0;
	
	BorraGrid('tblVentasDia');
	GPSgetCurrentPosition();
	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting information...");
	ObtieneVentasDia(opc, 
			function(tx, results)
			{
				if(results.rows.length > 0)
				{
					var htmlRow = '';                        
					for(var i = 0; i < results.rows.length; i++){                            
						var trClass = 'filaAlternativa';
						if(i%2 == 1)
							trClass = 'filaNormal';

						htmlRow = "<tr class='"+trClass+"'>";
						nombre = "\""+results.rows.item(i).id_venta+"\","+ "\""+results.rows.item(i).enviada + "\", \"" + parseInt(i+1) +"\",";
						if(opc === OPCVENTAS.CANCELAR)
						{                            
							if(parseInt(results.rows.item(i).status) == STATUSVENTAS.ACTIVA && parseInt(results.rows.item(i).id_cancelacion) === 0 && results.rows.item(i).Tipo != TIPO_TRANSACCION.DEMO)          	
								htmlRow += "<td><input type='radio' id='group1' name='group1' value='"+results.rows.item(i).id_venta+"|"+results.rows.item(i).enviada+"|"+results.rows.item(i).tipo_venta+"|"+results.rows.item(i).Id_tipo_credito+"'></td>";//"+results.rows.item(i).id_venta+"                                	
							else
								htmlRow += "<td></td>";                                
						}else                            	
							htmlRow += "<td><input type='radio' id='group1' name='group1' value='"+results.rows.item(i).id_venta+"|"+results.rows.item(i).Id_tipo_credito+"'></td>";//"+results.rows.item(i).id_venta+"

						htmlRow += "<td>"+results.rows.item(i).Tipo+"</td>";
						htmlRow += "<td>"+results.rows.item(i).factura+"</td>";
						htmlRow += "<td>"+results.rows.item(i).fecha+"</td>";
						htmlRow += "<td>"+results.rows.item(i).codigo_cliente+"</td>";						

						granTotal +=parseFloat(results.rows.item(i).monto_total);
						
						if(parseInt(results.rows.item(i).status) == STATUSVENTAS.ACTIVA && parseInt(results.rows.item(i).id_cancelacion) === 0)          	
						{
							htmlRow += "<td>"+STATUS_MOVS.ENABLED+"</td>";
							switch(results.rows.item(i).Tipo)
							{
								case TIPO_TRANSACCION.VENTA:
									totalVentas += parseFloat(results.rows.item(i).monto_total);
									break;
								case TIPO_TRANSACCION.DEMO:
									totalDemos += parseFloat(results.rows.item(i).monto_total);
									break;
								case TIPO_TRANSACCION.CREDITO:
									totalCreditos += parseFloat(results.rows.item(i).monto_total);
									break;
								case TIPO_TRANSACCION.PROMOCION:
									totalPromos += parseFloat(results.rows.item(i).monto_total);
									break;
							}
						}else
							htmlRow += "<td>"+STATUS_MOVS.VOID+"</td>";    
						
						htmlRow += "<td align='right'>"+formatNumber(parseFloat(results.rows.item(i).monto_total).toFixed(2), '')+"</td>";
						
						htmlRow += "</tr>";

						$("#tblVentasDia").append(htmlRow);                    
					}
					htmlRow = "<tr><td align='right' colspan='6'>TOTAL SALES</td><td align='right'>"+ formatNumber(totalVentas, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
					htmlRow = "<tr><td align='right' colspan='6'>TOTAL DEMO</td><td align='right'>"+ formatNumber(totalDemos, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
					htmlRow = "<tr><td align='right' colspan='6'>TOTAL CREDITS</td><td align='right'>"+ formatNumber(totalCreditos, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
					htmlRow = "<tr><td align='right' colspan='6'>TOTAL PROMOTION</td><td align='right'>"+ formatNumber(totalPromos, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
				}
				navigator.notification.activityStop();                
			}
			,null
	);	
}

function LlenaGridReimpresionGeneral(opc)
{
	var granTotal = 0.0;
	var totalVentas = 0.0;
	var totalDemos = 0.0;
	var totalCreditos = 0.0;
	var totalPromos = 0.0;
	
	BorraGrid('tblVentasDia');
	GPSgetCurrentPosition();
	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting information...");
	ObtieneVentasGeneral(opc === TIPOVENTA.GENERAL ? 'NULL' : opc ,
			function(tx, results)
			{
				if(results.rows.length > 0)
				{
					var htmlRow = '';                        
					for(var i = 0; i < results.rows.length; i++){                            
						var trClass = 'filaAlternativa';
						if(i%2 == 1)
							trClass = 'filaNormal';

						htmlRow = "<tr class='"+trClass+"'>";						

						htmlRow += "<td>"+results.rows.item(i).Tipo+"</td>";
						htmlRow += "<td>"+results.rows.item(i).factura+"</td>";
						htmlRow += "<td>"+results.rows.item(i).fecha+"</td>";
						htmlRow += "<td>"+results.rows.item(i).codigo_cliente+"</td>";						

						granTotal +=parseFloat(results.rows.item(i).monto_total);
						
						if(parseInt(results.rows.item(i).status) == STATUSVENTAS.ACTIVA && parseInt(results.rows.item(i).id_cancelacion) === 0)
						{
							htmlRow += "<td>"+STATUS_MOVS.ENABLED+"</td>";
							switch(results.rows.item(i).Tipo)
							{
								case TIPO_TRANSACCION.VENTA:
									totalVentas += parseFloat(results.rows.item(i).monto_total);
									break;
								case TIPO_TRANSACCION.DEMO:
									totalDemos += parseFloat(results.rows.item(i).monto_total);
									break;
								case TIPO_TRANSACCION.CREDITO:
									totalCreditos += parseFloat(results.rows.item(i).monto_total);
									break;
								case TIPO_TRANSACCION.PROMOCION:
									totalPromos += parseFloat(results.rows.item(i).monto_total);
									break;
							}
						}else
							htmlRow += "<td>"+STATUS_MOVS.VOID+"</td>";    
						
						htmlRow += "<td align='right'>"+formatNumber(parseFloat(results.rows.item(i).monto_total).toFixed(2), '')+"</td>";
						
						htmlRow += "</tr>";

						$("#tblVentasDia").append(htmlRow);                    
					}
					htmlRow = "<tr><td align='right' colspan='5'>TOTAL SALES</td><td align='right'>"+ formatNumber(totalVentas, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
					htmlRow = "<tr><td align='right' colspan='5'>TOTAL DEMO</td><td align='right'>"+ formatNumber(totalDemos, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
					htmlRow = "<tr><td align='right' colspan='5'>TOTAL CREDITS</td><td align='right'>"+ formatNumber(totalCreditos, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
					htmlRow = "<tr><td align='right' colspan='5'>TOTAL PROMOTION</td><td align='right'>"+ formatNumber(totalPromos, '') +"</td></tr>";
					$("#tblVentasDia").append(htmlRow);
				}
				navigator.notification.activityStop();                
			}
			,null
	);	
}

function onPrompt(factura, sobrante) {
    
    //Se crea una copia
    var objPago = new PAGO();
    objPago = CreaCopiaPago(aPagos[aPagos.length-1]);
    objPago.objPagosRuta.Factura = factura;//results.input1;
    objPago.objPagosRuta.Monto = parseFloat(sobrante).toFixed(2);
    objPago.parentId = aPagos[aPagos.length-1].id;
    objPago.parentFactura = aPagos[aPagos.length-1].parentFactura;
    $("#txtFactura").val("");
    
    //se agrega al array y se manda al grid
    aPagos[aPagos.length] = objPago;
    aPagos[aPagos.length-1].id = aPagos.length-1;
    
    ListaPagoscliente();
}
function ValidaTipoPago()
{
    var cont = 0;
    for(var i = 0; i < aPagos.length; i++)
        if(aPagos[i].objPagosRuta.Id_tipo_pago === TIPOPAGO.CASH)
            cont++;
    
    return cont == 0 ? false : true;
}

function ValidaTotalPago(NumFactura)
{
	
    var cont = 0.00;
    var subtotal = 0;
    for(var i = 0; i < aPagos.length; i++)
    {
    	subtotal = 0;
    	
        if(aPagos[i].objPagosRuta.Factura === NumFactura)
        	{
        		subtotal = parseFloat(aPagos[i].objPagosRuta.Monto);
            	cont += parseFloat(subtotal);
        	}
    }
    return cont;
}

function ValidaCheque(NumCheque)
{
    for(var i = 0; i < aPagos.length; i++)
        if(aPagos[i].objPagosRuta.Numero_cheque === NumCheque)
            return true;
    
    return false;
}

function CreaCopiaPago(src)
{
    var objPago = new PAGO();
    
    objPago.Enviada = src.Enviada;
    objPago.Fecha = src.Fecha;
    objPago.Hora = src.Hora;        
    objPago.id_pago = src.id_pago;
    objPago.codigo_cliente = src.codigo_cliente;

    objPago.objPagosRuta.Comentarios = src.objPagosRuta.Comentarios;
    objPago.objPagosRuta.Factura = src.objPagosRuta.Factura;
    objPago.objPagosRuta.Fecha_creacion = src.objPagosRuta.Fecha_creacion;
    objPago.objPagosRuta.Id_asignacion_ruta = src.objPagosRuta.Id_asignacion_ruta;
    objPago.objPagosRuta.Id_cliente = src.objPagosRuta.Id_cliente;
    objPago.objPagosRuta.Id_distribuidor = src.objPagosRuta.Id_distribuidor;
    objPago.objPagosRuta.Id_tipo_pago = src.objPagosRuta.Id_tipo_pago;
    objPago.objPagosRuta.Numero_cheque = src.objPagosRuta.Numero_cheque;
    objPago.objPagosRuta.Id_usuario = src.objPagosRuta.Id_usuario;
    objPago.objPagosRuta.Monto = src.objPagosRuta.Monto;
    objPago.monto_total = src.monto_total;
    
    return objPago;
}

function ListaPagoscliente()
{
	if(g_isdebug)
		console.log("ListaPagoscliente aPagos.length:" + aPagos.length);
	BorraGrid('tblPagos');

	var nombreRadio = 'rbPago';
	var totalPagos = 0.00;
	for(var i =0; i < aPagos.length; i++)
	{
		var objPago = aPagos[i];

		var htmlRow = ''; 
		var trClass = 'filaAlternativa';
		if(i%2 == 1)
			trClass = 'filaNormal';                        

		if(g_isdebug)
			console.log("TIPOPAGO: objPago.objPagosRuta.Id_tipo_pago:" + objPago.objPagosRuta.Id_tipo_pago + "TIPOPAGO.CASH:" + TIPOPAGO.CASH );
		
		htmlRow = "<tr class='"+trClass+"'>";
		htmlRow += "<td><input type='radio' value='"+objPago.id+"' data-mini='true' name='" + nombreRadio + "' id='" + nombreRadio + "' class='custom' /></td>";
		htmlRow += "<td>"+objPago.objPagosRuta.Factura+"</td>";
		htmlRow += "<td>"+ objPago.Fecha +"</td>";
		var type = parseInt(objPago.objPagosRuta.Id_tipo_pago) == TIPOPAGO.CASH ? " Cash " : " Check ";
		htmlRow += "<td>"+ type +"</td>";
		htmlRow += "<td align='right'>"+ parseFloat(objPago.objPagosRuta.Monto).toFixed(2) +"</td>";

		totalPagos += parseFloat(objPago.objPagosRuta.Monto);
		htmlRow += "</tr>";
		if(g_isdebug)
			console.log("htmlRow: " + htmlRow);
		$("#tblPagos").append(htmlRow);
	}
	htmlRow = "<tr><td colspan='4' aling='right'>TOTAL</td><td align='right'>"+totalPagos.toFixed(2)+"</td></tr>";
	$("#tblPagos").append(htmlRow);


}

function CreaObjetoPago(item)
{
	var objPago = new PAGO();
	
	objPago.objPagosRuta = new PagosRuta();
	objPago.Enviada = item.Enviada;
	objPago.Fecha = item.Fecha;
	objPago.Hora = item.Hora;
	objPago.sobrante = item.sobrante;
	objPago.id_pago = item.id_pago;
	objPago.codigo_cliente = item.codigo_cliente;
	
	objPago.objPagosRuta.Comentarios = item.Comentarios;
	objPago.objPagosRuta.Factura = item.Factura;
	objPago.objPagosRuta.Fecha_creacion = objPago.Fecha + ' ' + objPago.Hora;//item.Fecha_creacion;
	objPago.objPagosRuta.Id_asignacion_ruta = item.Id_asignacion_ruta;
	objPago.objPagosRuta.Id_cliente = item.Id_cliente;
	objPago.objPagosRuta.Id_distribuidor = item.Id_distribuidor;
	objPago.objPagosRuta.Id_tipo_pago = item.Id_tipo_pago;
	objPago.objPagosRuta.Id_usuario = item.Id_usuario;
	objPago.objPagosRuta.Monto = item.monto;
	objPago.objPagosRuta.Numero_cheque = item.Numero_cheque;
	
	return objPago;
}

function Reimprimir(id_venta, Id_tipo_credito)
{
	var _imprimir = 1;
	if(g_isdebug)
		console.log("Reimprimir id_venta:" + id_venta + "|Id_tipo_credito:" +Id_tipo_credito);
	var id_cliente = 0;
	objVentas = new VENTAS();
	if(Id_tipo_credito == TIPOVENTA.GENERICO)
	{
		objUsuario.operacion = TIPOVENTA.GENERICO;
		ImprimirMovimiento(id_venta);		
		return;
	}
	
	objVentas.id_tipo_venta = objUsuario.operacion;
	//alert("Tipo Venta: "+ objVentas.id_tipo_venta);
	if(g_isdebug)
		console.log("Reimprimir id_tipo_venta:" + objVentas.id_tipo_venta);

	ObtieneVentaId(id_venta,
			function(tx, results)
			{		
				if(g_isdebug)
					console.log("Reimprimir results.rows.length:" + results.rows.length);
				if(results.rows.length >0)
				{			
					id_cliente = results.rows.item(0).id_cliente;	
					
					objVentas.id_venta = id_venta;
					objVentas.folio = results.rows.item(0).factura;
					objVentas.subtotal = results.rows.item(0).monto_subtotal;					
					objVentas.total = results.rows.item(0).monto_total;		
					objVentas.latitude = results.rows.item(0).latitude;
					objVentas.longitude = results.rows.item(0).longitud;
					
					objVentas.Id_tipo_credito = results.rows.item(0).Id_tipo_credito;					
					objVentas.requiere_firma = results.rows.item(0).requiere_firma;
					
					
					objVentas.fecha = results.rows.item(0).fecha;
					objVentas.hora = results.rows.item(0).hora;					
					objVentas.status = results.rows.item(0).status;
					objVentas.enviada = results.rows.item(0).enviada;
					
					objVentas.totalProductos  = results.rows.item(0).cantidad_productos;
					//objVentas.id_tipo_venta = results.rows.item(0).tipo_venta;									
					
					//ADD:11112013, limpiar array
					objVentas.aProductos = [];//new Array();
					objUsuario.operacion = objVentas.id_tipo_venta;
					objVentas.id_tipo_venta = results.rows.item(0).tipo_venta;
					//alert("Reimprimir objUsuario.operacion: "+ objVentas.id_tipo_venta);
					
					if(g_isdebug)
						console.log("Reimprimir objUsuario.operacion :" + objUsuario.operacion);
					
					
					ObtieneDetalleVentaId(objVentas.id_venta, Id_tipo_credito,_imprimir,
							function(tx, results)
							{										
								if(results.rows.length>0)
								{									
									for(var i= 0; i < results.rows.length; i++)
									{
										var objProducto = new PRODUCTO();										
										objProducto.Precio = results.rows.item(i).precio.toFixed(2);
										
										objProducto.Cantidad = results.rows.item(i).cantidad;
										objProducto.CantidadCaja = results.rows.item(i).cajas;
										objProducto.Nombre_producto = results.rows.item(i).nombre;//TODO: pasarlo a mi version
										
										objProducto.id_unidad_medida = results.rows.item(i).Id_unidad_medida;
										
										objProducto.Id_producto = results.rows.item(i).id_producto;
										objProducto.Lote = results.rows.item(i).lote;
										objProducto.Clave = results.rows.item(i).clave;
										
										objVentas.aProductos[objVentas.aProductos.length] = objProducto;
	//TODO: aqui debe invocar la funcion de agrupedo, digo agrupado
										//Ponerlo en mi version :p
										AgruparProductos(objProducto, false);
									}
									ObtieneClienteId(id_cliente,
											function(tx, results)
											{										
												if(results.rows.length> 0)
												{
													objVentas.objCliente = new CLIENTE();
													objVentas.objCliente.id_cliente = results.rows.item(0).id_cliente;
													objVentas.objCliente.Nombre  =results.rows.item(0).Nombre;
													objVentas.objCliente.domicilio  =results.rows.item(0).domicilio;
													objVentas.objCliente.codigo_postal  =results.rows.item(0).codigo_postal;
													objVentas.objCliente.telefono  =results.rows.item(0).telefono;
													
													objVentas.objCliente.ciudad = results.rows.item(0).ciudad;
													objVentas.objCliente.codigo_estado  =results.rows.item(0).codigo_estado;
													objVentas.objCliente.dias_credito  =results.rows.item(0).dias_credito;
													objVentas.objCliente.id_ruta  =results.rows.item(0).id_ruta;
													objVentas.objCliente.id_distribuidor  =results.rows.item(0).id_distribuidor;
													objVentas.objCliente.codigo_cliente  =results.rows.item(0).codigo_cliente;
													
													if(g_isdebug)
														console.log("Pagos cliente:" + objVentas.objCliente.id_cliente + " Folio:" + objVentas.folio);
													
													ObtienePagosClienteFactura(
															objVentas.objCliente.id_cliente, objVentas.folio,
															function(tx, results)
															{
																if(g_isdebug)
																	console.log("Pagos cliente length:" + results.rows.length);
																if(results.rows.length> 0)
																{
																	for(var i = 0; i < results.rows.length; i++)
																	{
																		if(g_isdebug)
																			console.log("Pagos cliente :" + results.rows.item(i));
																		
																		var objPago = CreaObjetoPago(results.rows.item(i));
																		objVentas.aPagos[objVentas.aPagos.length] = objPago;
																	}
																}
																Impresion();
															},
															function()
															{
																alert("Error printing payments");
															}
													);
												}else{
													if(g_isdebug)
														console.log("Reimprimir cliente no exist");
												}
												//alert("Reimprimir");
												//Impresion();
											}, function(){alert("Error1");}
									);
									
								}else{
									if(g_isdebug)
										console.log("Reimprimir detalle no existe");
								}
							}, function(){alert("Error2");}
					);
				}else{
					if(g_isdebug)
						console.log("Reimprimir mov no existe");
				}
			}, function(){alert("Error3");}
	);
}

function ImprimirMovimiento(id_movimiento)
{
	ObtieneMovimientoById(id_movimiento,
		function(tx, results){
			objVentas.aProductos = [];//new Array();
			if(results.rows.length >0)
			{
				objVentas.fecha = results.rows.item(0).fecha;
				objVentas.id_movimiento_enc = results.rows.item(0).id_movimiento_enc;
				
				var total = parseInt(results.rows.item(0).totalProductos);
				for(var i = 0; i < total; i++)
				{
					var objProducto = new PRODUCTO();
					objProducto.Id_producto = results.rows.item(i).Id_producto;
					objProducto.Clave = results.rows.item(i).clave;
					objProducto.Lote = results.rows.item(i).Lote;
					objProducto.id_unidad_medida = results.rows.item(i).Id_unidad_medida;
					objProducto.Cantidad = results.rows.item(i).Cantidad;
					objProducto.CantidadCaja = results.rows.item(i).Cantidad_cajas;
					objProducto.Nombre_producto = results.rows.item(i).nombre;
					
					objVentas.totalCajas += parseInt(objProducto.CantidadCaja);
					objVentas.totalProductos += parseFloat(objProducto.Cantidad);
					
					objVentas.aProductos[objVentas.aProductos.length] = objProducto;
					AgruparProductos(objProducto, false);					
				}							
				Impresion();
			}
		}, 
		function()
		{
			alert("Error Getting Information");
		}
	);
}

function EliminaFilaTabla(nombreGrid, folio, id_tipo)
{
    var tipo ='';
    if(g_isdebug)
    	console.log("EliminaFilaTabla id_tipo:" +id_tipo);
    switch(id_tipo)
    {
        case TIPOVENTA.VENTA:
            tipo = TIPO_TRANSACCION.VENTA;
            break;
        case TIPOVENTA.DEMO:
            tipo = TIPO_TRANSACCION.DEMO;
            break;
        case TIPOVENTA.CREDITO:
            tipo = TIPO_TRANSACCION.CREDITO;
            break;
        case TIPOVENTA.PROMOCION:
            tipo = TIPO_TRANSACCION.PROMOCION;
            break;
        case TIPOVENTA.CANCELACION:
            tipo = TIPO_TRANSACCION.CANCELACION ;
            break;
        case TIPOVENTA.GENERICO:
            tipo = TIPO_TRANSACCION.MOVIMIENTO ;
            break;
        case TIPOVENTA.PAGOS:
            tipo = TIPO_TRANSACCION.PAGO;
            break;
    }

	var table = document.getElementById(nombreGrid), 
    rows = table.getElementsByTagName('tr'),
    i, j, cells;

	//for (i = 0, j = rows.length; i < j; ++i) {
	for (i = rows.length-1, j = 1; i >= j; i--) {
		//console.log("EliminaFilaTabla rows:" +rows.length);
		cells = rows[i].getElementsByTagName('td');
		if (!cells.length) {
			continue;
		}
		
		//console.log("EliminaFilaTabla cells:" +cells.length);
		
		var clave  = cells[0];
		var tipoCel = cells[2];
		
		//console.log("EliminaFilaTabla clave:" +clave.innerHTML+ "|folio:"+folio+"|tipo:"+tipo+"|tipoCel:"+tipoCel.innerHTML);
		if(String(clave.innerHTML) === String(folio) && String(tipo) === String(tipoCel.innerHTML))
		{			  
			if(g_isdebug)
				console.log("EliminaFilaTabla Elimino");
			table.deleteRow(i);
			break;
		}
	}
}

function ControlaProgressBar(total, actual)
{
    var avance = 0;
    
    if(actual > 0)
    	avance = (100*actual) / total;
    if(g_isdebug)
    	console.log("ControlaProgressBar total:" + total + "|actual:"+ actual + "|avance:" + avance);
    navigator.notification.progressValue = avance;
}

function VerificaCierre(objUsuarioPrevio)
{
	
    if(objUsuarioPrevio.TotalCancelaciones <= 0 &&
            objUsuarioPrevio.TotalVentas <= 0
       )
    {
        Alerta('There are not transaction.');
        return;
    }
    
    if(objUsuarioPrevio.TotalVentasNoEnviadas > 0 ||
            objUsuarioPrevio.TotalMovimientosNoEnviados > 0 ||
            objUsuarioPrevio.TotalCancelaciones > 0 ||
            objUsuarioPrevio.TotalPagosNoEnviados > 0 ||
            objUsuarioPrevio.TotalCancelacionesPagos > 0
            )
    {
        Alerta('There are transaction to send:\nPlease send it firts\nOr check your internet connection.');
        return;
    }

    navigator.notification.confirm(
            'If you send the daily close you can not add more movements \n to this day and some information will be delete\n Dou you continue?',
            function(buttonIndex)
            {               
                if(buttonIndex == 1)
                    EnviarCierre();             
            },
            NOMBRE_APLICACION,
            'YES,NO'
    );
}

function VerificaTransacionesPendientes()
{
	ObtieneTransaccionesPendientes(
	           function(tx, results)
	           {	        	   
	               navigator.notification.activityStop();
	               if(results.rows.length > 0)                                         
	                   ProcesaTransaccionesPendientes(results, null);
	               else
	                   VerificaCancelacionesPendientes();	           
	           },
	           function()
	           {
	        	   alert("VerificaTransacionesPendientes Error");
	               navigator.notification.activityStop();
	           }
	   );
}

function VerificaCancelacionesPendientes()
{
    navigator.notification.activityStart(NOMBRE_APLICACION, "Wait getting information");
    ObtieneCancelacionesCompletasPendientes(
            function(tx, results)
            {
                navigator.notification.activityStop();
                if(results.rows.length > 0)                                         
                    ProcesaTransaccionesPendientes(results, TIPOVENTA.CANCELACION);                
                else
                	VerificaPagosPendientes();
            },
            function()
            {
            	alert("VerificaCancelacionesPendientes Error");
                navigator.notification.activityStop();
            }
    );    
}

function VerificaPagosPendientes()
{
	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait getting payments");
	ObtienePagosNoEnviados(
            function(tx, results)
            {
                navigator.notification.activityStop();
                if(results.rows.length > 0)                                         
                    ProcesaPagosPendientes(results);
                else{
                	VerificaCancelarPagosPendientes();
                	/*if(curWindow===PAGINAS.PENDIENTES)
                        offlineFunction = window.setTimeout(ReEnviarVenta, TIMEOUT_OFFLINE);*/
                }                
            },
            function()
            {
            	alert("Check payments Error");
                navigator.notification.activityStop();
            }
    );    
}

function VerificaCancelarPagosPendientes()
{
	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait, Getting payment");
	ObtieneCanclearPagosNoEnviados(
            function(tx, results)
            {
                navigator.notification.activityStop();
                if(results.rows.length > 0)                                         
                    ProcesaCancelarPagosPendientes(results);
                else{
                	if(curWindow===PAGINAS.PENDIENTES)
                        offlineFunction = window.setTimeout(ReEnviarVenta, TIMEOUT_OFFLINE);
                }                
            },
            function()
            {
            	alert("Chech payment Error");
                navigator.notification.activityStop();
            }
    );    
}

function ProcesaMovimientoPendientes(results)
{
    var aTrapasos = new Array();
    var totalProductos = 0;
    
    for(var i = 0; i < results.rows.length; i++)
    {
        var objVenta = new VENTAS();
        objVenta.id_movimiento_enc = results.rows.item(i).id_movimiento_enc;
        objVenta.Id_usuario = results.rows.item(i).Id_usuario;
        totalProductos = results.rows.item(i).totalProductos;              
        
        var aProductos = [];//new Array();
        for(var j = 0; j < totalProductos; j++)
        {
            var objProducto = new PRODUCTO();
            
            objProducto.CantidadCaja = results.rows.item(i+j).Cantidad_cajas;            
            objProducto.Cantidad = results.rows.item(i+j).Cantidad;               
            objProducto.Id_almacen = objUsuario.Id_Almacen;            
            objProducto.Id_producto = results.rows.item(i+j).Id_producto;            
            objProducto.id_unidad_medida = results.rows.item(i+j).Id_unidad_medida;            
            //objProducto.Id_usuario =  results.rows.item(i).Id_usuario;
            objProducto.Lote= results.rows.item(i+j).Lote;            
            aProductos[aProductos.length] = objProducto;
        }
        
        objVenta.aProductos = aProductos;        
        aTrapasos[aTrapasos.length] = objVenta;
            
        i += totalProductos - 1;    
    } 
    
    navigator.notification.progressStart(NOMBRE_APLICACION,"Wait, Sending information");
    ControlaProgressBar(aTrapasos.length, 0);
    for(var i=0; i < aTrapasos.length; i++)
    {
    	ControlaProgressBar(aTrapasos.length, i+1);
        EnviarTraspaso(aTrapasos[i]);
        
        EliminaFilaTabla("tblNoEnviadas",  aTrapasos[i].id_movimiento_enc, TIPOVENTA.GENERICO);
    }
    navigator.notification.progressStop();    
    
    VerificaTransacionesPendientes();
}

function ProcesaTransaccionesPendientes(results, tipo)
{
    var aVentas = new Array();
    var totalProductos = 0;
    
    for(var i = 0; i < results.rows.length; i++)
    {
        var objVenta = new VENTAS();
        var objCliente = new CLIENTE();
        
        objCliente.id_cliente = results.rows.item(i).id_cliente;
        objVenta.objCliente = objCliente;
        
        //Si es nulo es transaccion activa
        if(tipo == null)
        	objVenta.status= results.rows.item(i).status;
        else//esta cancelada
        	objVenta.status=  STATUSVENTAS.CANCELADA;
        objVenta.folio= results.rows.item(i).factura;
        objVenta.Facturada=1;
        objVenta.fecha = results.rows.item(i).fecha + " " + results.rows.item(i).hora;
        objVenta.Id_asignacion_Ruta= results.rows.item(i).id_asignacion_ruta;
        objVenta.Id_cliente= results.rows.item(i).id_cliente;
        objVenta.Id_ruta= objUsuario.Id_Ruta;
        objVenta.id_tipo_venta = results.rows.item(i).tipo_venta;
        objVenta.Id_usuario= results.rows.item(i).id_usuario;
        objVenta.Imei= g_imei;
        objVenta.latitude= results.rows.item(i).latitude;
        objVenta.longitude = results.rows.item(i).longitud;
        objVenta.Monto_descuento = 0.0;
        objVenta.Monto_iva = 0.0;
        objVenta.Monto_otrosdescuentos = 0.0;
        objVenta.subtotal = results.rows.item(i).monto_subtotal;
        objVenta.total = results.rows.item(i).monto_total;
        objVenta.Pagada = 0;//TODO: checar cuando va 1
        objVenta.Id_tipo_credito = results.rows.item(i).Id_tipo_credito;
        objVenta.id_venta = results.rows.item(i).id_venta;  
        
        
        totalProductos = results.rows.item(i).TotalProductos;
        
        if(g_isdebug)
        	console.log("ProcesaTransaccionesPendientes objVenta.id_venta:" + objVenta.id_venta + "|totalProductos:" + totalProductos);
        
        var aProductos = [];//new Array();
        for(var j = 0; j < totalProductos; j++)
        {
            var objProducto = new PRODUCTO();
            
            objProducto.CantidadCaja = parseInt(results.rows.item(i+j).caja);
            objProducto.Cantidad= results.rows.item(i+j).cantidad;     
            objProducto.Id_almacen= objUsuario.Id_Almacen;
            objProducto.Id_producto= results.rows.item(i+j).id_producto;
            objProducto.id_unidad_medida = results.rows.item(i+j).Id_unidad_medida;        
            objProducto.Id_usuario =  results.rows.item(i+j).id_usuario;
            objProducto.Lote= results.rows.item(i+j).lote;            
            //objProducto.Estatus=1;
            //objProducto.Fecha_venta =  results.rows.item(i).fecha;
            

            //objProducto.Id_venta = results.rows.item(i).id_venta;            
            objProducto.Monto_descuento = 0.0;
            objProducto.Monto_iva = 0.0;
            
            objProducto.subtotal = results.rows.item(i+j).subtotalDet;
            objProducto.total = results.rows.item(i+j).totalDet;
            objProducto.Precio = results.rows.item(i+j).precio;
            objProducto.tipo_captura = parseInt(results.rows.item(i).tipo_captura) == TIPO_CAPTURA.LECTOR ? 1 : 0;
            
            
            objVenta.totalCajas += objProducto.CantidadCaja;
            objVenta.totalProductos += objProducto.Cantidad;
            
            aProductos[aProductos.length] = objProducto;
        }
        
        objVenta.aProductos = aProductos;        
        aVentas[aVentas.length] = objVenta;
        
        i += totalProductos - 1;
    } 
    
    if(g_isdebug)
    	console.log("ProcesaTransaccionesPendientes aVentas.length:" + aVentas.length);
    navigator.notification.progressStart(NOMBRE_APLICACION,"Wait Sending information");
    ControlaProgressBar(aVentas.length, 0);
    navigator.notification.progressValue=50;
    for(var i=0; i < aVentas.length; i++)
    {        
        EnviarVenta(aVentas[i]);
        ControlaProgressBar(aVentas.length, i+1);
        
        EliminaFilaTabla("tblNoEnviadas",  aVentas[i].folio, tipo == null ? aVentas[i].Id_tipo_venta : TIPOVENTA.CANCELACION);
    }
    navigator.notification.progressStop();
    //Lllama las cancelaciones solo si yipo = null
    if(tipo == null)
    	VerificaCancelacionesPendientes();
    else
    	VerificaPagosPendientes();
    /*else{
    	if(curWindow===PAGINAS.PENDIENTES)
            offlineFunction = window.setTimeout(ReEnviarVenta, TIMEOUT_OFFLINE);
    }*/
}

function ProcesaPagosPendientes(results)
{
    var aPagos = new Array();
    var totalPagos = 0;

    for(var i = 0; i < results.rows.length; i++)
    {
    	totalPagos = results.rows.item(i).TotalPagos;
    	var aPago = new Array();
    	for(var j = 0; j < totalPagos; j++)
        {    		
    		var objPago = CreaObjetoPago(results.rows.item(i+j));
    		aPago[aPago.length] = objPago;
        }
        
    	i += totalPagos - 1;
        aPagos[aPagos.length] = aPago;
    } 
    
    navigator.notification.progressStart(NOMBRE_APLICACION,"Wait sending payments");
    ControlaProgressBar(aPagos.length, 0);
    navigator.notification.progressValue=50;
    
    for(var i=0; i < aPagos.length; i++)
    {     
    	EnviarPago(aPagos[i]);
        ControlaProgressBar(aPagos.length, i+1);
        
        for(var x = 0; x < aPagos[i].length; x++)
        	EliminaFilaTabla("tblNoEnviadas",  aPagos[i][x].id_pago, TIPOVENTA.PAGOS);
    }
    navigator.notification.progressStop();
    
    VerificaCancelarPagosPendientes();
}

function ProcesaCancelarPagosPendientes(results)
{
    var aPagos = new Array();
    var totalPagos = 0;

    for(var i = 0; i < results.rows.length; i++)
    {
    	var oPago = new p();
    	var r = results.rows.item(i);
    	
    	oPago.Comentarios = r.Comentarios;
    	oPago.Factura = r.Factura;
    	oPago.Fecha_creacion = r.Fecha + " " + r.Hora;
    	oPago.Id_asignacion_ruta = r.Id_asignacion_ruta;
    	oPago.Id_cliente = r.Id_cliente;
    	oPago.Id_distribuidor = r.Id_distribuidor;
    	oPago.Id_tipo_pago = r.Id_tipo_pago;
    	oPago.Id_usuario = r.Id_usuario;
    	oPago.Monto = r.monto;
    	oPago.Numero_cheque = r.Numero_cheque;
    	
        aPagos[aPagos.length] = {id : r.id_pago, pago :oPago};
    } 
    
    navigator.notification.progressStart(NOMBRE_APLICACION,"Sending information");
    ControlaProgressBar(aPagos.length, 0);
    navigator.notification.progressValue=50;
    
    for(var i=0; i < aPagos.length; i++)
    {     
    	EnviarCancelarPago(aPagos[i].pago, aPagos[i].id);
        ControlaProgressBar(aPagos.length, i+1);
        
        for(var x = 0; x < aPagos[i].length; x++)
        	EliminaFilaTabla("tblNoEnviadas",  aPagos[i].id, TIPOVENTA.PAGOCANCEL);
    }
    navigator.notification.progressStop();    	    
}

function PintaImpresoras()
{
	aImpresoras = new Array();
    BorraGrid('tblPrinters');
    ObtieneImpresoras(
            function(tx, results)
            {
                if(results.rows.length > 0)
                {                                                                         
                    for(var i = 0; i < results.rows.length; i++)
                    {   
                        var objImpresora = new IMPRESORA();
                    	objImpresora.MAC = results.rows.item(i).MAC;
                    	objImpresora.Nombre = results.rows.item(i).Nombre;
                    	objImpresora.Predeterminada = results.rows.item(i).Predeterminada;
                    	objImpresora.Tipo = results.rows.item(i).Tipo;
                    	objImpresora.id_impresora = results.rows.item(i).Id_Impresora;
                    	
                        var htmlRow = ''; 
                        var trClass = 'filaAlternativa';
                        if(i%2 == 1)
                            trClass = 'filaNormal';                        
                        
                        htmlRow = "<tr class='"+trClass+"'>";
                        htmlRow += "<td>"+objImpresora.Nombre+"</td>";
                        htmlRow += "<td>"+ objImpresora.MAC +"</td>";
                        if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
                            htmlRow += "<td>Zebra</td>";
                        else
                            htmlRow += "<td>Datamax</td>";
                        if(parseInt(objImpresora.Predeterminada) == 1)
                            htmlRow += "<td>Si</td>";
                        else
                            htmlRow += "<td><button id='btnPredeterminada' name='btnPredeterminada' onClick='btnPredeterminada_Click("+objImpresora.id_impresora+")'>Set Up</button></td>";
                        
						htmlRow += "<td><button id='btnEliminarImpresora' name='btnEliminarImpresora' onClick='btnEliminarImpresora_Click("+objImpresora.id_impresora+")'>Delete</button></td>";
						
                        htmlRow += "</tr>";
                        if(g_isdebug)
                        	console.log("htmlRow: " + htmlRow);
                        $("#tblPrinters").append(htmlRow);
                        
                        aImpresoras[aImpresoras.length] = objImpresora;
                    }
                }
            },
            function()
            {
                Alerta('Error Printer');
            }
    );  
}

function PintaMovimientosAbiertos()
{
    //BorraGrid('tblTraspasos');
	var rst = {};
	rst.Traspasos = [];
	ObtieneMovimientosAbiertos(
			function(tx, results)
			{				
				rst.Traspasos = convertResult2JsonAray(results);
				
				loadPartialTemplateHBS('partial/grid-transfer', 'grid-transfer', rst, undefined);				
			},
			function()
			{
				Alerta('Error Printer');
			}
	);	
}

function IniciaOffline()
{    
	if(String(objUsuario.Clave).toUpperCase() === String(objUsuarioPrevio.usuarioPrevio.Clave).toUpperCase() 
	        && String(objUsuario.Password).toUpperCase() === String(objUsuarioPrevio.usuarioPrevio.Password).toUpperCase())
	{
		navigator.notification.activityStop();
		
		document.addEventListener("backbutton", onBackKeyDown, false);
		
		objUsuario.Id_Ruta = objUsuarioPrevio.usuarioPrevio.Id_Ruta;		
		objUsuario.Id_Usuario = objUsuarioPrevio.usuarioPrevio.Id_Usuario;
		objUsuario.Clave = objUsuarioPrevio.usuarioPrevio.Clave;                   
		objUsuario.Password = objUsuarioPrevio.usuarioPrevio.Password;
		objUsuario.version = objUsuarioPrevio.usuarioPrevio.version;
		objUsuario.impresora = objUsuarioPrevio.usuarioPrevio.impresora;
		objUsuario.id_tipo_ruta = objUsuarioPrevio.usuarioPrevio.id_tipo_ruta ;
		objUsuario.Id_Almacen = objUsuarioPrevio.usuarioPrevio.Id_Almacen;
		objUsuario.Id_Vendedor = objUsuarioPrevio.usuarioPrevio.Id_Vendedor;
		objUsuario.num_factura =  parseInt(objUsuarioPrevio.usuarioPrevio.num_factura);		
		objUsuario.codigo_ruta = objUsuarioPrevio.usuarioPrevio.codigo_ruta;
		
		objUsuario.id_distribuidor = objUsuarioPrevio.usuarioPrevio.id_distribuidor;
		objUsuario.Id_asignacion_Ruta = objUsuarioPrevio.usuarioPrevio.Id_asignacion_Ruta;
		
		if(objUsuarioPrevio.TotalVentas <= 0)
			objUsuario.num_factura = parseInt(objUsuarioPrevio.usuarioPrevio.num_factura);
		else
			objUsuario.num_factura = parseInt(objUsuarioPrevio.usuarioPrevio.num_factura) + parseInt(objUsuarioPrevio.TotalVentas);
		
		objUsuario.parametros = objUsuarioPrevio.usuarioPrevio.parametros;
		
		g_enviando = false;
		
		MuestraDiv("aMenu");
		
		var rst = {
				hasLogo :  (String(oClienteApp.Logo).length > 0),
				Logo	:  oClienteApp.Logo
		};
		loadTemplateHBS('Inicio', '', rst, 
				function()
		        {
		            $("#sVersion").text('Version: ' + objUsuario.parametros['version']);
		        }
		);
		/*ControlaDiv('Inicio', '', 
		        function()
		        {
		            $("#sVersion").text('Version: ' + objUsuario.parametros['version']);
		        }
		);*/
	}else{
		navigator.notification.activityStop();
		Alerta("Invalid User");
		return;
	}	
}

function instance()  
{  
    if(estaImpreso)
    {
        clearTimeout(timerFunction);  
        return;
    }
    
    window.plugins.Printer.isConnected(function (result)
    {                   
        if(parseInt(result.status) == 1)
        {
            estaConectado = true;
            /*if(objUsuario.parametros['requiereLogo'] == '1')
            {
                window.plugins.Printer.printImage(
                    function(result){
                        ImprimirVouchers();
                    },function(result){
                        ImprimirVouchers();
                    }
                );
            }else*/
                ImprimirVouchers();
            return;
        }
        if(estaImpreso)
        {
            if(objUsuario.operacion == TIPOVENTA().PREVENTA || objUsuario.operacion == TIPOVENTA.VENTA)
                LimpiarVenta(null);
            navigator.notification.activityStop();                      
            return;
        }
    },
    function(e)
    {
        LimpiarVenta(null);
        navigator.notification.activityStop();
    });
}  

 function NewTransaction()
 {
	 LimpiarVenta(null);
	 btnVentas_Click(objUsuario.operacion);
 }
 
 function PrintTransfer() {
	 if(objVentas != null && objVentas.aProductosAgrupadosHeader.length > 0) {
		 Impresion();
	 } else {
		 Alerta("You need to add items first");
	 }
 }
 
function Impresion()
{
    var objImpresora = new IMPRESORA();
    
    if(objVentas != null)
    {
    	if(g_isdebug)
    		console.log("Total de grupos:" + objVentas.aProductosAgrupadosHeader.length);
    	
    	for(var j=0; j< objVentas.aProductosAgrupadosHeader.length-1; j++){        	
        	for(var i = j+1; i < objVentas.aProductosAgrupadosHeader.length; i++)
        	{        	
        		if(objVentas.aProductosAgrupadosHeader[j][0].Clave > objVentas.aProductosAgrupadosHeader[i][0].Clave)
        		{
        			var tmpProducto = objVentas.aProductosAgrupadosHeader[j][0];
        			objVentas.aProductosAgrupadosHeader[j][0] = objVentas.aProductosAgrupadosHeader[i][0];
        			objVentas.aProductosAgrupadosHeader[i][0] = tmpProducto;
        		}
        	}
    	}	
    }    
    //ImprimeGrupo(objVentas.aProductosAgrupadosHeader, "Vector ordenado");
    if(aImpresoras.length > 0)
    {
    	if(g_isdebug)
    		console.log("aImpresoras:" + aImpresoras.length);
    	
    	objImpresora = aImpresoras[0];
        g_buscarImpresora = false;
        
        g_bluetoothPlugin.enable(BTConectado, BTFalla);
        
        estaConectado = false;
        
        estaImpreso = false;
        navigator.notification.activityStart(NOMBRE_APLICACION, "Sending information to the printer.");
        
        window.plugins.Printer.connect(function (result)
        {
            //timerFunction = window.setTimeout(instance, 100);
            navigator.notification.activityStop();
            if(String(result) == 'OK')
            	ImprimirVouchers();
            else{
            	if(objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.PROMOCION)
                    {
            			//LimpiarVenta(null);
            			//if(g_procesando_venta)
            			if(preimpresion)
            			 btnVentas_Click(objUsuario.operacion);
                    }
            }
        },
        function (e)
        {
        	   //if(g_isdebug)
        		//	console.log("objventas.folio:" + objventas.folio + "|objUsuario.operacion:" + objUsuario.operacion);
        	if(objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.PROMOCION)
                {
        			//LimpiarVenta(null);
        			//if(objventas.folio != 0)
        			if(preimpresion)
        			 btnVentas_Click(objUsuario.operacion);
                }
            alert('Message Failed:' + e);
            navigator.notification.activityStop();
            clearTimeout(timerFunction);
        }, objImpresora.MAC, objImpresora.Tipo);
    }else
    {
        navigator.notification.activityStop();
        Alerta("There are not printer connected.");
        if(objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.PROMOCION)
        {
			//LimpiarVenta(null);
        	//if(objventas.folio != 0)
			btnVentas_Click(objUsuario.operacion);
        }
        
        //AgregaPago(objVentas.objCliente.id_cliente, objVentas.folio, objVentas.total);
    }
}

function PreguntaPanelFirma()
{
	navigator.notification.confirm(
            'Do you want sign?',
            function(buttonIndex)
            {               
                if(buttonIndex == 1)
                {   
                	//ActualizaFirmaVentas(objVentas.id_venta, 1);
                	ControlaDiv(PAGINAS.PANELFIRMA, TITULOS.PANEL, null);
                }else
                {
                	Impresion();
                    //LimpiarVenta();
                }
            },
            NOMBRE_APLICACION,
            'Yes,No'
    );
}

function ImprimirVenta()
{
	navigator.notification.activityStop();
    navigator.notification.confirm(
            'Do you want print?',
            function(buttonIndex)
            {    //Si desea imprimir pregunta por panel
                if(buttonIndex == 1)
                {
                	//PreguntaPanelFirma();
                	Impresion();
                }else
                {
                	//si no imprime se acaba ciclo
                	//AgregaPago(objVentas.objCliente.id_cliente, objVentas.folio, objVentas.total);
                     // LimpiarVenta(null);
                      
                      switch(parseInt(objUsuario.operacion))
                      {
                  	    case TIPOVENTA.VENTA:
                  	    case TIPOVENTA.DEMO:
                  	    case TIPOVENTA.CREDITO:
                  	    case TIPOVENTA.PROMOCION:
                  	    	 btnVentas_Click(objUsuario.operacion);
                  	    	break;
                      }
                      
                	 
                	
                	
                }
            },
            NOMBRE_APLICACION,
            'YES,No'
    );
}

function AgregaPago(id_cliente, factura, monto)
{
	if(g_isdebug)
		console.log("AgregaPago objUsuario.operacion:" + objUsuario.operacion + "|TIPOVENTA.VENTA:" + TIPOVENTA.VENTA);
	navigator.notification.activityStop();
	if(objUsuario.operacion != TIPOVENTA.VENTA)
	{	
		ImprimirVenta();
		return;
	}
	g_procesando_pagos = false;
    navigator.notification.confirm(
            'Do you want add a payment?',
            function(buttonIndex)
            {               
                if(buttonIndex == 1)
                {                   
                	$("#hfPagos").val(id_cliente+'@'+factura+'@'+monto);
                	btnPagos_Click(id_cliente, factura, monto);
                }else
                {
                	ImprimirVenta();
                }
            },
            NOMBRE_APLICACION,
            'Yes,No'
    );
}
//Se agrego pos por que el check se desmadro
function CreaFilaEnGrid(objProducto, nombreGrid, pos)
{
	if(g_isdebug)
		console.log("CreaFilaEnGrid tabla:" + nombreGrid + "|pos:" +pos);
	
	var tabla = document.getElementById(nombreGrid);
	var fila = document.createElement("tr");
	
	var colCheck = document.createElement("td");
	var colClave = document.createElement("td");
	var colLote = document.createElement("td");
	var colDescripcion = document.createElement("td");
	
	var colPrecio = document.createElement("td");
	colPrecio.setAttribute('style','text-align :right;');
	var colCantidad = document.createElement("td");
	colCantidad.setAttribute('style','text-align :right;');
	
	var colCajas = document.createElement("td");
	colCajas.setAttribute('style','text-align :right;');
	
	var colSubtotal = document.createElement("td");
	colSubtotal.setAttribute('style','text-align :right;');
	
	colCheck.innerHTML = '<input type="checkbox" class="">';
	//colCheck.innerHTML = "<td><a href='' onClick='QuitarPartida_Click(\"tblVentas\", \""+pos+"\");' data-role='button' data-icon='delete' data-iconpos='notext'></a></td>";
	colClave.innerHTML = objProducto.Clave;// .Id_producto;
	colLote.innerHTML = objProducto.Lote;
	colDescripcion.innerHTML =  objProducto.Nombre_producto;
	
	//console.log("CreaFilaEnGrid Cantidad:"+objProducto.Cantidad);
	//console.log("CreaFilaEnGrid CantidadCaja:"+objProducto.CantidadCaja);
	colPrecio.innerHTML = parseFloat(objProducto.Precio).toFixed(2);
	colCantidad.innerHTML = parseFloat(objProducto.Cantidad).toFixed(2);
	colCajas.innerHTML = parseInt(objProducto.CantidadCaja);
	
	subtotal = (objProducto.Precio * objProducto.Cantidad);	

	colSubtotal.innerHTML = subtotal.toFixed(2);
	
	fila.appendChild(colCheck);
	fila.appendChild(colClave);
	fila.appendChild(colLote);
	fila.appendChild(colDescripcion);
	fila.appendChild(colPrecio);
	fila.appendChild(colCantidad);
	if(nombreGrid === 'tblVentas')
	    fila.appendChild(colCajas);
	
	fila.appendChild(colSubtotal);
	
	tabla.appendChild(fila);
	//$('#home').trigger('create');
}

function ObtieneTotalVenta()
{
	var subtotal = 0;
	var factor  = 1.00;

	if(objUsuario.operacion != TIPOVENTA.VENTA && objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
		factor = -1.00;
	
	objVentas.subtotal = 0.00;
	objVentas.descuento = 0.00;
	objVentas.otrosdescuento = 0.00;
	objVentas.total = 0.00;
	objVentas.totalProductos = 0;	
	objVentas.totalCajas = 0;
	
	for(var i=0; i< objVentas.aProductos.length; i++)
	{
		subtotal = 0;

		objVentas.totalProductos += parseFloat(objVentas.aProductos[i].Cantidad);
		objVentas.totalCajas += parseInt(objVentas.aProductos[i].CantidadCaja);
		subtotal = parseFloat(parseFloat(objVentas.aProductos[i].Precio) * parseFloat(objVentas.aProductos[i].Cantidad));
		objVentas.aProductos[i].subtotal = parseFloat(subtotal).toFixed(2);
		//objVentas.aProductos[i].total = parseFloat(subtotal);
//console.log("ObtieneTotalVenta objVentas.subtotal:" + objVentas.subtotal);
		objVentas.subtotal += parseFloat(objVentas.aProductos[i].subtotal);//subtotal;
	//	console.log("ObtieneTotalVenta objVentas.subtotal:" + objVentas.subtotal);
		objVentas.aProductos[i].total = parseFloat(objVentas.aProductos[i].subtotal);
	}

	objVentas.total = objVentas.subtotal;

	objVentas.subtotal = parseFloat(objVentas.subtotal).toFixed(2);
	$("#txtSubtotal").val(formatNumber(String(objVentas.subtotal * factor), ''));
	var total = parseFloat(objVentas.total);
	objVentas.total = parseFloat(total).toFixed(2);
	$("#txtTotal").val(formatNumber(String(objVentas.total* factor), ''));
	
	var Nc = parseFloat(objVentas.importeNC).toFixed(2);
	$("#txtNC").val(Nc);	
	
	if(g_isdebug)
		console.log("ObtieneTotalVenta objVentas.total:" +objVentas.total + "|Nc:" + Nc);
	
	objVentas.montoPagar = objVentas.total - (Nc * -1.00); // Nc es negativo
	$("#txtAmountPay").val(parseFloat(objVentas.montoPagar).toFixed(2));
	
	//TODO: checar este valor
	$("#txtIva").val('0.00');
	//TODO: checar si se agrega esta funcionalidad
	//AgregaEstiloAGrid();
	
	$("#txtTotalCantidad").val(parseFloat(objVentas.totalProductos).toFixed(2));
	$("#txtTotalCajas").val(parseFloat(objVentas.totalCajas).toFixed(2));
	
	objVentas.totalProductos = parseFloat(objVentas.totalProductos).toFixed(2);
    objVentas.totalCajas = parseInt(objVentas.totalCajas);
}

function AgruparProductos(objProducto, esNuevo)
{    
    var aGrupo = objVentas.aProductosAgrupados;
    var posArray = -1;
    var posProducto = -1;
    
    var rbOtro = $("#rbOtro");
    //Si otro no esta chequeado agrupa, de lo contrario siempre crea uno nuevo
    if (!rbOtro.is (':checked'))
    {
    	if(g_isdebug)
    		console.log("AgruparProductos Error aGrupo.length:" + aGrupo.length);
    	for(var i=0; i < aGrupo.length; i++)
    	{
    		var aProductos = aGrupo[i];
    		//Si encontr� la clave en un grupo
    		if(objProducto.Clave === aProductos[0].Clave)
    		{
    			posArray = i;
    			if(g_isdebug)    		    
    				console.log("AgruparProductos Error aProductos.length:" + aProductos.length);
    			//ahora busca si el producto existe el grupo
    			for(var j=0; j < aProductos.length; j++)
    			{
    				if(aProductos[j].Clave === objProducto.Clave && aProductos[j].Lote === objProducto.Lote)
    				{
    					posProducto = j;
    					break;
    				}
    			}
    			break;
    		}
    	}
    }
    if(g_isdebug)
    	console.log("AgruparProductos posArray:" + posArray +"|posProducto:" + posProducto);
    var productoGrupo = CreaCopiaProducto(objProducto);
    var productoHeader;
    //No existe el grupo
    
    if(posArray == -1)
    {
        aProducto = [];//new Array();        
        aProducto[aProducto.length] = productoGrupo;
        objVentas.aProductosAgrupados[objVentas.aProductosAgrupados.length] = aProducto;
        
        //Se agrega al header
        productoHeader = CreaCopiaProducto(objProducto);
        aProductoHeader = [];//new Array();
        aProductoHeader[aProductoHeader.length] = productoHeader;        
        objVentas.aProductosAgrupadosHeader[objVentas.aProductosAgrupadosHeader.length] = aProductoHeader;
    }else
    {
        /*var pos = posProducto == -1 ? objVentas.aProductosAgrupados[posArray].length : posProducto;
        console.log("AgruparProductos  pos:" + pos);
        //se agrega al grupo e la posicion del array y en la posici�n del grupo
        objVentas.aProductosAgrupados[posArray][pos] = productoGrupo;*/
        
    	//Si no existe lo agrega
    	if(posProducto == -1)
    		objVentas.aProductosAgrupados[posArray][objVentas.aProductosAgrupados[posArray].length] = productoGrupo;
    	else{
    		//Si existe lo incrementa
    		objVentas.aProductosAgrupados[posArray][posProducto].Cantidad += productoGrupo.Cantidad;
    		objVentas.aProductosAgrupados[posArray][posProducto].CantidadCaja += productoGrupo.CantidadCaja;
    	}
        //incrementala cantidad en el header
        objVentas.aProductosAgrupadosHeader[posArray][0].Cantidad += objProducto.Cantidad;
        objVentas.aProductosAgrupadosHeader[posArray][0].CantidadCaja += objProducto.CantidadCaja;
        if(g_isdebug)
        {
        	console.log("AgruparProductos  lenHeader:" + objVentas.aProductosAgrupadosHeader[posArray].length);        
        	console.log("AgruparProductos  lenAgrupados:" + objVentas.aProductosAgrupados[posArray].length);  
        }
    }
    if(g_isdebug)
    {
    	console.log("AgruparProductos  lenHeader1:" + objVentas.aProductosAgrupadosHeader.length);
    	console.log("AgruparProductos  lenAgrupados1:" + objVentas.aProductosAgrupados.length);
    }
        
    if(g_isdebug)
    {
    	ImprimeGrupo(objVentas.aProductosAgrupadosHeader, 'ImprimeGrupoHeader');
    	ImprimeGrupo(objVentas.aProductosAgrupados, 'ImprimeGrupo');
    }
}

function ImprimeGrupo(aGrupos, titulo)
{
	if(!g_isdebug)
		return;
	
	var aGrupo = aGrupos;
	console.log(titulo + " len:" + aGrupos.length);
    for(var i=0; i < aGrupo.length; i++)
    {
    	console.log(titulo + " Inicio:" + i + "-----------------------------------");
    	var aProductos = aGrupo[i];       
    	for(var j=0; j < aProductos.length; j++)
    	{
    		console.log(titulo + " id:" + aProductos[j].Id_producto);
    		console.log(titulo + " Clave:" + aProductos[j].Clave);
    		console.log(titulo + " Lote:" + aProductos[j].Lote);
    		console.log(titulo + " CantidadCaja:" + aProductos[j].CantidadCaja);
    		console.log(titulo + " Cantidad:" + aProductos[j].Cantidad);
    		console.log(titulo + "-----------------------------------------------");
    	}
    	console.log(titulo + " Fin:" + i + "-----------------------------------");
    }
}

function LlenaGridVentas(pos, encontrado, nombreGrid)
{
	var tabla = document.getElementById(nombreGrid);
	var objProducto =  objVentas.aProductos[pos];
	if(tabla != null)
	{
		if(tabla.rows.length == 1)
		{
			CreaFilaEnGrid(objProducto, nombreGrid, pos);//tabla
		}else
		{
			if(encontrado)
			{
				tabla.rows[pos+1].cells[4].innerHTML = objProducto.Cantidad;
			}else
			{
				CreaFilaEnGrid(objProducto, nombreGrid , pos);//tabla
			}
		}
		//CreaFilaEnGrid(objProducto, tabla);
	}
	ObtieneTotalVenta();
	
	PosicionarOption("cmbProducto", 0);
	$("#txtPrecio").val('');
	$("#txtCodigoBarras").val('');
	$("#txtCodigo").val('');
	$("#txtLote").val('');
	$("#txtCantidad").val('');
	$("#txtCajas").val('');
	//TODO:cajasPosicionarOption("txtCajas", 0);
}

function drawGridSale(nombreGrid, aProductos)
{
	var rst = {};
	rst.gridName = nombreGrid;
	rst.aProductos = [];
	
	_.each(aProductos, function(p){rst.aProductos.push(p);});	
	console.log("type of:" + typeof rst.aProductos);
		
	loadPartialTemplateHBS('partial/grid-sale', nombreGrid, rst, undefined);
	ObtieneTotalVenta();
	
	PosicionarOption("cmbProducto", 0);
	$("#txtPrecio").val('');
	$("#txtCodigoBarras").val('');
	$("#txtCodigo").val('');
	$("#txtLote").val('');
	$("#txtCantidad").val('');
	$("#txtCajas").val('');
}

function BuscaProductoEnGrid(Id_producto, lote)
{
	if(g_isdebug)
		console.log("BuscaProductoEnGrid Total productos:" + objVentas.aProductos.length);
	
	for(var i=0; i < objVentas.aProductos.length; i++)
	{
		if(g_isdebug)
			console.log("BuscaProductoEnGrid id array:" + objVentas.aProductos[i].Id_producto + "|Id_producto:" + Id_producto + "|");
		if(String(objVentas.aProductos[i].Id_producto) === String(Id_producto) &&
				String(objVentas.aProductos[i].Lote) === String(lote)
		)
			return i;
	}		
	
	return -1;
}

function CreaCopiaProducto(objProductoSrc)
{
    var objProductoDest = new PRODUCTO();
    
    objProductoDest.Clave = objProductoSrc.Clave;
    objProductoDest.Existencia = objProductoSrc.Existencia;
    objProductoDest.Id_almacen = objProductoSrc.Id_almacen;
    objProductoDest.Id_producto = objProductoSrc.Id_producto;
    objProductoDest.Nombre_producto = objProductoSrc.Nombre_producto;
    objProductoDest.Id_categoria = objProductoSrc.Id_categoria;
    objProductoDest.Id_almacen_inventario = objProductoSrc.Id_almacen_inventario;
    objProductoDest.caja = objProductoSrc.caja;
    objProductoDest.Cantidad = (parseFloat(objProductoSrc.Cantidad) <= 0.00) ? parseFloat($("#txtCantidad").val()) : parseFloat(objProductoSrc.Cantidad);
    //console.log("CreaCopiaProducto objProductoSrc.CantidadCaja:" + objProductoSrc.CantidadCaja);
    if(parseInt(objProductoSrc.CantidadCaja) <= 0)
    {	
    	if($("#txtCajas").val() == '' || isNaN( $("#txtCajas").val()))
    		objProductoDest.CantidadCaja = parseInt(objProductoSrc.CantidadCaja);
    	else
    		objProductoDest.CantidadCaja = parseInt($("#txtCajas").val());
    }else
    {
    	if($("#txtCajas").val() == '' || isNaN( $("#txtCajas").val()))
    		objProductoDest.CantidadCaja = parseInt(objProductoSrc.CantidadCaja);
    	else
    		objProductoDest.CantidadCaja = parseInt($("#txtCajas").val());
    }
    //objProductoDest.CantidadCaja = parseFloat(objProductoSrc.CantidadCaja) <= 0.00 ? parseFloat($("#txtCajas").val()) : parseFloat(objProductoSrc.CantidadCaja);
    
    objProductoDest.Precio = parseFloat(objProductoSrc.Precio) == 0.00 ? parseFloat($("#txtPrecio").val()).toFixed(2) : parseFloat(objProductoSrc.Precio);
    
    objProductoDest.tipo_captura = objProductoSrc.tipo_captura;
    objProductoDest.objPrecio = objProductoSrc.objPrecio;
    
    objProductoDest.maximoCaja = objProductoSrc.maximoCaja;
    objProductoDest.maximoUnidad = objProductoSrc.maximoUnidad;
    objProductoDest.id_unidad_medida = objProductoSrc.id_unidad_medida;
    objProductoDest.nombre_unidad_medida = objProductoSrc.nombre_unidad_medida;
    objProductoDest.Lote = objProductoSrc.Lote;
    objProductoDest.status_venta = objProductoSrc.status_venta;
    
    return objProductoDest;
}

function CreaCopiaArrayProductos(arraySrc)
{
	var nuevoArray = [];//new Array();
	for(var i=0; i < arraySrc.length; i++)
		nuevoArray[i] = CreaCopiaProducto(arraySrc[i]);
	return nuevoArray;
}

function BuscaProductoEnArray(Productos, id_producto)
{
	for(var i=0; i < Productos.length; i++)
		if(String(Productos[i].Id_producto) ==String(id_producto))
			return Productos[i];
	return null;
}

function BuscaProductoLoteEnArray(Productos, id_producto, Lote)
{
	var objProducto = new PRODUCTO();
	
	objProducto.Clave = id_producto;
	objProducto.Lote = Lote;
	for(var i=0; i < Productos.length; i++)
		if(String(Productos[i].Id_producto) ==String(id_producto) && String(Productos[i].Lote) ==String(Lote))
		{			
			objProducto.Cantidad += parseFloat(Productos[i].Cantidad);
			objProducto.CantidadCaja += parseFloat(Productos[i].CantidadCaja);
			
			objProducto.Precio = parseFloat(Productos[i].Precio);
		}
			//return Productos[i];
	return (parseFloat(objProducto.Cantidad) <= 0.00) ? null : objProducto;
}

function LlenaInputsProducto(existe, existeLote)
{	
	$("#txtLote").val(productoSeleccionado.Lote);
    $("#txtCodigo").val(productoSeleccionado.Clave+"/"+ productoSeleccionado.Lote);
    
    
    DeshabilitaInput('txtLote');
    
    //Si existe se deshabilita el precio para que tome el ingresado inicialmente
    if(!existe)
    {
    	if(g_isdebug)
    		console.log("LlenaInputsProducto no existe");
    	//Si es precio de catalogo se deshabilita el precio y toma tal
    	if(productoSeleccionado.tipo_precio == TIPO_PRECIO.CATALOGO)
    	{    		
    		if(productoSeleccionado.status_venta != TIPO_PRODUCTO.COMODIN)
    			$("#txtPrecio").attr('disabled','disabled');
    		else
    			$("#txtPrecio").removeAttr('disabled');
    		$('#txtPrecio').val(parseFloat(productoSeleccionado.Precio).toFixed(2));
    	}else{    		
    		$("#txtPrecio").removeAttr('disabled');    	
    		$('#txtPrecio').val(parseFloat(productoSeleccionado.objPrecio.precio_caja_regular).toFixed(2));
    	}
    	
    	if(productoSeleccionado.tipo_captura == TIPO_CAPTURA.LECTOR)
        {    		
    		$("#txtCantidad").attr('disabled','disabled');
    		$("#txtCajas").attr('disabled','disabled');
    		ControlaCheckbox('chkManual', false);//TODO: bastante puerco, pero de lo contrario no funciona
    		
    		//Si es movimiento y por lector entra automatico
    		if(objUsuario.operacion == TIPOVENTA.GENERICO)
    		{    			
    			navigator.notification.activityStop();//11042013
    			$('#txtPrecio').val("0.00");
    			btnAgregar_Click('tblVentasGral');    			
    		}
    		//solo si es por lector y no existe manda el mensaje
    		if(objUsuario.operacion != TIPOVENTA.GENERICO)
    			Alerta("Favor de revisar el precio");
    		
    		//navigator.notification.activityStop();
        }else{        	
        	$("#txtCantidad").removeAttr('disabled');
        	$("#txtCajas").removeAttr('disabled');
        	ControlaCheckbox('chkManual', true);//TODO: bastante puerco, pero de lo contrario no funciona
        	
        	if(objUsuario.operacion == TIPOVENTA.CREDITO)
        	{
        		$('#txtLote').val(productoSeleccionado.Clave);
        		$('#txtCodigo').val($('#txtCodigo').val()+productoSeleccionado.Clave);
        	}
        	
        	if(objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.GENERICO)
        	{
        		HabilitaInput('txtLote');
        		//setFocus('txtLote');
        	}else{
        		DeshabilitaInput('txtLote');
        		setFocus('txtCantidad');
        	}//019/3dx-326 - 1dy-331
        	
        	if(objUsuario.operacion == TIPOVENTA.GENERICO)    		    		
    			$('#txtPrecio').val("0.00");
        }
    }else{    	
    	var rbOtro = $("#rbOtro");
    	//TODO: vuelve a pedir precio si es otro
		if (rbOtro.is (':checked'))
			$("#txtPrecio").removeAttr('disabled','disabled');
		else
			$("#txtPrecio").attr('disabled','disabled');
		
    	$("#txtPrecio").val(parseFloat(productoSeleccionado.Precio).toFixed(2));
    	if(productoSeleccionado.tipo_captura == TIPO_CAPTURA.LECTOR)
        {
        	$("#txtCantidad").attr('disabled','disabled');
    		$("#txtCajas").attr('disabled','disabled');
    		var codigo = $("#txtCodigoBarras").val().split("/");
    		    		
    		if(codigo.length == 4)
    		{
    			$("#txtCajas").val(parseInt(codigo[2]));
    			//TODO:cajasPosicionarOptionXTexto("txtCajas", codigo[2]);
				$("#txtCantidad").val(String(parseFloat(codigo[3]).toFixed(2)));
    		}else
    		{
				$("#txtCantidad").val(String(parseFloat(codigo[2]).toFixed(2)));
    			$("#txtCajas").val('1');
				//TODO:cajasPosicionarOptionXTexto("txtCajas", '1');
    		}
			
    		//TODO:checar aqui si no debe restringir cuando es otro producto
			//Si es el mismo lote lo agrega, si no quiere decir que solo existe la clave
			//if(existeLote)
			//{
				//navigator.notification.activityStop();
				btnAgregar_Click('tblVentasGral');
			//}
        }else{        	
        	$("#txtCantidad").removeAttr('disabled');
        	$("#txtCajas").removeAttr('disabled');
        	ControlaCheckbox('chkManual', true);//TODO: bastante puerco, pero de lo contrario no funciona
        	
        	if(objUsuario.operacion == TIPOVENTA.CREDITO)
        	{
        		$('#txtLote').val(productoSeleccionado.Clave);
        		$('#txtCodigo').val($('#txtCodigo').val()+productoSeleccionado.Clave);
        	}
        	
        	if(/*objUsuario.operacion == TIPOVENTA.CREDITO || */objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.GENERICO)
        	{	
        		HabilitaInput('txtLote');
        		//setFocus('txtLote');
        	}else{
        		DeshabilitaInput('txtLote');
        		setFocus('txtCantidad');
        	}
        }
    }
    navigator.notification.activityStop();
}

function LlenaComboProductos(nombreCombo)
{
   
	var combo = '#' + nombreCombo; 
	
	var nodo = 'Select a product';
	var sel = $(combo);

	$(combo).html('');
	if($("option", sel).length > 0)
		$(combo)[0].options.length = 0;
	 
	$(combo).append($('<option selected="selected" value="'+nodo+'">'+nodo+'</option>'));

	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait processing information.");
	ObtieneProductosCombo(objUsuario.operacion, 
	        function(tx, results)
			{
		//alert("total a insertar:"+results.rows.length);
				if(results.rows.length >0)
				{
					for ( var i = 0; i < results.rows.length; i++)
					{
						$(combo).append(
								$('<option value="' + results.rows.item(i).clave + '/' + results.rows.item(i).lote + '">'
										+ results.rows.item(i).clave +'/'+ results.rows.item(i).lote+ " "+ results.rows.item(i).nombre + '</option>'));
					}
				}
				PosicionarOption(nombreCombo, 0);
				PosicionarOptionXTexto(nombreCombo, nodo);
				navigator.notification.activityStop();
			}, null			
	);
	
}
function LlenaComboNegocios(nombreCombo, todos)
{
	var combo = '#'+nombreCombo;
	
	var sel = $(combo);
	var nodo= VALOR_INICIALCMBCLIENTE;
    
    //if($("option", sel).length > 0)
        //return;
	//console.log("html:"+$(combo).html());
	$(combo).html('');
	if($("option", sel).length > 0)
		$(combo)[0].options.length = 0;
	
	$(combo).append($('<option selected="selected" value="'+nodo+'">'+nodo+'</option>'));

	navigator.notification.activityStart(NOMBRE_APLICACION, "Wait proccesing customer.");
	ObtieneNegociosCombo(objUsuario.Id_Ruta, todos,
			function(tx, results)
			{
		//alert("total a insertar:"+results.rows.length);
				if(results.rows.length>0)
				{					
					for ( var i = 0; i < results.rows.length; i++)
					{
						$(combo).append(
								$('<option value="' + results.rows.item(i).id_cliente + '">'
										+ results.rows.item(i).id_cliente+'/'+ results.rows.item(i).Nombre + '</option>'));						
					}
					//$("#"+nombreCombo).trigger("change");
				}
				//PosicionarOption(nombreCombo, 0);
				//PosicionarOptionXTexto(nombreCombo, nodo);
								
				if(objUsuario.operacion == TIPOVENTA.PAGOS)
				{
					var aPagos = String($("#hfPagos").val()).split('@');
					if(g_isdebug)
					{
						console.log("LlenaComboNegocios val():" + $("#hfPagos").val());
						console.log("LlenaComboNegocios len:" + aPagos.length);
						console.log("LlenaComboNegocios [0]:" + aPagos[0]);
					}
					if(aPagos != null && aPagos.length > 1)
					{						
						//$("#"+nombreCombo+" option[value='"+aPagos[0]+"']").attr("selected", "selected");
						PosicionarOptionXValue(nombreCombo, aPagos[0]);
						DeshabilitaInput(nombreCombo);						
					}
				}else
					//PosicionarOptionXTexto(nodo);
					PosicionarOption(nombreCombo, 0);
				
				navigator.notification.activityStop();
			}, 
			function()
			{
				Alerta('There are not customers');
			}
	);
}

function LlenaListNegocios()
{
	
}
/*function LlenaComboCajas(nombreCombo)
{
    var combo = '#' + nombreCombo; 
    var nodo = '';

    $(combo).html('');
    $(combo)[0].options.length = 0;
    $(combo).append($('<option selected="selected" value="'+nodo+'">'+nodo+'</option>'));



    for ( var i = 0; i < 1001; i++)
    {
        $(combo).append(
                $('<option value="' + i + '">' + i + '</option>'));
    }

    PosicionarOption(nombreCombo, 0);
    PosicionarOptionXTexto(nombreCombo, nodo);
}*/

function PosicionarOption(nombreCombo, pos)
{
	if(g_isdebug)
		console.log("PosicionarOption nombreCombo:" + nombreCombo);
	var myselect = $("select#"+nombreCombo);
	if(myselect != null && myselect.length > 0)
	{
		myselect[0].selectedIndex = pos;
		myselect.selectmenu("refresh");
	}
}

function PosicionarOptionXTexto(nombreCombo, texto)
{
	//$("#"+nombreCombo).val(texto);
	//$("#"+nombreCombo).selectmenu("refresh", true);
	  
	//$( "#"+nombreCombo ).selectmenu( "option", texto, false );
	/*var pos = 0;
    $("#"+ nombreCombo +" option").each(function()
    {
    	console.log("PosicionarOptionXTexto $(this).text():"+ $(this).text() + "|texto:" +texto);
        if($(this).text() === texto)
        {
        	console.log("PosicionarOptionXTexto nombreCombo:"+ nombreCombo + "|pos:" +pos);
            PosicionarOption(nombreCombo, pos);
            return;
        }
        pos = pos + 1;
     });*/
	if(g_isdebug)
		console.log("PosicionarOptionXTexto nombreCombo:"+ nombreCombo+"|texto:" + texto);
	var combo = document.getElementById(nombreCombo);
	if(combo != null)
	{
		if(g_isdebug)
			console.log("PosicionarOptionXTexto len:"+ combo.length);
		for(var i=0; i < combo.length; i++)
		{
			if(g_isdebug)
				console.log("PosicionarOptionXTexto $(this).text():"+ combo.options[i].text + "|texto:" +texto);
			if(combo.options[i].text == texto)
			{
				if(g_isdebug)
					console.log("PosicionarOptionXTexto nombreCombo:"+ nombreCombo + "|pos:" +i);
	            PosicionarOption(nombreCombo, i);
	            return;	
			}
		}
	}else{
		if(g_isdebug)
			console.log("PosicionarOptionXTexto nombreCombo null");
	}
}

function PosicionarOptionXValue(nombreCombo, texto)
{
	if(g_isdebug)
		console.log("PosicionarOptionXValue nombreCombo:"+ nombreCombo+"|texto:" + texto);
	var combo = document.getElementById(nombreCombo);
	if(combo != null)
	{
		if(g_isdebug)
			console.log("PosicionarOptionXValue len:"+ combo.length);
		for(var i=0; i < combo.length; i++)
		{
			if(g_isdebug)
				console.log("PosicionarOptionXValue value:"+ combo.options[i].value + "|texto:" +texto);
			if(combo.options[i].value == texto)
			{
				if(g_isdebug)
					console.log("PosicionarOptionXValue nombreCombo:"+ nombreCombo + "|pos:" +i);
	            PosicionarOption(nombreCombo, i);
	            return;	
			}
		}
	}else{
		if(g_isdebug)
			console.log("PosicionarOptionXValue nombreCombo null");
	}
}

//Recibe nulo si debe dejar el combo de clientes intacto
function LimpiarVenta(borraCombo)
{	
	BorraGrid("tblPagos");
	clienteSeleccionado =  null;
	productoSeleccionado = null;
	
	if(objVentas != null)
	{
		LimpiaArray(objVentas.aPagos);
		LimpiaArray(objVentas.aProductos);
		LimpiaArray(objVentas.aProductosAuxiliar);
		LimpiaArrayGrupo(objVentas.aProductosAgrupados);
		LimpiaArrayGrupo(objVentas.aProductosAgrupadosHeader);
		LimpiaArray(aPagos);
	}
	
	objVentas = null;
	g_procesando_venta = false;
	g_procesando_pagos = false;
	preimpresion = false;
	//Si est� en panel o pagos
	if(curWindow === PAGINAS.PAGOS || curWindow === PAGINAS.PANELFIRMA )
	{
		btnVentas_Click(objUsuario.operacion);
		return;
	}
	
	/*
	 * $("#spVentas").text(titulo);
    	GPSgetCurrentPosition();
    	$( "#popupPanel" ).popup( "close" );
    	LimpiarVenta(null);
   
    	MuestraDiv('clientesVentas');
    	OcultarDiv('vtaPrincipal');
    	OcultarDiv('divTipoProducto');
    	OcultarDiv('divTipoCredito');
    	OcultarDiv('vtaAuxiliar');
   
    	
    	//Si es demo se pone visible la opcion rizo/otro
        if(objUsuario.operacion == TIPOVENTA.DEMO)
        {
     	   ControlaCheckbox('rbRizo', true);
     	   MuestraDiv('divTipoProducto');
        }else if(objUsuario.operacion == TIPOVENTA.CREDITO)
            MuestraDiv('divTipoCredito');              
        
    	return;
	 * 
	 */
	if(curWindow == VENTANAS[0])
	{
		 
	    	
		//borra el grid
		BorraGrid('tblVentas');
		
		//limpia los controles
		LimpiarControles();
		LlenaComboProductos('cmbProducto');
		//LlenaComboCajas('txtCajas');
		/*if(borraCombo == null)
		{
			LlenaComboNegocios('cmbNegocio', false);
			otroCliente = false;
		}
		*/
		
    	//MuestraDiv('vtaPrincipal');
    	MuestraDiv('clientesVentas');
    	OcultarDiv('vtaPrincipal');
    	OcultarDiv('divTipoProducto');
    	OcultarDiv('ventas_pagos')
    	//OcultarDiv('divTipoCredito');
    	OcultarDiv('vtaAuxiliar');
    	OcultarDiv('afooter');
    	//Si es demo se pone visible la opcion rizo/otro
        if(objUsuario.operacion == TIPOVENTA.DEMO)
        {
     	   ControlaCheckbox('rbRizo', true);
     	   MuestraDiv('divTipoProducto');
        }else if(objUsuario.operacion == TIPOVENTA.CREDITO)
            	MuestraDiv('divTipoCredito');  
        //else if(objUsuario.operacion == TIPOVENTA.VENTA)
      		//MuestraDiv('divNotaCredito');
		
		DeshabilitaInput("btnProductos");
		DeshabilitaInput("cmbProducto");
						
		//MuestraDiv('aGuardar');
		setFocus('txtCodigoBarras');
				
		$("#txtFolio").text(parseInt(objUsuario.num_factura) + 1);
		PosicionarOption('cmbNegocio', 0);
		PosicionarOption('cmbProducto', 0);
		PosicionarOption('txtCajas', 0);
	}
}

function LimpiaTextVenta()
{
	$("#txtCodigoBarras").val("");
	/*$("#txtCodigo").val("");
	$("#txtLote").val("");
	$("#txtCantidad").val("");
	$("#txtCajas").val("");
	$("#txtPrecio").val("");*/
}

function BorraGrid(nombreGrid)
{
	var pos = 0;
	//concatenamos al nombre de la tabla el elemento tr, para que nos devuelva todas la filas
	//la primera fila no se borra por que es el encabezado
	var nombre ='#' + nombreGrid + ' tr';
	
	/*$(nombre).each(function() 
	{
		if (pos > 0)
			$(this).remove();
		pos++;
	});*/
		
	
	var table = document.getElementById(nombreGrid);
	if(!table || !table.rows)
		return;
	for(var i = table.rows.length - 1; i > 0; i--)
	{
		table.deleteRow(i);
	}
}

function LimpiarControles()
{	
	//Extraemos los inputs, si son check los ponemos deshabilitados, si son text vacios
	/*$("input").each(
			function()
			{
				if($(this).attr('type') === 'checkbox')
                    $(this).removeAttr("checked"); 

				else
					$(this).val('');				
			}
	);*/
	
	$('input:text').val('');
	$('input:checkbox').removeAttr('checked');
	
	if(objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.VENTA
			|| objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.PROMOCION
	)
	{
		//TODO: checar, esto cuando se limpie
	    /*PosicionarOption("cmbNegocio", 0);
	    PosicionarOption("cmbMotivo", 0);
	    PosicionarOption("cmbProducto", 0);
	    */
	    //$("#txtNC").attr("disabled", "disabled");
		DeshabilitaInput("cmbProducto");
		DeshabilitaInput("txtCantidad");		
		DeshabilitaInput("txtCajas");
		
		DeshabilitaInput("txtTotalCantidad");
		DeshabilitaInput("txtTotalCajas");
	}
	try
	{
		$("input[type='checkbox']").attr("checked",false).checkboxradio("refresh");
	}catch(err)
	{
		
	}
}

function LlenaComboImpresion()
{	
    ObtieneImpresion(
            function(tx, results)
            {
            	if(results.rows.length > 0)
            		aImpresion = new Array();
                for(var i=0; i < results.rows.length; i++)
                {
                    var objImpresion = new IMPRESION();
                                      
                    
                    objImpresion.ciudad = results.rows.item(i).ciudad;
                    objImpresion.codigo_postal = results.rows.item(i).codigo_postal;
                    objImpresion.compania = results.rows.item(i).compania;
                    objImpresion.direccion = results.rows.item(i).direccion;
                    objImpresion.estado = results.rows.item(i).estado;
                    objImpresion.fax = results.rows.item(i).fax;
                    objImpresion.id_compania = results.rows.item(i).id_compania;
                    objImpresion.id_distribuidor =results.rows.item(i).id_distribuidor;
                    objImpresion.manufacturer = results.rows.item(i).manufacturer;
                    objImpresion.nombre_comercial = results.rows.item(i).nombre_comercial;
                    objImpresion.pais = results.rows.item(i).pais;
                    objImpresion.po_box = results.rows.item(i).po_box;
                    objImpresion.telefono = results.rows.item(i).telefono;
                    objImpresion.toll_free= results.rows.item(i).toll_free;
                    //objImpresion.descripcion = results.rows.item(i).descripcion;;
                    //objImpresion.condado= results.rows.item(i).condado;;
                    
                    if(g_isdebug)
                		console.log("objImpresion objImpresion.po_box :"+ po_box + "toll_free" + objImpresion.toll_free + "objImpresion.descripcion" + objImpresion.descripcion );
                    
                    aImpresion[ aImpresion.length] = objImpresion;
                }
            }, function() {
            	alert("Error cant read printer data");
            }
    );
}

function LlenaPagosclienteFactura()
{	
	if(objUsuario.operacion == TIPOVENTA.VENTA)
	{
		objVentas.aPagos = new Array();
		
		ObtienePagosClienteFactura(
				objVentas.objCliente.id_cliente, objVentas.folio,
				function(tx, results)
				{
					if(results.rows.length> 0)
					{
						for(var i = 0; i < results.rows.length; i++)
						{
							var objPago = CreaObjetoPago(results.rows.item(i));
							objVentas.aPagos[objVentas.aPagos.length] = objPago;
						}
					}					
				},
				function()
				{
					alert("Error payments customer-invoices");
				}
		);
	}	
}
//Fin funciones genericas

//Consumo de datos
function ConsultaFacturaOnLine(factura)
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
    
    LeerXmlObtenerVenta(retVal);
}

function getDetalleMovimiento(valSeleccionado, divOcultar, divMostrar, Grid)
{
	var wws= new IvanWebService(WSURL); 
    var parameters = new Array("id_movimiento", valSeleccionado, "msj", "");
    
    navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Service...");
        
    wws.callWCF(METODOS.METODO_MOVIMIENTODET, false, parameters, INTERFAZ_SERVICIO);
    var retVal = false;
    retVal= wws.result;
    
    LeerXmlDetalleMovimiento(retVal, valSeleccionado, divOcultar, divMostrar, Grid);
}

function ConsultaAsignacionRutaUsuarios(pClave, pContrasena, pendientes)
{
    var wws= new IvanWebService(WSURL); 
    var parameters = new Array("Clave", pClave, "Contrasena", pContrasena, "Imei", g_imei, "msj", "");
        
    wws.callWCF(METODOS.METODO_OBTENERASIGNACIONRUTAUSUARIOS, false, parameters, INTERFAZ_SERVICIO);
    var retVal = false;
    retVal= wws.result;
    if(g_isdebug)
    	console.log("ConsultaAsignacionRutaUsuarios"+retVal);
    //alert(retVal);
    LeerXmlObtenerAsignacionRutaUsuarios(retVal, pendientes);
}

function ConcultaEntidadesWCF()
{
    var wws = new IvanWebService(WSURL);
    var parameters = new Array("IdDistribuidor", objUsuario.id_distribuidor, "IdRuta", objUsuario.Id_Ruta,"msj", "");
    wws.callWCF(METODOS.METODO_OBTENERTABLAS, false, parameters, INTERFAZ_SERVICIO);     
    var retVal = false;
    retVal = wws.result;
    //alert("ConcultaEntidadesWCF"+retVal);
    //console.log("ConcultaEntidadesWCF"+retVal);
    LeerXmlEntidades(retVal);
}

function ConsultaProductosInicial(pIdDistribuidor, pId_Almacen){
	var wws = new IvanWebService(WSURL);
	var parameters = new Array("id_asignacion_ruta", pIdDistribuidor, "id_almacen", pId_Almacen);    
	wws.callWCF(METODOS.METODO_OBTENERDETALEASIGNACION, false, parameters, INTERFAZ_SERVICIO);     

	var retVal = false;
	retVal = wws.result;	
	LeerXmlProductosIniciales(retVal);
}

function ConsultarObtenerVersion(pIdEmpresa)
{
	var wws = new IvanWebService(WSURL);
	var parameters = new Array("IdCompania", pIdEmpresa, "msj", "");	           
	wws.callWCF(METODOS.METODO_OBTENERVERSION, false, parameters, INTERFAZ_SERVICIO);
	var retVal = false;
	retVal = wws.result;
	//console.log("ConsultarObtenerVersion:"+METODOS.METODO_OBTENERVERSION);
	//alert(retVal);
	LeerXmlVersion(retVal);
}

function ConcultaMovimientosNC(pIdCompania)
{
	var wws = new IvanWebService(WSURL);
    var parameters = new Array("IdCompania", pIdCompania, "msj", "");
    wws.callWCF(METODOS.METODO_OBTENERMOVIMIENTOSNC, false, parameters, INTERFAZ_SERVICIO);	    
    var retVal = false;
    retVal = wws.result;
    //console.log("ConcultaMovimientosNC"+retVal);
    //alert(retVal);
    LeerXmlMotivosNC(retVal);
}

function ConcultaMovimientosNV(pIdCompania)
{
    var wws = new IvanWebService(WSURL);
    var parameters = new Array("IdCompania", pIdCompania, "msj", "");
    wws.callWCF(METODOS.METODO_OBTENERMOVIMIENTOSNV, false, parameters, INTERFAZ_SERVICIO);     
    var retVal = false;
    retVal = wws.result;
    //alert(retVal);
    //console.log("ConcultaMovimientosNV"+retVal);
    LeerXmlMotivosNV(retVal);
}

function ConsultaVerificacionEntidadesWCF()
{
    var wws = new IvanWebService(WSURL);
    var parameters = new Array("IdDistribuidor", objUsuario.id_distribuidor, "IdRuta", objUsuario.Id_Ruta,"msj", "");
    wws.callWCF(METODOS.METODO_OBTENERVALIDACION, false, parameters, INTERFAZ_SERVICIO);     
    var retVal = false;
    retVal = wws.result;    
    
    LeerXmlVerificacionEntidades(retVal);
}

function ConfirmaSincronizacion()
{
    navigator.notification.activityStart(NOMBRE_APLICACION, "Sending confirmation.");
    var wws = new IvanWebService(WSURL);
    
    var parameters = new Array("IdAsignacionRuta", objUsuario.Id_asignacion_Ruta, "IdUsuario", objUsuario.Id_Usuario,"msj", "");
    wws.callWCF(METODOS.METODO_CONFIRMASINCRO, false, parameters, INTERFAZ_SERVICIO);     
    var retVal = false;
    retVal = wws.result;
    
    //alert("Sincro:"+retVal);
    navigator.notification.activityStop();
}

function LeerXmlObtenerVenta(xml)
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
	
	if(objVentas && objVentas.aProductos.length > 0)
	{
		GuardaFacturas(objVentas,
			function() {
			navigator.notification.activityStop();
			    console.log(objVentas.id_tipo_venta + "|" + TIPOVENTA.VENTA);
				if(objVentas.id_tipo_venta === TIPOVENTA.VENTA)
				{
					if(objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
					{
						$("#txtMonto").val(objVentas.total);
						PosicionarOptionXValue("cmbNegocioPagos", objVentas.id_cliente);
						$("#hfTotalFactura").val(objVentas.total);
					} else {
						GotoSaleWindow();
					}
				} else {
					if(objUsuario.operacion !== TIPOVENTA.SEARCHINVOICE)
					{
						$("#txtMonto").val("");
						PosicionarOption("cmbNegocioPagos", 0);
						$("#hfTotalFactura").val("");						
						$("#txtFactura").val("");
					} else {
						$("#txtInvoice").val("");
					}
					Alerta("The movement there is not exist or is not an invoice.");
				}
			}	
		);
	} else
	{
		navigator.notification.activityStop();
		Alerta("Invoice there is not exist");
	}
}

function LeerXmlDetalleMovimiento(xml, valSeleccionado, divOcultar, divMostrar, Grid)
{
	objVentas.aProductos = [];
	
	$(xml).find('ObtenerMovimientosDetResult').each(            
            function() {
                $(this).find('a\\:MovimientosDet').each(
                		function() {
                			var Cantidad = $(this).find('a\\:Cantidad').text();
                			if(Cantidad.length > 0)
                			{
                				var oProducto  = new PRODUCTO();
                				
                				oProducto.Cantidad = parseFloat(Cantidad);
                				oProducto.Id_almacen = objUsuario.Id_Almacen;
                				oProducto.Id_producto = parseInt($(this).find('a\\:Id_producto').text());                				
                				oProducto.Lote = $(this).find('a\\:Lote').text();
                				oProducto.CantidadCaja = parseFloat($(this).find('a\\:Cantidad_cajas').text());;                			
                				oProducto.id_unidad_medida = parseInt($(this).find('a\\:Id_unidad_medida').text());;
                				oProducto.Precio = 0.0;
                				oProducto.subtotal = 0.0;
                				
                				objVentas.aProductos.push(oProducto);
                			}
                		}
                )
            }
     );
	
	if(objVentas.aProductos.length > 0)
	{
		GuardaTransferDescargado(valSeleccionado, objUsuario.Id_Ruta, objUsuario.Id_asignacion_Ruta ,objUsuario.Id_Usuario, objVentas.aProductos,
				function(){
					console.log("AFTER save transfer:" +divOcultar);
					console.log("AFTER save transfer:" +divMostrar);
					console.log("AFTER save transfer:" +Grid);
					ObtieneMovimientosDescargados(parseInt(valSeleccionado),
			    			function(txt, result)
			    			{
								objVentas.aProductos = [];
			    				if(result.rows.length > 0)
			    				{
			    					for(var i = 0; i < result.rows.length; i++)
			    					{
			    						var item = result.rows.item(i);
			    						var oProducto  = new PRODUCTO();
			            				
			            				oProducto.Cantidad = parseFloat(item.existencia);
			            				oProducto.Id_almacen = parseInt(item.id_almacen);
			            				oProducto.Id_producto = parseInt(item.id_producto);                				
			            				oProducto.Lote = item.lote;
			            				oProducto.CantidadCaja = parseFloat(item.caja);                			
			            				oProducto.id_unidad_medida = parseInt(item.id_unidad_medida);
			            				oProducto.Nombre_producto = item.nombre;
			            				oProducto.Clave = item.clave
			            				oProducto.Precio = 0.0;
			            				oProducto.subtotal = 0.0;
			            				
			            				objVentas.aProductos.push(oProducto);
			    					}
			    					//lo pinta
			    					btnProductos_Click(divOcultar, divMostrar, Grid);
			    					navigator.notification.activityStop();
			    				}
			    			});
				}
		);
	}else
	{
		btnProductos_Click(divOcultar, divMostrar, Grid);
		navigator.notification.activityStop();
	}	
}

function LeerXmlObtenerAsignacionRutaUsuarios(xml, pendientes)
{
    var total = 0;
    $(xml).find('ObtenerAsignacionRutaUsuariosResult').each(            
            function() {
                $(this).find('a\\:v_asignacion_ruta_usuarios').each(
                        function() {                        
                            var clave = $(this).find('a\\:clave').text();
                            if(clave.length > 0)
                            {
                                total++;
                                objUsuario.Clave = clave;
                                objUsuario.Usuario = objUsuario.Clave;
                                objUsuario.Password = $(this).find('a\\:contrasena').text();                                                               
                                objUsuario.Fecha_Ruta = $(this).find('a\\:fecha_ruta').text();
                                objUsuario.Id_Almacen = $(this).find('a\\:id_almacen').text();
                                objUsuario.Id_asignacion_Ruta = $(this).find('a\\:id_asignacion_ruta').text();
                                objUsuario.id_distribuidor = $(this).find('a\\:id_distribuidor').text();                                
                                objUsuario.Id_Ruta = $(this).find('a\\:id_ruta').text();
                                objUsuario.Id_Usuario =$(this).find('a\\:id_usuario').text();
                                objUsuario.Id_Vendedor = $(this).find('a\\:id_vendedor').text();
                                objUsuario.num_factura = $(this).find('a\\:num_factura').text();
                                objUsuario.codigo_ruta = $(this).find('a\\:codigo_ruta').text();
                               
                                objUsuario.nombre = $(this).find('a\\:nombre_usuario').text() || '';
                                objUsuario.apellidos = $(this).find('a\\:apellido_paterno').text() || '';
                                                
                            }
                        }
                );
            }
    );
    
    if(total >0)
    {
        if(isNaN(objUsuario.Id_Ruta))
        {
            navigator.notification.activityStop();
            Alerta("There are not route.");
            return;
        }
        /*if(isNaN(objUsuario.id_zona))
        {
            navigator.notification.activityStop();
            Alerta("No hay tipo de ruta asignada.");
            return;
        }*/
        
        AgregaRegistros(1);  
        EliminaUsuarios();
        GuardaUsuario(objUsuario);
        VerificaSesion(pendientes);
    }else{
    	var mensaje = '';
        $(xml).find('ObtenerAsignacionRutaUsuariosResponse').each(
                function() {                   
                    mensaje = $(this).find('msj').text();
                }
        );
        navigator.notification.activityStop();
        Alerta("ERROR: " + mensaje);        
    }
}

function LeerXmlEntidades(xml)
{
    $(xml).find('ObtenerTablasResult').each(            
            function() {
                $(this).find('a\\:v_tablas').each(
                        function() {                        
                            var id_tabla = $(this).find('a\\:id_tablas').text();
                            if(id_tabla.length > 0)
                            {   
                                var objEntidad = new ENTIDAD();
                                
                                objEntidad.id = id_tabla;
                                objEntidad.nombre_tabla = $(this).find('a\\:tabla').text();
                                objEntidad.checksum = $(this).find('a\\:chek').text();
                                aEntidades[aEntidades.length] = objEntidad;
                            }
                        }
                );
            }
    );
     //alert("Total entidades:" + aEntidades.length);
}

function LeerXmlProductosIniciales(xml)
{	
    var aProductos = new Array();
    $(xml).find('ObtenerDetalleAsignacionResult').each(            
            function() {
                $(this).find("a\\:v_detalle_asignacion").each(
                        function() {                        
                            //var id_movimiento_details = $(this).find("a\\:id_movimiento_details").text();
                        	var codigo_producto = $(this).find("a\\:codigo_producto").text();
                            if(codigo_producto.length > 0)
                            {   
                                var objProducto = new PRODUCTOINICIAL();

                                objProducto.id_movimiento_details = 0;                                
                                objProducto.nombre_tipo_movimiento = $(this).find("a\\:nombre_tipo_movimiento").text();
                                objProducto.fecha_entrega = $(this).find("a\\:fecha_entrega").text();                                
                                objProducto.id_almacen = $(this).find("a\\:id_almacen").text();                                
                                objProducto.codigo_producto = codigo_producto;                           
                                objProducto.nombre_producto = $(this).find("a\\:nombre_producto").text();                                
                                objProducto.categoria_producto= $(this).find("a\\:categoria_producto").text();                                
                                objProducto.unidad_medida = $(this).find("a\\:unidad_medida").text();                                
                                objProducto.lote = "";//$(this).find("a\\:lote").text();                                
                                objProducto.cantidad = $(this).find("a\\:cantidad").text();                                                                                             
                                objProducto.cantidad_cajas = $(this).find("a\\:cantidad_cajas").text();                                                               
                                objProducto.status = $(this).find("a\\:status").text();
                                objProducto.id_asignacion_ruta = $(this).find("a\\:id_asignacion_ruta").text();         
                                
                                aProductos[aProductos.length] = objProducto;
                            }
                        }
                );
            }
    );
    
    //alert("Total productos:" + aProductos.length);
    if(aProductos.length > 0)
    {
    	EliminaProductosIniciales();     
        AgregaRegistros(aProductos.length);
        GuardaProductosIniciales(aProductos);
    }
}

//TODO: no regresa la misma estructura
function LeerXmlVersion(xml)
{
	var nombreParam = '';
	var total = 0;
	var objUsuarioV = null;
	
	 $(xml).find('ObtenerConfiguracionCompaniaResult').each(            
	            function() {
	                $(this).find("a\\:cat_configuracion").each(
	                        function() {                        
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
	                                }else if(nombreParam == 'password_settings')
	                                    objUsuarioV.parametros['password_settings'] = $(this).find("a\\:valor").text();	                                   
	                                	                               
	                                total++;
	                            }
	                        }
	                );
	            }
	    );

	
	if(total > 0 && objUsuarioV.parametros['password_settings'].length >0)
	{
		if(objUsuarioV.version.length>0)
		{
		    AgregaRegistros(1);
		    ActualizaUsuarioVersion(objUsuarioV.version);
		}
		
	    objUsuarioV.parametros['requiereFirma'] = objUsuario.parametros['requiereFirma'];
	    objUsuarioV.parametros['requiereLogo']= objUsuario.parametros['requiereLogo'];
	    objUsuarioV.parametros['transfer_auto']= objUsuario.parametros['transfer_auto'];
	    objUsuario.parametros['password_settings'] = objUsuarioV.parametros['password_settings'];
	    objUsuario.parametros['requiereLogo'] = objUsuarioV.parametros['password_settings'];
	    objUsuario.parametros['transfer_auto'] = objUsuarioV.parametros['transfer_auto'];

	    AgregaRegistros(getTotalPropiedades(objUsuarioV.parametros) + 1);
	    ActualizaParametros(objUsuarioV.parametros);
	}
}

function LeerXmlMotivosNC(xml)
{
    var aMotivos = new Array();
    $(xml).find('ObtenerMovimientosNCResult').each(            
            function() {
                $(this).find("a\\:cat_motivos_nt").each(
                        function() {                        
                            var id_motivos_nt=  $(this).find("a\\:id_motivos_nt").text();
                            if(id_motivos_nt.length > 0)
                            {   
                                var objMotivo = new MOTIVO();
                                
                                objMotivo.estatus = $(this).find("a\\:estatus").text();
                                objMotivo.fecha_creacion = $(this).find("a\\:fecha_creacion").text();
                                objMotivo.fecha_ult_act = $(this).find("a\\:fecha_ult_act").text();
                                objMotivo.id_compania = $(this).find("a\\:id_compania").text();
                                objMotivo.id_motivos_nt = id_motivos_nt;
                                objMotivo.id_usuario = $(this).find("a\\:id_usuario").text();
                                objMotivo.nombre = $(this).find("a\\:nombre").text();
                                
                                //GuardaMotivo(objMotivo);
                                //AgregaOptionMotivoNC(objMotivo);
                                aMotivos[aMotivos.length] = objMotivo;
                            }
                        }
                );
            }
    );
    //alert("Total MotivosNC:" +aMotivos.length);
	if(aMotivos.length > 0)
	{
		EliminaMotivosNC();		
		AgregaRegistros(aMotivos.length);
		GuardaMotivos(aMotivos);
	}
}

function LeerXmlMotivosNV(xml)
{
    var aMotivos = new Array();
    $(xml).find('ObtenerMotivoNVResult').each(            
            function() {
                $(this).find("a\\:cat_tipo_no_venta").each(
                        function() {                        
                            var id_motivos_nv=  $(this).find("a\\:id_tipo_no_venta").text();
                            if(id_motivos_nv.length > 0)
                            {   
                                var objMotivo = new MOTIVO();
                                
                                objMotivo.estatus = $(this).find("a\\:estatus").text();
                                objMotivo.fecha_creacion = $(this).find("a\\:fecha_creacion").text();
                                objMotivo.fecha_ult_act = $(this).find("a\\:fecha_ult_act").text();
                                objMotivo.id_compania = $(this).find("a\\:id_compania").text();
                                objMotivo.id_motivos_nt = id_motivos_nv;
                                objMotivo.id_usuario = $(this).find("a\\:id_usuario").text();
                                objMotivo.nombre = $(this).find("a\\:nombre").text();
                                                                
                                aMotivos[aMotivos.length] = objMotivo;
                            }
                        }
                );
            }
    );
    //alert("Total motivos no venta:" + aMotivos.length);
    if(aMotivos.length > 0)
    {
        EliminaMotivosNV();     
        AgregaRegistros(aMotivos.length);
        GuardaMotivosNV(aMotivos);
    }
}

function LeerXmlTraspasos(xml)
{
    var aTraspasos = new Array();
    $(xml).find('ObtenerMovimientosResult').each(            
            function() {
                $(this).find("a\\:v_movimientos").each(
                        function() {                        
                            var id_movimiento_enc = $(this).find("a\\:id_movimiento_enc").text();
                            if(id_movimiento_enc.length > 0)
                            {   
                                var objTraspaso = new TRASPASO();

                                objTraspaso.id_movimiento_enc = id_movimiento_enc;
                                objTraspaso.id_ruta = $(this).find("a\\:id_ruta").text();
                                objTraspaso.id_asignacion_ruta= $(this).find("a\\:id_asignacion_ruta").text();
                                objTraspaso.id_destino = $(this).find("a\\:id_destino").text();
                                objTraspaso.id_estatus_movimiento = $(this).find("a\\:id_estatus_movimiento").text();
                                objTraspaso.id_origen = $(this).find("a\\:id_origen").text();
                                objTraspaso.nombre = $(this).find("a\\:nombre").text();
                                objTraspaso.nombre_ruta = $(this).find("a\\:nombre_ruta").text();                                
                                objTraspaso.fecha_entrega = $(this).find("a\\:fecha_entrega").text();
                                var D = new Date(objTraspaso.fecha_entrega); 
                                
                                objTraspaso.fecha_entrega = String(D.getFullYear()) + '-' + padding_left(String(D.getMonth()+1), '0', 2) + '-' + padding_left(String(D.getDate()), '0', 2);                                
                                
                                aTraspasos[aTraspasos.length] = objTraspaso;
                            }
                        }
                );
            }
    );
        
    navigator.notification.activityStop();    
    if(aTraspasos.length > 0)
    {
    	BorraGrid("tblTraspasos");
    	ReseteaContadorRegistros();
    	AgregaRegistros(aTraspasos.length);
    	Guardamovimientos(aTraspasos);
    	//PintaMovimientosAbiertos();
    }else
    	Alerta('There are not movements');
}

function LeerXmlVerificacionEntidades(xml)
{
    $(xml).find('ObtenerValidacionResult').each(            
            function() {
                $(this).find('a\\:v_validacion').each(
                        function() {                        
                            var tabla = $(this).find('a\\:tabla').text();
                            if(tabla.length > 0)
                            {                               	
                            	for(var i=0; i < aEntidades.length; i++)
                            	{
                            		//alert("tabla:" + aEntidades[i].nombre_tabla + "|id_tabla:" + id_tabla + "|id:"+aEntidades[i].id);
                            		if(aEntidades[i].nombre_tabla === String(tabla))
                            		{
                            			aEntidades[i].totalServer = parseInt($(this).find('a\\:valor').text());
                            			//alert("tabla:" + aEntidades[i].nombre_tabla + "|total:" + aEntidades[i].totalServer);
                            			break;
                            		}
                            	}
                            }
                        }
                );
            }
    );
}
//Fin consumo de datos



function VerificaSesion(pendientes)
{
    
    ConcultaEntidadesWCF();

    ConsultaVerificacionEntidadesWCF();
    
    navigator.notification.activityStop();

    if(objUsuario.Clave.length > 0)
    {            
        objUsuario.parametros = objUsuarioPrevio.usuarioPrevio.parametros;
                
        document.addEventListener("backbutton", onBackKeyDown, false);                
        if(aEntidades.length>0){
            AgregaRegistros(aEntidades.length);
            GuardaEntidades(aEntidades);
        }        

        navigator.notification.activityStart(NOMBRE_APLICACION, "Getting information.");            
        if(pendientes === false && ComparaChecksumEnArray('v_almacen_inventario'))
        {
        	navigator.notification.activityStop();
            navigator.notification.activityStart(NOMBRE_APLICACION, "Getting inventary information");
        	ConsultaAlmacenInventario(objUsuario.Id_Almacen);           
        }
        
        if(ComparaChecksumEnArray('v_negocios'))
        {
        	navigator.notification.activityStop();
        	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting catalogs");        	
        	ConsultaProductosInicial(objUsuario.Id_asignacion_Ruta, objUsuario.Id_Almacen);
        }        

        if(ComparaChecksumEnArray('v_negocios'))
        {
        	navigator.notification.activityStop();
        	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting customer");
        	ConsultaNegociosXDia(objUsuario.id_distribuidor);
        }
            

        if(ComparaChecksumEnArray('v_lista_precios'))
        {
        	navigator.notification.activityStop();
        	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting Price");
        	ConsultaListasPrecios(objUsuario.id_distribuidor);
        }

        //if(ComparaChecksumEnArray('v_descuentos'))
          //  ConsultaDescuentos(objUsuario.id_distribuidor);

        if(ComparaChecksumEnArray('v_informacion_impresion_compania'))
        {
        	navigator.notification.activityStop();
        	navigator.notification.activityStart(NOMBRE_APLICACION, "Getting information");
        	ConsultarInformacionImpresion(objUsuario.id_distribuidor);          
        }

        ConsultarObtenerVersion(objUsuario.id_compania == 0 ? 1 : objUsuario.id_compania);
        ConsultarObtenerCompania(objUsuario.id_compania == 0 ? 1 : objUsuario.id_compania);

        /*if(ComparaChecksumEnArray('cat_motivos_nt'))
        {
        	navigator.notification.activityStop();
        	navigator.notification.activityStart(NOMBRE_APLICACION, "Descargando Informacion de Motivos");
        	ConcultaMovimientosNC(objUsuario.id_compania);
        }*/
        
        /*if(ComparaChecksumEnArray('cat_tipo_no_venta'))
            ConcultaMovimientosNV(objUsuario.id_compania);*/

        navigator.notification.activityStop();                      
        
        navigator.notification.activityStart(NOMBRE_APLICACION, "sync infomation.");
        g_enviando = false;
    }else
    {
        Alerta("Usero or password no valid.");
        return;
    }
}

function ComparaChecksumEnArray(nombe_tabla)
{
    var checksum = '';
    
    if(aEntidadesEnBD.length == 0)
        return true;
    
    for(var i=0; i < aEntidadesEnBD.length; i++)
    {
        if(nombe_tabla ===aEntidadesEnBD[i].nombre_tabla)
        {            
            checksum = aEntidadesEnBD[i].checksum;
            break;
        }
    }
    
    if(checksum !== '')
    {
        for(var i=0; i < aEntidades.length; i++)
        {           
            if(nombe_tabla ===aEntidades[i].nombre_tabla)
            {
                if(aEntidades[i].checksum ===checksum)                
                    return false;                                
                break;
            }
        }
    }
    //alert("return true len:" + aEntidades.length + "|nombe_tabla:" +nombe_tabla);
    return true;
}

//Consultas SQL
/*
 *busca un cliente en la lista para
 * utilizar sus propiedades en la venta
 */
function ObtieneCliente(id_cliente)
{	
    navigator.notification.activityStart(NOMBRE_APLICACION, "Search customer.");
    ObtieneClienteId(id_cliente,
            function(txt, results)
            {          
    			if(results.rows.length >0)
    			{
                    var objCliente = new CLIENTE();
                    objCliente.codigo_cliente = results.rows.item(0).codigo_cliente;
                    objCliente.id_distribuidor = results.rows.item(0).id_distribuidor;
                    objCliente.id_cliente = results.rows.item(0).id_cliente;
                    objCliente.domicilio = results.rows.item(0).domicilio;
                    objCliente.codigo_postal = results.rows.item(0).codigo_postal;
                    objCliente.Nombre = results.rows.item(0).Nombre;
                    objCliente.telefono = results.rows.item(0).telefono;
                    
                    objCliente.ciudad = results.rows.item(0).ciudad;
                    objCliente.codigo_estado = results.rows.item(0).codigo_estado;
                    objCliente.dias_credito = results.rows.item(0).dias_credito;
                    objCliente.id_ruta = results.rows.item(0).id_ruta;
                    objCliente.id_lista_precio = results.rows.item(0).id_lista_precio;
                    
                    navigator.notification.activityStop();
                    clienteSeleccionado = objCliente;
                    
                    if(objUsuario.operacion !== TIPOVENTA.PAYMENTS)
                    {
                    	objVentas.objCliente = clienteSeleccionado;
                    	HabilitaInput("btnProductos");
                    }                    
            		
                }else
                {   
                	alert("customer not exist");
                    navigator.notification.activityStop();
                    if(objUsuario.operacion !== TIPOVENTA.PAYMENTS)
                    {
                    	clienteSeleccionado = null;                    
                    	objVentas.objCliente = null;
                    }
                }
            }, null
    );
}

function BuscaPrecioEnLista(id_producto, Lote, id_distribuidor)
{	
	var existeLote = false;
	
	//alert("id_producto:" + id_producto + "|Lote:" + Lote + "id_distribuidor: " + id_distribuidor );
	
	//alert("id_producto:" + id_producto + "|id_zona:" + id_zona);
    navigator.notification.activityStart(NOMBRE_APLICACION, "Search Price");
    var objProducto = BuscaProductoEnArray(objVentas.aProductos, id_producto);
    var objProductoLote = BuscaProductoLoteEnArray(objVentas.aProductos, id_producto, Lote);
    
    if(objProducto != null)
    {
    	if(g_isdebug)
    		console.log("BuscaPrecioEnLista producto existe");
    	//TODO: checar si aqui se hace el decremento
    	
    	//22052013: se agrega precision en maximos
    	//Si existe el lote tambien, se descuenta las existencias - cantidad que hasta el momento tiene
    	if(objProductoLote != null)
    	{
			existeLote = true;
    		//console.log("BuscaPrecioEnLista producto existe lote");
    		productoSeleccionado.maximoUnidad = parseFloat(productoSeleccionado.Existencia - objProductoLote.Cantidad).toFixed(2);
            productoSeleccionado.maximoCaja = parseInt(productoSeleccionado.caja - objProductoLote.CantidadCaja);            
    	}else
    	{
    		//console.log("BuscaPrecioEnLista producto existe lote no");
    		//caso contrario toma el inventario inicial
    		productoSeleccionado.maximoUnidad = parseFloat(productoSeleccionado.Existencia).toFixed(2);
            productoSeleccionado.maximoCaja = parseInt(productoSeleccionado.caja);
    	}    	
        
    	//Si el id pone el precio ingresado con anterioridad
        productoSeleccionado.Precio = objProducto.Precio;        
        
    	//navigator.notification.activityStop();
        //alert("ExisteLote: " + existeLote);
        LlenaInputsProducto(true, existeLote);
    	return;
    }
    
    //TODO: Aqui debe buscar primero si existe el producto en carrito por aquella regla
    //de respetar el precio inicial
    ObtienePrecioProducto(id_producto, id_distribuidor,
            function(tx, results)
            {
    			if(g_isdebug)
    				console.log("BuscaPrecioEnLista len:" + results.rows.length);
                if(results.rows.length > 0)
                { 
                	productoSeleccionado.objPrecio = new PRECIO();
                	productoSeleccionado.id_distribuidor = id_distribuidor;
                	productoSeleccionado.id_lista_precios_enc = results.rows.item(0).id_lista_precios_enc;
                	productoSeleccionado.id_producto = id_producto;
                	productoSeleccionado.objPrecio.precio_caja_final_max = results.rows.item(0).precio_caja_final_max;
                	productoSeleccionado.objPrecio.precio_caja_final_min = results.rows.item(0).precio_caja_final_min;
                	productoSeleccionado.objPrecio.precio_caja_regular = results.rows.item(0).precio_caja_regular;
                    //productoSeleccionado.Precio = results.rows.item(0).precio_caja_final;                    
                	//alert("BuscaPrecioEnLista precio_caja_regular:"+productoSeleccionado.objPrecio.precio_caja_regular);
                	/*$('#txtPrecio').val(parseFloat(productoSeleccionado.objPrecio.precio_caja_regular).toFixed(2));                    
                	$("#txtCodigo").val(productoSeleccionado.Clave+"/"+ productoSeleccionado.Lote);
                	$("#txtPrecio").removeAttr('disabled');
                	$("#txtLote").val(productoSeleccionado.Lote);*/
                	productoSeleccionado.tipo_precio = TIPO_PRECIO.LISTA;
                	LlenaInputsProducto(false, false);
                	//navigator.notification.activityStop();
                }else{                	
                    //$('#txtPrecio').val(parseFloat(productoSeleccionado.Precio).toFixed(2));
                	productoSeleccionado.tipo_precio = TIPO_PRECIO.CATALOGO;
                	LlenaInputsProducto(false, false);
                    //navigator.notification.activityStop();
                }
            }, function(){alert("Error BuscaPrecioEnLista"); navigator.notification.activityStop();}
    );    
    if(productoSeleccionado.maximoUnidad <= 0) {
        productoSeleccionado.maximoUnidad = productoSeleccionado.Existencia;
        productoSeleccionado.maximoCaja = productoSeleccionado.caja;
    }
    //$('#txtExistencias').val(productoSeleccionado.Existencia);
}

function BuscaProductoEnCatalogo(Clave, tipo_captura)
{
	
	var prod =  Clave.split('/');
	//alert("clave: " +  String(prod[0]).trim() + "Lote: " +  String(prod[1]).trim());
    navigator.notification.activityStart(NOMBRE_APLICACION, "Search products.");
    ObtieneProductoId(String(prod[0]).trim(), String(prod[1]).trim(), objUsuario.operacion, 
            function(tx, results)
            {    			
    			//alert("El total es" + results.rows.length);
                if(results.rows.length>0)
                {
                    
                    productoSeleccionado = new PRODUCTO();
                    
                    productoSeleccionado.Clave = results.rows.item(0).clave;
                    productoSeleccionado.status_venta = results.rows.item(0).status_venta;
                    if(productoSeleccionado.status_venta == TIPO_PRODUCTO.COMODIN)
                    {
                    	//console.log("BuscaProductoEnCatalogo comodin");
                    	$("#txtLote").val("000");
                    	productoSeleccionado.Lote = "000";
                    }
                    else
                    {
                    	//console.log("BuscaProductoEnCatalogo otro");
                    	if(String(results.rows.item(0).lote) != '')
                    		productoSeleccionado.Lote = results.rows.item(0).lote;
                    	else //if (objUsuario.operacion != TIPOVENTA.CREDITO)
                    	{
                    		//alert("productoSeleccionado.Lote :" + $("#txtLote").val());
                    		productoSeleccionado.Lote = $("#txtLote").val();
                    	}
                    }
                    //22052013: se agrega precision en cajas y existencias
                    productoSeleccionado.Id_almacen = results.rows.item(0).id_almacen;
                    productoSeleccionado.Id_producto = results.rows.item(0).id_producto;
                    productoSeleccionado.id_almacen_inventario = results.rows.item(0).id_almacen_inventario;
                    productoSeleccionado.Nombre_producto = results.rows.item(0).nombre;
                    productoSeleccionado.Id_categoria = parseInt(results.rows.item(0).id_categoria);
                    productoSeleccionado.Categoria = results.rows.item(0).categoria;           
                    productoSeleccionado.Existencia = parseFloat(results.rows.item(0).existencia).toFixed(2);                                                           
                    productoSeleccionado.caja = parseFloat(results.rows.item(0).caja).toFixed(2);
                    productoSeleccionado.estatus = results.rows.item(0).estatus;
                    productoSeleccionado.tipo_captura = tipo_captura;
                    productoSeleccionado.id_unidad_medida = results.rows.item(0).id_unidad_medida;
                    productoSeleccionado.nombre_unidad_medida = results.rows.item(0).nombre_unidad_medida;
                    productoSeleccionado.Precio = parseFloat(results.rows.item(0).precio_unidad).toFixed(2);                   
                                    
                    //alert("Existencia " + productoSeleccionado.Existencia);
                    //alert("Caja " + productoSeleccionado.caja);
                    navigator.notification.activityStop();
                    var rbOtro = $("#rbOtro");
            		//si es otro el precio lo busca hasta el blur
                    if (rbOtro.is (':checked'))
            			return;
            		
                    BuscaPrecioEnLista(productoSeleccionado.Id_producto, productoSeleccionado.Lote, objUsuario.id_distribuidor);
                }else
                {
                	alert("product not valid");
                	//TODO: checar esta accion
                	productoSeleccionado = null;
                	$("#txtLote").val("");
                	$("#txtCodigo").val("");                	
                	$("#txtPrecio").val("");
                	$("#txtCantidad").val("");
                	$("#txtCajas").val("");
                	//TODO:cajasPosicionarOption("txtCajas", 0);
                	$("#txtCodigoBarras").val("");
                	
                	setFocus('txtCodigoBarras');
                    navigator.notification.activityStop();                    
                }
            },function(){alert("Error getting product");}
    );
}

function ConsultaUsuarioLogueado()
{
    objUsuarioPrevio = new LOGIN();
    ObtieneUsuarioAnterior(
            function(tx, results)
            {               
                if(results.rows.length > 0)
                {
                    objUsuarioPrevio.usuarioPrevio.Id_Usuario = results.rows.item(0).Id_Usuario;
                    objUsuarioPrevio.usuarioPrevio.nombre = results.rows.item(0).nombre;
                    objUsuarioPrevio.usuarioPrevio.apellidos = results.rows.item(0).apellidos;
                    
                    objUsuarioPrevio.usuarioPrevio.Clave = results.rows.item(0).Usuario;
                    objUsuarioPrevio.usuarioPrevio.Password = results.rows.item(0).Password;
                    objUsuarioPrevio.usuarioPrevio.version = results.rows.item(0).version;
                    objUsuarioPrevio.usuarioPrevio.impresora = results.rows.item(0).impresora;
                    objUsuarioPrevio.usuarioPrevio.id_distribuidor = results.rows.item(0).id_distribuidor;
                    objUsuarioPrevio.usuarioPrevio.Id_Almacen = results.rows.item(0).Id_Almacen;
                    objUsuarioPrevio.usuarioPrevio.Id_asignacion_Ruta = results.rows.item(0).Id_asignacion_Ruta;
                    objUsuarioPrevio.usuarioPrevio.Id_Ruta = results.rows.item(0).Id_Ruta;
                    objUsuarioPrevio.usuarioPrevio.Id_Vendedor = results.rows.item(0).Id_Vendedor;
                    objUsuarioPrevio.usuarioPrevio.num_factura = results.rows.item(0).num_factura;
                    objUsuarioPrevio.usuarioPrevio.codigo_ruta = results.rows.item(0).codigo_ruta;
                    
                    objUsuarioPrevio.TotalVentas = results.rows.item(0).TotalVentas;
                    objUsuarioPrevio.TotalVentasNoEnviadas = results.rows.item(0).TotalVentasNoEnviadas;                    
                    objUsuarioPrevio.TotalCancelaciones = results.rows.item(0).TotalCancelaciones;
                    objUsuarioPrevio.TotalMovimientos = results.rows.item(0).TotalMovimientos;
                    objUsuarioPrevio.TotalMovimientosNoEnviados = results.rows.item(0).TotalMovimientosNoEnviados;
                    objUsuarioPrevio.TotalMovimientosCerrados = results.rows.item(0).TotalMovimientosCerrados;
                    objUsuarioPrevio.TotalPagosNoEnviados = results.rows.item(0).TotalPagosNoEnviados;
                    objUsuarioPrevio.TotalCancelacionesPagos = results.rows.item(0).TotalCancelacionesPagos;
                    
                    objUsuarioPrevio.loggueado = true;
                }else{          
                    objUsuarioPrevio = new LOGIN();
                    objUsuarioPrevio.usuarioPrevio = new USUARIO();
                    objUsuarioPrevio.loggueado = false;
                }
            }, function()
            {
                alert('Error ConsultaUsuarioLogueado');
            }
    );
    
  //Debe seleccionar los parametros
    ObtieneParametros(
            function(tx, results)                    
            {
                //alert("Total parametros:"+ results.rows.length);
                if(results.rows.length >0)
                {
                    for(var i=0; i<results.rows.length; i++)
                        objUsuarioPrevio.usuarioPrevio.parametros[results.rows.item(i).nombre] = results.rows.item(i).valor;
                    //alert("DB");
                }else{
                    InsertaParametrosIniciales();
                    objUsuarioPrevio.usuarioPrevio.parametros['requiereFirma'] = '0';
                    objUsuarioPrevio.usuarioPrevio.parametros['requiereLogo'] = '-1';
                    objUsuarioPrevio.usuarioPrevio.parametros['version'] = '1';
                    objUsuarioPrevio.usuarioPrevio.parametros['password_settings'] = DEFAULT_CLAVE;
                    objUsuarioPrevio.usuarioPrevio.parametros['transfer_auto'] = '0';
                    objUsuarioPrevio.usuarioPrevio.parametros['price'] = '0';
                    objUsuarioPrevio.usuarioPrevio.parametros['list_price'] = '0';
                }
                
                //getValue(objUsuarioPrevio.usuarioPrevio.parametros, '');
            }, function(){
                Alerta("Error consultando parametros");
            });
}

function ConsultaEntidades()
{    
    ObtieneEntidades(
            function(tx, results)
            {
                if(results.rows.length > 0)
                {
                    //alert("ConsultaEntidades total entidades BD" + results.rows.length);
                    for(var i=0; i < results.rows.length; i++)
                    {
                        var objEntidad = new ENTIDAD();
                        objEntidad.id = results.rows.item(i).id_tabla;
                        objEntidad.nombre_tabla = results.rows.item(i).nombre_tabla;
                        objEntidad.checksum = results.rows.item(i).checksum;
                        //alert("ConsultaEntidades nombre|checkum:" + objEntidad.nombre_tabla + "|" + objEntidad.checksum);
                        aEntidadesEnBD[aEntidadesEnBD.length] = objEntidad;
                    }
                }
            }, null
    );
}
//Fin Consultas SQL

function LeerCodigo()
{
	window.plugins.barcodeScanner.scan( function(result) {
    	alert("We got a barcode\n" +
    			"Result: " + result.text + "\n" +
    			"Format: " + result.format + "\n" +
    			"Cancelled: " + result.cancelled);
    }, function(error) {
    	alert("Scanning failed: " + error);
    }
    );
}

var getLocation = function() {
    var suc = function(p) {
        alert(p.coords.latitude + " " + p.coords.longitude);
    };
    var locFail = function() {
    };
    navigator.geolocation.getCurrentPosition(suc, locFail);
};

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}

//onSuccess Geolocation
function GPSonSuccess(position) {
    PosicionObtenida = 1;
    PosicionGPS = position;
    
}

function GPSonError(error) {
    PosicionObtenida = 0;
    var options = {maximumAge: 1000, timeout: (90000), enableHighAccuracy: true};
    navigator.geolocation.getCurrentPosition(GPSonSuccess, GPSonErrorsalida,options);
}

function GPSonErrorsalida(error) {
    PosicionObtenida = 0;
}

function GPSgetCurrentPosition() {
    var options = {maximumAge: 1000, timeout: (90000), enableHighAccuracy: true};
    var filterFun = function(position) {
        if (lastPos == null || !position.equals(lastPos)) 
        {           
            
            GPSonSuccess(position);                    
            lastPos = position.clone();
        }
    };  
    navigator.geolocation.getCurrentPosition(GPSonSuccess, GPSonError, options);
}

function onOffline()
{
    ONLINE = 0;
    console.log("offline mode");
    
}
function onOnline()
{
    ONLINE = 1;
    console.log("online mode");
}

function onMenuBtn()
{
	if(g_isdebug)
		console.log("onMenuBtn");
}
//Evento que se dispara mientras la aplicacion y/o celular
//no esta en accion, por lo que en este momento se invoca
//el reenvio de transacciones pendientes
function onPause()
{
	GPSgetCurrentPosition();
	//Si esta online
	if(ONLINE == 1)
	{
		//ReEnviarVenta(null);
		ObtieneUsuarioAnterior(
				function(tx, results)
				{               
					if(results.rows.length > 0)
					{
						if(results.rows.item(0).TotalVentasNoEnviadas <= 0
								&& results.rows.item(0).TotalMovimientosNoEnviados <= 0
								&& results.rows.item(0).TotalCancelaciones <= 0
								&& results.rows.item(0).TotalPagosNoEnviados <=0)
							onResume();
						else
						{
							if(g_isdebug)
								console.log("onPause onLine...");                            
							offlineFunction = window.setTimeout(ReEnviarTraspasos, TIMEOUT_OFFLINE);
						}
					}else 
						onResume();                    
				}, function()
				{
					onResume();
				}
		);
	}
}

function onResume()
{
	if(g_isdebug)
		console.log("onResume...");
    if(offlineFunction != null)
        clearTimeout(offlineFunction);   
}

function onBackKeyDown()
{
    if(objUsuario != null && objUsuario.Password.length > 0)
        Alerta('Exit not enable');
}

function LlenaArrayImpresoras()
{
	aImpresoras = new Array();
	ObtieneImpresoras(
			function(tx, results)
			{				
				if(results.rows.length > 0)
				{					
					for(var i = 0; i < results.rows.length; i++)
					{						
						var objImpresora = new IMPRESORA();
						objImpresora.MAC = results.rows.item(i).MAC;
						objImpresora.Nombre = results.rows.item(i).Nombre;
						objImpresora.Predeterminada = results.rows.item(i).Predeterminada;
						objImpresora.Tipo = results.rows.item(i).Tipo;
						objImpresora.id_impresora = results.rows.item(i).Id_Impresora;
						
						aImpresoras[aImpresoras.length] = objImpresora;
					}
				}
			},
			function(){
				alert("LlenaArrayImpresoras error");
			}			
	);
}

function RegistrarCodigoCliente() {
	if($("#txtCodigo").val() === '') {
		Alerta("Proporcione un código");
		return;
	} else {
		ObtieneCodigoClienteByCod($("#txtCodigo").val(),
			function(tx, result) {
				if(result.rows.length > 0) {
					EstableceCodigoCliente($("#txtCodigo").val());
					var i=0;
					oClienteApp.codigoCliente = result.rows.item(i).codigoCliente;
	    			oClienteApp.Logo = result.rows.item(i).Logo;
	    			oClienteApp.NombreCliente = result.rows.item(i).NombreCliente;
	    			oClienteApp.Predeterminada = result.rows.item(i).Predeterminada;
	    			oClienteApp.Url = result.rows.item(i).Url;
	    			WSURL = result.rows.item(i).Url;
	    			GotoLogin();
				} else {
					Alerta('Codigo no valido');
				}
			}
		);
	}
}

function GotoRegistro() {
	var rst = {	};
	
	
	loadTemplateHBS('codigo-cliente', 'Registro', rst,
			function()
    		{
				curWindow = 'codigo-cliente';
    		}
	);
}

function GotoLogin() {
	var rst = {
			hasLogo :  (String(oClienteApp.Logo).length > 0),
			Logo	:  oClienteApp.Logo
	};	
	
	loadTemplateHBS('login', TITULOS.INICIO, rst,
			function()
    		{
    			if(g_isdebug)
    			{
    				$("#txtUsuario").val("la7");
    				$("#txtPassword").val("12345");    				    			
    			}
    			
    			var dtSource = {menu : main_menu.menu};
    			loadPartialTemplateHBS('Menu', 'popupPanel', dtSource, undefined);
    		}
	);
	
	/*CargaVentana('login', TITULOS.INICIO,
    		function()
    		{
    			if(g_isdebug)
    			{
    				$("#txtUsuario").val("la7");
    				$("#txtPassword").val("12345");    				    			
    			}
    			
    			var dtSource = {menu : main_menu.menu};
    			loadPartialTemplateHBS('Menu', 'popupPanel', dtSource, undefined);
    		}
    );*/
    curWindow = 'login';
}

var deviceInfo = function()
{
    g_bluetoothPlugin = cordova.require('cordova/plugin/bluetooth');
    OcultarDiv('aGuardar');
    OcultarDiv('aMenu');
    OcultarDiv('afooter');
    AbreBD();
    
    if(g_isdebug)
        g_imei = '352578060661807';//'357684043387067','99000120269634', '352578060661807';
    else
        g_imei = window.CustomNativeAccess.getImeiNumber();
    
   
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("startcallbutton", onMenuBtn, false);

    /*$(function()
     {
        $(".validar").keydown(function(event)
        {
            if(event.keyCode < 48 || event.keyCode > 57)
            {
                if(event.keyCode != 8)//retroceso
                    if(event.keyCode == 190 && $("#txtNC").val().indexOf('.') != -1)
                        return false;
            }
        });
    });
    */
    oClienteApp = new CLIENTEAPP();
    ObtieneCodigoCliente(
    	function(tx, result) {    		
    		if(result.rows.length > 0) {
    			var i = 0;
    			oClienteApp.codigoCliente = result.rows.item(i).codigoCliente;
    			oClienteApp.Logo = result.rows.item(i).Logo;
    			oClienteApp.NombreCliente = result.rows.item(i).NombreCliente;
    			oClienteApp.Predeterminada = result.rows.item(i).Predeterminada;
    			oClienteApp.Url = result.rows.item(i).Url;
    			WSURL = result.rows.item(i).Url;
    			GotoLogin();
    		} else {
    			InsertaCodigoClientes();
    			curWindow = 'codigo-cliente';
    			WSURL = '';
    			GotoRegistro();
    		}
    	}
    );
    
    
    ConsultaUsuarioLogueado();
    ConsultaEntidades();
    LlenaArrayImpresoras();
    
    $( "#popupPanel" ).on({
        popupbeforeposition: function() {
            var h = $( window ).height();

            $( "#popupPanel" ).css( "height", "100%" );
        }
    });
    
};

function init() {    
    document.addEventListener("deviceready", deviceInfo, false);       
}
