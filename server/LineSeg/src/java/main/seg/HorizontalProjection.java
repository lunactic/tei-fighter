/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main.seg;

/**
 * This class is used for computing projections as well as
 * local thresholds. These thresholds are used for binarizing the projection
 * profile in a better way than a global threshold. The local thresholds are
 * defined as something in-between the local maximum and minimum the closest to
 * the column.
 * @author Mathias Seuret
 */
public class HorizontalProjection {
    float[] sum;
    float[] localMax;
    float[] localMin;
    float[] threshold;
    int length;
    
    /**
     * Constructs a projection profile for the given image.
     * @param img image
     */
    public HorizontalProjection(Image img) {
        length = img.getHeight();
        sum = new float[length];
        localMax = new float[length];
        localMin = new float[length];
        threshold = new float[length];
        for (int y=0; y<img.getHeight(); y++) {
            sum[y] = getWeightedValue(img, y);
            
        }
        computeThreshold();
    }
    
    /**
     * Computes the value of the histogram for a given row.
     * @param img image
     * @param y row
     * @return a float
     */
    private float getWeightedValue(Image img, int y) {
        float res = 0.0f;
        for (int x=0; x<img.getWidth(); x++) {
            for (int l=0; l<3; l++) {
                int rad = 9;
                for (int o=-rad ; o<rad; o++) {
                    if (y+o<0 || y+o>=img.getHeight()) {
                        continue;
                    }
                    res += (1-Math.abs(o)*0.1f) * img.get(l, x, y+o);
                }
            }
        }
        return res;
    }
    
    /**
     * @return the histogram
     */
    public float[] getValues() {
        return sum;
    }
    
    /**
     * @return the binarization threshold
     */
    public float[] getThreshold() {
        return threshold;
    }
    
    /**
     * @return the mean value of the histogram
     */
    public float getMean() {
        float s = 0;
        for (float f : sum) {
            s += f;
        }
        return s / length;
    }
    
    /**
     * Smooths the histogram for a given number of iterations.
     * @param val number of iterations
     */
    public void smooth(int val) {
        float[] newSum = new float[length];
        for (int i=0; i<length; i++) {
            int n = 0;
            newSum[i] = Float.NEGATIVE_INFINITY;
            newSum[i] = 0;
            for (int di=-val; di<=val; di++) {
                int j = i+di;
                if (j<0 || j>=length) {
                    continue;
                }
                newSum[i] += sum[j];
                n++;
            }
            newSum[i] /= n;
        }
        sum = newSum;
        computeThreshold();
    }
    
    /**
     * Computes the binarization threshold.
     */
    private void computeThreshold() {
        boolean[] isMin = new boolean[length];
        boolean[] isMax = new boolean[length];
        
        // Computes which rows are local extremas
        for (int pos=0; pos<length; pos++) {
            isMax[pos] = true;
            isMin[pos] = true;
            if (pos>0 && sum[pos-1]>sum[pos]) {
                isMax[pos] = false;
            }
            if (pos<length-1 && sum[pos+1]>sum[pos]) {
                isMax[pos] = false;
            }
            if (pos>0 && sum[pos-1]<sum[pos]) {
                isMin[pos] = false;
            }
            if (pos<length-1 && sum[pos+1]<sum[pos]) {
                isMin[pos] = false;
            }
        }
        
        // Default values for the local extremas to which belong the rows.
        for (int i=0; i<length; i++) {
            localMin[i] = Float.POSITIVE_INFINITY;
            localMax[i] = Float.NEGATIVE_INFINITY;
        }
        
        // Computing the local extremas pools.
        for (int pos=0; pos<length; pos++) {
            if (isMin[pos]) {
                for (int back=pos; back>=0; back--) {
                    if (localMin[back]>sum[pos]) {
                        localMin[back] = sum[pos];
                    }
                    if (isMax[back]) {
                        break;
                    }
                }
                for (int front=pos; front<length; front++) {
                    if (localMin[front]>sum[pos]) {
                        localMin[front] = sum[pos];
                    }
                    if (isMax[front]) {
                        break;
                    }
                }
            }
            if (isMax[pos]) {
                for (int back=pos; back>=0; back--) {
                    if (localMax[back]<sum[pos]) {
                        localMax[back] = sum[pos];
                    }
                    if (isMin[back]) {
                        break;
                    }
                }
                for (int front=pos; front<length; front++) {
                    if (localMax[front]<sum[pos]) {
                        localMax[front] = sum[pos];
                    }
                    if (isMin[front]) {
                        break;
                    }
                }
            }
        }
        
        // Computing the threshold
        for (int pos=0; pos<length; pos++) {
            float r = 4;
            threshold[pos] = (r*localMin[pos]+localMax[pos])/(1+r);
        }
    }
}
