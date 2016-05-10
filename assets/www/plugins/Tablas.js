//DEFINICION DE LAS ENTIDADES

var TABLAS = function() {};


TABLAS.VENTAS = 'CREATE TABLE IF NOT EXISTS ventas (id_venta INTEGER PRIMARY KEY AUTOINCREMENT, '+
				'id_asignacion_ruta INTEGER, ' +
				'factura VARCHAR(15), ' +
				'id_almacen INTEGER, ' +
			    'id_usuario INTEGER, ' + 
                'id_cliente INTEGER, ' + 
               // 'fecha_venta, ' +
				'monto_subtotal FLOAT, ' +
				'monto_total FLOAT, ' +
				'cantidad_productos INTEGER, ' +
				'status INTEGER, ' +
				'pagada INTEGER, ' +
				'longitud, ' + 
				'latitude, ' +
				'fecha VARCHAR(10), ' + 
				'hora VARCHAR(10), ' + 
				'enviada INTEGER, ' +
				'tipo_venta INTEGER, Id_tipo_credito INTEGER, requiere_firma INTEGER, applica_credito INTEGER)';

TABLAS.DATALLEVENTA = 'CREATE TABLE IF NOT EXISTS detalle_venta (id_venta INTEGER, id_producto INTEGER, '+
						'cantidad FLOAT, ' +
						'lote VARCHAR(50), ' +
						'precio FLOAT, ' +
						'monto_subtotal FLOAT, ' +
						'monto_total FLOAT, tipo_captura INTEGER, Id_unidad_medida INTEGER, caja FLOAT, descuento FLOAT)';

TABLAS.USUARIO = 'CREATE TABLE IF NOT EXISTS usuarios (Id_Usuario INTEGER PRIMARY KEY, ' +
					'Usuario varchar(20), ' +
					'Password varchar(20), ' +
					'id_distribuidor INTEGER, '+	
					'Fecha_Ruta varchar(20), ' +
					'Id_Almacen INTEGER, ' +
					'Id_asignacion_Ruta INTEGER, '+
					'Id_Ruta INTEGER, ' +
					'Id_Vendedor INTEGER, ' +
					'version varchar(20), impresora varchar(20), num_factura INTEGER, codigo_ruta Varchar(20), nombre Varchar(30), apellidos Varchar(30))'; //, '+'id_zona INTEGER

TABLAS.IMPRESORA = 'CREATE TABLE IF NOT EXISTS impresora (Id_Impresora INTEGER PRIMARY KEY, Nombre Varchar(25) unique, MAC Varchar(25) unique, Tipo INTEGER, Predeterminada)';

TABLAS.CLIENTES = 'CREATE TABLE IF NOT EXISTS clientes (id_cliente INTEGER PRIMARY KEY, '+
	 				'codigo_cliente VARCHAR(20), ' +
	 				'domicilio VARCHAR(100),'+
	 				'codigo_postal VARCHAR(20),'+
	 				'id_ruta INTEGER,'+
	 				'id_distribuidor INTEGER,'+
	 				'Nombre VARCHAR(50), '+
	 				'telefono VARCHAR(20), ciudad VARCHAR(20), codigo_estado VARCHAR(20), dias_credito INTEGER, id_lista_precio INTEGER)';
//codigo 1, lote abc, cant lib 100, cant cajas 5
//codigo+lote+cantlibras
TABLAS.PRODUCTOS = 'CREATE TABLE IF NOT EXISTS almacen_inventario (id_almacen_inventario ,' + //INTEGER PRIMARY KEY
					'id_almacen INTEGER,' +
					'id_producto INTEGER,' +
					'lote VARCHAR(50),' +
					'clave  VARCHAR(50),' + 
					'nombre  VARCHAR(50),' +
					'id_categoria INTEGER,' +
					'categoria,' +
					'existencia FLOAT,' +
					'caja FLOAT,' +
					'estatus INTEGER, ' +
					'id_unidad_medida INTEGER, nombre_unidad_medida VARCHAR(50), '+
					'precio_unidad FLOAT)';

TABLAS.PRODUCTOS_MALOS = 'CREATE TABLE IF NOT EXISTS almacen_malo (id_almacen_inventario ,' + //INTEGER PRIMARY KEY
					'id_almacen INTEGER,' +
					'id_producto INTEGER,' +
					'lote,' +
					'clave,' + 
					'nombre,' +
					'id_categoria INTEGER,' +
					'categoria,' +
					'existencia FLOAT,' +
					'caja FLOAT,' +
					'estatus INTEGER, ' +
					'id_unidad_medida INTEGER, nombre_unidad_medida VARCHAR(50), '+
					'precio_unidad FLOAT)';

