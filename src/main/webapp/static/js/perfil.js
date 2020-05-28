$(document).ready(function() {
    
    let cliente = getSession()
    
    $(".id-cliente").text(cliente.idCliente)
    $(".id-usuario").text(cliente.usuario)
    $(".id-nombre").text(cliente.nombre)
    $(".id-direccion").text(cliente.direccion)
    
    let cuentas = getCuentas(cliente.idCliente);
    //Agrego las cuentas del cliente a los desplegables
    mostrarCuentas(cuentas);
    
    $("#realizar").click(function(e) {
        e.preventDefault();
                
        let cuentaOrigen = $('#cuentas option').filter(':selected').val()
        let cuentaDestino = $("#cuenta-destino").val().toUpperCase()
        let monto = parseFloat($("#monto").val())

         let cuentaActual = cuentas.find(cuenta => cuenta.id == cuentaOrigen)
        
        if(verificarSaldo(cuentaOrigen, monto)) {
            //Realizar transferencia
            realizarTransferencia(cuentaOrigen, cuentaDestino, monto)
            
            //Actualizar saldos de las cuentas involucradas
            actualizarSaldo(cuentaActual, -monto)
            let cDestino = getCuentaDestino(cuentaDestino)
            actualizarSaldo(cDestino, monto)
            window.location.replace('transaccion-realizada.html')
        } else {
           $(".modal").addClass('is-active')
        }
        
    });
    
    $("#btn-transferencia").click(function() {
        $("#transferencia").removeClass('no-mostrar')
        $("#bonos").addClass('no-mostrar')
    })
    
    $("#btn-bonos").click(function() {
        $("#bonos").removeClass('no-mostrar')
        $("#transferencia").addClass('no-mostrar')
    })
    
})

function mostrarCuentas(cuentas) {
    for(c in cuentas) { //c es el indice
        let option = new Option(cuentas[c].aliasCuenta,cuentas[c].id); 
        $('#cuentas,#cuentasBonos').append($(option));
    }
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

function realizarTransferencia(origen, destino, monto) {

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