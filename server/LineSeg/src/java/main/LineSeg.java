/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package main;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URL;
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
@WebServlet(name = "HelloServlet", urlPatterns = {"/HelloServlet"})
public class LineSeg extends HttpServlet {

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
        response.setContentType("application/json;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            
            String url = request.getParameter("url");
            int left = Integer.parseInt(request.getParameter("left"));
            int top = Integer.parseInt(request.getParameter("top"));
            int right = Integer.parseInt(request.getParameter("right"));
            int bottom = Integer.parseInt(request.getParameter("bottom"));
            

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
            }
        }
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
