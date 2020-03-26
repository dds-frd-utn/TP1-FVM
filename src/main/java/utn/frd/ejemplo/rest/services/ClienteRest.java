/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.ejemplo.rest.services;
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
import utn.frd.ejemplo.entity.Cliente;
import utn.frd.ejemplo.sessions.ClienteFacade;

/**
 *
 * @author Sergio
 */
@Path("/cliente")
public class ClienteRest {
    @EJB
    private ClienteFacade ejbClienteFacade;
    
    //obtener todas las entidades
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Cliente> findAll(){
        return ejbClienteFacade.findAll();
    }
    
    //crear entidades
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public void create(Cliente cliente){
        ejbClienteFacade.create(cliente);
    }
    
    //actualizar entidades
    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/{id}")
    public void edit(@PathParam("id")long id, Cliente cliente){
        ejbClienteFacade.edit(cliente);
    }
    
    //eliminar entidades
    @DELETE
    @Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
    @Path("/{id}")
    public void remove(@PathParam("id")long id){
        ejbClienteFacade.remove( ejbClienteFacade.find(id) );
    }
    
    //obtener una entidad por id
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Cliente findById(@PathParam("id")long id){
        return ejbClienteFacade.find(id);
    }
}