TABLAS.PRODUCTOS_INICIAL = 'CREATE TABLE IF NOT EXISTS almacen_inicial (id_movimiento_details INTEGER,' + //INTEGER PRIMARY KEY
							'nombre_tipo_movimiento,' +
							'fecha_entrega,' +							
							'id_almacen INTEGER,' + 
							'codigo_producto,' +
							'nombre_producto,' +
							'categoria_producto,' +
							'unidad_medida,' +
							'lote,' +
							'cantidad FLOAT, ' +
							'cantidad_cajas FLOAT, status INTEGER, '+
							'id_asignacion_ruta INTEGER)';
					
TABLAS.PRECIOS = 'CREATE TABLE IF NOT EXISTS precios (id_lista_precios_enc INTEGER, '+ //PRIMARY KEY, '+ 
					//'id_zona INTEGER, '+
					'id_producto INTEGER, ' +
					'precio_caja_final_max FLOAT, ' +
					'precio_caja_final_min FLOAT, ' +
					'precio_caja_regular FLOAT, codigo_producto, ' +
					'id_distribuidor INTEGER, id_unidad_medida INTEGER, ' +
					'nombre_producto, unidad_medida, status_venta INTEGER)';

TABLAS.IMPRESION = 'CREATE TABLE IF NOT EXISTS impresion (ciudad, codigo_postal, compania,' +
					'direccion VARCHAR(50), estado, fax, ' +
					'id_compania INTEGER, ' +
					'id_distribuidor INTEGER, manufacturer, nombre_comercial, pais, '+
					'po_box, telefono VARCHAR(15), toll_free, descripcion VARCHAR(45), condado varchar(80))';

TABLAS.DESCUENTOS = 'CREATE TABLE IF NOT EXISTS descuentos (id_descuento_det INETEGER PRIMARY KEY, '+
					'id_descuento INTEGER, ' +
					'clave_negocio INTEGER, ' +
					'clave VARCHAR(10), '+
					'id_distribuidor INTEGER, ' +
					'id_tipo_descuento INTEGER, ' +
					'nombre VARCHAR(30), ' +
					'porcetaje FLOAT, '+
					'automatico INTEGER)';

TABLAS.MOTIVOSNC = 'CREATE TABLE IF NOT EXISTS motivosnc (id_motivos_nt INTEGER, ' +
					'nombre VARCHAR(50), ' +
					'id_usuario INTEGER, '+
					'id_compania INTEGER, ' +
					'fecha_creacion VARCHAR(20), ' +
					'fecha_ult_act VARCHAR(20), ' +
					'estatus INTEGER)';

TABLAS.NOTACREDITO = 'CREATE TABLE IF NOT EXISTS notacredito (id_notacredito INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                        'id_venta INTEGER, ' +
                        'factura VARCHAR(15), ' +
                        'monto FLOAT, ' +
    					'status INTEGER)';

//Si la venta a cancelar no ha sido enviada al host o se est� offlie
//se guarda aqui, cuando la venta se haya enviado satisfactoriamente al host
// se envie la cancelacion, se elimna de esta tabla y se actualiza el status de la venta
TABLAS.CANCELACIONESOFFLINE = 'CREATE TABLE IF NOT EXISTS cancelacionesoffline (id_cancelacion INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                                'id_venta INTEGER, ' +
                                'longitud VARCHAR(20), latitude VARCHAR(20), fecha VARCHAR(10), hora VARCHAR(10),' +
                                'Id_Usuario INTEGER, enviada INTEGER)';

TABLAS.CANCELACIONPAGOSOFFLINE = 	'CREATE TABLE IF NOT EXISTS cancelacionpagosoffline (id_cancelacion INTEGER PRIMARY KEY AUTOINCREMENT, ' +
								'id_pago INTEGER, ' +
								'longitud VARCHAR(20), latitude VARCHAR(20), fecha VARCHAR(10), hora VARCHAR(10),' +
								'Id_Usuario INTEGER, enviada INTEGER)';

TABLAS.PARAMETROS = 'CREATE TABLE IF NOT EXISTS parametros(nombre VARCHAR(25), valor VARCHAR(25))';

TABLAS.ENTIDADES = 'CREATE TABLE IF NOT EXISTS entidades(id_tabla INTEGER PRIMARY KEY, '+
                        'nombre_tabla VARCHAR(20), ' +
                        'checksum VARCHAR(150))';

TABLAS.MOTIVOSNV = 'CREATE TABLE IF NOT EXISTS motivosnv (id_tipo_no_venta INTEGER, ' +
					'nombre VARCHAR(50), ' +
					'id_usuario INTEGER, '+
					'id_compania INTEGER, ' +
					'fecha_creacion VARCHAR(20), ' +
					'fecha_ult_act VARCHAR(20), ' +
					'estatus INTEGER)';

