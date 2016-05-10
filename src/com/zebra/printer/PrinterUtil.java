package com.zebra.printer;

public class PrinterUtil {

	public static final int ALIGN_LEFT = 0;
	public static final int ALIGN_CENTER = 1;
	public static final int ALIGN_RIGHT = 2;
	
	public static String AlineaTexto(String Texto, int align, int maximo)
	{
		String res = Texto;
		int total = 0;
		
		if (Texto== null || Texto.length() >= maximo) {
	        return Texto;
	    }

	    int max = (maximo - Texto.length());
	    	    
		if(align != ALIGN_LEFT)
		{
			if (align == ALIGN_CENTER)
				max /= 2;
			
			if(max >0)
				;//res.
		}
		return res;
	}
}
