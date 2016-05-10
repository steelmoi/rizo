package com.rizo.Printer;

import org.json.JSONException;
import org.json.JSONObject;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.PluginResult;

public abstract class IPrinter {
	public abstract PluginResult Connect(String mac);
	public abstract JSONObject IsConnected() throws JSONException;
	public abstract JSONObject Disconnect() throws JSONException;
	//public abstract boolean printText();
	//public abstract boolean printTextXY();
	public abstract JSONObject printImage(int x, int y, int width, int height, String codigo) throws JSONException;
	//public abstract JSONObject printImage() throws JSONException;
	public abstract JSONObject addDocument(String font) throws JSONException;
	public abstract JSONObject addTextDocument(int docIndex, String Text, int row, int col) throws JSONException;
	public abstract JSONObject addImageDocument(int docIndex, int x, int y, int width, int height, String codigo) throws JSONException;
	public abstract JSONObject printDocument(int docIndex)throws JSONException;
	public abstract JSONObject printAllDocuments()throws JSONException;
	
	public abstract void setContext(CordovaInterface ctx);
	//public abstract boolean addDocument();

}
