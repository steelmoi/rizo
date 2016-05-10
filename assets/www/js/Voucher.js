function ImprimirVouchers()
{
	var y = 0;
	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];		
	
	console.log("objUsuario: antes " + objImpresora.Tipo + "|IMPRESORA|" + objUsuario.operacion);
	/**
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
	{
		var col = 200, row = 30, width=409, height =250;
	    window.plugins.Printer.printImage(null,null, col, row, width, height);
	}	
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
	window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,50);//200
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,50);
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF185); 
    window.plugins.Printer.addTextDocument(null,null,1,"PO Box: " + aImpresion[0].po_box,50,50);
	window.plugins.Printer.addTextDocument(null,null,1,aImpresion[0].direccion + " " + aImpresion[0].ciudad + " " + aImpresion[0].estado ,75,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Office:" + aImpresion[0].telefono,100,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Fax:" + aImpresion[0].fax,125,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Toll Free:" + aImpresion[0].toll_free,150,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Manufacturer No.:" + aImpresion[0].manufacturer,175,50);
	**/
	if(g_isdebug)
		console.log("objUsuario: antes " + objUsuario.operacion + "|TIPOVENTA.RPTINICIAL:" +TIPOVENTA.RPTINICIAL);

    switch(objUsuario.operacion)
    {
        case TIPOVENTA.VENTA:
        case TIPOVENTA.DEMO:
        case TIPOVENTA.CREDITO:
        case TIPOVENTA.PROMOCION:
        case TIPOVENTA.GENERAL:
        case TIPOVENTA.REIMPRIMIR:
        	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
        		VoucherMovimientoZebra();
        	else
        		VoucherMovimientoDatamax();
        	
        		var r= false;
        		do{
        			//Ya no imprime en el vouche, imprime aqui. Al menos lo hace 1 vez
        	    	window.plugins.Printer.printAllDocuments(null,null);
        	    	//Pregunta si quiere otra copia
        	    	r=confirm("Do you want a copy?");        	    	
        	    }while(r==true);
        		//Finalmente cierra la conexion
        		window.plugins.Printer.disconnect(null, null);
            break;
            
        case TIPOVENTA.RPTINVENTARIO:
        	VoucherInventario("REPORT OF INVENTORY");
        	break;
        case TIPOVENTA.RPTINICIAL:
        	VoucherInventario("REPORT OF INICIAL");
            break;
        /*case TIPOVENTA.RPTCREDITOS:
        	VoucherInventario("REPORT OF CREDITS");
        	break;*/
        case TIPOVENTA.GENERICO:
        	VoucherTransfer();
        	break;
        case TIPOVENTA.RPTVENTAS:
        case TIPOVENTA.RPTDEMO:
        case TIPOVENTA.RPTCREDITOS:
        case TIPOVENTA.RPTGENERAL:
        case TIPOVENTA.RPTPROMOCION:
        	VoucherVentasGeneral();
        	break;
        case TIPOVENTA.RPTPAGOS:
        	VoucherPagos();
        	break;
        case TIPOVENTA.RPTVTADIARIA:
        	VoucherVentaDiaria();
        	break;
        	
        case TIPOVENTA.PAYMENTS:
        	VoucherPagosCliente();
        	break;
        	
        case TIPOVENTA.RERPORTCREDITS:
        	VoucherCreditos();
        	break;
    }
    
    
    navigator.notification.activityStop();
    estaImpreso = true;

    if(objUsuario.operacion == TIPOVENTA.GENERICO || objUsuario.operacion == TIPOVENTA.DEMO || objUsuario.operacion == TIPOVENTA.VENTA || objUsuario.operacion == TIPOVENTA.CREDITO || objUsuario.operacion == TIPOVENTA.PROMOCION)
    {
    	//if(preimpresion)
    		//{
    			//LimpiarVenta(null);
    		//	btnVentas_Click(objUsuario.operacion);
    		//}
    }
}

