/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author federico
 */
@WebServlet("/VerSession")
public class VerSession extends HttpServlet {
    private static final long serialVersionUID = 1L;
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession currentSession = (HttpSession) request.getSession();
        
        JSONObject usuario = new JSONObject();
        
        try {
            usuario
                .put("idCliente", currentSession.getAttribute("idCliente"))
//                .put("idCliente",Integer.parseInt((String) currentSession.getAttribute("idCliente")))
                .put("nombre", (String) currentSession.getAttribute("nombre"))
                .put("usuario", (String) currentSession.getAttribute("usuario"))
                .put("direccion", (String) currentSession.getAttribute("direccion"))
                .put("password", currentSession.getAttribute("password"));
        } catch(JSONException ex) {
            Logger.getLogger(VerSession.class.getName()).log(Level.SEVERE, null, ex);
        }
        
        PrintWriter pw = response.getWriter();
        pw.println(usuario.toString());
        pw.close();
    }
}
