package com.rizo.Printer;

import java.util.ArrayList;

import org.apache.cordova.api.Plugin;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.R;
import android.util.Log;

public class Printer extends Plugin{
	public final boolean DEBUG = false;
	public final String TAG_PRINTER = "Printer";
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
	
	public IPrinter oPrinter = null;

	public  Printer() {
		
	}

	public PluginResult execute(String action, JSONArray args, 
			String callbackId) {

		
		String mac =  "";
		int inPrinter = 0;
		if(DEBUG)
		{
			Log.d(TAG_PRINTER, "execute action:" + action);
			Log.d(TAG_PRINTER, "execute len:" + args.length());
		}
		if(action.equals(ACTION_CONNECT))
		{			
				try {
					mac = args.get(0).toString();
					inPrinter = args.getInt(1);
				} catch (JSONException e) {					
					e.printStackTrace();
				}
				if(DEBUG)
					Log.d(TAG_PRINTER, "ACTION_CONNECT mac:" + mac);
				try{
					switch (inPrinter) {
					case 1:
						oPrinter = new Zebra();
						oPrinter.setContext(this.ctx);
						
						break;
					case 2:
						oPrinter = new DataMax();
						break;					
					default:
						oPrinter = new DataMax();
						break;
					}
					
					return oPrinter.Connect(mac);
				}catch(Exception eConn){
					
					Log.d(TAG_PRINTER, "ACTION_CONNECT eConn:" + eConn.getMessage());
					return new PluginResult(PluginResult.Status.ERROR, eConn.getMessage());
				}
				
		}else if(action.equals(ACTION_ISCONNECTED)){
			JSONObject obj = null;
			try {
				obj = oPrinter.IsConnected();
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, obj);
				else
					return new PluginResult(PluginResult.Status.OK, obj);
			} catch (JSONException e) {				
				e.printStackTrace();
			}			
			return new PluginResult(PluginResult.Status.ERROR, obj);
			
		}else if(action.equals(ACTION_DISCONNECT)){
			JSONObject obj;
			try {
				obj = oPrinter.Disconnect();
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "Conectado");
				else
					return new PluginResult(PluginResult.Status.OK, "Desconectado");
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}			
			return new PluginResult(PluginResult.Status.ERROR, "Conectado");						
		/*}else if(action.equals(ACTION_IMPRIMIR)){
			try{
				String text = args.getString(0);
				int row = args.getInt(1);
				int col = args.getInt(2);
				
				imprimir(text, row, col);
				return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}*/
		}else if(action.equals(ACTION_ADDDOCUMENT)){
			try{
				String font = args.getString(0);
				JSONObject obj = oPrinter.addDocument(font);
				
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "0");
				else
					return new PluginResult(PluginResult.Status.OK, "1");
								
			}catch(Exception e){
				//return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_ADDTEXTDOCUMENT)){
			try{
				int index = args.getInt(0);
				String text = args.getString(1);
				int row = args.getInt(2);
				int col = args.getInt(3);
								
				JSONObject obj = oPrinter.addTextDocument(index, text, row, col);
				
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "0");
				else
					return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_ADDIMAGEDOCUMENT)){
			try{
				int index = args.getInt(0);
				int row = args.getInt(1);
				int col = args.getInt(2);
				int w = args.getInt(3);
				int h = args.getInt(4);
				String codigo = args.getString(5);
								
				JSONObject obj = oPrinter.addImageDocument(index, row, col, w, h, codigo);
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "0");
				else
					return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_PRINTDOCUMENT)){
			try{
				int index = args.getInt(0);
				
				JSONObject obj = oPrinter.printDocument(index);
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "0");
				else
					return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_PRINTALLDOCUMENTS)){
			try{
				
				JSONObject obj = oPrinter.printAllDocuments();
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "0");
				else
					return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}else if(action.equals(ACTION_IMAGE)){
			try{
				int x = args.getInt(0);
				int y = args.getInt(1);
				int width = args.getInt(2);
				int height = args.getInt(3);
				String codigo = args.getString(4);
				
				JSONObject obj = oPrinter.printImage(x, y, width, height, codigo);
				if(obj == null || obj.getString("status").equals("0"))
					return new PluginResult(PluginResult.Status.ERROR, "0");
				else
					return new PluginResult(PluginResult.Status.OK, "1");
			}catch(Exception e){
				return new PluginResult(PluginResult.Status.ERROR, "0");
			}
		}
		
		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		r.setKeepCallback(true);
		return r;
	}
}
