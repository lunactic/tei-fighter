/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main.seg;

import java.io.IOException;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Mathias Seuret
 */
public class LineSegmentation {
    /**
     * Applies a Sauvola's text binarization to the region to process. It
     * does not seem necessary, but implementing it required only half a
     * dozen lines.
     */
    public static boolean doSauvolaBinarization = false;
    
    /**
     * In case of noisy images, smoothing them might improve the accuracy. Not
     * sure of it, but the option is there.
     */
    public static boolean smoothImage = false;
    
    /**
     * Smoothing factor for the projection profile. If the result is segmented
     * into too many small lines and sublines, then increasing this value should
     * improve it. If only a few large lines (regrouping several actual lines
     * are detected, then this value should be decreased.
     * The default value of 6 has been rather successful on several documents
     * from different datasets.
     */
    public static int projectionSmoothingFactor = 6;
    
    /**
     * Threshold used for trimming the sides of the lines. A value of 0 does
     * not trim them, while higher values do trim them.
     */
    public static float cleaningThreshold = 0.7f;
    
    /**
     * Will store the results. Unless it needs to be read in random order,
     * a linked list should do well.
     */
    private List<Line> lines = new LinkedList();
    
    /**
     * Creates a currentLine segmentation for the given area of the given image.
     * @param img image to use
     * @param left coordinate of the area
     * @param top coordinate of the area
     * @param right coordinate of the area
     * @param bottom coordinate of the area
     * @throws IOException only during tests
     */
    public LineSegmentation(Image img, int left, int top, int right, int bottom) throws IOException {
        img.invert();
        
        Image sub = img.getSubImage(img, left, top, right, bottom);
        
        if (smoothImage) {
            sub = sub.getBluredVersion();
        }
        
        
        if (doSauvolaBinarization) {
            applySauvola(sub);
        }
        
        
        HorizontalProjection proj = new HorizontalProjection(sub);
        for (int s=1; s<=projectionSmoothingFactor; s++) {
            proj.smooth(s);
        }
        
        Line currentLine = null;
        float[] val = proj.getValues();
        float[] thres = proj.getThreshold();
        for (int y=0; y<sub.getHeight(); y++) {
            if (val[y]<thres[y]) {
                if (currentLine!=null) {
                    currentLine.bottom = y+top-1; // bottom known now
                    lines.add(currentLine);
                    currentLine = null;
                }
                continue;
            }
            
            if (currentLine==null) { // not currently in a currentLine, creating one
                currentLine = new Line(left, y+top, right-1, 0); // bottom unknown now
            }
        }
        
        for (Line l : lines) {
            cleanLine(l, sub, left, top);
        }
        
        for (Line l : lines) {
            for (int x=l.left; x<l.right; x++) {
                for (int y=l.top; y<l.bottom; y++) {
                    img.set(0, x, y, 1);
                }
            }
        }
    }
    
    /**
     * @return the generated list of lines - not a copy of the list !
     */
    public List<Line> getLines() {
        return lines;
    }
    
    private void applySauvola(Image image) {
        image.toYUV();
        Matrix m = new Matrix(image.getLayer(0));
        m.sauvolaBinarization();

        image.toRGB();
        try {
            image.setLayer(0, m.array);
            image.setLayer(1, m.array);
            image.setLayer(2, m.array);
        } catch (Exception e) {} // will not happen, m has the same size as image
    }
    
    private void cleanLine(Line line, Image image, int offsetX, int offsetY) {
        VerticalProjection proj = new VerticalProjection(image, line.top-offsetY, line.bottom-offsetY);
        for (int s=1; s<=projectionSmoothingFactor; s++) {
            proj.smooth(s);
        }
        float mean  = proj.getMean();
        float thres = mean * cleaningThreshold;
        float[] val = proj.getValues();
        
        while (val[line.left-offsetX]<thres) {
            line.left++;
        }
        while (val[line.right-offsetX]<thres) {
            line.right--;
        }
    }
}
