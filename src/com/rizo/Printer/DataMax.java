package com.rizo.Printer;

import java.util.ArrayList;

import oneil.connection.ConnectionBase;
import oneil.connection.Connection_Android_Bluetooth;
import oneil.printer.Document;
import oneil.printer.DocumentEZ;
import oneil.printer.configuration.GeneralStatus;
import oneil.printer.configuration.PrintheadStatus;

import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

public class DataMax extends IPrinter {

	public static String TAG_DATAMAX = "Datamax";
	private static boolean DEBUG_DATAMAX = false;
	
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
	private CordovaInterface ctx;
	
	@Override
	public PluginResult Connect(String mac) {

			if(DEBUG_DATAMAX)
				Log.d(TAG_DATAMAX, "ACTION_CONNECT mac:" + mac);
			try{
				b_connected = true;
				mac_Address = mac;
				documentList = new ArrayList<Document>();
				OpenCon();
				while(b_connected){}

				JSONObject objResp = IsConnected();
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
				if(DEBUG_DATAMAX)
					Log.d(TAG_DATAMAX, "ACTION_CONNECT eConn:" + eConn.getMessage());
				return new PluginResult(PluginResult.Status.ERROR, eConn.getMessage());
			}
		/*} catch (JSONException e) {
			b_connected = false;
			Log.d(TAG_DATAMAX, "ACTION_CONNECT error JSON:" + e.getMessage());
			e.printStackTrace();
			return new PluginResult(PluginResult.Status.ERROR, e.getMessage());
		}*/
	}

	public void setContext(CordovaInterface ctx)
	{
		this.ctx = ctx;
	}
	
