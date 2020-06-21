/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package utn.frd.fvm.entity;

import java.io.Serializable;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author federico
 */
@Entity
@Table(name = "inversiones")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Inversion.findAll", query = "SELECT i FROM Inversion i"),
    @NamedQuery(name = "Inversion.findById", query = "SELECT i FROM Inversion i WHERE i.id = :id"),
    @NamedQuery(name = "Inversion.findByCantidadTitulos", query = "SELECT i FROM Inversion i WHERE i.cantidadTitulos = :cantidadTitulos"),
    @NamedQuery(name = "Inversion.findByIdTitulo", query = "SELECT i FROM Inversion i WHERE i.idTitulo = :idTitulo")})
public class Inversion implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "cantidadTitulos")
    private int cantidadTitulos;
    @Basic(optional = false)
    @NotNull
    @Column(name = "idTitulo")
    private int idTitulo;
    @Basic(optional = false)
    @NotNull
    @Column(name = "idCliente")
    private int idCliente;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    public Inversion() {
    }

    public Inversion(Integer id) {
        this.id = id;
    }

    public Inversion(Integer id, int cantidadTitulos, int idTitulo) {
        this.id = id;
        this.cantidadTitulos = cantidadTitulos;
        this.idTitulo = idTitulo;
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
        if (!(object instanceof Inversion)) {
            return false;
        }
        Inversion other = (Inversion) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "utn.frd.fvm.entity.Inversion[ id=" + id + " ]";
    }

    public int getCantidadTitulos() {
        return cantidadTitulos;
    }

    public void setCantidadTitulos(int cantidadTitulos) {
        this.cantidadTitulos = cantidadTitulos;
    }

    public int getIdTitulo() {
        return idTitulo;
    }

    public void setIdTitulo(int idTitulo) {
        this.idTitulo = idTitulo;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }
    
}
