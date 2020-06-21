/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.rest.services;
import java.util.List;
import javax.ejb.EJB;
import javax.persistence.NoResultException;
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
import utn.frd.fvm.entity.Cliente;
import utn.frd.fvm.sessions.ClienteFacade;

/**
 *
 * @author federico
 */
@Path("/clientes")
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
    public void edit(@PathParam("id")int id, Cliente cliente){
        ejbClienteFacade.edit(cliente);
    }
    
    //eliminar entidades
    @DELETE
    @Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
    @Path("/{id}")
    public void remove(@PathParam("id")int id){
        ejbClienteFacade.remove( ejbClienteFacade.find(id) );
    }
    
    //obtener una entidad por id
    @GET
    @Path("/{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public Cliente findById(@PathParam("id")int id){
        return ejbClienteFacade.find(id);
    }
    
        //login
    @POST
    @Path("/login")
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.TEXT_PLAIN})
    public String login(String request) throws JSONException {
        JSONObject jsonResponse = new JSONObject();
        
        try {
            JSONObject jsonRequest = new JSONObject(request);
            String usuario = jsonRequest.get("usuario").toString();
            String password = jsonRequest.get("password").toString();
            Query query =  ejbClienteFacade.getEntityManager().createQuery("SELECT c from Cliente c WHERE c.usuario='"+usuario+"' AND c.password = '"+password+"'");
            Cliente result = (Cliente) query.getSingleResult();
            
            jsonResponse
                .put("id", result.getId())
                .put("usuario",usuario)
                .put("nombre", result.getNombre())
                .put("direccion", result.getDireccion())
                .put("password",password)
                .put("error_code", 0);
            
            return jsonResponse.toString();
        } catch(NoResultException e) {
            jsonResponse.put("error_code", "1");
            return jsonResponse.toString();
            
        }
    }
}