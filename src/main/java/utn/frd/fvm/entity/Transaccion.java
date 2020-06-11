/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

/**
 *
 * @author federico
 */
@Entity
@Table(name = "transacciones")
@NamedQueries({
    @NamedQuery(name = "Transaccion.findAll", query = "SELECT t FROM Transaccion t"),
    @NamedQuery(name = "Transaccion.findById", query = "SELECT t FROM Transaccion t WHERE t.id = :id"),
    @NamedQuery(name = "Transaccion.findByCuentaOrigen", query = "SELECT t FROM Transaccion t WHERE t.cuentaOrigen = :cuentaOrigen"),
    @NamedQuery(name = "Transaccion.findByCuentaDestino", query = "SELECT t FROM Transaccion t WHERE t.cuentaDestino = :cuentaDestino"),
    @NamedQuery(name = "Transaccion.findByMonto", query = "SELECT t FROM Transaccion t WHERE t.monto = :monto"),
    @NamedQuery(name = "Transaccion.findByTipoTransaccion", query = "SELECT t FROM Transaccion t WHERE t.tipoTransaccion = :tipoTransaccion"),
    @NamedQuery(name = "Transaccion.findByFecha", query = "SELECT t FROM Transaccion t WHERE t.fecha = :fecha")})
public class Transaccion implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "cuentaOrigen")
    private int cuentaOrigen;
    @Basic(optional = false)
    @NotNull
    @Column(name = "cuentaDestino")
    private int cuentaDestino;
    @Basic(optional = false)
    @NotNull
    @Column(name = "monto")
    private float monto;
    @Basic(optional = false)
    @NotNull
    @Column(name = "tipoTransaccion")
    private int tipoTransaccion;
    @Basic(optional = false)
    @NotNull
    @Column(name = "fecha")
    @Temporal(TemporalType.DATE)
    private Date fecha;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    public Transaccion() {
    }

    public Transaccion(Integer id) {
        this.id = id;
    }

    public Transaccion(int cuentaOrigen, int cuentaDestino, float monto, int tipoTransaccion, Date fecha) {
        this.cuentaOrigen = cuentaOrigen;
        this.cuentaDestino = cuentaDestino;
        this.monto = monto;
        this.tipoTransaccion = tipoTransaccion;
        this.fecha = fecha;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }
    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Transaccion)) {
            return false;
        }
        Transaccion other = (Transaccion) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }
    @Override
    public String toString() {
        return "utn.frd.fvm.entity.Transaccion[ id=" + id + " ]";
    }

    public int getCuentaOrigen() {
        return cuentaOrigen;
    }

    public void setCuentaOrigen(int cuentaOrigen) {
        this.cuentaOrigen = cuentaOrigen;
    }

    public int getCuentaDestino() {
        return cuentaDestino;
    }

    public void setCuentaDestino(int cuentaDestino) {
        this.cuentaDestino = cuentaDestino;
    }

    public float getMonto() {
        return monto;
    }

    public void setMonto(float monto) {
        this.monto = monto;
    }

    public int getTipoTransaccion() {
        return tipoTransaccion;
    }

    public void setTipoTransaccion(int tipoTransaccion) {
        this.tipoTransaccion = tipoTransaccion;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }
    
}
