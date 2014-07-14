/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main.seg;

/**
 * Class used for storing line data. No comments !
 * @author Mathias Seuret
 */
public class Line {
    public int left;
    public int top;
    public int right;
    public int bottom;
    
    /**
     * Constructor of the class
     * @param left coordinate
     * @param top coordinate
     * @param right coordinate
     * @param bottom  coordinate
     */
    public Line(int left, int top, int right, int bottom) {
        this.left   = left;
        this.top    = top;
        this.right  = right;
        this.bottom = bottom;
    }
    
    @Override
    public String toString() {
        return "Line(["+left+","+top+"]["+right+","+bottom+"])";
    }
}
