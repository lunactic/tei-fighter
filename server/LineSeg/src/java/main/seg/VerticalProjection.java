/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main.seg;

/**
 * Computes projection profiles but no thresholds as it is not needed for my
 * task.
 * @author Mathias Seuret
 */
public class VerticalProjection {
    float[] sum;
    int length;
    
    /**
     * Constructs a projection profile for the defined slice of the image.
     * @param img image
     * @param top coordinate of the slice
     * @param bottom coordinate of the slice
     */
    public VerticalProjection(Image img, int top, int bottom) {
        length = img.getWidth();
        sum = new float[length];
        for (int x=0; x<img.getWidth(); x++) {
            sum[x] = getWeightedValue(img, x, top, bottom);
            
        }
    }
    
    /**
     * Computes the value of the histogram for a given row.
     * @param img image to use
     * @param x row
     * @param top coordinate of the slice
     * @param bottom coordinate of the slice
     * @return a float
     */
    private float getWeightedValue(Image img, int x, int top, int bottom) {
        float res = 0.0f;
        for (int y=top; y<bottom; y++) {
            for (int l=0; l<3; l++) {
                int rad = 9;
                for (int o=-rad ; o<rad; o++) {
                    if (x+o<0 || x+o>=img.getWidth()) {
                        continue;
                    }
                    res += (1-Math.abs(o)*0.1f) * img.get(l, x+o, y);
                }
            }
        }
        return res;
    }
    
    /**
     * @return the profile
     */
    public float[] getValues() {
        return sum;
    }
    
    /**
     * @return the mean of the profile
     */
    public float getMean() {
        float s = 0;
        for (float f : sum) {
            s += f;
        }
        return s / length;
    }
    
    /**
     * Smooths the profile with the given factor.
     * @param factor to use (bigger = more smooth)
     */
    public void smooth(int factor) {
        float[] newSum = new float[length];
        for (int i=0; i<length; i++) {
            int n = 0;
            newSum[i] = Float.NEGATIVE_INFINITY;
            newSum[i] = 0;
            for (int di=-factor; di<=factor; di++) {
                int j = i+di;
                if (j<0 || j>=length) {
                    continue;
                }
                newSum[i] += sum[j];
                if (sum[j]>newSum[i]) {
                    //newSum[i] = sum[j];
                }
                n++;
            }
            newSum[i] /= n;
        }
        sum = newSum;
    }
}
