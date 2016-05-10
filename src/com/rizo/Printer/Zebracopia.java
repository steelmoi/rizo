package com.rizo.Printer;

import java.util.ArrayList;

import oneil.printer.Document;
import oneil.printer.DocumentEZ;

import org.apache.cordova.api.CordovaInterface;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.graphics.Bitmap;
import android.os.Looper;
import android.util.Log;

import com.phonegap.api.PluginResult;
import com.zebra.android.comm.BluetoothPrinterConnection;
import com.zebra.android.comm.ZebraPrinterConnection;
import com.zebra.android.comm.ZebraPrinterConnectionException;
import com.zebra.android.discovery.DiscoveryHandler;
import com.zebra.android.printer.ZebraPrinter;
import com.zebra.android.printer.ZebraPrinterFactory;
import com.zebra.android.printer.ZebraPrinterLanguageUnknownException;

public class Zebracopia extends IPrinter{
	public static String TAG_ZEBRA = "Zebra";
	public static boolean DEBUG_ZEBRA = false;
	private boolean b_connected = false;
	
	private String mac_Address ="";
	
	ZebraPrinterConnection connection = null;
	
	private JSONArray m_discoveredDevices = null;
	private static DiscoveryHandler btDiscoveryHandler = null;
	//Array de array, cada elemento de array es un documento
	ArrayList<ArrayList<Line>> lstDocuments = new ArrayList<ArrayList<Line>>();
	private CordovaInterface ctx;
	
	@Override
	public PluginResult Connect(String mac) {
		try{
			lstDocuments = new ArrayList<ArrayList<Line>>();
			mac_Address = mac;
			if(DEBUG_ZEBRA)
				Log.d("mac_Address", mac_Address);
			b_connected = true;
			Connect();
			while(b_connected){}
			return new PluginResult(PluginResult.Status.OK, "OK");				
		}catch(Exception e){
			b_connected = false;
			return new PluginResult(PluginResult.Status.ERROR, e.getMessage());	
		}
	}
	
	public void setContext(CordovaInterface ctx)
	{
		this.ctx = ctx;
	}
	
