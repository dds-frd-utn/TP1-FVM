/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.rest.services;

import java.util.List;
import javax.ejb.EJB;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import utn.frd.fvm.entity.Bonos;
import utn.frd.fvm.entity.Cuenta;
import utn.frd.fvm.sessions.BonosFacade;

/**
 *
 * @author federico
 */
@Path("/bonos")
public class BonoRest {
    @EJB
    private BonosFacade ejbBonosFacade;
    
    //Obtener todas las entidades
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Bonos> findAll() {
        return ejbBonosFacade.findAll();
    }
    
    //Crear entidades
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public void create(Bonos bono) {
        ejbBonosFacade.create(bono);
    }
    
    //Update entity
    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/{id}")
    public void edit(@PathParam("id") int id, Bonos bono) {
        ejbBonosFacade.edit(bono);
    }
    
    //Delete entity
    @DELETE
    @Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
    @Path("/{id}")
    public void remove(@PathParam("id") int id) {
        ejbBonosFacade.remove(ejbBonosFacade.find(id));
    }
    
    //Get entity by id
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Bonos findById(@PathParam("id") int id) {
        return ejbBonosFacade.find(id);
    }
}
