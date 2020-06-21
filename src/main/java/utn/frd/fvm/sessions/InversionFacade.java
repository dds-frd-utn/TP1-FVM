/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.sessions;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import utn.frd.fvm.entity.Inversion;

/**
 *
 * @author federico
 */
@Stateless
public class InversionFacade extends AbstractFacade<Inversion> {

    @PersistenceContext(unitName = "my_persistence_unit")
    private EntityManager em;

    @Override
    public EntityManager getEntityManager() {
        return em;
    }

    public InversionFacade() {
        super(Inversion.class);
    }
    
}