	private void Connect(){
		new Thread(new Runnable() {
			public void run() {
				try {             
					Looper.prepare();
					if(DEBUG_ZEBRA)
						Log.d("connect", mac_Address);
					connection = new BluetoothPrinterConnection(mac_Address);
					connection.open();

					if(DEBUG_ZEBRA)
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
	
	@Override
	public JSONObject IsConnected() throws JSONException {
		JSONObject obj = new JSONObject();
		try{
			if (connection != null && connection.isConnected())
				obj.put("status", "1");
			else
				obj.put("status", "0");
		}catch(Exception e){
			obj.put("status", "0");			
		}
		return obj;
	}

	@Override
	public JSONObject Disconnect()  throws JSONException{
		JSONObject obj = new JSONObject();
		lstDocuments = new ArrayList<ArrayList<Line>>();
		try {
			if (connection != null)
				connection.close();
			obj.put("status", "1");
		} catch (ZebraPrinterConnectionException e) {
			obj.put("status", "0");
		} finally {

		}
		return obj;
	}

	/*@Override
	public boolean printText() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean printTextXY() {
		// TODO Auto-generated method stub
		return false;
	}*/

	@Override
	public JSONObject printImage(int x, int y, int width, int height, String codigo)  throws JSONException{
		JSONObject obj = new JSONObject();
		Bitmap myBitmap = null;
		try {			 
			if (connection == null)
				connection.open();

			ZebraPrinter printer = ZebraPrinterFactory.getInstance(connection);
			//myBitmap = getMapaDeBits(TIPO_EXTRACCION.RECURSOS_ANDROID);
           // zebraPrinterConnection.write("! U1 JOURNAL\r\n! U1 SETFF 50 2\r\n".getBytes());
			if(myBitmap== null){
				Log.d("imprimirImagen ", "myBitmap is null");
				obj.put("status","bitmap es nula");                    	
			}else{
				Log.d("imprimirImagen ", "myBitmap is not null");
				connection.write("! U1 JOURNAL\r\n! U1 SETFF 50 2\r\n".getBytes());
				printer.getGraphicsUtil().printImage(myBitmap, x, y, width, height, false);//409, 206
				
				if (connection == null)
					connection.close();
				
				obj.put("status", "OK");
			}
		}
		catch (ZebraPrinterConnectionException e) {
			b_connected = false; 
			Log.d("imprimirImagen 1-", e.getMessage());
			obj.put("status", "imprimirImagen 1-"+ e.getMessage());			
		} catch (ZebraPrinterLanguageUnknownException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			obj.put("status", "imprimirImagen 2-"+ e.getMessage());	
		}
		return obj;
	}


	@Override
	public JSONObject addDocument(String font) throws JSONException {
		JSONObject obj = new JSONObject();
		ArrayList<Line> lstDocument = new ArrayList<Line>();
		
		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addDocument");
		try{
			lstDocuments.add(lstDocument);
			obj.put("status", "1");
		}catch(Exception e){
			Log.d(TAG_ZEBRA, "addDocument error:" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject addTextDocument(int docIndex, String Text, int row, int col) throws JSONException {
		ArrayList<Line> lstDocument;
		JSONObject obj = new JSONObject();

		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addTextDocument");
		try{
			if(DEBUG_ZEBRA)
				Log.d(TAG_ZEBRA, "addTextDocument docIndex:"+ docIndex + "|Text:" + Text + "|row:" + row + "|col:" + col + "|size:" + lstDocuments.size());
			if(docIndex >= 0 && lstDocuments.size() > 0 && docIndex < lstDocuments.size())
			{
				//Sacamos el documento de la lista
				lstDocument = lstDocuments.get(docIndex);
				if(lstDocument == null)
				{
					if(DEBUG_ZEBRA)
						Log.d(TAG_ZEBRA, "addTextDocument document is null");
				}
				//Creamos un objeto linea
				Line oLine = new Line(Text, row, col);
				//Agregamos la linea al documetno
				lstDocument.add(oLine);
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				//documentList.add(docIndex, docEZ);
				if(lstDocuments.size() == 0)
					lstDocuments.add(docIndex, lstDocument);
				else
					lstDocuments.set(docIndex, lstDocument);

				sortLinesInList(docIndex);
				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			Log.d(TAG_ZEBRA, "addTextDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	private void sortLinesInList(int index)
	{
		ArrayList<Line> lstDocument = lstDocuments.get(index);
		for(int i=0; i< lstDocument.size()-1; i++)
		{
			Line lineX = lstDocument.get(i);
			for(int j=i+1; j < lstDocument.size(); j++)
			{					
				Line lineY = lstDocument.get(j);
				if(lineX.getCol() > lineY.getCol())
				{

				}
			}
		}
		lstDocuments.set(index, lstDocument);
	}
	@Override
	public JSONObject addImageDocument(int docIndex, int x, int y, int width, int height, String codigo) throws JSONException {
		JSONObject obj = new JSONObject();
		ArrayList<Line> lstDocument;

		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addImageDocument");
		try{
			if(DEBUG_ZEBRA)
				Log.d(TAG_ZEBRA, "addImageDocument docIndex:"+ docIndex  + "|x:" + x + "|y:" + y + "|size:" + lstDocuments.size());
			if(docIndex >= 0 && lstDocuments.size() > 0 && docIndex < lstDocuments.size())
			{				
				//Sacamos el documento de la lista
				lstDocument = lstDocuments.get(docIndex);
				if(lstDocument == null)
				{
					if(DEBUG_ZEBRA)
						Log.d(TAG_ZEBRA, "addImageDocument document is null");
				}
				Line oLine = new Line(x, y, width, height, true);
				lstDocument.add(oLine);				
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				if(lstDocuments.size() == 0)
					lstDocuments.add(docIndex, lstDocument);
				else
					lstDocuments.set(docIndex, lstDocument);

				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			Log.d(TAG_ZEBRA, "addImageDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject printDocument(int docIndex) throws JSONException{
		JSONObject obj = new JSONObject();
		ArrayList<Line> lstDocument;
		
		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "printDocument");
		try{
			if (connection == null)//{
				connection.open();
			if(DEBUG_ZEBRA)
				Log.d(TAG_ZEBRA, "printDocument docIndex:" + docIndex + "|size:" + lstDocuments.size());
			if(docIndex >= 0 && lstDocuments.size() > 0 && docIndex < lstDocuments.size())
			{
				//Log.d(TAG_DATAMAX, "printDocument imprimo documento:");
				lstDocument = lstDocuments.get(docIndex);
				try {
					if(lstDocument == null)
						Log.d(TAG_ZEBRA, "printDocument document is null");
					// Print the document
					for (Line line : lstDocument) {
						 byte[] configLabel = line.getText().getBytes();
						connection.write(configLabel, line.getRow(), line.getCol());
					}			
				}
				catch (Exception myError) {
					// Exception thrown
					Log.d(TAG_ZEBRA, "printDocument: " + myError.getMessage());
					obj.put("status", "0");
				}
				    
				obj.put("status", "1");
			}else{
				Log.d(TAG_ZEBRA, "printDocument puro puedo imprimio");
				obj.put("status", "0");
			}
		}catch(Exception e){
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject printAllDocuments() throws JSONException{
		JSONObject obj = new JSONObject();		
		
		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "printAllDocuments");
		try{
			if (connection == null)
				connection.open();
			if(DEBUG_ZEBRA)
				Log.d(TAG_ZEBRA, "printAllDocuments size:" + lstDocuments.size());
			if(lstDocuments.size() > 0)
			{				
				try {
					for (ArrayList<Line> lstDocument : lstDocuments) {
						for (Line line : lstDocument) {
							 byte[] configLabel = line.getText().getBytes();
							//connection.write(configLabel, line.getRow(), line.getCol());
							 connection.write(configLabel);
						}
					}					
				}
				catch (Exception myError) {
					// Exception thrown
					Log.d(TAG_ZEBRA, "Generic printAllDocuments: " + myError.getMessage());
					obj.put("status", "0");
				}
				    
				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			Log.d(TAG_ZEBRA, "printAllDocuments error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

}
