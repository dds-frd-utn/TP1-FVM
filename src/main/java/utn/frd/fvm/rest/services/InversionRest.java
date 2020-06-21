/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.rest.services;

import java.util.List;
import javax.ejb.EJB;
import javax.persistence.Query;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.json.JSONArray;
import org.json.JSONObject;
import utn.frd.fvm.entity.Inversion;
import utn.frd.fvm.sessions.InversionFacade;
import utn.frd.fvm.utils.HttpConnection;

/**
 *
 * @author federico
 */
@Path("/inversiones")
public class InversionRest {
    @EJB
    private InversionFacade ejbInversionFacade;
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Inversion> findAll() {
        return ejbInversionFacade.findAll();
    }
    
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public void create(Inversion inversion) {
        ejbInversionFacade.create(inversion);
    }
    
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("/bonos/{idCliente}")
    public String getInfoBonos(@PathParam("idCliente") int idCliente) {
        
        //HttpConnection con = new HttpConnection();
        //String cliente = con.httpRequest(con.getURL()+"clientes/"+idCliente, "GET", new JSONObject());
        
        String consulta = "SELECT b.nombre, i.cantidadTitulos, b.precioCompra, b.precioPago, b.vencimiento"
                + " FROM Inversion i "
                + " LEFT JOIN Bonos b on b.id=i.idTitulo"
                + " WHERE i.idCliente="+idCliente;
        Query query = ejbInversionFacade.getEntityManager().createQuery(consulta);
        List<Object[]> listaInversiones = query.getResultList();
        
        JSONArray jsonArray = new JSONArray();
        JSONObject jsonElement;
        
        for(Object[] item: listaInversiones) {
            int compra = Integer.parseInt(item[2].toString());
            int venta = Integer.parseInt(item[3].toString());
            int cantidad = Integer.parseInt(item[1].toString());
            int ganancia = cantidad*(venta-compra);
            jsonElement = new JSONObject();
            jsonElement
                    .put("nombre", item[0])
                    .put("cantidad", item[1])
                    .put("precioCompra", item[2])
                    .put("precioPago", item[3])
                    .put("vencimiento", item[4])
                    .put("ganancia", ganancia);
            jsonArray.put(jsonElement);
        }
        
        return jsonArray.toString();
    }
}
