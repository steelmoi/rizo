package com.rizo.Printer;

public class Line {
	private String Text = "";
	private int row = -1;
	private int col = -1;
	private int width = -1;
	
	private int height = -1;
	private boolean isImage = false;
	private String PathImage = "";
	private String codigo = "";
	
	public String getCodigo() {
		return codigo;
	}
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	public Line()
	{
		
	}
	public Line(String Text, int row, int col)
	{
		this.col =col;
		this.row = row;
		this.Text = Text;
	}
	
	public Line(int row, int col, int width, int height, boolean isImage)
	{
		this.col =col;
		this.row = row;
		this.width= width;
		this.height = height;
		this.isImage = isImage;
	}
	
	public String getText() {
		return Text;
	}
	public void setText(String text) {
		Text = text;
	}
	public int getRow() {
		return row;
	}
	public void setRow(int row) {
		this.row = row;
	}
	public int getCol() {
		return col;
	}
	public void setCol(int col) {
		this.col = col;
	}
	public boolean isImage() {
		return isImage;
	}
	public void setImage(boolean isImage) {
		this.isImage = isImage;
	}
	public boolean getImage() {
		return isImage;
	}
	public String getPathImage() {
		return PathImage;
	}
	public void setPathImage(String pathImage) {
		PathImage = pathImage;
	}
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	public int getHeight() {
		return height;
	}
	public void setHeight(int height) {
		this.height = height;
	}
}
