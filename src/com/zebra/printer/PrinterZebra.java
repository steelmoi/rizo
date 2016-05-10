package com.zebra.printer;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONObject;

import com.rizo.phonegap.R;
import com.zebra.android.comm.BluetoothPrinterConnection;
import com.zebra.android.comm.ZebraPrinterConnection;
import com.zebra.android.comm.ZebraPrinterConnectionException;
import com.zebra.android.discovery.DiscoveryHandler;
import com.zebra.android.printer.ZebraPrinter;
import com.zebra.android.printer.ZebraPrinterFactory;
import com.zebra.android.printer.ZebraPrinterLanguageUnknownException;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.os.Looper;
import android.provider.MediaStore.Images.Media;
import android.util.Log;

public class PrinterZebra extends Plugin {
	public final String ACTION_CONNECT ="connect";
	public final String ACTION_ISCONNECTED = "isConnected";
	public final String ACTION_DISCONNECT = "disconnect";
	public final String ACTION_IMPRIMIR = "printText";
	public final String ACTION_IMPRIMIRXY = "printTextXY";//esa
	public final String ACTION_IMAGE = "printImage";
	
	private boolean b_connected = false;
	
	private String mac_Address ="";
	
	ZebraPrinterConnection connection = null;
	
	private JSONArray m_discoveredDevices = null;
	private static DiscoveryHandler btDiscoveryHandler = null;
	
	public PrinterZebra(){
		Log.d("Creando", "plugin");
	}
	
	@Override
	public PluginResult execute(String action, JSONArray args, 
			String callbackId)
	{
		Log.d("action:", action);
		Log.d("len:" ,  String.valueOf(args.length()));
		Log.d("callbackId:" , callbackId);
		if(action.equals(ACTION_CONNECT)){
			try{
				mac_Address = args.getString(0);
				Log.d("mac_Address", mac_Address);
				b_connected = true;
				Connect();
				while(b_connected){}
				return new PluginResult(PluginResult.Status.OK, "User did not specify data to encode");				
			}catch(Exception e){
				b_connected = false;
				return new PluginResult(PluginResult.Status.ERROR, e.getMessage());	
			}
		}else if(action.equals(ACTION_ISCONNECTED)){
			JSONObject obj = isConnected();
			if(obj == null)
				return new PluginResult(PluginResult.Status.ERROR, obj);
			else
				return new PluginResult(PluginResult.Status.OK, obj);
		}else if(action.equals(ACTION_DISCONNECT)){
			disconnect();
			return new PluginResult(PluginResult.Status.OK, "Desconectado");
		}else if(action.equals(ACTION_IMPRIMIR)){
			try{
				String text = args.getString(0);
				imprimir(text);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_IMPRIMIRXY)){
			try{
				String text = args.getString(0);
				int x = Integer.parseInt(args.getString(1));
				int y = Integer.parseInt(args.getString(2));
				imprimirXY(text, x, y);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_IMAGE)){
			try{
				String text = imprimirImagen();
				return new PluginResult(PluginResult.Status.OK, text);
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}

		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		r.setKeepCallback(true);
		return r;
	}
	
	public void Connect(){
		new Thread(new Runnable() {
			public void run() {
				try {             
					Looper.prepare();
					Log.d("connect", mac_Address);
					connection = new BluetoothPrinterConnection(mac_Address);
					connection.open();

					Log.d("connect", "conectado");
					//byte[] configLabel = "Hola!".getBytes();                    
					//connection.write(configLabel);
					b_connected = false;
				} catch (ZebraPrinterConnectionException e) {
					b_connected = false; 
					Log.d("connect 1-", e.getMessage());
				} finally {

					//Looper.myLooper().quit();
				}
			}
		}).start();
	}
	
	public JSONObject isConnected(){
		JSONObject obj = new JSONObject();
		try{
			if (connection != null && connection.isConnected())
				obj.put("status", "1");
			else
				obj.put("status", "0");
		}catch(Exception e){
			return null;
		}
		return obj;
	}
	
	public void imprimir(String a){
		try {
			  byte[] configLabel = a.getBytes();                    
			if (connection == null)//{
				connection.open();
			    
			//}else{
				connection.write(configLabel);
			    //b_connected= false;				
			//}
			    
		} catch (ZebraPrinterConnectionException e) {
			b_connected = false; 
			Log.d("connect 1-", e.getMessage());
		}

	}
	
	public void imprimirXY(String a, int x, int y){
		try {
			  byte[] configLabel = a.getBytes();                    
			if (connection == null)//{
				connection.open();
			  
				connection.write(configLabel, x, y);
			   
			    
		} catch (ZebraPrinterConnectionException e) {
			b_connected = false; 
			Log.d("connect 1-", e.getMessage());
		}

	}
	
	public String fileName ="/uniliver.jpg";
	public enum TIPO_EXTRACCION{MEMORIA_EXTERNA, RECURSOS_ANDROID};
	
	private Bitmap getMapaDeBits(TIPO_EXTRACCION tipo)
	{
		Bitmap bmp = null;
		String strPathStorage = Environment.getExternalStorageDirectory().getPath();//Desde la memoria
		//String strPathDirectory = Environment.getDataDirectory().getPath();//desde la memoria interna
		
		Log.d("imprimirImagen URI", strPathStorage+fileName);
		Uri imgPath =  null;
		
		try {
			switch(tipo){
				case MEMORIA_EXTERNA:
					imgPath =  Uri.fromFile(new File(strPathStorage+fileName));
					bmp = Media.getBitmap(this.ctx.getContentResolver(), imgPath);
					break;
				case RECURSOS_ANDROID:
					bmp = BitmapFactory.decodeResource(this.ctx.getContext().getResources(), R.drawable.ic_launcher);
					break;
			}
		} catch (FileNotFoundException e) {
        	Log.d("imprimirImagen FileNotFoundException", e.getMessage());        	
        } catch (IOException e) {
        	Log.d("imprimirImagen IOException", e.getMessage());        	      
        }
		return bmp;
	}
	
	public String imprimirImagen() throws ZebraPrinterLanguageUnknownException{
		String res = "Impresa";
		Bitmap myBitmap = null;
		try {			 
			if (connection == null)
				connection.open();

			ZebraPrinter printer = ZebraPrinterFactory.getInstance(connection);
			myBitmap = getMapaDeBits(TIPO_EXTRACCION.RECURSOS_ANDROID);
           // zebraPrinterConnection.write("! U1 JOURNAL\r\n! U1 SETFF 50 2\r\n".getBytes());
			if(myBitmap== null){
				Log.d("imprimirImagen ", "myBitmap is null");
				res ="bitmap es nula";                    	
			}else{
				Log.d("imprimirImagen ", "myBitmap is not null");
				printer.getGraphicsUtil().printImage(myBitmap, 0, 50, 150, 150, false);
				
				if (connection == null)
					connection.close();
			}
		}
		catch (ZebraPrinterConnectionException e) {
			b_connected = false; 
			Log.d("imprimirImagen 1-", e.getMessage());
			res = "imprimirImagen 1-"+ e.getMessage();			
		}
		return res;
	}

	public void disconnect(){
		try {
			if (connection != null)
				connection.close();
		} catch (ZebraPrinterConnectionException e) {

		} finally {

		}
	}	
}
