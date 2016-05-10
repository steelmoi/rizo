//Entidad usuario

/*
 * obed manuel dice:
 1.- por cliente
 2.- por producto
 3.- por categoria
Mois�s dice:
 ok
 esa categoria de donde la saco?
obed manuel dice:
 en realidad
 lo que se hace
 es lo siguiente
 se guarda siempre
 tanto por producto y categoria
 una relacion de id_producto, id_negocio, porcentaje
 el campo clave puede para el tipo de descuento producto y categoria
 representa el id_producto
 para el tipo de descuento
 seha por cliente representa
 el campo clave = id_cliente
 */

/*function TIPODESCUENTO(){}

TIPODESCUENTO.NONE = 0;
TIPODESCUENTO.CLIENTE = 1;
TIPODESCUENTO.CATEGORIA = 2;
TIPODESCUENTO.PRODUCTO = 3;*/


/*function STATUSVENTAS(){}
STATUSVENTAS.CANCELADA = 0;
STATUSVENTAS.ACTIVA = 1;*/

/*function ESTADOTRANSACCION() {}
ESTADOTRANSACCION.NOENVIADA = 0;
ESTADOTRANSACCION.ENVIADA = 1;*/

/*function OPCVENTAS(){}
OPCVENTAS.REIMPRIMIR = 1;
OPCVENTAS.CANCELAR = 2;*/

/*function TIPOVENTA() {}
TIPOVENTA.PREVENTA = 0;
TIPOVENTA.VENTA = 1;
TIPOVENTA.INVENTARIO = 4;*/

function CLIENTEAPP() {
	this.codigoCliente = '';
	this.NombreCliente = '';
	this.Url = '';
	this.Predeterminada = 0;
	this.Logo = ''; 
};

function USUARIO(){
	this.Id_Usuario = 0;
	this.Usuario = '';
	this.Password = '';
	this.id_distribuidor = 0;	
	this.Fecha_Ruta = '';
	this.Id_Almacen = 0;
	this.Id_asignacion_Ruta = '';
	this.Id_Ruta = 0;	
	this.Id_Vendedor = 0;
	//this.Id_Almacen = 0;
	this.version ='';
	this.operacion = 0;
    
    this.tipo_venta = TIPOVENTA.VENTA;
    this.impresora = '';
    //this.id_zona = 0;
    this.id_compania = 0;
    
    this.parametros = new Object();
    this.num_factura = 0;
    this.codigo_ruta = '';
    this.downloadManual = false;
    this.nombre = '';
    this.apellidos = '';
}

function LOGIN(){
    this.usuarioPrevio = new USUARIO();
    
    this.TotalVentasNoEnviadas = 0;
    this.NoVentasPendientes = 0;
    this.TotalCancelaciones = 0;
    this.TotalNoventas = 0;
    this.TotalVentas = 0;
    this.TotalMovimientos = 0;
    this.TotalMovimientosNoEnviados = 0;
    this.TotalMovimientosCerrados = 0;
    this.TotalPagosNoEnviados = 0;
    this.TotalCancelacionesPagos = 0;
    this.loggueado = false;      
};

//Entidad Producto
function PRODUCTO(){
	
	this.Clave = '';
	this.Existencia = 0;
	this.Id_almacen = 0;
	this.Id_producto = 0;
	this.Nombre_producto = '';
	this.Id_categoria = 0;
	this.Categoria = '';
	this.Lote = '';
	this.Id_almacen_inventario = 0;
	this.caja = 0;
	
	this.id_unidad_medida = 0;
	this.nombre_unidad_medida = '';
	
	//se ocupa para controlar la cantidad
	// de productos que se van agregando
	this.Cantidad = 0.0;
	this.CantidadCaja = 0;
	this.Precio = 0.0;
	
	//this.objDescProducto = null;
	//this.objDescCategoria = null;
	this.subtotal = 0.0;
	this.total = 0.0;
	this.estatus = 0;
	
	this.maximoCaja = 0;
	this.maximoUnidad = 0;
	this.tipo_captura = TIPO_CAPTURA.LECTOR;
	
	this.objPrecio = new PRECIO();
	
	this.tipo_precio = TIPO_PRECIO.CATALOGO;
	this.descuento = 0.0;
	
	this.status_venta = 0;
	this.Monto_iva = 0.0;
	this.Id_venta = 0;
}

