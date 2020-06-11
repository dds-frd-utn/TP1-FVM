/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.utils;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;

/**
 *
 * @author federico
 */
@WebServlet("/CrearSession")
public class CrearSession extends HttpServlet {
    private static final long serialVersionUID = 1L;
    @Consumes({MediaType.APPLICATION_JSON})
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        HttpSession currentSession = request.getSession(true);
        
        String idCliente = request.getParameter("id");
        String nombre = request.getParameter("nombre");
        String usuario = request.getParameter("usuario");
        String direccion = request.getParameter("direccion");
        String password = request.getParameter("password");
        
        currentSession.setAttribute("idCliente", idCliente);
        currentSession.setAttribute("nombre", nombre);
        currentSession.setAttribute("usuario", usuario);
        currentSession.setAttribute("direccion", direccion);
        currentSession.setAttribute("password", password);
        
    }
}