function VoucherInventario(tipo)
{
	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];
	
	var x = 1;
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
		x = 50;
	
	  window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
		window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);//200
		window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
		window.plugins.Printer.addDocument(null, null, FONTS.MF185); 
		
	 /**
	    window.plugins.Printer.addTextDocument(null,null,1,"PO Box: " + aImpresion[0].po_box,50,x);
		window.plugins.Printer.addTextDocument(null,null,1,aImpresion[0].direccion + " " + aImpresion[0].ciudad + " " + aImpresion[0].estado ,75,x);
		window.plugins.Printer.addTextDocument(null,null,1,"Office:" + aImpresion[0].telefono,100,x);
		window.plugins.Printer.addTextDocument(null,null,1,"Fax:" + aImpresion[0].fax,125,x);
		window.plugins.Printer.addTextDocument(null,null,1,"Toll Free:" + aImpresion[0].toll_free,150,x);
		window.plugins.Printer.addTextDocument(null,null,1,"Manufacturer No.:" + aImpresion[0].manufacturer,175,x);
		**/
	if(g_isdebug)
		console.log("VoucherInventario:" + tipo);
	var y = 0;
	var col0 = 115;
	var numDocto = 1;
	 
	window.plugins.Printer.addTextDocument(null,null,numDocto, tipo,y,x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocto, "DATE/TIME: " + FechaActualFormato(), y, x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocto, "ROUTE    : " + objUsuario.codigo_ruta, y, x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocto, "          ", y, x);
	y += 25;
		window.plugins.Printer.addLineDocument(null,null,numDocto, 740,y,x);
	y += 25;
	var Col1 = 1;  // Code
	var Col2 = 120; //Description 120
	var Col3 = 450; // Batch 450
	var Col4 = 580; // Quantity 580
	var Col5 = 720 ; // Cases 720 
	
	
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
	{	
		Col1 = 50;
		Col2 = 150;
		Col3 = 550;
		Col4 = 680; // Quantity 580
		Col5 = 800; // Cases 720 
	}
	    
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Code",y,Col1);
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Description",y,Col2);
	if(objUsuario.operacion != TIPOVENTA.RPTINICIAL)
		window.plugins.Printer.addTextDocument(null,null,numDocto, "Batch",y,Col3);
	else
		window.plugins.Printer.addTextDocument(null,null,numDocto, "     ",y,Col3);
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Quantity",y,Col4);
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Cases",y,Col5);

	    
	    y += 25;
	    window.plugins.Printer.addLineDocument(null,null,numDocto, 740,y,x);
	
	
    //var linea = '';
	//numDocto++;
    var total = $('#tblInventario >tbody >tr').length;
    if(g_isdebug)
    	console.log("total registros: " + total );
    try{
	    $("#tblInventario tbody tr").each(function (index) {
	    	y += 25;
	    	if(index%10 ==0)
	    	{
	    		 numDocto++;
	    		 window.plugins.Printer.addDocument(null,null, FONTS.MF226);
	    		 y = 0;
	    	}
			if(index == total-1)
			{
				 //y += 25;
				//window.plugins.Printer.addTextDocument(null,null,0, "--------------------------------------------------------------------------------------",y,1);
				 y += 25;
				 if(g_isdebug)
				 {
					 console.log("VoucherInventario Ultima Fila: " + $(this).text() + "y: " + y );
					 console.log("VoucherInventario es la ultima fila");
				 }
				$(this).children("td").each(function (index2) {
				 switch(index2)
				{
				 case 0:    
	             	window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col1);
	             	if(g_isdebug)
	             		console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	             	break;
	             case 1:
	                 window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col4);
	                 if(g_isdebug)
	                	 console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col4 );
	                 break;
	             case 2:
	             	window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col5);
	             	if(g_isdebug)
	             		console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col5 );
	                 
	                 break;
	                 				
				}
				});
			}
	        else if(index >= 0)
	        {
	            $(this).children("td").each(function (index2) {
	                switch(index2)
	                {
	                	// Code	            	 
	                	case 0:    
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col1);
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	                	break;
	                	//Description		            	
	                	case 1:
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col2);
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col2 );
	                    break;
	                    // cases		            	
	                	case 2:
	                		if(objUsuario.operacion != TIPOVENTA.RPTINICIAL)
	                			window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col3);
	                		else{
	                			window.plugins.Printer.addTextDocument(null,null,numDocto,  "     ",y,Col3);
	                			window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col4);
	                		}
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col3 );
	                    break;	                 
		            	// Batch
	                	case 3:
	                		if(objUsuario.operacion != TIPOVENTA.RPTINICIAL)
	                			window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col4);
	                		else
	                			window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col5);
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col4 );
	                    break;
	                    //Quantity
	                	case 4:
	                		if(objUsuario.operacion != TIPOVENTA.RPTINICIAL)
	                			window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col5);	                		
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col5 );
	                    break;
	                    
	                }	                
	            });            
	        }
	    });
    }catch(err)
    {
    	Alerta("Printer error:" + err);
    }
    if(g_isdebug)
    	console.log("VoucherInventario ya forme las lineas");

    
    y += 200;
    window.plugins.Printer.addTextDocument(null,null,numDocto, "          ", y, x);
	y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocto, "WAREHOUSE PERSON",y,180);
    window.plugins.Printer.addTextDocument(null,null,numDocto, "SALES PERSON",y,450);
    y += 300;
    
    window.plugins.Printer.addTextDocument(null,null,numDocto, "",y,x);
   // window.plugins.Printer.addTextDocument(null,null,numDocto, "",y,1);

    if(g_isdebug)
    	console.log("VoucherInventario antes de imprimri");
    //window.plugins.Printer.printDocument(null,null,0);
    window.plugins.Printer.printAllDocuments(
    		function(){
    			if(g_isdebug)
    		    	console.log("VoucherInventario despues de imprimri");
    		    window.plugins.Printer.disconnect(null, null);
    		},
    		function(){
    	
    		}
    );
    
}

