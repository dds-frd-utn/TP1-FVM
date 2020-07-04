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
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import org.json.JSONArray;
import org.json.JSONObject;
import utn.frd.fvm.entity.Cuenta;
import utn.frd.fvm.sessions.CuentaFacade;

/**
 *
 * @author federico
 */
@Path("/cuentas")
public class CuentaRest {
    @EJB
    private CuentaFacade ejbCuentaFacade;
    
    //Get all instances
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Cuenta> findAll() {
        return ejbCuentaFacade.findAll();
    }
    
    //Create entity
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public void create(Cuenta cuenta) {
        ejbCuentaFacade.create(cuenta);
    }
    
    //Update entity
    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/{id}")
    public void edit(@PathParam("id") int id, Cuenta cuenta) {
        ejbCuentaFacade.edit(cuenta);
    }
    
    //Delete entity
    @DELETE
    @Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
    @Path("/{id}")
    public void remove(@PathParam("id") int id) {
        ejbCuentaFacade.remove(ejbCuentaFacade.find(id));
    }
    
    //Get entity by id
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Cuenta findById(@PathParam("id") int id) {
        return ejbCuentaFacade.find(id);
    }

    //Get entity by aliasCuenta
    @GET
    @Path("/alias/{aliasCuenta}")
    @Produces({MediaType.APPLICATION_JSON})
    public Cuenta findByAliasCuenta(@PathParam("aliasCuenta") String aliasCuenta) {
        List<Cuenta> query = ejbCuentaFacade.getEntityManager().createNamedQuery("Cuenta.findByAliasCuenta", Cuenta.class)
        .setParameter("aliasCuenta", aliasCuenta)
        .getResultList();
        return query.isEmpty() ? null : query.get(0);
        //Uso getResultList y no getSingleResult para poder devolver null en caso de que falle, y evitar una exception
    }
    
    //Get all clienteId cuentas
    @GET
    @Path("/clientes/{idCliente}")
    @Produces({MediaType.APPLICATION_JSON})
    public String findByIdCliente(@PathParam("idCliente") int idCliente) {
        
        Query query = ejbCuentaFacade.getEntityManager().createQuery("SELECT c from Cuenta c WHERE c.idCliente = "+idCliente);
        List<Cuenta> cuentas = query.getResultList();
        
        JSONArray jsonArray = new JSONArray();
        for (int i = 0; i < cuentas.size(); i++){
            JSONObject myJsonObject = new JSONObject();
            myJsonObject.put("id", cuentas.get(i).getId());
            myJsonObject.put("aliasCuenta", cuentas.get(i).getAliasCuenta());
            myJsonObject.put("saldo", cuentas.get(i).getSaldo());
            myJsonObject.put("idCliente", cuentas.get(i).getIdCliente());
            jsonArray.put(myJsonObject);
        }
        
        return jsonArray.toString();
    }
    
}
