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
import org.json.JSONException;
import org.json.JSONObject;
import utn.frd.fvm.entity.Cuenta;
import utn.frd.fvm.sessions.CuentaFacade;

/**
 *
 * @author federico
 */
@Path("cuentas")
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
    
}