function VoucherMovimientoZebra()
{
	var maximo = 25;
	//console.log(new Date(Date.fromString('09.05.2012', {order: 'MMddYY'})));
	//Wed May 09 2012 00:00:00 GMT+0300 (EEST)
	//var objImpresora = new IMPRESORA;
	//objImpresora = aImpresoras[0];
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF107);
	var col = 270, row = 10, width=300, height =110;
    window.plugins.Printer.addImageDocument(null,null, 0, col, row, width, height, oClienteApp.codigoCliente);
     
	//window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,0,50);//200
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 0,50);
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF185); 
    
    //if(aImpresion[0].po_box != "" || aImpresion[0].po_box != null)
    	//window.plugins.Printer.addTextDocument(null,null,1,"PO Box: " + aImpresion[0].po_box,0,50);
	
    window.plugins.Printer.addTextDocument(null,null,1,aImpresion[0].direccion + " " + aImpresion[0].ciudad + " " + aImpresion[0].estado ,25,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Office:" + aImpresion[0].telefono,50,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Fax:" + aImpresion[0].fax,75,50);
	
	//if(aImpresion[0].toll_free != ""  || aImpresion[0].toll_free != null )
		//window.plugins.Printer.addTextDocument(null,null,1,"Toll Free:" + aImpresion[0].toll_free,100,50);
	//if(aImpresion[0].manufacturer != "" || aImpresion[0].manufacturer != null)
		//window.plugins.Printer.addTextDocument(null,null,1,"Manufacturer No.:" + aImpresion[0].manufacturer,125,50);
	
	if(aImpresion[0].descripcion != "" || aImpresion[0].descripcion != null)
		window.plugins.Printer.addTextDocument(null,null,1,"email:" + aImpresion[0].descripcion,125,50);
	
	
	
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 115;
	var numDocument = 2;
	
	y += 25;
	if(preimpresion)
		var type = ObtieneNombreTransaccion(objVentas.id_tipo_venta);	
	else
	{
		objVentas.fecha = FechaActual();
		var fechaHora = objVentas.fecha.split(' ');
		objVentas.hora = fechaHora[1];
		var type = 'THIS IS NOT AN INVOICE';
	}
	window.plugins.Printer.addTextDocument(null,null,numDocument, type,y,300);
	y += 25;
	//window.plugins.Printer.addTextDocument(null,null,numDocument, "----------------------------------------------------------------------------",y,1);
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
	
	//window.plugins.Printer.addTextDocument(null,null,0,"TEST:",y,1);
	y += 15;
	
	//y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "INVOICE: ",y,50);
	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.folio,y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: ",y,50);
	window.plugins.Printer.addTextDocument(null,null,numDocument, FechaFormato(objVentas.fecha, FORMATO_FECHA_DEFAULT, objVentas.hora),y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "CUSTOMER: ", y,50);
	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.codigo_cliente,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "NAME: ",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.Nombre,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "ADDRESS: ",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.domicilio,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.ciudad + " " + objVentas.objCliente.codigo_estado + " " + objVentas.objCliente.codigo_postal ,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "PHONE: ",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.telefono,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 15;
    
    var Col1 = 50;  // Number
    var Col2 = 150; //Description
    var Col3 = 550; // cases
    var Col4 = 450; // Quantity
    var Col5 = 650; // Unit Price
    var Col6 = 750; // Unit Extended
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Item",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Item",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Unit",y,Col5);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Extended",y,Col6);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Number",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Description",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Cases",y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Qty",y,Col4);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Price",y,Col5);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Price",y,Col6);
    
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    //ese es un array de array
    if(g_isdebug)
    	console.log("aProductosAgrupadosHeader length:" + objVentas.aProductosAgrupadosHeader.length);
    var total_cajas = 0;
    for(var j=0; j< objVentas.aProductosAgrupadosHeader.length; j++){
    	
    	var aGrupo = objVentas.aProductosAgrupadosHeader[j];
    	if(g_isdebug)
    		console.log("aGrupo length:" + aGrupo.length);
    	
    	for(var i = 0; i < aGrupo.length; i++)
    	{    	
    		if(i%20 == 0)
    		{
    			window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    			numDocument++;
    			y = 0;
    		}
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Clave, y, Col1);
    		//window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Nombre_producto , y, Col2);
    		if(g_isdebug)
    			console.log("aGrupo Nombre_producto:" + aGrupo[i].Nombre_producto);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].CantidadCaja , y, Col3);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  parseFloat(aGrupo[i].Cantidad).toFixed(2) , y, Col4);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  parseFloat(aGrupo[i].Precio).toFixed(2) , y, Col5);
    		
    		if(objVentas.id_tipo_venta == TIPOVENTA.DEMO || objVentas.id_tipo_venta == TIPOVENTA.CREDITO)
    			window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(aGrupo[i].Precio * aGrupo[i].Cantidad).toFixed(2) * -1, y, Col6);
    		else if (objVentas.id_tipo_venta == TIPOVENTA.PROMOCION)
    			window.plugins.Printer.addTextDocument(null,null,numDocument, "0.00", y, Col6);
    		else
    			window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(aGrupo[i].Precio * aGrupo[i].Cantidad).toFixed(2), y, Col6);
    			
    		total_cajas +=  aGrupo[i].CantidadCaja;
        //window.plugins.Printer.printText(null,null,0, objVentas.aProductos[j].Cantidad , y, Col4);
    		//window.plugins.Printer.addTextDocument(null,null,0, "ENTRA1" , y, Col5);
    		
    		//console.log("PpRECIO" +aGrupo[i].Precio);
    		//window.plugins.Printer.addTextDocument(null,null,0, "ENTRA2" , y, Col5);
    		if(aGrupo[i].Nombre_producto.length <= maximo)
    		{
    			window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Nombre_producto , y, Col2);    		
    			y += 25;
    		}else{
    			y+= breakLine(aGrupo[i].Nombre_producto, maximo, numDocument, y, Col2, 25);
    		}
    		//y += 25;
    	}
    }
    
    //y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, total_cajas,y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(objVentas.totalProductos).toFixed(2), y,Col4);
    
    if(g_isdebug)
    	console.log("objUsuario.operacion :" + objUsuario.operacion);
	 
    
    if(objVentas.id_tipo_venta == TIPOVENTA.DEMO || objVentas.id_tipo_venta == TIPOVENTA.CREDITO)
    	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.total * -1 ,y,Col6);
    else if (objVentas.id_tipo_venta == TIPOVENTA.PROMOCION)
		window.plugins.Printer.addTextDocument(null,null,numDocument, "0.00", y, Col6);
    else
    	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.total,y,Col6);
    
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "GRAND TOTALS:",y,50);
    y += 25;
    if(objVentas.notaCredito == 1)
    {
    	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
        numDocument++;
        y = 0;
        
    	 y += 25;
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "REF CREDIT:",y,50);
    	
    	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.Reference,y,150);
    	Col4 = 750;
    	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.importeNC,y,Col4);
     	
    	y += 25;
     	window.plugins.Printer.addTextDocument(null,null,numDocument, "TOTAL TO PAY:",y,50);
     	
     	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.montoPagar,y,Col4);
     	
     	 y += 25;
         window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
         y += 15;
    }
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "SALES PERSON:",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objUsuario.codigo_ruta,y,150);
    y += 25;
    
   
    if(objVentas.aPagos.length  > 0)
    {
    	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
        numDocument++;
        y = 0;
        
    	 y += 25;
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "PAYMENTS:",y,50);
    	 y += 25;
    	Col1 = 50;  // Date
    	Col2 = 300; //Invoice
    	Col3 = 500; // Amount
    	Col4 = 600; // Check
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Date",y,Col1);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Invoice",y,Col2);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Amount",y,Col3);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Check#",y,Col4);
    	
    	 y += 25;
    	 
    	 
     	
    	for(var j=0; j< objVentas.aPagos.length; j++){
    		
    		
    		
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   objVentas.aPagos[j].objPagosRuta.Fecha_creacion , y, Col1);
    		if(g_isdebug)
    			console.log("aGrupoPagos Fecha:" + objVentas.aPagos[j].Fecha_creacion);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   objVentas.aPagos[j].objPagosRuta.Factura, y, Col2);
    		if(g_isdebug)
    			console.log("aGrupoPagos Factura:" + objVentas.aPagos[j].objPagosRuta.Factura);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   parseFloat(objVentas.aPagos[j].objPagosRuta.Monto).toFixed(2) , y, Col3);
    		if(g_isdebug)
    			console.log("aGrupoPagos Monto:" + parseFloat(objVentas.aPagos[j].objPagosRuta.Monto).toFixed(2));
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   objVentas.aPagos[j].objPagosRuta.Numero_cheque , y, Col4);
    		if(g_isdebug)
    			console.log("aGrupoPagos Numero_cheque:" + objVentas.aPagos[j].objPagosRuta.Numero_cheque);
    		
    		 y += 25;
    		
    	}
    	//for objVentas.aPagos[objVentas.aPagos.length] 
    }
    y = 0;
    window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    numDocument++;
    y += 75;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "TERMS AND CONDITIONS",y,300);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "(1) Seller retains title to the goods and a security interest in the goods,",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  (1)Seller retains title to the goods and a security interest in",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "including all accessions to and replacements of them, until B uyer performs",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  the goods, including all accessions to and replacements of them,",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "the entire contract. (2) Seller reserves the right to repossess the goods",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  until Buyer performs the entire contract. (2)Seller reserves the",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "if payment is not received in 14 days. (3) The goods in this invoice are ",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  right to repossess the goods if payment is not received in 14 days.",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "for resale only. (4) In any action which may be brought to enforce payment",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  (3)The goods in this invoice are for resale only. (4)In any action",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "under this contract Seller is entitled to recover all costs including atto",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  which may be brought to enforce payment under this contract Seller",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "rney�s fees. (5) If this invoice is not paid within 30 days of delivery, any",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  is entitled to recover all costs including attorney s fees. (5)If",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, " unpaid amount will be subject to a monthly finance charge of 1.5%. (6) Buyer",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  this invoice is not paid within 30 days of delivery, any unpaid",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  amount will be subject to a monthly finance charge of 1.5%. (6)",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, " agrees to pay $30.00 for each check drawn on insufficient funds. (7) Buyer",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  Buyer agrees to pay  $30.00 for each check drawn on insufficient",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "agrees that jurisdiction and venue is proper in Stanislaus County, California",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  funds. (7)Buyer agrees that jurisdiction and venue is proper in",y,1);
    y += 50;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "I acknowledge that (I) all referenced goods have been received and are",y,1);
    
    if(aImpresion[0].condado != "" || aImpresion[0].condado != null)
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "  " + aImpresion[0].condado + " I acknowledge that (I) all referenced",y,1);
    else
    	window.plugins.Printer.addTextDocument(null,null,numDocument, " Stanislaus County, California I acknowledge that (I) all referenced",y,1);
   
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "in good order, and (II) I understand that this sale is expressly conditioned",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  goods have been received and are in good order, and (II) I underst",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "upon my assent to all terms on the reverse of this page, and I accept them as",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  and that this sale is expressly conditioned upon my assent to all",y,1);
    y += 25;
    //window.plugins.Printer.addTextDocument(null,null,numDocument, "terms of this sale.",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  terms on the reverse of this page, and I accept them as terms of",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "  this sale.",y,1);
   /** 
	}
    else
    {
    	var comentarios = "  (1) Seller retains title to the goods and a security interest in the goods, including all accessions to " +
    					  "and replacements of them until Buyer performs the entire contract. (2) Seller reserves the right to repossess " +
    					  "the goods if payment is not received in 14 days. (3) The goods in this invoice are for resale only. (4) In any action" +
    					  "which may be brought to enforce payment under this contract Seller is entitled to recover all costs including attorney s fees. " +
    					  "(5) If this invoice is not paid within 30 days of delivery, any unpaid amount will be subject to a monthly finance charge of " +
    					  "1.5%. (6) Buyer agrees to pay  $30.00 for each check drawn on insufficient funds. (7)Buyer agrees that jurisdiction and venue " +
    					  "is proper in Stanislaus County, California I acknowledge that (I) all referenced goods have been received and are in good order, " +
    					  "and (II) I understand that this sale is expressly conditionedupon my assent to all terms on the reverse of this page, and I accept them as terms of this sale." ;
    					  
    	window.plugins.Printer.addTextDocument(null,null,numDocument, comentarios,y,1);
      
    }
    **/
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "RECEIVED BY:",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    
    //window.plugins.Printer.printDocument(null,null,0);
    
    //window.plugins.Printer.disconnect(null, null);
	
}

