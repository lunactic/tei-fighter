/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
import java.text.ParseException;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import main.seg.Image;
import main.seg.Line;
import main.seg.LineSegmentation;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

/**
 *
 * @author ms
 */
@WebServlet(name = "LineSeg", urlPatterns = {"/LineSeg"})
public class HelloServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        BufferedWriter writer = new BufferedWriter(new FileWriter(new File("/tmp/log-server")));
        writer.write("Hello World !\n"); writer.flush();
        StringBuffer jsonText = new StringBuffer();
        String line = null;
        try {
          BufferedReader reader = request.getReader();
          while ((line = reader.readLine()) != null) {
            jsonText.append(line);
          }
        } catch (Exception e) { /*report an error*/ }
        
        
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            writer.write("Place A"); writer.flush();
            
            JSONObject parameters;
            parameters = new JSONObject(jsonText.toString());
            writer.write(parameters.toString());
            
            String url = parameters.getString("url");
            int left = parameters.getInt("left");
            int top = parameters.getInt("top");
            int right = parameters.getInt("right");
            int bottom = parameters.getInt("bottom");

            writer.write("URL: "+url); writer.flush();
            writer.write("L: "+left); writer.flush();
            writer.write("R: "+right); writer.flush();
            writer.write("T: "+top); writer.flush();
            writer.write("B: "+bottom); writer.flush();
            
            
            writer.write("Place B"); writer.flush();
            try {
                BufferedImage bi = ImageIO.read(new URL(url));
                Image img = new Image(bi);
                LineSegmentation seg = new LineSegmentation(
                        img,
                        left,
                        top,
                        right,
                        bottom
                );
                
                
                JSONArray array = new JSONArray();
                
                for (Line l : seg.getLines()) {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("top", l.top);
                    jsonObject.put("bottom", l.bottom);
                    jsonObject.put("left", l.left);
                    jsonObject.put("right", l.right);
                    array.put(jsonObject);
                }
                array.write(out);
                
                
            } catch (Exception e) {
                out.println(e.toString());
                e.printStackTrace(out);
                writer.write(e.toString()); writer.flush();
            }
        } catch (Exception e) {
            writer.write("2:"+e.toString()); writer.flush();
        }
        writer.close();
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
