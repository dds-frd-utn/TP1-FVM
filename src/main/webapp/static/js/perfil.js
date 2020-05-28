$(document).ready(function() {
    
    let idCliente = getSession()
    
    let cuentas = getCuentas(idCliente);
    //Agrego las cuentas del cliente a los desplegables
    mostrarCuentas(cuentas);
        
    $("#realizar").click(function(e) {
        e.preventDefault();
                
        let cuentaOrigen = $('#cuentas option').filter(':selected').val()
        let cuentaDestino = $("#cuenta-destino").val()
        let monto = parseFloat($("#monto").val())

         let cuentaActual = cuentas.find(cuenta => cuenta.id == cuentaOrigen)
        
        if(verificarSaldo(cuentaOrigen, monto)) {
            //Realizar transferencia
            realizarTransferencia(cuentaOrigen, cuentaDestino, monto)
            
            //Actualizar saldos de las cuentas involucradas
            actualizarSaldo(cuentaActual, -monto)
            let cDestino = getCuentaDestino(cuentaDestino)
            actualizarSaldo(cDestino, monto)
        } else {
            //Saldo insuficiente
            alert('Saldo insuficiente')
        }
        window.location.replace('transaccion-realizada.html')
    });
})

function mostrarCuentas(cuentas) {
    for(c in cuentas) { //c es el indice
        let option = new Option(cuentas[c].aliasCuenta,cuentas[c].id); 
        $('#cuentas,#cuentasBonos').append($(option));
    }
}

function getSession() {
    let id = 0;
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/VerSession',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            id = data.idCliente
        },
        error: function(error) {
            console.log(error)
        }
    })
    return id;
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

function getCuentaDestino(idCuenta) {
    let cuenta;
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/' + idCuenta,
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