function VoucherPagosCliente()
{
	var maximo = 25;
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF107);
	var col = 270, row = 10, width=300, height =110;
    window.plugins.Printer.addImageDocument(null,null, 0, col, row, width, height, oClienteApp.codigoCliente);
    
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 0,350);
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    window.plugins.Printer.addTextDocument(null,null,1,"PO Box: " + aImpresion[0].po_box,0,50);
	window.plugins.Printer.addTextDocument(null,null,1,aImpresion[0].direccion + " " + aImpresion[0].ciudad + " " + aImpresion[0].estado ,25,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Office:" + aImpresion[0].telefono,50,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Fax:" + aImpresion[0].fax,75,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Toll Free:" + aImpresion[0].toll_free,100,50);
	window.plugins.Printer.addTextDocument(null,null,1,"Manufacturer No.:" + aImpresion[0].manufacturer,125,50);
	
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 180;
	var numDocument = 2;
	
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
	
	y += 15;
	
	/*window.plugins.Printer.addTextDocument(null,null,numDocument, "INVOICE: ",y,50);
	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.folio,y,col0);
	y += 25;*/
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: ",y,50);
	var aFecha = String(FechaActual()).split(' ');
	window.plugins.Printer.addTextDocument(null,null,numDocument, FechaFormato(aFecha[0], FORMATO_FECHA_DEFAULT, aFecha[1]),y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "CUSTOMER: ", y,50);
	window.plugins.Printer.addTextDocument(null,null,numDocument, clienteSeleccionado.codigo_cliente,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "NAME: ",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, clienteSeleccionado.Nombre,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "ADDRESS: ",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, clienteSeleccionado.domicilio,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, clienteSeleccionado.ciudad + " " + clienteSeleccionado.codigo_estado + " " + clienteSeleccionado.codigo_postal ,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "PHONE: ",y,50);
    window.plugins.Printer.addTextDocument(null,null,numDocument, clienteSeleccionado.telefono,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 15;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "REPORT PERSON:",y,0);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objUsuario.codigo_ruta,y,col0);
    y += 25;
       
    if(rptPagos.length  > 0)
    {
    	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    	numDocument++;
    	y = 0;
    	//4152 3131 8536 4333
    	y += 25;
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "PAYMENTS:",y,350);
    	y += 25;
    	Col1 = 50;  // Date
    	Col2 = 300; //Invoice
    	Col3 = 500; // Amount
    	Col4 = 600; // Check
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Date",y,Col1);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Invoice",y,Col2);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Amount",y,Col3);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Check#",y,Col4);
    	
    	 y += 25;
    	     	      	
    	for(var j=0; j< rptPagos.length; j++){    		
    		var o = rptPagos[j];
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   o.objPagosRuta.Fecha_creacion , y, Col1);
    		if(g_isdebug)console.log("aGrupoPagos Fecha:" + o.Fecha_creacion);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   o.objPagosRuta.Factura, y, Col2);
    		if(g_isdebug)console.log("aGrupoPagos Factura:" + o.objPagosRuta.Factura);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   parseFloat(o.objPagosRuta.Monto).toFixed(2) , y, Col3);
    		if(g_isdebug)console.log("aGrupoPagos Monto:" + parseFloat(o.objPagosRuta.Monto).toFixed(2));
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   o.objPagosRuta.Numero_cheque , y, Col4);
    		if(g_isdebug)console.log("aGrupoPagos Numero_cheque:" + o.objPagosRuta.Numero_cheque);
    		
    		 y += 25;    		
    	}
    }
    y = 0;
    window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    numDocument++;
  
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " ",y,50);
    
    window.plugins.Printer.printAllDocuments(function() {
    	window.plugins.Printer.disconnect(null, null);
    },null);
	
}

