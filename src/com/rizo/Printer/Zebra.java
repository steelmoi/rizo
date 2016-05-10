package com.rizo.Printer;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeMap;


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.rizo.phonegap.R;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Environment;
import android.os.Looper;
import android.provider.MediaStore.Images.Media;
import android.util.Log;

import com.phonegap.api.PluginResult;
import com.zebra.android.comm.BluetoothPrinterConnection;
import com.zebra.android.comm.ZebraPrinterConnection;
import com.zebra.android.comm.ZebraPrinterConnectionException;
import com.zebra.android.discovery.DiscoveryHandler;
import com.zebra.android.printer.ZebraPrinter;
import com.zebra.android.printer.ZebraPrinterFactory;
import com.zebra.android.printer.ZebraPrinterLanguageUnknownException;

import org.apache.cordova.api.CordovaInterface;

public class Zebra extends IPrinter{
	public static String TAG_ZEBRA = "Zebra";
	public static boolean DEBUG_ZEBRA = false;
	private boolean b_connected = false;
	private CordovaInterface ctx;
	
	
	private String mac_Address ="";
	
	ZebraPrinterConnection connection = null;
	
	private JSONArray m_discoveredDevices = null;
	private static DiscoveryHandler btDiscoveryHandler = null;
	//Array de array, cada elemento de array es un documento
	//ArrayList<ArrayList<Line>> lstDocuments = new ArrayList<ArrayList<Line>>();
	 Map<Integer,Map<Integer, ArrayList<Line>>> lstDocuments=new HashMap<Integer, Map<Integer, ArrayList<Line>>>();
	//----[numDoc, [row, [line-->]]]
	@Override
	public PluginResult Connect(String mac) {
		try{			
			lstDocuments=new HashMap<Integer, Map<Integer, ArrayList<Line>>>();
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
		lstDocuments=new HashMap<Integer, Map<Integer, ArrayList<Line>>>();
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

	public String fileName ="/logochucho.png";
	private enum TIPO_EXTRACCION{MEMORIA_EXTERNA, RECURSOS_ANDROID};
	
	private Bitmap getMapaDeBits(TIPO_EXTRACCION tipo, String codigo)
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
					if(codigo.equals("1000"))
						bmp = BitmapFactory.decodeResource(this.ctx.getContext().getResources(), R.drawable.logochucho);
					else if (codigo.equals("2000"))
						bmp = BitmapFactory.decodeResource(this.ctx.getContext().getResources(), R.drawable.logochucho);
					else if (codigo.equals("3000"))
						bmp = BitmapFactory.decodeResource(this.ctx.getContext().getResources(), R.drawable.i0000);
					else 
						bmp = BitmapFactory.decodeResource(this.ctx.getContext().getResources(), R.drawable.i0000);
					break;
			}
		} catch (FileNotFoundException e) {
        	Log.d("imprimirImagen FileNotFoundException", e.getMessage());        	
        } catch (IOException e) {
        	Log.d("imprimirImagen IOException", e.getMessage());        	      
        }
		return bmp;
	}
	
	@Override
	public JSONObject printImage(int x, int y, int width, int height, String codigo)  throws JSONException{
		JSONObject obj = new JSONObject();
		Bitmap myBitmap = null;
		try {			 
			if (connection == null)
				connection.open();

			ZebraPrinter printer = ZebraPrinterFactory.getInstance(connection);
			myBitmap = getMapaDeBits(TIPO_EXTRACCION.RECURSOS_ANDROID, codigo);
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
		//ArrayList<Line> lstLines = new ArrayList<Line>();
		Map<Integer, ArrayList<Line>> lstDocument = null;//new HashMap<Integer, ArrayList<Line>>();
		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addDocument");
		try{
			//lstDocuments.add(lstDocument);
			lstDocuments.put(lstDocuments.size(), lstDocument);
			obj.put("status", "1");
		}catch(Exception e){
			Log.d(TAG_ZEBRA, "addDocument error:" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject addTextDocument(int docIndex, String Text, int row, int col) throws JSONException {
		Map<Integer, ArrayList<Line>> lstDocument;
		JSONObject obj = new JSONObject();
		ArrayList<Line> lstLines = new ArrayList<Line>();

		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addTextDocument");
		try{
			if(DEBUG_ZEBRA)
				Log.d(TAG_ZEBRA, "addTextDocument docIndex:"+ docIndex + "|Text:" + Text + "|row:" + row + "|col:" + col + "|size:" + lstDocuments.size());
			if(docIndex >= 0 && lstDocuments.size() > 0 && docIndex < lstDocuments.size())
			{
				//Creamos un objeto linea
				Line oLine = new Line(Text, row, col);
				//Sacamos el documento de la lista
				lstDocument = lstDocuments.get(docIndex);
				if(lstDocument == null)
				{
					lstDocument = new HashMap<Integer, ArrayList<Line>>();
					if(DEBUG_ZEBRA)
						Log.d(TAG_ZEBRA, "addTextDocument document is null");
					lstLines.add(oLine);
					lstDocument.put(row, lstLines);
				}else{
					if(DEBUG_ZEBRA)
						Log.d(TAG_ZEBRA, "addTextDocument document tiene lineas");
					
					boolean exist = false;
					Set s=lstDocument.entrySet();					
			        //Set s=mpr.entrySet();

			        //MOVER CON ITERATOR A PROXIMO key & value DEL MAP 
			        Iterator it=s.iterator();

			        while(it.hasNext())
			        {
			        	// ENTRADA DEL MAP Map.Entry PATA OBTENER key & value
			        	Map.Entry m =(Map.Entry)it.next();
			        	int key=(Integer)m.getKey();
			        	if(key == row){
			        		exist = true;
			        		ArrayList<Line> aLines = (ArrayList<Line>)m.getValue();
			        		aLines.add(oLine);
			        		sortLinesInList(docIndex, aLines);
			        		lstDocument.put(row, aLines);
			        		break;
			        	}
			        }
			        
			        //Si no existe creamos el nodo
			        if(!exist){
			        	if(DEBUG_ZEBRA)
							Log.d(TAG_ZEBRA, "addTextDocument row no encontrada");
			        	lstLines.add(oLine);
						lstDocument.put(row, lstLines);
			        }
				}
				
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				//documentList.add(docIndex, docEZ);
				//if(lstDocuments.size() == 0)
					lstDocuments.put(docIndex, lstDocument);
				/*else
					lstDocuments.p(docIndex, lstDocument);*/				
				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			Log.d(TAG_ZEBRA, "addTextDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	private void sortLinesInList(int index, ArrayList<Line> lstDocument)
	{
		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addTextDocument ordenando filas");
		for(int i=0; i< lstDocument.size()-1; i++)
		{
			Line lineX = lstDocument.get(i);
			for(int j=i+1; j < lstDocument.size(); j++)
			{				
				Line lineY = lstDocument.get(j);
				if(lineY.getImage())
					continue;
				if(lineX.getCol() > lineY.getCol())
				{
					Line tmp = lineY;
					lstDocument.set(j, lineX);
					lstDocument.set(i, tmp);					
				}
			}
		}
	}
	@Override
	public JSONObject addImageDocument(int docIndex, int x, int y, int width, int height, String codigo) throws JSONException {
		Map<Integer, ArrayList<Line>> lstDocument;
		JSONObject obj = new JSONObject();
		ArrayList<Line> lstLines = new ArrayList<Line>();

		if(DEBUG_ZEBRA)
			Log.d(TAG_ZEBRA, "addImageDocument");
		try{
			if(DEBUG_ZEBRA)
				Log.d(TAG_ZEBRA, "addImageDocument docIndex:"+ docIndex + "|x:" + x + "|y:" + y + "|size:" + lstDocuments.size());
			if(docIndex >= 0 && lstDocuments.size() > 0 && docIndex < lstDocuments.size())
			{				
				//Sacamos el documento de la lista
				lstDocument = lstDocuments.get(docIndex);			
				Line oLine = new Line(x, y, width, height, true);
				oLine.setCodigo(codigo);
				if(lstDocument == null)
				{
					lstDocument = new HashMap<Integer, ArrayList<Line>>();
					if(DEBUG_ZEBRA)
						Log.d(TAG_ZEBRA, "addTextDocument document is null");
					lstLines.add(oLine);
					lstDocument.put(x, lstLines);
				}else{
					if(DEBUG_ZEBRA)
						Log.d(TAG_ZEBRA, "addTextDocument document tiene lineas");
					
					boolean exist = false;
					Set s=lstDocument.entrySet();					
			        //Set s=mpr.entrySet();

			        //MOVER CON ITERATOR A PROXIMO key & value DEL MAP 
			        Iterator it=s.iterator();

			        while(it.hasNext())
			        {
			        	// ENTRADA DEL MAP Map.Entry PATA OBTENER key & value
			        	Map.Entry m =(Map.Entry)it.next();
			        	int key=(Integer)m.getKey();
			        	if(key == y){
			        		exist = true;
			        		ArrayList<Line> aLines = (ArrayList<Line>)m.getValue();
			        		aLines.add(oLine);
			        		sortLinesInList(docIndex, aLines);
			        		lstDocument.put(x, aLines);
			        		break;
			        	}
			        }
			        
			        //Si no existe creamos el nodo
			        if(!exist){
			        	if(DEBUG_ZEBRA)
							Log.d(TAG_ZEBRA, "addTextDocument row no encontrada");
			        	lstLines.add(oLine);
						lstDocument.put(x, lstLines);
			        }
				}
				
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				//documentList.add(docIndex, docEZ);
				//if(lstDocuments.size() == 0)
				lstDocuments.put(docIndex, lstDocument);

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

				try {
						
				}
				catch (Exception myError) {

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

	private int PIXELBYCHAR = 13;//.7246376812;
	
	private String padLeft(String s, int n) {
		if(n <=0)
			return s;
		
	    return String.format("%1$" + n + "s", s);  
	}
	
	private String BuildLines(ArrayList<Line> aLines)
	{
		boolean hasImage = false;
		StringBuilder sbLines = new StringBuilder();
		
		for(Line oLine : aLines)
		{
			if(oLine.getImage())
			{
				hasImage = true;
				continue;
			}
			if(oLine.getCol() <= 0)
				sbLines.append(oLine.getText());
			else
			{
				int col = oLine.getCol()/PIXELBYCHAR;
				sbLines.append(padLeft("", col- sbLines.toString().length()) + oLine.getText());
			}
			Log.d(TAG_ZEBRA, "BuildLines line:" + sbLines.toString());
		}
		if(sbLines.toString().length() <= 0 && hasImage)
			sbLines.append("");
		else
			sbLines.append('\r').append('\n');
		return sbLines.toString();
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
					//for(Entry<Integer, Map<Integer, ArrayList<Line>>> document : lstDocuments.entrySet()) {
					for(int key =0; key < lstDocuments.size(); key++) {	
						//int key = (int)document.getKey();
						if(DEBUG_ZEBRA)
							Log.d(TAG_ZEBRA, "printAllDocuments document num:" + key);
						//Map rowDocument = (Map<Integer, ArrayList<Line>>)document.getValue();
						Map rowDocument = lstDocuments.get(key);
						
						Map<Integer, ArrayList<Line>> treeMap = new TreeMap<Integer, ArrayList<Line>>(rowDocument);
																
						Set s=treeMap.entrySet();					

				        //MOVER CON ITERATOR A PROXIMO key & value DEL MAP 
				        Iterator it=s.iterator();

				        StringBuilder sbLines = new StringBuilder();
				        while(it.hasNext())
				        {				        	
				        	// ENTRADA DEL MAP Map.Entry PATA OBTENER key & value
				        	Map.Entry m =(Map.Entry)it.next();
				        	int row=(Integer)m.getKey();
				        	ArrayList<Line> aLines = (ArrayList<Line>)m.getValue();
				        	
				        	//Por el momento checamos primero la imagen
				        	for(Line oLine : aLines)
				        	{
				        		if(!oLine.getImage())
				        			continue;
				        		Log.d(TAG_ZEBRA, "printAllDocuments imprimire imagen row:" + row + "|lineas:" + aLines.size()+ "|doc:" + key);
				        		printImage(oLine.getRow(), oLine.getCol(), oLine.getWidth(), oLine.getHeight(), oLine.getCodigo());
				        	}
				        	//if(DEBUG_ZEBRA)
								Log.d(TAG_ZEBRA, "printAllDocuments row:" + row + "|lineas:" + aLines.size() + "|doc:" + key);
				        	 sbLines.append(BuildLines(aLines));
				        }
				        connection.write(sbLines.toString().getBytes());
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