function PRODUCTOINICIAL()
{
	this.id_movimiento_details = 0;
	this.nombre_tipo_movimiento = '';
	this.fecha_entrega = '';
	this.id_almacen = ''; 
	this.codigo_producto = '';
	this.nombre_producto = '';
	this.categoria_producto = '';
	this.unidad_medida = '';
	this.lote = '';
	this.cantidad = 0.00;
	this.cantidad_cajas = 0.00; 
	this.status = 0;
	this.id_asignacion_ruta = 0;	
}
//Entidad Negocio

function CLIENTE()
{
	this.ciudad = '';
	this.codigo_cliente = '';
	this.codigo_estado = '';
	this.codigo_postal = '';
	this.dias_credito = 0;
	this.domicilio = '';
	this.id_cliente = '';
	this.id_ruta = '';
	this.id_distribuidor = '';
	this.Nombre = '';
	this.telefono = '';
	this.id_lista_precio = 0;
}

function IMPRESION()
{
	this.ciudad = '';
	this.codigo_postal = '';
	this.compania = '';
	this.direccion = '';
	this.estado = '';
	this.fax = '';
	this.id_compania = '';	
	this.id_distribuidor ='';
	this.manufacturer = '';
	this.nombre_comercial = '';
	this.pais = '';
	this.po_box = '';
	this.telefono = '';
	this.toll_free= '';
	this.descripcion = '';
	this.condado = '';
}

function PRECIO()
{
	this.id_lista_precios_enc = '';
	this.id_producto = '';
	this.precio_caja_final_max = 0.0;
	this.precio_caja_final_min = 0.0;
	this.precio_caja_regular = 0.0;
	
	this.codigo_producto = '';
	this.id_distribuidor = 0;
	this.id_unidad_medida = 0;
	this.nombre_producto = '';
	this.unidad_medida = '';
	this.status_venta = 0;
}

var CANCELACION = function()
{
    this.id_venta = 0; 
    this.longitud = '';
    this.latitude = '';
    this.fecha = '';
    this.hora = '';
    this.Id_Usuario = 0;
    this.enviada = ESTADOTRANSACCION.NOENVIADA;
    this.id_tipo_credito = 0;
};

function VENTAS()
{
	this.folio = 0;
	this.id_venta =0;
	//this.tipo_descuento = TIPODESCUENTO.NONE;
	this.aProductos = [];//new Array();
	this.aProductosAgrupados = [];//new Array();
	this.aProductosAgrupadosHeader = [];//new Array();
	this.aProductosAuxiliar = [];//new Array();
	this.id_tipo_venta = TIPOVENTA.VENTA;
	this.objCliente = null;
	this.subtotal = 0.0;
	//this.descuento = 0;
	//this.objDescCliente = null;
	this.total = 0.0;
	//this.otrosdescuento  = 0.0;
	this.status = STATUSVENTAS.ACTIVA;
	this.monto_iva = 0.0;
	this.fecha = '';
	this.hora = '';
	
	this.notaCredito = 0;
	this.importeNC = 0.0;
	this.montoPagar =0.0
	this.Id_usuario = 0;
	this.Reference = '';
	this.latitude;
    this.longitude;
    
    this.Id_Almacen = 0;
    this.Id_asignacion_Ruta = 0;
    
    this.comentario = '';
    this.id_motivont = 0;
    this.Id_distribuidor = 0;
    this.totalProductos = 0.0;
    this.totalCajas = 0.0;
    
    this.Id_tipo_credito = 0;
    this.requiere_firma = 0;
    
    //Solo para trasapasos
    this.id_movimiento_enc = 0;
    
    this.aPagos = new Array();
    this.srcImage = null;
    this.pagosVentas = 0;
    this.image = null;
    this.ventaConPago = false;
    
    this.id_cliente = 0;
    this.Monto_descuento = 0;
    this.Monto_otrosdescuentos = 0;
    this.hasSign = false;
    this.tabIndex = 0;
};


var ENTIDAD= function(){
    this.id = 0;
    this.nombre_tabla = '';
    this.checksum = '';
    this.totalServer = 0;
    this.totalLocal = 0;
};

function ERROR ()
{
    this.numError = '';
    this.msj = '';
};

var MOTIVO = function(){
	this.estatus = 1;
	this.fecha_creacion = '';
	this.fecha_ult_act = '';
	this.id_compania = 0;
	this.id_motivos_nt = 0;
	this.id_usuario = 0;
	this.nombre = '';
};

var IMPRESORA = function()
{
	this.id_impresora = 0;
    this.Nombre = '';
    this.MAC= '';
    this.Tipo = 1;
    this.Predeterminada = 0;
};