function VoucherVentasGeneral(tipo)
{
	//var y = 0;
	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];
	
	var x = 1;
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
		x = 50;
	
	  window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
		window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);//200
		window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
		window.plugins.Printer.addDocument(null, null, FONTS.MF185); 
		
	
	var y = 25;
	var col0 = 115;
	var numDocto = 1;
	
	window.plugins.Printer.addTextDocument(null,null,numDocto, "REPORT INVOICES",y,x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocto, "DATE/TIME: " + FechaActualFormato(), y, x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocto, "ROUTE    : " + objUsuario.codigo_ruta, y, x);
	y += 25;
		window.plugins.Printer.addTextDocument(null,null,numDocto, linea,y,x);
	y += 25;
	var Col1 = 1;  // Tipo
	var Col2 = 100; //Factura
	var Col3 = 200; //Fecha
	var Col4 = 400; //cliente
	var Col5 = 600; //Status
	var Col6 = 700; //Monto
	    
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
	{
		Col1 = 50;  // Tipo
		Col2 = 150; //Factura
		Col3 = 300; //Fecha
		Col4 = 550; //cliente
		Col5 = 700; //Status
		Col6 = 800; //Monto
		    
	}
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Type",y,Col1);
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Invoice",y,Col2);	
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Date",y,Col3);	
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Client",y,Col4);
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Status",y,Col5);
	window.plugins.Printer.addTextDocument(null,null,numDocto, "Total",y,Col6);

	    
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocto, linea,y,1);


    //var linea = '';
    
    var total = $('#tblVentasDia >tbody >tr').length;
    if(g_isdebug)
    	console.log("total registros: " + total );
    try{
	    $("#tblVentasDia tbody tr").each(function (index) {
	    	 y += 25;
	    	if(index%15 ==0)
	    	{
	    		 numDocto++;
	    		 window.plugins.Printer.addDocument(null,null, FONTS.MF226);
	    		 y = 0;
	    	}
			if(index >= total-4)
			{
				 //y += 25;
				//window.plugins.Printer.addTextDocument(null,null,0, "--------------------------------------------------------------------------------------",y,1);
				 y += 25;
				 if(g_isdebug)
				 {
					 console.log("VoucherInventario Ultima Fila: " + $(this).text() + "y: " + y );
					 console.log("VoucherInventario es la ultima fila");
				 }
				$(this).children("td").each(function (index2) {
					 
					if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
					{
					 window.plugins.Printer.addTextDocument(null,null,"   ",  $(this).text(),y,Col2);
					 y += 25;
					}
				 switch(index2)
				{
				 	
				 case 0:    
					 window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col2);
	             	if(g_isdebug)
	             		console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	             	break;
	             case 1:
	            	 //window.plugins.Printer.addTextDocument(null,null," ",  $(this).text(),y,Col2);
	            	 //y +=25;
	                 window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col5);
	                 if(g_isdebug)
	                	 console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col4 );
	                 break;	            	                 			
				}
				});
			}
	        else if(index > 0)
	        {
	            $(this).children("td").each(function (index2) {
	                switch(index2)
	                {
	                	// Tipo	            	 
	                	case 0:    
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col1);
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	                		break;
	                	//Factura		            	
	                	case 1:
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col2);
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col2 );
	                		break;
	                    // Fecha		            	
	                	case 2:	                			                		
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col3);	                		
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col3 );
	                		break;	                 
		            	// Cliente
	                	case 3:	                		
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col4);	                		
	                		if(g_isdebug)
	                			console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col4 );
	                		break;
	                    //Status
	                	case 4:	                		
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col5);
	                		break;
	                  //monto
	                	case 5:	                		
	                		window.plugins.Printer.addTextDocument(null,null,numDocto,  $(this).text(),y,Col6);
	                		break;
	                }                           
	                
	            });            
	        }
	    });
    }catch(err)
    {
    	Alerta("VoucherInventario error:" + err);
    }
    if(g_isdebug)
    	console.log("VoucherInventario ya forme las lineas");

    
    //y += 200;
    //window.plugins.Printer.addTextDocument(null,null,numDocto, "WAREHOUSE PERSON",y,180);
    //window.plugins.Printer.addTextDocument(null,null,numDocto, "SALES PERSON",y,450);
    y += 300;
    
    window.plugins.Printer.addTextDocument(null,null,numDocto, "",y,0);
   // window.plugins.Printer.addTextDocument(null,null,numDocto, "",y,1);

    if(g_isdebug)
    	console.log("VoucherInventario antes de imprimri");

    window.plugins.Printer.printAllDocuments(function() {
    	window.plugins.Printer.disconnect(null, null);
    },null);
}

