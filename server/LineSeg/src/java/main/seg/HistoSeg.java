/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main.seg;

import java.io.IOException;

/**
 *
 * @author Mathias Seuret
 */
public class HistoSeg {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws IOException, Exception {
        Image img;
        LineSegmentation seg;
        
        System.out.println("in1.jpg");
        img = new Image("in1.jpg");
        seg = new LineSegmentation(img, 36, 141, 309, 1134);
        showSegmentation(img, seg, "out-1-1.jpg");
        
        System.out.println("in1.jpg");
        img = new Image("in1.jpg");
        seg = new LineSegmentation(img, 61, 1129, 712, 1722);
        showSegmentation(img, seg, "out-1-2.jpg");
        
        System.out.println("in1.jpg");
        img = new Image("in1.jpg");
        seg = new LineSegmentation(img, 951, 134, 1122, 1116);
        showSegmentation(img, seg, "out-1-3.jpg");
        
        System.out.println("in1.jpg");
        img = new Image("in1.jpg");
        seg = new LineSegmentation(img, 723, 1119, 1135, 1731);
        showSegmentation(img, seg, "out-1-4.jpg");
        
        System.out.println("in2.jpg");
        img = new Image("in2.jpg");
        seg = new LineSegmentation(img, 256, 156, 701, 911);
        showSegmentation(img, seg, "out-2.jpg");
        
        System.out.println("in3.jpg");
        img = new Image("in3.jpg");
        seg = new LineSegmentation(img, 792, 1240, 1936, 3632);
        showSegmentation(img, seg, "out-3.jpg");
        
        
    }
    
    public static void showSegmentation(Image img, LineSegmentation seg, String out) throws IOException {
        // Graphical output for the demo
        for (Line l : seg.getLines()) {
            for (int x=l.left; x<l.right; x++) {
                for (int y=l.top; y<l.bottom; y++) {
                    img.set(0, x, y, 1);
                }
            }
        }
        
        img.write(out, "jpg");
    }
    
}
