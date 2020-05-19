$("#realizar").click(function(e) {
    e.preventDefault();

    getCuentasCliente(idCliente);

    let cuentaOrigen = null;
    let cuentaDestino = $("#cuenta-destino").val()
    let monto = $("#monto").val()

    if(verificarSaldo(cuentaOrigen, monto)) {
        //Realizar transferencia
        realizarTransferencia(cuentaOrigen, cuentaDestino, monto)
    } else {
        //Saldo insuficiente
    }
})

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
        error: function(erro) {
            console.log(erro)
        }
    })
}

function getCuentasCliente(idCliente) {

    $.ajax({
        url: 'http://localhost:8080/Banco-FVM/rest/cuentas/'+idCliente,
        type: 'get',
        contentType: 'appliction/json',
        dataType: 'json',
        success: function(res) {
            return res
        },
        error: function(error) {
            console.log(error)
        }
    })

}