function VoucherMovimientoDatamax()
{
	//console.log(new Date(Date.fromString('09.05.2012', {order: 'MMddYY'})));
	//Wed May 09 2012 00:00:00 GMT+0300 (EEST)
	var maximo = 25;
    window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
	//window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);//200
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
	
    window.plugins.Printer.addDocument(null, null, FONTS.MF185); 
    //window.plugins.Printer.addTextDocument(null,null,1,"PO Box: " + aImpresion[0].po_box,50,1);
	window.plugins.Printer.addTextDocument(null,null,1,aImpresion[0].direccion + " " + aImpresion[0].ciudad + " " + aImpresion[0].estado ,75,1);
	window.plugins.Printer.addTextDocument(null,null,1,"Office:" + aImpresion[0].telefono,100,1);
	window.plugins.Printer.addTextDocument(null,null,1,"Fax:" + aImpresion[0].fax,125,1);
	//window.plugins.Printer.addTextDocument(null,null,1,"Toll Free:" + aImpresion[0].toll_free,150,1);
	//window.plugins.Printer.addTextDocument(null,null,1,"Manufacturer No.:" + aImpresion[0].manufacturer,175,1);
	
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 115;
	var numDocument = 2;
	
	y += 25;
	var type = ObtieneNombreTransaccion(objVentas.id_tipo_venta);	
	window.plugins.Printer.addTextDocument(null,null,numDocument, type,y,300);
	y += 25;
	//window.plugins.Printer.addTextDocument(null,null,numDocument, "----------------------------------------------------------------------------",y,1);
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
	
	//window.plugins.Printer.addTextDocument(null,null,0,"TEST:",y,1);
	y += 25;
	
	//y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "INVOICE: ",y,1);
	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.folio,y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: ",y,1);
	window.plugins.Printer.addTextDocument(null,null,numDocument, FechaFormato(objVentas.fecha, FORMATO_FECHA_DEFAULT, objVentas.hora),y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "CUSTOMER: ", y,1);
	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.codigo_cliente,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "NAME: ",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.Nombre,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "ADDRESS: ",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.domicilio,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.ciudad + " " + objVentas.objCliente.codigo_estado + " " + objVentas.objCliente.codigo_postal ,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "PHONE: ",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.objCliente.telefono,y,col0);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    var Col1 = 1;  // Number
    var Col2 = 80; //Description
    var Col3 = 400; // cases
    var Col4 = 500; // Quantity
    var Col5 = 600; // Unit Price
    var Col6 = 700; // Unit Extended
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Item",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Item",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Unit",y,Col5);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Extended",y,Col6);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Number",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Description",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Cases",y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Qty",y,Col4);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Price",y,Col5);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Price",y,Col6);
    
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    //ese es un array de array
    if(g_isdebug)
    	console.log("aProductosAgrupadosHeader length:" + objVentas.aProductosAgrupadosHeader.length);
    var total_cajas = 0;
    for(var j=0; j< objVentas.aProductosAgrupadosHeader.length; j++){
    	
    	var aGrupo = objVentas.aProductosAgrupadosHeader[j];
    	if(g_isdebug)
    		console.log("aGrupo length:" + aGrupo.length);
    	
    	for(var i = 0; i < aGrupo.length; i++)
    	{    	
    		if(i%20 == 0)
    		{
    			window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    			numDocument++;
    			y = 0;
    		}
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Clave, y, Col1);
    		//window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Nombre_producto , y, Col2);
    		if(g_isdebug)
    			console.log("aGrupo Nombre_producto:" + aGrupo[i].Nombre_producto);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].CantidadCaja , y, Col3);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  parseFloat(aGrupo[i].Cantidad).toFixed(2) , y, Col4);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  parseFloat(aGrupo[i].Precio).toFixed(2) , y, Col5);
    		
    		if(objVentas.id_tipo_venta == TIPOVENTA.DEMO || objVentas.id_tipo_venta == TIPOVENTA.CREDITO)
    			window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(aGrupo[i].Precio * aGrupo[i].Cantidad).toFixed(2) * -1, y, Col6);
    		else if (objVentas.id_tipo_venta == TIPOVENTA.PROMOCION)
    			window.plugins.Printer.addTextDocument(null,null,numDocument, "0.00", y, Col6);
    		else
    			window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(aGrupo[i].Precio * aGrupo[i].Cantidad).toFixed(2), y, Col6);
    			
    		total_cajas +=  aGrupo[i].CantidadCaja;
        //window.plugins.Printer.printText(null,null,0, objVentas.aProductos[j].Cantidad , y, Col4);
    		//window.plugins.Printer.addTextDocument(null,null,0, "ENTRA1" , y, Col5);
    		
    		//console.log("PpRECIO" +aGrupo[i].Precio);
    		//window.plugins.Printer.addTextDocument(null,null,0, "ENTRA2" , y, Col5);
    		if(aGrupo[i].Nombre_producto.length <= maximo)
    		{
    			window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Nombre_producto , y, Col2);    		
    			y += 25;
    		}else{
    			y+= breakLine(aGrupo[i].Nombre_producto, maximo, numDocument, y, Col2, 25);
    		}
    	}
    }
    
    //y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, total_cajas,y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(objVentas.totalProductos).toFixed(2), y,Col4);
    
    if(g_isdebug)
    	console.log("objUsuario.operacion :" + objUsuario.operacion);
	 
    
    if(objVentas.id_tipo_venta == TIPOVENTA.DEMO || objVentas.id_tipo_venta == TIPOVENTA.CREDITO)
    	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.total * -1 ,y,Col6);
    else if (objVentas.id_tipo_venta == TIPOVENTA.PROMOCION)
		window.plugins.Printer.addTextDocument(null,null,numDocument, "0.00", y, Col6);
    else
    	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.total,y,Col6);
    
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "GRAND TOTALS:",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "SALES PERSON:",y,1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, objUsuario.codigo_ruta,y,150);
    y += 25;
    
   
    if(objVentas.aPagos.length  > 0)
    {
    	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
        numDocument++;
        y = 0;
        
    	 y += 25;
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "PAYMENTS:",y,1);
    	 y += 25;
    	Col1 = 1;  // Date
    	Col2 = 300; //Invoice
    	Col3 = 400; // Amount
    	Col4 = 5000; // Check
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Date",y,Col1);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Invoice",y,Col2);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Amount",y,Col3);
    	window.plugins.Printer.addTextDocument(null,null,numDocument, "Check#",y,Col4);
    	
    	 y += 25;
    	 
    	 
     	
    	for(var j=0; j< objVentas.aPagos.length; j++){
    		
    		
    		
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   objVentas.aPagos[j].objPagosRuta.Fecha_creacion , y, Col1);
    		if(g_isdebug)
    			console.log("aGrupoPagos Fecha:" + objVentas.aPagos[j].Fecha_creacion);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   objVentas.aPagos[j].objPagosRuta.Factura, y, Col2);
    		if(g_isdebug)
    			console.log("aGrupoPagos Factura:" + objVentas.aPagos[j].objPagosRuta.Factura);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   parseFloat(objVentas.aPagos[j].objPagosRuta.Monto).toFixed(2) , y, Col3);
    		if(g_isdebug)
    			console.log("aGrupoPagos Monto:" + parseFloat(objVentas.aPagos[j].objPagosRuta.Monto).toFixed(2));
    		window.plugins.Printer.addTextDocument(null,null,numDocument,   objVentas.aPagos[j].objPagosRuta.Numero_cheque , y, Col4);
    		if(g_isdebug)
    			console.log("aGrupoPagos Numero_cheque:" + objVentas.aPagos[j].objPagosRuta.Numero_cheque);
    		
    		 y += 25;
    		
    	}
    	//for objVentas.aPagos[objVentas.aPagos.length] 
    }
    y = 0;
    window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    numDocument++;
    y += 50;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "TERMS AND CONDITIONS",y,300);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "(1) Seller retains title to the goods and a security interest in the goods,",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "including all accessions to and replacements of them, until B uyer performs",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "the entire contract. (2) Seller reserves the right to repossess the goods",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "if payment is not received in 14 days. (3) The goods in this invoice are ",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "for resale only. (4) In any action which may be brought to enforce payment",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "under this contract Seller is entitled to recover all costs including atto",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "rney�s fees. (5) If this invoice is not paid within 30 days of delivery, any",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " unpaid amount will be subject to a monthly finance charge of 1.5%. (6) Buyer",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, " agrees to pay $30.00 for each check drawn on insufficient funds. (7) Buyer",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "agrees that jurisdiction and venue is proper in Stanislaus County, California",y,1);
    y += 50;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "I acknowledge that (I) all referenced goods have been received and are",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "in good order, and (II) I understand that this sale is expressly conditioned",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "upon my assent to all terms on the reverse of this page, and I accept them as",y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "terms of this sale.",y,1);
    y += 50;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "RECEIVED BY:",y,1);
    y += 50;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "",y,1);
    y += 400;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "",y,1);
    
    //window.plugins.Printer.printDocument(null,null,0);
    
    //window.plugins.Printer.disconnect(null, null);
	
}