	private void OpenCon() {
		new Thread(new Runnable() {
			public void run() {
				// Open Close the connection
				if (m_cPrinter == null) {
					if(DEBUG_DATAMAX)
						Log.d(TAG_DATAMAX, "AbrirCon m_cPrinter es null");
					// Open
					try {
						m_cPrinter = Connection_Android_Bluetooth.createClient(mac_Address);

						m_cPrinter.open();

						// Check if worked
						if (!m_cPrinter.getIsOpen()) {
							if(DEBUG_DATAMAX)
								Log.d(TAG_DATAMAX, "AbrirCon !m_cPrinter.getIsOpen(");
							// Clean Up
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
						if(DEBUG_DATAMAX)
							Log.d(TAG_DATAMAX, "AbrirCon status");
						GeneralStatus status = new GeneralStatus();
						status.update(m_cPrinter, 30000);

						if(DEBUG_DATAMAX)
							Log.d(TAG_DATAMAX, "AbrirCon m_cPrinter getValid:" + status.getValid());
						if (status.getValid() == false) {
							// Notify
							if(DEBUG_DATAMAX)
								Log.d(TAG_DATAMAX, "No printer response, Open Failed");

							// Clean Up
							m_cPrinter.close();
							m_cPrinter = null;
							b_connected = false;
							return;
						}

						// We are Open, get the parameters.  In your own application it would
						// be better to hard code these as normally you are working with a 
						// single type of printer.
						PrintheadStatus config = new PrintheadStatus();
						config.update(m_cPrinter, 3000);

						if (config.getPrintheadModel_IsPresent()) {
							// Thermal
							m_IsThermalPrinter = true;
							m_PrinterWidth = (int)config.getPrintheadWidth();
							m_FontLP1 = "$";
							m_FontLP2 = "!";
						}
						else {
							// Impact
							m_IsThermalPrinter = false;
							m_PrinterWidth = 1920;
							m_FontLP1 = "A";
							m_FontLP2 = "B";
						}


						b_connected = false;
					}
					catch (Exception myError) {
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
				}
			}
		}).start();
	}

	@Override
	public JSONObject IsConnected() throws JSONException {
		JSONObject obj = new JSONObject();
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
			if(DEBUG_DATAMAX)
				Log.d(TAG_DATAMAX, "isConnected error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject Disconnect()  throws JSONException{
		JSONObject obj = new JSONObject();
		documentList = new ArrayList<Document>();
		if(DEBUG_DATAMAX)
			Log.d(TAG_DATAMAX, "disconnect:");
		try {
			if (m_cPrinter != null)
			{
				m_cPrinter.close();
				m_cPrinter = null;
			}
			obj.put("status", "1");
		} catch (Exception e) {
			Log.d(TAG_DATAMAX, "disconnect error:" + e.getMessage());
			obj.put("status", "0");
		} finally {

		}
		return obj;
	}

	/*@Override
	public boolean printText() {		
		return false;
	}

	@Override
	public boolean printTextXY() {
		return false;
	}*/

	@Override
	public JSONObject printImage(int x, int y, int width, int height, String codigo) throws JSONException{		
		JSONObject obj = new JSONObject();
		
		return obj;
	}

	@Override
	public JSONObject addDocument(String font)  throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ = null;
		
		if(DEBUG_DATAMAX)
			Log.d(TAG_DATAMAX, "addDocument");
		try{
			docEZ = new DocumentEZ(font);
			if(docEZ == null)
			{
				if(DEBUG_DATAMAX)
					Log.d(TAG_DATAMAX, "addDocument document is null" + " s");
			}
			documentList.add(docEZ);
			obj.put("status", "1");					
		}catch(Exception e){
			Log.d(TAG_DATAMAX, "addDocument error" + e.getMessage());
			obj.put("status", "0");
			
		}
		return obj;
	}

	@Override
	public JSONObject addTextDocument(int docIndex, String Text, int row, int col) throws JSONException {
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;

		if(DEBUG_DATAMAX)
			Log.d(TAG_DATAMAX, "addTextDocument");
		try{
			if(DEBUG_DATAMAX)
				Log.d(TAG_DATAMAX, "addTextDocument docIndex:"+ docIndex + "|Text:" + Text + "|row:" + row + "|col:" + col + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{
				//Sacamos el documento de la lista
				docEZ = (DocumentEZ)documentList.get(docIndex);
				if(docEZ == null)
				{
					if(DEBUG_DATAMAX)
						Log.d(TAG_DATAMAX, "addTextDocument document is null");
				}
				//Agregamos el texto
				docEZ.writeText(Text, row, col);
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
			Log.d(TAG_DATAMAX, "addTextDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject addImageDocument(int docIndex, int x, int y, int width, int height, String codigo) throws JSONException {
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;

		if(DEBUG_DATAMAX)
			Log.d(TAG_DATAMAX, "addImageDocument");
		try{
			if(DEBUG_DATAMAX)
				Log.d(TAG_DATAMAX, "addImageDocument docIndex:"+ docIndex + "|x:" + x + "|y:" + y + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{				
				//Sacamos el documento de la lista
				docEZ = (DocumentEZ)documentList.get(docIndex);
				if(docEZ == null)
				{
					if(DEBUG_DATAMAX)
						Log.d(TAG_DATAMAX, "addImageDocument document is null");
				}
				//Agregamos el texto
				docEZ.writeImage("", x, y);
				//y volvemos a agregar el elemento en la lista, en la misma prosicion
				if(documentList.size() == 0)
					documentList.add(docIndex, docEZ);
				else
					documentList.set(docIndex, docEZ);

				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			Log.d(TAG_DATAMAX, "addImageDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject printDocument(int docIndex) throws JSONException{
		JSONObject obj = new JSONObject();
		DocumentEZ docEZ;
		
		if(DEBUG_DATAMAX)
			Log.d(TAG_DATAMAX, "printDocument");
		try{
			if(DEBUG_DATAMAX)
				Log.d(TAG_DATAMAX, "printDocument docIndex:" + docIndex + "|size:" + documentList.size());
			if(docIndex >= 0 && documentList.size() > 0 && docIndex < documentList.size())
			{
				if(DEBUG_DATAMAX)
					Log.d(TAG_DATAMAX, "printDocument imprimo documento:");
				docEZ = (DocumentEZ)documentList.get(docIndex);
				try {
					if(docEZ == null)
					{
						if(DEBUG_DATAMAX)
							Log.d(TAG_DATAMAX, "printDocument document is null");
					}
					// Print the document
					m_cPrinter.write(docEZ.getDocumentData());					
				}
				catch (Exception myError) {
					// Exception thrown
					Log.d(TAG_DATAMAX, "printDocument: " + myError.getMessage());
					obj.put("status", "0");
				}
				    
				obj.put("status", "1");
			}else{
				Log.d(TAG_DATAMAX, "printDocument puro pedo imprimio");
				obj.put("status", "0");
			}
		}catch(Exception e){
			Log.d(TAG_DATAMAX, "printDocument error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

	@Override
	public JSONObject printAllDocuments() throws JSONException{
		JSONObject obj = new JSONObject();		
		int v_total_lines_printer = 0;
		int v_total_for_printer = 0;
		int docIndex = 0;
		
		if(DEBUG_DATAMAX)
			Log.d(TAG_DATAMAX, "printAllDocuments");
		try{
			if(DEBUG_DATAMAX)
				Log.d(TAG_DATAMAX, "printAllDocuments size:" + documentList.size());
			if(documentList.size() > 0)
			{				
				try {
					// Print the document
					/*for (Document docObject : documentList) {
						m_cPrinter.write(docObject.getDocumentData());
					}*/
					v_total_for_printer = documentList.size();
					while(v_total_lines_printer < v_total_for_printer)
					{
						DocumentEZ docEZ = null;
						try {
							docEZ = (DocumentEZ)documentList.get(docIndex);
						}catch(Exception e) {
							docEZ = null;
						}
						
						if(docEZ != null)
						{
							m_cPrinter.write(docEZ.getDocumentData());
							v_total_lines_printer++;
						}
						docIndex++;
					}
				}
				catch (Exception myError) {
					// Exception thrown
					Log.d(TAG_DATAMAX, "Generic printAllDocuments: " + myError.getMessage());
					obj.put("status", "0");
				}
				    
				obj.put("status", "1");
			}else
				obj.put("status", "0");
		}catch(Exception e){
			Log.d(TAG_DATAMAX, "printAllDocuments error" + e.getMessage());
			obj.put("status", "0");
		}
		return obj;
	}

}
