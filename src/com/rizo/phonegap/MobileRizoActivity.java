package com.rizo.phonegap;

import org.apache.cordova.*;

//import com.phonegap.*;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.telephony.PhoneStateListener;
import android.telephony.TelephonyManager;
import android.util.Log;

public class MobileRizoActivity extends DroidGap {
    /** Called when the activity is first created. */
	
	 CustomNativeAccess cna;
	 //LectorBarra lector;
	 TelephonyManager telephonyManager;
	  PhoneStateListener listener;
	 String Batterlevel="";
	 
	 private static final String APP_NAME = "SignalLevelSample";
    private static final int EXCELLENT_LEVEL = 75;
    private static final int GOOD_LEVEL = 50;
    private static final int MODERATE_LEVEL = 25;
    private static final int WEAK_LEVEL = 10;
    private static final int WEAK = 0;
    private static final int NONE_LEVEL = 0;
    
    private static final int INFO_SERVICE_STATE_INDEX = 0;
    private static final int INFO_CELL_LOCATION_INDEX = 1;
    private static final int INFO_CALL_STATE_INDEX = 2;
    private static final int INFO_CONNECTION_STATE_INDEX = 3;
    private static final int INFO_SIGNAL_LEVEL_INDEX = 4;
    private static final int INFO_SIGNAL_LEVEL_INFO_INDEX = 5;
    private static final int INFO_DATA_DIRECTION_INDEX = 6;
    private static final int INFO_DEVICE_INFO_INDEX = 7;
    private static final int yscanloader01=0x7f020003;
    
    private static final int BATERY_LEVEL4 = 85;
    private static final int BATERY_LEVEL3 = 75;
    private static final int BATERY_LEVEL2 = 50;
    private static final int BATERY_LEVEL1 = 15;
    private static final int BATERY_LEVEL0 = 0;
    
    public static int BatteryLevel =0;
    
    private BroadcastReceiver mBatInfoReceiver = new BroadcastReceiver(){
        @Override
        public void onReceive(Context arg0, Intent intent) {
          // TODO Auto-generated method stub
          int level = intent.getIntExtra("level", 0);
          BatteryLevel = getBateryLevelString(level);
          cna.BatteryLevel = BatteryLevel;
        }
      };
      private int getBateryLevelString(int level) {
	       int BateryLevelString = 0;
	       
	       if(level > BATERY_LEVEL4)             BateryLevelString = 4;
	       else if(level > BATERY_LEVEL3)             BateryLevelString = 3;
	       else if(level > BATERY_LEVEL2) BateryLevelString = 2;
	       else if(level > BATERY_LEVEL1)             BateryLevelString = 1;
	       else if(level > BATERY_LEVEL0)             BateryLevelString = 0;
	       
	       return BateryLevelString;
	   }
      
    @Override
    public void onCreate(Bundle savedInstanceState) {
        //super.onCreate(savedInstanceState);
        //super.loadUrl("file:///android_asset/www/index.html");
    	
    	super.onCreate(savedInstanceState);
        super.init();
        
        cna = new CustomNativeAccess(this, appView);
        appView.addJavascriptInterface(cna, "CustomNativeAccess");
        
        //lector = new LectorBarra(this, appView);
        //appView.addJavascriptInterface(lector, "LectorBarra");
        
        super.clearCache();
        this.registerReceiver(this.mBatInfoReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
        // LoadUrl timeout value in msec (default of 20 sec) 
        super.loadUrlTimeoutValue = 60000; 
        super.setIntegerProperty("loadUrlTimeoutValue", 120000);


        //Set properties for activity 

        // load splash.jpg image from the resource drawable directory 
        super.setIntegerProperty("splashscreen",yscanloader01); 

        //show loading dialog 
        super.setStringProperty("loadingDialog", "RIZO ,Cargando Aplicacion...");
        cna.obtenerWakeLock();
        super.loadUrl("file:///android_asset/www/index.html");
        
        startSignalLevelListener();
    }
    @Override
    public void onDestroy() {
          super.onDestroy();
          /*
          Calendar cal = Calendar.getInstance();
          cal.add(Calendar.SECOND, 30);
          Intent intent = new Intent(this, AlarmReceiver.class);
          PendingIntent sender = PendingIntent.getBroadcast(this, 640002791, intent,
                      PendingIntent.FLAG_UPDATE_CURRENT);
          AlarmManager am = (AlarmManager) getSystemService(ALARM_SERVICE);
          am.set(AlarmManager.RTC_WAKEUP, cal.getTimeInMillis(), sender);
          cna.wakeLock.release();
          */
    }

    private void startSignalLevelListener() {
        TelephonyManager tm = (TelephonyManager) getSystemService(TELEPHONY_SERVICE);
        int events = PhoneStateListener.LISTEN_SIGNAL_STRENGTH;
        tm.listen(phoneStateListener, events);
    }
    
    private void setSignalLevel(int level){
        int progress = (int) ((level/31.0) * 100);
        String signalLevelString = getSignalLevelString(progress);
        cna.SingalStrength = signalLevelString;
        //Log.i("signalLevel ","" + progress);
    }
    
    private String getSignalLevelString(int level) {
        String signalLevelString = "0";
        
        if(level > EXCELLENT_LEVEL)             signalLevelString = "4";
        else if(level > GOOD_LEVEL)             signalLevelString = "3";
        else if(level > MODERATE_LEVEL) signalLevelString = "2";
        else if(level > WEAK_LEVEL)             signalLevelString = "1";
        else if(level > WEAK)             signalLevelString = "0";
        else if(level > NONE_LEVEL)             signalLevelString = "0";
        
        return signalLevelString;
    }
    private final PhoneStateListener phoneStateListener = new PhoneStateListener(){

        @Override
        public void onSignalStrengthChanged(int asu)
        {
                //Log.i(APP_NAME, "onSignalStrengthChanged " + asu);
                setSignalLevel(asu);
                super.onSignalStrengthChanged(asu);
        }
 };
 
 public String prueba(){
	 return "Hola";
 }
}