var TRASPASO = function()
{
	this.id_ruta = 0;
	this.id_asignacion_ruta = 0;
	this.id_destino = 0;
	this.id_estatus_movimiento = 0;
	this.id_movimiento_enc = 0;
	this.id_origen = 0;
	this.nombre = '';
	this.nombre_ruta = '';
	this.fecha_entrega = '';
	this.Enviada = 0;
	this.Abierto = 1;
};

var ventas = function()
{
	this.Cantidad_cajas=0.0;
    this.Cantidad_productos=0.0;
    this.Estatus=0;
    this.Factura='';
    this.Facturada=0;
    this.Fecha_venta='';
    this.Id_asignacion_ruta=0;
    this.Id_cliente=0;
    this.Id_ruta=0;
    this.Id_tipo_credito=0;
    this.Id_tipo_venta=0;
    this.Id_usuario=0;
    this.Imei='';
    this.Latitud='';
    this.Longitud = '';
    this.Monto_descuento = 0.0;
    this.Monto_iva = 0.0;
    this.Monto_otrosdescuentos = 0.0;
    this.Monto_subtotal = 0.0;
    this.Monto_total = 0.0;
    this.Pagada = 0;
};

var VentasDet = function()
{
	this.Automatico = TIPO_CAPTURA.LECTOR;
	this.Cajas = 0.0;
	this.Cantidad=0.0;
	this.Estatus=0;
	this.Fecha_venta='';
	this.Id_producto='';
	this.Id_unidad_medida=0;
	this.Id_usuario=0;
	this.Id_venta =0;
	this.Lote='';
	this.Monto_descuento = 0.0;
	this.Monto_iva = 0.0;
	this.Monto_subtotal = 0.0;
	this.Monto_total = 0.0;
	this.Precio_unitario = 0.0;	
};

var MovimientosDet = function()
{
	this.Cantidad = 0.00;
	this.Cantidad_cajas = 0.00;
	this.Id_almacen = 0;
	this.Id_producto = 0;
	this.Id_unidad_medida = 0;
	this.Id_usuario = 0;
	this.Lote = '';
};

var PAGO = function()
{
	this.objPagosRuta = new PagosRuta();
	this.Enviada = 0;
	this.Fecha = '';
	this.Hora = '';
	this.sobrante = 0.00;
	this.id_pago = 0;
	this.codigo_cliente = '';
	this.monto_total = 0.00;
	
	this.parentId = null;
	this.childId = null;
	this.id = 0;
	this.parentFactura = null;
};

var PagosRuta = function()
{
	this.Comentarios = '';
	this.Factura = '';
	this.Fecha_creacion = '';
	this.Id_asignacion_ruta = 0;
	this.Id_cliente = 0;
	this.Id_distribuidor = 0;
	this.Id_tipo_pago = 0;
	this.Id_usuario = 0;
	this.Monto = 0.00;
	this.Numero_cheque = '';
};

var p = function()
{
	this.Comentarios = '';
	this.Factura = '';
	this.Fecha_creacion = '';
	this.Id_asignacion_ruta = 0;
	this.Id_cliente = 0;
	this.Id_distribuidor = 0;
	this.Id_tipo_pago = 0;
	this.Id_usuario = 0;
	this.Monto = 0.00;
	this.Numero_cheque = '';
};

function getValue(obj, key)
{
    var value = '';
    for (var k in obj) {        
        if (obj.hasOwnProperty(k)) {
            alert('getValue key is: ' + k + ', value is: ' + obj[k]);
            if(String(k) == String(key))
                return obj[k];
        }
    }
    return value;
}

function getTotalPropiedades(obj)
{
    var total = 0;
    for (var k in obj)
        if (obj.hasOwnProperty(k)) 
            total++;        

    return total;
}

function existeValor(obj, value)
{
    for (var k in obj) {        
        if (obj.hasOwnProperty(k)) {
            if(String(obj[k]) == String(value))
                return true;
        }
    }
    return false;
}

var NotasCredito = function()
{
	this.Id_notacredito = 0;
	this.Id_venta = 0;
	this.Factura = '';
	this.Monto = 0.00;
	this.Status = '';
};

function SCREEN_ORIENTATION(){}
SCREEN_ORIENTATION.LANDSCAPE	= 0; //acostado
SCREEN_ORIENTATION.PORTRAIT		= 1; //pie
SCREEN_ORIENTATION.UNSPECIFIED	= -1; // cualquier forma


var firma = function()
{
	this.Firma_Venta = '';
    this.Folio = '';
    this.Id_asignacion_ruta = 0;
    this.Id_tipo = 0;
    this.Id_usuario = 0;
    this.Numero_imei = '';
};


