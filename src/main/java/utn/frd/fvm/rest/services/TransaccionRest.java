package utn.frd.fvm.rest.services;

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
        int cuentaOrigen = transaccionJson.getInt("cuenta_origen");
        int cuentaDestino = transaccionJson.getInt("cuenta_destino");
        int tipoTransaccion = transaccionJson.getInt("tipo_transaccion");
        float monto = transaccionJson.getFloat("monto");
        Date fecha = new Date();
        
        //Transaccion a realizar
        Transaccion transaccionObject = new Transaccion(cuentaOrigen,cuentaDestino,monto,tipoTransaccion,fecha);

        HttpConnection req = new HttpConnection();

        //Datos de cuentas emisora y receptora
        String datosOrigen = req.httpRequest("http://localhost:8080/Banco-FVM/rest/cuentas/"+cuentaOrigen,"GET",new JSONObject());
        String datosDestino = req.httpRequest("http://localhost:8080/Banco-FVM/rest/cuentas/"+cuentaDestino,"GET",new JSONObject());
        
        //Verificar que el emisor tenga fondos suficientes
        JSONObject resJsonOrigen = new JSONObject(datosOrigen);
        JSONObject resJsonDestino = new JSONObject(datosDestino);
        int saldoDisponible = resJsonOrigen.getInt("saldo");
        
        if (saldoDisponible >= monto) {
            float impuesto = 0.1f;
            switch(tipoTransaccion) {
                case 0: //Transferencia entre pares (no es compra/venta)
                    //Se deduce el monto de la cuenta del emisor y se añade a la del receptor
                    float newSaldoOrigen = resJsonOrigen.getFloat("saldo")-monto;
                    float newSaldoDestino = resJsonDestino.getFloat("saldo")+monto;
                    
                    JSONObject newOrigen = new JSONObject();
                    newOrigen.put("id", resJsonOrigen.getInt("id"));
                    newOrigen.put("cbu", resJsonOrigen.getInt("cbu"));
                    newOrigen.put("idCliente", resJsonOrigen.getInt("idCliente"));
                    newOrigen.put("saldo", newSaldoOrigen);
                    
                    
                    req.httpRequest("http://localhost:8080/Banco-FVM/rest/cuentas/"+cuentaOrigen, "PUT", newOrigen);
//                    req.httpRequest("http://localhost:8080/Banco-FVM/rest/cuentas/"+cuentaDestino, "PUT", newDestino);
                    ejbTransaccionFacade.create(transaccionObject);
                    return "Transferencia completada";
                case 1: //compra - venta
                case 2:
                    break;
                case 3: //Pago por celular
                    break;
                case 4: //Compra de bonos
            }
        } else {
            return "Saldo insuficiente";
        }
        
        return "Saldo disponible: " + saldoDisponible;
    }
    
    //Ultimas transacciones realizadas
    @Path("/ultimas/{idCuenta}/{cantidad}")
    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public String getUltimasTransacciones(@PathParam("idCuenta") int id, @PathParam("cantidad") int cantidad) {
        //Filtrar las transacciones por su idCuenta
        Query query = ejbTransaccionFacade.getEntityManager().createQuery("SELECT c from Transaccion c WHERE c.cuentaOrigen = "+id+" OR c.cuentaDestino = "+id+" ORDER BY c.fecha DESC");
        query.setMaxResults(cantidad);
        List<Transaccion> ultimas = query.getResultList();

        JSONObject jsonArray = new JSONObject();
        JSONObject jsonElement;

        for(Transaccion t : ultimas){
            jsonElement = new JSONObject()
                    .put("id", t.getId())
                    .put("cuentaOrigen",t.getCuentaOrigen())
                    .put("cuentaDestino", t.getCuentaDestino())
                    .put("monto", t.getMonto())
                    .put("fecha",t.getFecha())
                    .put("tipoTransaccion", t.getTipoTransaccion())
                    ;
            jsonArray.put(String.valueOf(t.getId()), jsonElement);
        }

        return jsonArray.toString();
    }
}