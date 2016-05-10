package com.datamax.printer;

import java.util.ArrayList;
import java.util.Date;

import oneil.connection.ConnectionBase;
import oneil.connection.Connection_Android_Bluetooth;
import oneil.printer.Document;
import oneil.printer.DocumentEZ;
import oneil.printer.DocumentLP;
import oneil.printer.ParametersEZ;
import oneil.printer.configuration.AvalancheFileData;
import oneil.printer.configuration.GeneralStatus;
import oneil.printer.configuration.GraphicData;
import oneil.printer.configuration.PrintheadStatus;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.zebra.android.comm.ZebraPrinterConnectionException;

//import org.json.JSONObject;

import android.util.Log;

public class PrinterDatamax extends Plugin{

	public final String  TAG_DATAMAX = "Datamax";
	public final String ACTION_CONNECT ="connect";
	public final String ACTION_ISCONNECTED = "isConnected";
	public final String ACTION_DISCONNECT = "disconnect";
	public final String ACTION_IMPRIMIR = "printText";
	public final String ACTION_IMPRIMIRXY = "printTextXY";
	public final String ACTION_IMAGE = "printImage";
	public final String ACTION_ADDDOCUMENT = "addDocument";
	public final String ACTION_ADDTEXTDOCUMENT = "addTextDocument";
	public final String ACTION_ADDIMAGEDOCUMENT = "addImageDocument";
	public final String ACTION_PRINTDOCUMENT = "printDocument";
	public final String ACTION_PRINTALLDOCUMENTS = "printAllDocuments";
	public final String ACTION_ADDLINEDOCUMENT = "addLineDocument";
	
	public final boolean DEBUG_PRINTER = true;
	
	/** Communication Object */
	private ConnectionBase m_cPrinter = null;
	
	/** This is true if we are using a thermal printer false for impact */
	private boolean m_IsThermalPrinter;
	
	/** Print Head Width (set on printer connect) */
	private int m_PrinterWidth;

	/** Printer Fonts (set on printer connect) */
	private String m_FontEZ1 = "MF185";
	private String m_FontLP1;
	private String m_FontLP2;
	
	private boolean b_connected = false;
	private String mac_Address ="";
	private ArrayList<Document> documentList = new ArrayList<Document>();
	
	public  PrinterDatamax() {
		
	}
	
	public PluginResult execute(String action, JSONArray args, 
			String callbackId) {
		
		String mac =  "";
		
		if(DEBUG_PRINTER)
		{
			Log.d(TAG_DATAMAX, "execute action:" + action);
			Log.d(TAG_DATAMAX, "execute len:" + args.length());
		}
		if(action.equals(ACTION_CONNECT))
		{
			try {				
				mac = args.get(0).toString();
				if(DEBUG_PRINTER)
					Log.d(TAG_DATAMAX, "ACTION_CONNECT mac:" + mac);
				try{
					b_connected = true;
					mac_Address = mac;
					documentList = new ArrayList<Document>();
					AbrirCon();
					while(b_connected){}
					
					JSONObject objResp = isConnected();
					if(objResp != null)
					{	
						if(objResp.getInt("status") == 1)
							return new PluginResult(PluginResult.Status.OK, "OK");
						else
							return new PluginResult(PluginResult.Status.ERROR, "BADCONN");
					}else
						return new PluginResult(PluginResult.Status.ERROR, "BADCONN");
				}catch(Exception eConn){
					b_connected = false;
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "ACTION_CONNECT eConn:" + eConn.getMessage());
					return new PluginResult(PluginResult.Status.ERROR, eConn.getMessage());
				}
			} catch (JSONException e) {
				b_connected = false;
				if(DEBUG_PRINTER)
					Log.d(TAG_DATAMAX, "ACTION_CONNECT error JSON:" + e.getMessage());
				e.printStackTrace();
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
				int row = args.getInt(1);
				int col = args.getInt(2);
				
				imprimir(text, row, col);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_ADDDOCUMENT)){
			try{
				String font = args.getString(0);
								
				addDocument(font);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_ADDTEXTDOCUMENT)){
			try{
				int index = args.getInt(0);
				String text = args.getString(1);
				int row = args.getInt(2);
				int col = args.getInt(3);
								
				addTextDocument(index, text, row, col);
				
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_ADDIMAGEDOCUMENT)){
			try{
				int index = args.getInt(0);
				String pathImage = args.getString(1);
				int row = args.getInt(2);
				int col = args.getInt(3);
								
				addImageDocument(index, pathImage, row, col);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_PRINTDOCUMENT)){
			try{
				int index = args.getInt(0);
				
				printDocument(index);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_PRINTALLDOCUMENTS)){
			try{
				
				printAllDocuments();
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_ADDLINEDOCUMENT)){
			try{
				
				int index = args.getInt(0);
				int len = args.getInt(1);
				int row = args.getInt(2);
				int col = args.getInt(3);
								
				addLineDocument(index, len, row, col);
				
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}		
		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		r.setKeepCallback(true);
		return r;
	}
	
