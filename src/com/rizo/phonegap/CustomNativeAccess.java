package com.rizo.phonegap;
import android.content.Context;
import android.telephony.TelephonyManager;
import android.webkit.WebView;
import org.apache.cordova.DroidGap;
import android.os.PowerManager;


public class CustomNativeAccess 
{ 
	private WebView mAppView;
    private DroidGap mGap;
    public String SingalStrength="0";
    public int BatteryLevel=0;
    public PowerManager.WakeLock wakeLock = null;
    
    public void obtenerWakeLock()
    {
    	PowerManager pm = (PowerManager) mGap.getSystemService(Context.POWER_SERVICE);
    	//this.wakeLock = pm.newWakeLock(p_flags, "PowerManagementPlugin");
    	this.wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "PowerManagementPlugin");
		this.wakeLock.acquire();

    }
    public CustomNativeAccess(DroidGap gap, WebView view)
    {
        mAppView = view;
        mGap = gap;       
    }
    public String getImeiNumber()
    {
     TelephonyManager tm = (TelephonyManager) mGap.getSystemService(Context.TELEPHONY_SERVICE);
        String imeiId = tm.getDeviceId().toString();     
        return imeiId;
    }
    public String getPhoneNumber()
    {
     TelephonyManager tm = (TelephonyManager) mGap.getSystemService(Context.TELEPHONY_SERVICE);
        String PhoneNumber = tm.getDeviceId().toString();     
        return PhoneNumber;
    }
    
    
    
    public int getPhoneBatteryLevel()
    {
    	int batteryLevel=0;
    	batteryLevel= BatteryLevel;
    	return batteryLevel;
    	
    }
    public String getPhoneSingalStrength()
    {
    	return SingalStrength;
    	
    }
    public String GetPhoneModel()
    {
    	String PhoneModel = android.os.Build.MODEL;
    	return PhoneModel;
    }
   
    public void CambiaVista(int orientation)
    {
		mGap.setRequestedOrientation(orientation);	    	
    }
}
