package utn.frd.fvm.rest.services;

import java.time.LocalDate;
import java.util.Date;
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
import utn.frd.fvm.utils.HttpConnection;
import utn.frd.fvm.entity.Transaccion;
import utn.frd.fvm.sessions.TransaccionFacade;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author federico
 */
@Path("/transacciones")
public class TransaccionRest {

    @EJB
    private TransaccionFacade ejbTransaccionFacade;
    
    //Get all entities
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public List<Transaccion> findAll(){
        return ejbTransaccionFacade.findAll();
    }
    
    //Create entities
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    public void create(Transaccion transaccion) {
        ejbTransaccionFacade.create(transaccion);
    }
    
    //Update entities
    @PUT
    @Consumes({MediaType.APPLICATION_JSON})
    @Path("/{id}")
    public void edit(@PathParam("id") int id,Transaccion transaccion) {
        ejbTransaccionFacade.edit(transaccion);
    }
    
    //Delete entity
    @DELETE
    @Consumes({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
    @Path("/{id}")
    public void remove(@PathParam("id")int id){
        ejbTransaccionFacade.remove(ejbTransaccionFacade.find(id));
    }
    
    //Get entity by id
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    @Path("/{id}")
    public Transaccion findById(@PathParam("id")int id){
        return ejbTransaccionFacade.find(id);
    }
    
    //Transfer money to account
    @POST
    @Consumes({MediaType.APPLICATION_JSON})
    @Produces({MediaType.TEXT_PLAIN})
    @Path("/realizar")
    public String realizarTransaccion(String transaccion) {
        JSONObject transaccionJson = new JSONObject(transaccion);

        //Obtengo las cuentas involucradas
        HttpConnection con = new HttpConnection();
        String origenString = con.httpRequest(con.getURL()+"cuentas/alias/"+transaccionJson.getString("cuentaOrigen"), "GET", new JSONObject());
        String destinoString = con.httpRequest(con.getURL()+"cuentas/alias/"+transaccionJson.getString("cuentaDestino"), "GET", new JSONObject());
        
        JSONObject origen = new JSONObject(origenString);
        JSONObject destino = new JSONObject(destinoString);
        
        JSONObject response = new JSONObject();
        response.put("error_code", 0);

        //Verifico si el origen tiene saldo suficiente
        if(origen.getInt("saldo") > transaccionJson.getInt("monto")) {
            //Veo el tipo de transaccion
            float monto = transaccionJson.getInt("monto");
            switch(transaccionJson.getInt("tipoTransaccion")) {
                case 0: //Transferencia
                    response.put("descripcion", "Transferencia Realizada");
                    break;
                case 1: //Compra - Venta (Impuestos)
                    float impuesto = 1.05f;
                    monto = transaccionJson.getInt("monto") * impuesto;
                    response.put("descripcion", "Compra/Venta Realizada");
                    break;
                case 2: //Compra de bonos
                    response.put("descripcion", "Compra de bonos realizada");
                    break;
            }
            
            //Realizo la transaccion
            int cuentaOrigen = origen.getInt("id");
            int cuentaDestino = destino.getInt("id");
            float montoTotal = monto;
            int tipoTransaccion = transaccionJson.getInt("tipoTransaccion");
            LocalDate localDate = LocalDate.now();
            Date fecha = java.sql.Date.valueOf(localDate);
            Transaccion transaccionObject = new Transaccion(cuentaOrigen,cuentaDestino,montoTotal,tipoTransaccion,fecha);
            ejbTransaccionFacade.create(transaccionObject);
            
            //Actualizo los saldos de las cuentas
            
            float nuevoSaldoOrigen = origen.getInt("saldo") - montoTotal;
            float nuevoSaldoDestino = destino.getInt("saldo") + monto;
            origen.put("saldo", nuevoSaldoOrigen);
            destino.put("saldo", nuevoSaldoDestino);
            
            con.httpRequest(con.getURL()+"cuentas/"+origen.getInt("id"), "PUT", origen);
            con.httpRequest(con.getURL()+"cuentas/"+destino.getInt("id"), "PUT", destino);
            
        } else {
            response.put("error_code", 1).put("descripcion", "Saldo insuficiente");
            return response.toString();
        }
        return response.toString();
    }
    
    //Ultimas transacciones realizadas
    @Path("/{idCuenta}/ultimas/{cantidad}")
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public String getUltimasTransacciones(@PathParam("idCuenta") int id, @PathParam("cantidad") int cantidad) {
        String superQuery = "SELECT t.fecha, t.monto, co.aliasCuenta, cd.aliasCuenta, t.cuentaOrigen FROM Transaccion t"
                + " LEFT JOIN Cuenta co on t.cuentaOrigen=co.id"
                + " LEFT JOIN Cuenta cd on t.cuentaDestino=cd.id"
                + " WHERE t.cuentaOrigen="+id+" OR t.cuentaDestino="+id
                + " ORDER BY t.fecha DESC";
        Query query = ejbTransaccionFacade.getEntityManager().createQuery(superQuery);
        query.setMaxResults(cantidad);
        List<Object[]> ultimas = query.getResultList(); //me devuelve un [Ljava.lang.Object

        JSONArray jsonArray = new JSONArray();
        JSONObject jsonElement;

          for(Object[] item : ultimas) {
              jsonElement = new JSONObject();
              jsonElement
                        .put("fecha", item[0])
                        .put("monto", item[1])
                        .put("aliasOrigen", item[2])
                        .put("aliasDestino", item[3])
                        .put("idOrigen", item[4]);
              jsonArray.put(jsonElement);
          }

        return jsonArray.toString();
    }
}