	private void AbrirCon() {
		new Thread(new Runnable() {
			public void run() {
				// Open Close the connection
				if (m_cPrinter == null) {
					documentList = new ArrayList<Document>();
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "AbrirCon m_cPrinter es null");
					// Open
					try {
						m_cPrinter = Connection_Android_Bluetooth.createClient(mac_Address);

						m_cPrinter.open();

						// Check if worked
						if (!m_cPrinter.getIsOpen()) {
							if(DEBUG_PRINTER)
								Log.d(TAG_DATAMAX, "AbrirCon !m_cPrinter.getIsOpen(");
							// Clean Up
							m_cPrinter.clearReadBuffer();
							m_cPrinter.clearWriteBuffer();
							m_cPrinter.close();
							m_cPrinter = null;
							b_connected = false;
							return;
						}
						
						// Check that the printer exists
						// Connections like Bluetooth can take some time to actually connect
						// to the device so this will 'look' for the printer to make sure that
						// be both had a valid connection target and the target is fully
						// connected.
						if(DEBUG_PRINTER)
							Log.d(TAG_DATAMAX, "AbrirCon status");
						GeneralStatus status = new GeneralStatus();
						status.update(m_cPrinter, 30000);

						if(DEBUG_PRINTER)
							Log.d(TAG_DATAMAX, "AbrirCon m_cPrinter getValid:" + status.getValid());
						if (status.getValid() == false) {
							// Notify
							if(DEBUG_PRINTER)
								Log.d(TAG_DATAMAX, "No printer response, Open Failed");

							// Clean Up
							m_cPrinter.clearReadBuffer();
							m_cPrinter.clearWriteBuffer();
							m_cPrinter.close();
							m_cPrinter = null;
							b_connected = false;
							return;
						}

						// We are Open, get the parameters.  In your own application it would
						// be better to hard code these as normally you are working with a 
						// single type of printer.
						PrintheadStatus config = new PrintheadStatus();
						config.update(m_cPrinter, 8000);

						if (config.getPrintheadModel_IsPresent()) {
							// Thermal
							m_IsThermalPrinter = true;
							m_PrinterWidth = (int)config.getPrintheadWidth();
							m_FontLP1 = "$";
							m_FontLP2 = "!";
							Log.d(TAG_DATAMAX, "TIPO IMPRESORA Thermal");
						}
						else {
							Log.d(TAG_DATAMAX, "TIPO IMPRESORA Impact");
							// Impact
							m_IsThermalPrinter = false;
							m_PrinterWidth = 1920;
							m_FontLP1 = "A";
							m_FontLP2 = "B";
						}

						m_cPrinter.clearReadBuffer();
						m_cPrinter.clearWriteBuffer();
						
						b_connected = false;
					}
					catch (Exception myError) {
						if(DEBUG_PRINTER)
							Log.d(TAG_DATAMAX, "catch (Exception myError): "+ myError.getMessage());

						if (m_cPrinter != null) {
							try { m_cPrinter.close(); }
							catch (Exception ignore) { }
						}
						m_cPrinter = null;
						b_connected = false;
					}
				}
				else {
					//TODO: creo que no debe cerrar la coneccion
					// Close CORRRE
					/*m_cPrinter.close();
					m_cPrinter = null;
					b_connected = false;*/
					
					m_cPrinter.clearReadBuffer();
					m_cPrinter.clearWriteBuffer();
					documentList = new ArrayList<Document>();
				}
			}
		}).start();
	}
	
	public JSONObject isConnected(){
		JSONObject obj = new JSONObject();
		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "isConnected");
		try{
			if (m_cPrinter != null)
			{
				GeneralStatus status = new GeneralStatus();
				status.update(m_cPrinter, 30000);

				if (status.getValid() == false)
					obj.put("status", "0");
				else
					obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "isConnected error" + e.getMessage());
			return null;
		}
		return obj;
	}

	public JSONObject addDocument(String font) throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ = null;
		
		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "addDocument");
		try{
			docEZ = new DocumentEZ(font);
			if(docEZ == null)
			{	
				if(DEBUG_PRINTER)
					Log.d(TAG_DATAMAX, "addDocument document is null" + "ff");
			}
			docEZ.clear();
			
			documentList.add(docEZ);
			obj.put("status", "1");					
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "addDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}
	
	public JSONObject addTextDocument(int docIndex, String Text, int row, int col) throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;

		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "addTextDocument");
		try{
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "addTextDocument docIndex:"+ docIndex + "|Text:" + Text + "|row:" + row + "|col:" + col + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{				
				//Sacamos el documento de la lista
				docEZ = (DocumentEZ)documentList.get(docIndex);
				if(docEZ == null)
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "addTextDocument document is null");
				
				Log.d(TAG_DATAMAX, "addTextDocument numlines:" +docEZ.getPageLength() );
				//Agregamos el texto				
				docEZ.writeText(Text, row, col);
				//Log.d(TAG_DATAMAX, "printAllDocuments m_cPrinter.getBytesAvailable:" + m_cPrinter.getBytesAvailable());
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				//documentList.add(docIndex, docEZ);
				if(documentList.size() == 0)
					documentList.add(docIndex, docEZ);
				else
					documentList.set(docIndex, docEZ);

				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "addTextDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}
	
	public JSONObject addLineDocument(int docIndex, int length, int row, int col) throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;

		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "addLineDocument");
		try{
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "addLineDocument docIndex:"+ docIndex + "|row:" + row + "|col:" + col + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{
				//Sacamos el documento de la lista
				docEZ = (DocumentEZ)documentList.get(docIndex);
				if(docEZ == null)
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "addLineDocument document is null");
				//Agregamos linea				
				docEZ.writeHorizontalLine(row, col, length, 3);
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				//documentList.add(docIndex, docEZ);
				if(documentList.size() == 0)
					documentList.add(docIndex, docEZ);
				else
					documentList.set(docIndex, docEZ);

				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "addLineDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	public JSONObject addImageDocument(int docIndex, String pathImage, int row, int col) throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;

		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "addImageDocument");
		try{
			Log.d(TAG_DATAMAX, "addImageDocument docIndex:"+ docIndex + "|pathImage:" + pathImage + "|row:" + row + "|col:" + col + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{				
				//Sacamos el documento de la lista
				docEZ = (DocumentEZ)documentList.get(docIndex);
				if(docEZ == null)
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "addImageDocument document is null");
				//Agregamos el texto
				docEZ.writeImage(pathImage, row, col);
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				if(documentList.size() == 0)
					documentList.add(docIndex, docEZ);
				else
					documentList.set(docIndex, docEZ);

				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "addImageDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}
	
	public void imprimir(String a, int row, int col){

		try {
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "imprimir");       
			if (m_cPrinter == null)
				Log.d(TAG_DATAMAX, "imprimir printer null");
				//connection.open();
			    //TODO: aqui checar si puede abrir la coneccion de nuevo
	
			
			// Create the document
			ArrayList<Document> documentList = new ArrayList<Document>();
			Date currentDate = new Date();
			DocumentEZ docEZ;
			
			
			docEZ = new DocumentEZ(m_FontEZ1);
			docEZ.writeText(a, row, col);			
			documentList.add(docEZ);			
			try {
				m_cPrinter.clearReadBuffer();
				m_cPrinter.clearWriteBuffer();
				// Print the document
				for (Document docObject : documentList) {
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "imprimir ");
					
					m_cPrinter.write(docObject.getDocumentData());
				}				
			}
			catch (Exception myError) {
				// Exception thrown
				if(DEBUG_PRINTER)
					Log.d(TAG_DATAMAX, "Generic Exception thrown while printing: " + myError.getMessage());
			}finally{
				
			}
			    
		} catch (Exception e) {
			b_connected = false; 
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "imprimir:" + e.getMessage());
		}

	}

	//Imprime un documento de la lista
	public JSONObject printDocument(int docIndex) throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;
		
		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "printDocument");
		try{
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "printDocument docIndex:" + docIndex + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{
				if(DEBUG_PRINTER)
					Log.d(TAG_DATAMAX, "printDocument imprimo documento:");
				docEZ = (DocumentEZ)documentList.get(docIndex);
				try {
					//m_cPrinter.clearReadBuffer();
					//m_cPrinter.clearWriteBuffer();
					if(docEZ == null)
						if(DEBUG_PRINTER)
							Log.d(TAG_DATAMAX, "printDocument document is null");
					// Print the document
					m_cPrinter.write(docEZ.getDocumentData());			
				}
				catch (Exception myError) {
					// Exception thrown
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "printDocument: " + myError.getMessage());
					obj.put("status", "0");
				}finally{
					
				}
				    
				obj.put("status", "1");
			}else{
				if(DEBUG_PRINTER)
					Log.d(TAG_DATAMAX, "printDocument puro pedo imprimio");
				obj.put("status", "0");
			}
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "printDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}
	
	//Imprime todos los documentos de la lista
	public JSONObject printAllDocuments() throws JSONException{
		JSONObject obj = new JSONObject();		
		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "printAllDocuments");
		try{
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "printAllDocuments size:" + documentList.size());
			if(documentList.size() > 0)
			{				
				try {
					//Log.d(TAG_DATAMAX, "printAllDocuments size:" + documentList.size());
					// Print the document					
					for (Document docObject : documentList) {						
						//m_cPrinter.clearReadBuffer();
						m_cPrinter.write(docObject.getDocumentData());
						//Log.d(TAG_DATAMAX, "printAllDocuments m_cPrinter.getBytesAvailable:" + m_cPrinter.getBytesAvailable());
						
					}			
				}
				catch (Exception myError) {
					// Exception thrown
					if(DEBUG_PRINTER)
						Log.d(TAG_DATAMAX, "Generic printAllDocuments: " + myError.getMessage());
					obj.put("status", "0");
				}
				    
				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "printAllDocuments error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}
	
	public void disconnect(){
		documentList = new ArrayList<Document>();
		if(DEBUG_PRINTER)
			Log.d(TAG_DATAMAX, "disconnect:");
		try {
			if (m_cPrinter != null)
			{
				m_cPrinter.close();
				m_cPrinter = null;
			}
		} catch (Exception e) {
			if(DEBUG_PRINTER)
				Log.d(TAG_DATAMAX, "disconnect error:" + e.getMessage());
		} finally {

		}
	}
}