function VoucherTransfer()
{

	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];
	
	var x = 1;
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
		x = 50;
	
	  window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
		window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);//200
		window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
		//window.plugins.Printer.addDocument(null, null, FONTS.MF185); 
		
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 115;
	var numDocument = 1;
	
	y += 25;
	var type = ObtieneNombreTransaccion(objVentas.id_tipo_venta);	
	window.plugins.Printer.addTextDocument(null,null,numDocument, type,y,300);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
		
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: ",y,x);
	window.plugins.Printer.addTextDocument(null,null,numDocument, FechaFormato(objVentas.fecha, FORMATO_FECHA_DEFAULT, objVentas.hora),y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "FOLIO: ",y,x);
	window.plugins.Printer.addTextDocument(null,null,numDocument, objVentas.id_movimiento_enc,y,col0);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    var Col1 = 1;  // Number
    var Col2 = 100; //Description
    var Col3 = 420; // Quantity
    var Col4 = 550; // boxes
    var Col5 = 700; // Unit Price
    if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
    {
    	Col1 = 50;
		Col2 = 150;
		Col3 = 550;
		Col4 = 680; // Quantity 580
		Col5 = 800; // Cases 720 
    }
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Code",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Description",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Batch",y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Quantity",y,Col4);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Cases",y,Col5);
    
    
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    //ese es un array de array
    if(g_isdebug)
    	console.log("aProductosAgrupadosHeader length:" + objVentas.aProductosAgrupadosHeader.length);
    var total_cajas = 0;
    for(var j=0; j< objVentas.aProductosAgrupadosHeader.length; j++){
    	
    	var aGrupo = objVentas.aProductosAgrupadosHeader[j];
    	if(g_isdebug)
    		console.log("aGrupo length:" + aGrupo.length);
    	
    	for(var i = 0; i < aGrupo.length; i++)
    	{    	
    		if(i%20 == 0)
    		{
    			window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    			numDocument++;
    			y = 0;
    		}
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Clave, y, Col1);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Nombre_producto , y, Col2);    	    		
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].Lote , y, Col3);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  parseFloat(aGrupo[i].Cantidad).toFixed(2) , y, Col4);
    		window.plugins.Printer.addTextDocument(null,null,numDocument,  aGrupo[i].CantidadCaja , y, Col5);
    		    	   		
    		total_cajas +=  aGrupo[i].CantidadCaja;
        
    		y += 25;
    	}
    }
    
    //y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, parseFloat(objVentas.totalProductos).toFixed(2), y,Col4);
    window.plugins.Printer.addTextDocument(null,null,numDocument, total_cajas,y,Col5);
    
    y += 25;
        
    y = 0;
    window.plugins.Printer.addDocument(null, null, FONTS.MF185);
    numDocument++;
   
    y += 50;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "RECEIVED BY:",y,x);
    y += 50;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "",y,1);
    y += 400;
    window.plugins.Printer.addTextDocument(null,null,numDocument, "",y,1);
    
    window.plugins.Printer.printAllDocuments(function() {
    	window.plugins.Printer.disconnect(null, null);
    },null);
}

function VoucherVentaDiaria()
{
	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];
	
	var x = 1;
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
		x = 50;
	
	window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
	window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);
	if(g_isdebug)console.log("nombre_comercial: " + aImpresion[0].nombre_comercial);
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
	if(g_isdebug)console.log("compania: " + aImpresion[0].compania);
		
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 115;
	var numDocument = 1;
	
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
		
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: " + FechaActualFormato(), y, x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "ROUTE    : " + objUsuario.codigo_ruta, y, x);
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    var Col1 = 1;
    var Col2 = 120;
    var Col3 = 420;
    var Col4 = 550;
    if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
    {
    	Col1 = 50;
		Col2 = 150;
		Col3 = 550;
		Col4 = 680;
    }
    
    window.plugins.Printer.addTextDocument(null,null,numDocument,'Resumen Daily',75,200);
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	y = 0;    
    $("#tblRuta tbody tr").each(function (index) {
    	y += 25;		
	   $(this).children("td").each(function (index2) {
	       switch(index2)
	       {	       		            	
	       	case 0:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col2);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3);
	       		break;
	       }
	   });
    });
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	 window.plugins.Printer.addTextDocument(null,null,numDocument,'SALES',50,200);
	y = 50;
	var header = "";
    $("#tblVentaRuta tbody tr").each(function (index) {
    	y += 25;
	   $(this).children("td").each(function (index2) {
		   if(g_isdebug)console.log("Text: " + $(this).text() + "index: " + index);
	       switch(index2)
	       {	       		            	
	       	case 0:
	       		if(index !== 0)
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		else
	       			header += $(this).text() + " ";
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:
	       		if(index !== 0)
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col3);
	       		else
	       			header += $(this).text() + " ";
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3);
	       		break;
	       		
	       	case 2:
	       		if(index !== 0)
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col3);
	       		else
	       			header += $(this).text() + " ";
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3, '', 15);
	       		break;
	       		
	       	case 3:
	       		if(index === 0)
	       		{
	       			header += $(this).text();
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  header,y,Col1);
	       		}	
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3);
	       		break;
	       }
	   });
    });
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	 window.plugins.Printer.addTextDocument(null,null,numDocument,'COLLECTION',75,200);
	y = 75;    
    $("#tblCobranzaRuta tbody tr").each(function (index) {
    	y += 25;		
	   $(this).children("td").each(function (index2) {
	       switch(index2)
	       {	       		            	
	       	case 0:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col3);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3);
	       		break;
	       }
	   });
    });
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	window.plugins.Printer.addTextDocument(null,null,numDocument,'RESUMEN',75,200);
	y = 75;    
    $("#tblTotalRuta tbody tr").each(function (index) {
    	y += 25;		
	   $(this).children("td").each(function (index2) {
	       switch(index2)
	       {	       		            	
	       	case 0:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col3);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + padding_left(Col3, '', 15));
	       		break;
	       }
	   });
	   /*if(index === 2)
	   {
		   y += 25;
		   window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
	   }*/
    });
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    
    window.plugins.Printer.printAllDocuments(function() {
    	window.plugins.Printer.disconnect(null, null);
    },null);
}

