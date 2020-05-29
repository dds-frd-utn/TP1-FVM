$(document).ready(function() {
    
    let cliente = getSession()
    
    //Muestro la informacion del cliente
    setClienteInfo(cliente)
    
    let cuentas = getCuentas(cliente.idCliente);
    //Agrego las cuentas del cliente a los desplegables
    mostrarCuentas(cuentas);
    //Agrego los bonos al desplegable
    mostrarBonos()
    
    //Realizar transferencia
    $("#realizar").click(function(e) {
        e.preventDefault();
                
        let cuentaOrigen = $('#cuentas option').filter(':selected').val()
        let cuentaDestino = $("#cuenta-destino").val().toUpperCase()
        let monto = parseFloat($("#monto").val())

         let cuentaActual = cuentas.find(cuenta => cuenta.id == cuentaOrigen)
        
        if(verificarSaldo(cuentaOrigen, monto)) {
            //Realizar transferencia
            realizarTransaccion(cuentaOrigen, cuentaDestino, monto)
            
            //Actualizar saldos de las cuentas involucradas
            actualizarSaldo(cuentaActual, -monto)
            let cDestino = getCuentaDestino(cuentaDestino)
            actualizarSaldo(cDestino, monto)
            window.location.replace('transaccion-realizada.html')
        } else {
           $(".modal").addClass('is-active')
        }
        
    });
    
    //Realizar compra de bonos
    $("#comprarBonos").click(function() {
        let cuentaOrigen = $('#selectCuentaBono option').filter(':selected').val()
        let idBono = $("#selectBono option").filter(':selected').val()
        let cantidad = $("#cantidadBonos").val()
        
        let cuentaActual = cuentas.find(cuenta => cuenta.id == cuentaOrigen)
        
        let infoBono = getBono(idBono)
        let monto = infoBono.precioCompra * cantidad
        if(verificarSaldo(cuentaOrigen, monto)) {
            realizarTransaccion(cuentaOrigen, 0, monto)
            
            actualizarSaldo(cuentaActual, -monto)
            window.location.replace('transaccion-realizada.html')
        } else {
            $(".modal").addClass('is-active')
        }
        
    })
    
    //Ver ultimos n movimientos 
    $("#verUltimosMovimientos").click(function(){
        let idCuenta = $('#ultimosMovSelect option').filter(':selected').val()
        console.log(idCuenta)
        let cantidad = parseInt($("#cantidad").val())
        getUltimosMovimientos(idCuenta, cantidad)
    })
    
    //Botones del menu lateral
    $("#btn-transferencia").click(function() {
        $("#transferencia").removeClass('no-mostrar')
        $("#ultimos-movimientos").addClass('no-mostrar')
        $("#bonos").addClass('no-mostrar')
    })
    
    $("#btn-bonos").click(function() {
        $("#bonos").removeClass('no-mostrar')
        $("#ultimos-movimientos").addClass('no-mostrar')
        $("#transferencia").addClass('no-mostrar')
    })
    
    $("#btn-ultimos-movimientos").click(function() {
        $("#ultimos-movimientos").removeClass('no-mostrar')
        $("#bonos").addClass('no-mostrar')
        $("#transferencia").addClass('no-mostrar')
    })
    
})

function setClienteInfo(cliente) {
    $(".id-cliente").text(cliente.idCliente)
    $(".id-usuario").text(cliente.usuario)
    $(".id-nombre").text(cliente.nombre)
    $(".id-direccion").text(cliente.direccion)
}

function getUltimosMovimientos(idCuenta, cantidad) {
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/transacciones/ultimas/'+idCuenta+'/'+cantidad,
        contentType: 'application/json',
        dataType: 'json',
        type: 'get',
        success: function(movimientos) {
            for(m in movimientos) {
                let mov = movimientos[m]
                console.log(mov.fecha)
                let htmlAppend = '\
                    <br><div class="card">\n\
                        <div class="card-header">\n\
                            <div class="card-header-title">Movimiento del '+mov.fecha+'</div>\n\
                        </div>\n\
                        <div class="card-content">\n\
                            <div class="content">\n\
                                <p>Origen: '+mov.cuentaOrigen+'</p>\n\
                                <p>Destino: '+mov.cuentaDestino+'</p>\n\
                                <p>Monto: '+mov.monto+'</p></div>\n\
                            </div>\n\
                        </div>\n\
                    </div>'
                $(".lista-ultimos-mov").append(htmlAppend)
            }
        }
    })
}

function mostrarCuentas(cuentas) {
    for(c in cuentas) { //c es el indice
        let option = new Option(cuentas[c].aliasCuenta,cuentas[c].id); 
        $('#cuentas,#selectCuentaBono,#ultimosMovSelect').append($(option));
    }
}

function mostrarBonos() {
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/bonos',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(bonos) {
            for(b in bonos) {
                let bono = bonos[b]
                let option = new Option(bono.nombre+' - $'+bono.precioCompra,bono.id); 
                $('#selectBono').append($(option));
            }
        }
    })
}

function getSession() {
    let cliente;
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/VerSession',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            cliente = data
        },
        error: function(error) {
            console.log(error)
        }
    })
    return cliente;
}

function verificarSaldo(origen, monto) {
    let suficiente = false
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/'+origen,
        type:'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(response) {
            suficiente = response.saldo >= monto
        }
    })
    return suficiente
}

function realizarTransaccion(origen, destino, monto) {

    let transferencia = {
        "cuentaOrigen": origen,
        "cuentaDestino": destino,
        "monto": monto,
        "tipoTransaccion": 0,
        "fecha": new Date(),
    }
    
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/transacciones/realizar',
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(transferencia),
        success: function(res) {
            console.log("Transferencia realizada")
        },
        error: function(error) {
            console.log(error)
        }
    })
}

function getCuentas(idCliente) {
    let cuentas = new Array()
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/clientes/'+idCliente,
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            cuentas = data
        },
        error: function(error) {
            //console.log(error)
        }
    })
    return cuentas;
}

function getBono(idBono) {
    let bono;
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/bonos/'+idBono,
        type:'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            bono = data
        }
    })
    return bono;
}

function actualizarSaldo(cuenta, diferencia) {
    let nuevoSaldo = cuenta.saldo + diferencia;
    //actualizar datos
    let cuentaUpdated = {
        'id': cuenta.id,
        'aliasCuenta': cuenta.aliasCuenta,
        'saldo': nuevoSaldo,
        'idCliente': cuenta.idCliente
    }

    //enviar informacion mediante ajax
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/' + cuenta.id,
        type: 'put',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(cuentaUpdated),
        async: false,
        error: function(error) {
            console.log(error)
        }

    })
}

function getCuentaDestino(alias) {
    let cuenta;
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/alias/' + alias,
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log(data)
            cuenta = data
        }
    })
    return cuenta;
}