TABLAS.MOVIMIENTOS =	'CREATE TABLE IF NOT EXISTS movimientos(id_ruta INTEGER, ' +
						'id_asignacion_ruta INTEGER, id_destino INTEGER, id_estatus_movimiento INTEGER, ' +
						'id_movimiento_enc INTEGER UNIQUE, id_origen INTEGER, nombre VARCHAR(25), ' +
						'nombre_ruta VARCHAR(30), fecha_entrega VARCHAR(20), ' +
						'Enviada INTEGER, Abierto INTEGER, fecha_ciere VARCHAR(20))';

TABLAS.DETMOVIMIENTOS =	'CREATE TABLE IF NOT EXISTS detalle_movimientos(id_movimiento_enc INTEGER, ' +
						'Id_almacen INTEGER, Id_producto INTEGER, Id_unidad_medida INTEGER, ' +
						'Lote, Cantidad_cajas FLOAT, Cantidad FLOAT, Id_usuario INTEGER)';


TABLAS.PAGOS = 	'CREATE TABLE IF NOT EXISTS pagos (id_pago INTEGER PRIMARY KEY AUTOINCREMENT, ' +
				'Id_cliente INTEGER, ' +
				'Id_asignacion_ruta INTEGER, Id_distribuidor INTEGER, Fecha VARCHAR(10), Hora VARCHAR(10), ' +
				'Id_usuario INTEGER, Id_tipo_pago INTEGER, Factura VARCHAR(15), monto FLOAT, sobrante FLOAT, monto_total FLOAT, Numero_cheque VARCHAR(20), Comentarios, Enviada INTEGER, parentFactura VARCHAR(15) null)';


TABLAS.TMPTRANSFER = 	'CREATE TABLE IF NOT EXISTS tmpTransfer(id_movimiento_enc INTEGER, id_ruta INTEGER, Id_asignacion_ruta INTEGER, Fecha VARCHAR(10), Hora VARCHAR(10), ' +
						'existencia FLOAT, caja FLOAT, id_almacen INTEGER, id_producto INTEGER, id_unidad_medida INTEGER, Id_Usuario INTEGER, lote VARCHAR(50), clave VARCHAR(50), nombre VARCHAR(50))';

TABLAS.FACTURA = 'CREATE TABLE IF NOT EXISTS factura (id_venta INTEGER , '+ //PRIMARY KEY id_venta INTEGER PRIMARY KEY AUTOINCREMENT, '+
													'id_asignacion_ruta INTEGER, ' + //'id_asignacion_ruta INTEGER, ' +
													'factura VARCHAR(15), ' + //'factura VARCHAR(15), ' +
													'id_almacen INTEGER, ' + //'id_almacen INTEGER, ' +
													'id_usuario INTEGER, ' + // 'id_usuario INTEGER, ' + 
													'id_cliente INTEGER, ' + // 'id_cliente INTEGER, ' + 
													'monto_subtotal FLOAT, ' + //'monto_subtotal FLOAT, ' +
													'monto_total FLOAT, ' + //'monto_total FLOAT, ' +
													'Monto_iva FLOAT, ' +
													'Monto_descuento FLOAT, ' +
													'Monto_otrosdescuentos FLOAT, ' +
													'cantidad_productos INTEGER, ' + //'cantidad_productos INTEGER, ' +
													'status INTEGER, ' + //'status INTEGER, ' +
													'pagada INTEGER, ' + //'pagada INTEGER, ' +
													'longitud, ' + 
													'latitude, ' +
													'fecha VARCHAR(10), ' + 
													'hora VARCHAR(10), ' + 
													'enviada INTEGER, ' +
													'tipo_venta INTEGER, Id_tipo_credito INTEGER, requiere_firma INTEGER)';

TABLAS.DETALLEFACTURA = 'CREATE TABLE IF NOT EXISTS detalle_factura (id_venta INTEGER, id_producto INTEGER, '+
																'cantidad FLOAT, ' +
																'lote VARCHAR(50), ' +
																'precio FLOAT, ' +
																'monto_subtotal FLOAT, ' +
																'monto_total FLOAT, tipo_captura INTEGER, Id_unidad_medida INTEGER, caja FLOAT, descuento FLOAT, Monto_iva FLOAT)';


TABLAS.CODIGO_CLIENTE = 'CREATE TABLE IF NOT EXISTS codigo_cliente(codigoCliente VARCHAR(50), NombreCliente VARCHAR(100), Url VARHCAR(250), Predeterminada INTEGER, Logo Varchar(150))';