function VoucherPagos()
{
	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];
	
	var x = 1;
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
		x = 50;
	
	window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
	window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);
	if(g_isdebug)console.log("nombre_comercial: " + aImpresion[0].nombre_comercial);
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
	if(g_isdebug)console.log("compania: " + aImpresion[0].compania);
		
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 115;
	var numDocument = 1;
	
	y += 25;
	var type = "";	
	window.plugins.Printer.addTextDocument(null,null,numDocument, type,y,300);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
		
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: " + FechaActualFormato(), y, x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "ROUTE    : " + objUsuario.codigo_ruta, y, x);
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    var Col1 = 1;
    var Col2 = 120;
    var Col3 = 420;
    var Col4 = 550;
    if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
    {
    	Col1 = 50;
		Col2 = 300;
		Col3 = 550;
		Col4 = 680;
    }
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Date",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Invoice",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Payment",y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "    Amount",y,Col4);
        
    
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);

    //y += 25;        
    $("#tblPayments > tbody > tr").each(function (index) {
    	if(g_isdebug)console.log("index: "  + index );
    	y += 25;
    	if(index%15 ==0)
    	{
    		numDocument++;
   		 	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
   		 	y = 0;
    	}
		if(index >= 0)
		{
			if(g_isdebug)console.log("index: "  + index );
           $(this).children("td").each(function (index2) {
        	   if(g_isdebug)console.log("index2: "  + index2 );
               switch(index2)
               {
               	// Date	            	 
               	case 0:    
               		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
               		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
               		break;
               	//Invoice
               	case 1:
               		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col2);
               		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col2 );
               		break;
                // Payment		            	
               	case 2:       			                		
               		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col3);	                		
               		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col3 );
               		break;	                 
	            // Amount
               	case 3:	                		
               		window.plugins.Printer.addTextDocument(null,null,numDocument, padding_left( $(this).text(), '', 15),y,Col4);	                		
               		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + padding_left(Col4, '', 15));
               		break;
               }               
           });            
       }
    });
    
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	y = 0;
    
    $("#tblPaymentsSumary tbody tr").each(function (index) {
    	y += 25;		
	   $(this).children("td").each(function (index2) {
	       switch(index2)
	       {	       		            	
	       	case 0:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument,  padding_left($(this).text(), '', 15),y,Col4);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + padding_left(Col3, '', 15));
	       		break;
	       }
	   });
    });
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    
    window.plugins.Printer.printAllDocuments(function() {
    	window.plugins.Printer.disconnect(null, null);
    },null);
}


function VoucherCreditos()
{
	var objImpresora = new IMPRESORA;
	objImpresora = aImpresoras[0];
	
	var x = 1;
	if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
		x = 50;
	
	window.plugins.Printer.addDocument(null, null, FONTS.MF107);    
	window.plugins.Printer.addTextDocument(null,null,0,aImpresion[0].nombre_comercial,75,200);
	if(g_isdebug)console.log("nombre_comercial: " + aImpresion[0].nombre_comercial);
	window.plugins.Printer.addTextDocument(null,null,0, aImpresion[0].compania, 100,200);
	if(g_isdebug)console.log("compania: " + aImpresion[0].compania);
		
	window.plugins.Printer.addDocument(null, null, FONTS.MF185);
	var y = 0;
	var col0 = 115;
	var numDocument = 1;
	
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
		
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, "DATE/TIME: " + FechaActualFormato(), y, x);
	y += 25;
	window.plugins.Printer.addTextDocument(null,null,numDocument, "ROUTE    : " + objUsuario.codigo_ruta, y, x);
	y += 25;	
	window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    y += 25;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument,'REPORT CREDITS',y,300);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,'',y,200);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,'',y,200);
    
    window.plugins.Printer.addTextDocument(null,null,numDocument,'Resales Credit',y,300);
    y += 25;
    
    var Col1 = 1;
    var Col2 = 120;
    var Col3 = 420;
    var Col4 = 550;
    var Col5 = 650;
    if(objImpresora.Tipo == TIPO_IMPRESORA.ZEBRA)
    {
    	Col1 = 50;
		Col2 = 150;
		Col3 = 550;
		Col4 = 680;
		Col5 = 780;
    }
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Code",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Name",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Lote",y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Quantity",y,Col4);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Boxes",y,Col5);    
    
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	y = 0;
	var t = $("#resales_credits tbody tr").length;
    $("#resales_credits tbody tr").each(function (index) {
    	y += 25;		
	   $(this).children("td").each(function (index2) {
	       switch(index2)
	       {	       		            	
	       	case 0:
	       		if(index < (t-1))
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		else
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1+100);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:
	       		if(index < (t-1))
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col2);
	       		else
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col4);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col2);
	       		break;
	       		
	       	case 2:
	       		if(index < (t-1))
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col3);
	       		else
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col5);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3);
	       		break;
	       		
	       	case 3:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col4);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col4);
	       		break;
	       		
	       	case 4:
	       		window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col5);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col5);
	       		break;
	       }
	   });
    });
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, linea,y,1);
    
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, '',y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, '',y,1);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument, 'Return Credit',y,1);
    y += 25;
    
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Code",y,Col1);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Name",y,Col2);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Lote",y,Col3);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Quantity",y,Col4);
    window.plugins.Printer.addTextDocument(null,null,numDocument, "Boxes",y,Col5);    
    
    numDocument++;
	window.plugins.Printer.addDocument(null,null, FONTS.MF185);
	y = 0;
	t = $("#return_credits tbody tr").length;
    $("#return_credits tbody tr").each(function (index) {
    	y += 25;		
	   $(this).children("td").each(function (index2) {
	       switch(index2)
	       {	       		            	
	       	case 0:
	       		if(index < (t-1))
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1);
	       		else
	       			window.plugins.Printer.addTextDocument(null,null,numDocument,  $(this).text(),y,Col1+100);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col: " + Col1 );
	       		break;
	       		
	       	case 1:
	       		if(index < (t-1))
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col2);
	       		else
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col4);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col2);
	       		break;
	       		
	       	case 2:
	       		if(index < (t-1))
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col3);
	       		else
	       			window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col5);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col3);
	       		break;
	       		
	       	case 3:    
	       		window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col4);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col4);
	       		break;
	       		
	       	case 4:
	       		window.plugins.Printer.addTextDocument(null,null,numDocument, $(this).text(),y,Col5);
	       		if(g_isdebug)console.log("columna: " + $(this).text() + "y: " + y + "col:" + Col5);
	       		break;
	       }
	   });
    });       
    
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    window.plugins.Printer.addTextDocument(null,null,numDocument,  "" , y,Col3);
    y += 25;
    
    window.plugins.Printer.printAllDocuments(function() {
    	window.plugins.Printer.disconnect(null, null);
    },null);
}
