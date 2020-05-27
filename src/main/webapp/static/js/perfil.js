$(document).ready(function() {
    
    let idCliente = getSession()
    
    let cuentas = getCuentas(idCliente);
    
    //Agrego las cuentas del cliente a los desplegables
    mostrarCuentas(cuentas);
        
    $("#realizar").click(function(e) {
        e.preventDefault();
        
        let cuentaOrigen = $('#cuentas option').filter(':selected').val()
        let cuentaDestino = $("#cuenta-destino").val()
        let monto = $("#monto").val()

        console.log(cuentaOrigen)
        console.log(cuentaDestino)
        console.log(monto)

        if(verificarSaldo(cuentaOrigen, monto)) {
            //Realizar transferencia
            //realizarTransferencia(cuentaOrigen, cuentaDestino, monto)
        } else {
            //Saldo insuficiente
        }
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
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/'+origen,
        type:'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
            return response.saldo >= monto
        }
    })
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
    let cuentas = [];
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/clientes/'+idCliente,
        type: 'get',
        contentType: 'appliction/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            cuentas = data
        },
        error: function(error) {
            console.log(error)
        }
    })
    return cuentas;
}

function actualizarSaldo(idCuenta, idCliente, diferencia) {

    //obtener la cuenta a actualizar
    //let cuenta = getCuentas(idCliente).filter(idCuenta)

    //actualizar datos
    let cuentaUpdated = {
        'id': idCuenta,
        'alias': cuenta['alias'],
        'saldo': cuenta['saldo'] + diferencia,
        'idCliente': idCliente
    }

    //enviar informacion mediante ajax
    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/' + idCuenta,
        type: 'put',
        contentType: 'application/json',
        dataType: 'json',
        data: cuentaUpdated,
        success: function(res) {
            console.log('cuenta actualizada: ' + res)
        },
        error: function(error) {
            console.log(error)
        }

    })
}