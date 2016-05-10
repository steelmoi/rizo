/**
 * 
 */

var CADENAVACIA = '';
var NOMBRE_APLICACION = 'Rizo';
var VERSION_APP = '1.0';
var BOTON_OK = 'Ok';

//var WSURL = "http://irlf.no-ip.net/RizoService/RizoService.svc"; // Production.
// Testing
var WSURL = "http://rizolopez.no-ip.com/RizoService/RizoService.svc";
// Amazon
//var WSURL = "http://52.25.163.93/ServiceMobil/RizoService.svc";
var INTERFAZ_SERVICIO = 'IRizoService';
var DEFAULT_CLAVE = 'Rizo2012';
var SUCCESS = '1';

function TITULOS(){}

TITULOS.INICIO 			= 'POS-ROUTE';
TITULOS.CANCELARVTA 	= 'CANCEL MOVS';
TITULOS.REIMPRIMIR 		= 'PRINT';
TITULOS.RPTINVENTARIO 	= 'INVENTORY';
TITULOS.NOENVIADAS 		= 'PENDIENTES';
TITULOS.VENTAS      	= 'SALE';
TITULOS.DEMO        	= 'DEMO';
TITULOS.CREDITO    		= 'CREDIT';
TITULOS.PROMOCION   	= 'PROMOTION';
TITULOS.TRASPASO    	= 'TRANFER';
TITULOS.IMPRESORA   	= 'PRINTER';
TITULOS.PANEL	    	= 'PANEL';
TITULOS.PAGOS	    	= 'PAYMENT';
TITULOS.RPTVENTAS   	= 'REPORTE VENTAS';
TITULOS.RPTCREDITOS   	= 'CREDIT REPORTS';
TITULOS.RPTPAGOS   		= 'REPORTE PAGOS';
TITULOS.RPTVENTASDIA   	= 'RPT VENTAS DIA';
TITULOS.RPTCREDITOS   	= 'REPORTE CREDITOS';
TITULOS.SEARCHINVOICE  	= 'SEARCH INVOICE';

TITULOS.SYNC   = 'SINCRONIZACI\u00d3N';

var VENTANAS = new Object();
VENTANAS[0] = 'ventas';
VENTANAS[1] = 'PanelFirma';
VENTANAS[2] = 'Parametros';
VENTANAS[3] = 'Printer';
//VENTANAS[] = 'Printer';

function OPCVENTAS(){}
OPCVENTAS.REIMPRIMIR 	= 2;
OPCVENTAS.CANCELAR 		= 3;

function TIPO_CAPTURA(){};
TIPO_CAPTURA.LECTOR = 1;
TIPO_CAPTURA.MANUAL = 2;

function TIPO_PRECIO() {}
TIPO_PRECIO.LISTA 		= 1;
TIPO_PRECIO.CATALOGO 	= 2;

function ESTADOTRANSACCION(){}
ESTADOTRANSACCION.NOENVIADA 	= 0;
ESTADOTRANSACCION.ENVIADA		= 1;

function STATUSVENTAS(){}
STATUSVENTAS.CANCELADA 		= 0;
STATUSVENTAS.ACTIVA 		= 1;

function TIPOVENTA(){}
TIPOVENTA.VENTA 			= 1;
TIPOVENTA.DEMO 				= 2;
TIPOVENTA.CREDITO 			= 3;
//20062013
TIPOVENTA.INVENTARIO 		= 4;

TIPOVENTA.PROMOCION 		= 5;

TIPOVENTA.GENERAL			= 11;

TIPOVENTA.CANCELACION 		= 999;
TIPOVENTA.GENERICO 			= 1000;
TIPOVENTA.RPTINVENTARIO 	= 1001;
TIPOVENTA.RPTINICIAL 		= 1002;
TIPOVENTA.REIMPRIMIR 		= 1003;
TIPOVENTA.PAGOS 			= 1004;
TIPOVENTA.RPTVENTAS 		= 1005;
TIPOVENTA.RPTCREDITOS		= 1006;
TIPOVENTA.RPTPAGOS 			= 1007;
TIPOVENTA.RPTVTADIARIA 		= 1008;

TIPOVENTA.RPTDEMO 			= 1009;
TIPOVENTA.RPTPROMOCION		= 1010;
TIPOVENTA.RPTGENERAL		= 1011;

TIPOVENTA.SEARCHINVOICE		= 1012;
TIPOVENTA.PAGOCANCEL		= 1013;
TIPOVENTA.PAYMENTS			= 1014;

TIPOVENTA.RERPORTCREDITS	= 1015;

function PAGINAS(){}
PAGINAS.TRASPASO	    =	'Traspasos';
PAGINAS.IMPRESORA       =   'Printer';
PAGINAS.PENDIENTES      =   'Pendientes';
PAGINAS.PANELFIRMA      =   'PanelFirma';
PAGINAS.REIMPRIMIR      =   'Reimprimir';
PAGINAS.PAGOS			=	'Pagos';
PAGINAS.RPTVENTAS		=	'RptVentas';


function TIPOCREDITO(){}
TIPOCREDITO.PRODUCTOBUENO = 1;
TIPOCREDITO.PRODUCTOVENCIDO = 2;

function TIPO_IMPRESORA(){}
TIPO_IMPRESORA.ZEBRA    =   1;
TIPO_IMPRESORA.DATAMAX  =   2;

function TIPO_TRANSACCION(){}
TIPO_TRANSACCION.VENTA          =   'SALE';
TIPO_TRANSACCION.DEMO           =   'DEMO';
TIPO_TRANSACCION.CREDITO        =   'CREDIT';
TIPO_TRANSACCION.PROMOCION      =   'PROMOTION';
TIPO_TRANSACCION.CANCELACION    =   'CANCELACION';
TIPO_TRANSACCION.CANCELACIONPAY =   'CANCELACION PAY';
TIPO_TRANSACCION.MOVIMIENTO      =   'MOVIMIENTO';
TIPO_TRANSACCION.PAGO		      =   'PAGO';

var TIMEOUT_OFFLINE = 60000;

var FINLINEA = "\r\n";
var MAX_COLUMNAS_IMPRESORA =  32;

function TEXT_ALIGN(){}
TEXT_ALIGN.LEFT		=	0;
TEXT_ALIGN.CENTER	=	0;
TEXT_ALIGN.RIGHT	=	0;

var VALOR_INICIALCMBCLIENTE = 'Seleccione Cliente';

function TIPOPAGO(){}
TIPOPAGO.CASH	= 1;
TIPOPAGO.CHEQUE	= 2;


function TIPO_PRODUCTO(){}
TIPO_PRODUCTO.RIZO = 0;
TIPO_PRODUCTO.VENTA = 1;
TIPO_PRODUCTO.COMODIN   = 2;

function FONTS(){}
FONTS.MF226 = 'MF226';
FONTS.MF204 = 'MF204';
FONTS.MF185 = 'MF185';
FONTS.MF107 = 'MF107';
FONTS.PT05T = 'PT05T';
FONTS.OCA1R = 'OCA1R';
FONTS.MF102 = 'MF102';
FONTS.MF072	= 'MF072';
FONTS.MF055 = 'MF055';

function TIPODESCUENTO(){}

TIPODESCUENTO.NONE = 0;
TIPODESCUENTO.CLIENTE = 1;
TIPODESCUENTO.CATEGORIA = 2;
TIPODESCUENTO.PRODUCTO = 3;

function STATUS_MOVS(){}
STATUS_MOVS.ENABLED = 'VALID';
STATUS_MOVS.VOID = 'VOID';

var FORMATO_FECHA_DEFAULT = 'MM-dd-yyyy';

var FILTER_COMBO = false;

var errorNetwork = false;

var offline_menu =	[
                  	 	{name : 'Config', label : 'Config', catalog : 'Parameter', allowOffline : true, error: false},
                  	 	{name : 'PriceList', label : 'Price List', catalog : 'Precio', allowOffline : true , functionSync : '', error: false},
                  	 	{name : 'Products', label : 'Products', catalog : 'Inventory', allowOffline : false , functionSync : '', error: false},
                  	 	{name : 'Customers', label : 'Customers', catalog : 'Negocios', allowOffline : false , functionSync : '', error: false},
                  	 	{name : 'Info Company', label : 'Company', catalog : 'Impresion', allowOffline : false , functionSync : '', error: false}
                  	];

var main_menu = {
		menu: [
			{
				label : 'Transactions',
				hasList: true,
				options : [
			           		{name: 'Sales', label: 'Sales', isSelected: false, onClick: 'btnVentas_Click(1);'},
			           		{name: 'Demos', label: 'Demos', isSelected: false, onClick : 'btnVentas_Click(2);'},
			           		{name: 'Credit', label: 'Credit', isSelected: false, onClick : 'btnVentas_Click(3);'},
			           		{name: 'Promotion', label: 'Promotions', isSelected: false, onClick : 'btnVentas_Click(5);'},
			           		//{name: 'Payments', label: 'Add Payments', isSelected: false, onClick : 'btnPagos_Click(null, null, null);'},
			           		{name: 'Cancel', label: 'Print Trans.', isSelected: false, onClick : 'btnReImprimir_Click(1003);'},
			           		{name: 'Cancel', label: 'Cancel Trans.', isSelected: false, onClick : 'btnReImprimir_Click(3);'},
			           		{name: 'sPayments', label: 'Search Invoices', isSelected: false, onClick : 'btnSearchInvoice_Click();'},
			           		{name: 'Payments', label: 'Payments', isSelected: false, onClick : 'LoadViewPaymentCustomer();'}
			          ]
			},
			{
				label : 'Inventory',				
				hasList: true,
				options : [
				           	{name: 'Transfer', label: 'Transfer', isSelected: false, onClick : 'btnTraspasos_Click(1000);'},
				           	{name: 'Rpt Inventory', label: 'Inventory', isSelected: false, onClick : 'btnRptInventario_Click(1001);'},
				           	{name: 'Rpt Intial', label: 'Initial Inventory', isSelected: false, onClick : 'btnInvInicial_Click(1002);'},
				           	{name: 'Close', label: 'End Day', isSelected: false, onClick: 'btnCierre_Click();'}
				          ]
			},
			{				
				label : 'Reports',
				hasList: true,
				options : [
			           		{name: 'Rpt Sales', label: 'Sales Report', isSelected: false, onClick: 'btnRptVentas_Click('+TIPOVENTA.RPTVENTAS+');'},
			           		{name: 'Rpt Demos', label: 'Demos Report', isSelected: false, onClick: 'btnRptVentas_Click('+TIPOVENTA.RPTDEMO+');'},
			           		{name: 'Rpt Credits', label: 'Credits Report', isSelected: false, onClick: 'btnRptCreditos_click();'/*'btnRptVentas_Click('+TIPOVENTA.RPTCREDITOS+');'*/},
			           		{name: 'Rpt Promotions', label: 'Promotions Report', isSelected: false, onClick: 'btnRptVentas_Click('+TIPOVENTA.RPTPROMOCION+');'},
			           		/*{name: 'Rpt Credito', label: 'Credits Report', isSelected: false, onClick : 'btnRptInventario_Click(1006);'},/*/
			           		{name: 'Rpt Payments', label: 'Payments Report', isSelected: false, onClick : 'btnRptPagos_click();'},
			           		{name: 'Rpt Dayli', label: 'Dayli Report', isSelected: false, onClick : 'btnRptVentasDiarias_click();'},
			           		{name: 'Sumary Report', label: 'Sumary Report', isSelected: false, onClick : 'btnRptVentas_Click('+TIPOVENTA.RPTGENERAL+');'}
			          ]
			},
			/*{
				label : 'MOVS',
				hasList: true,
				options : [
			           		{name: 'Print Movs', label: 'Print Movs', isSelected: false, onClick: 'btnReImprimir_Click(1003);'},			           		
			           		{name: 'Credit', label: 'Credit', isSelected: false, onClick : 'btnVentas_Click(3);'},			           		
			           		
			          ]
			},*/
			
			{
				label : 'Sync',	
				hasList: true,
				options : [
				           	{name: 'OFfline', label: 'Send Data', isSelected: false, onClick: 'btnPendientes_Click();'},
				           	{name: 'Config', label: 'Update Data', isSelected: false, onClick: 'btnSync_click();'}
				           ]
			},
			
			{
				label : 'Setting',				
				name: 'Config', label : 'Printer', isSelected: false, onClick: 'btnImpresora_Click();'
			}
		]
};

var menu_sale = {
		menu: [
			{
				label : 'Transactions',
				hasList: true,
				options : [
			           		{name: 'Imprimir', label: 'Imprimir', isSelected: false, onClick: 'btnVentas_Click(1);'},
			           		{name: 'Payment', label: 'Payment', isSelected: false, onClick : 'btnVentas_Click(2);'},
			           		{name: 'Sign', label: 'Sing', isSelected: false, onClick : 'btnVentas_Click(3);'}
			          ]
			}
				]
};

function SCREEN_ORIENTATION(){}
SCREEN_ORIENTATION.LANDSCAPE	= 0; //acostado
SCREEN_ORIENTATION.PORTRAIT		= 1; //pie
SCREEN_ORIENTATION.UNSPECIFIED	= -1; // cualquier forma
