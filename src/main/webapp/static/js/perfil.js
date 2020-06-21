$(document).ready(function() {
    
    let cliente = getSession();
    
    //Muestro la informacion del cliente
    setClienteInfo(cliente);
    
    //get info de mis bonos
    getInfoBonos(cliente.idCliente);
    
    let cuentas = getCuentas(cliente.idCliente);
    //Agrego las cuentas del cliente a los desplegables
    mostrarCuentas(cuentas);
    //Agrego los bonos al desplegable
    mostrarBonos();
    
    //Gestionar cuentas
    $("#verDatosCuenta").click(function(e) {
        e.preventDefault();
        let idCuenta = $("#selectCuentasGestionarCuentas option").filter(':selected').val();
        let cuentaActual = cuentas.find(cuenta => cuenta.id == idCuenta);
        mostrarInfoCuenta(cuentaActual);
    });
    
    //Realizar transferencia
    $("#realizar").click(function(e) {
        e.preventDefault();
                
        let aliasOrigen = $('#selectCuentasTransferencia option').filter(':selected').text();
        let cuentaDestino = $("#cuentaDestino").val().toUpperCase();
        let monto = parseFloat($("#monto").val());

        if(verificarSaldo(aliasOrigen, monto)) {
            
            //
            realizarTransaccion(aliasOrigen, cuentaDestino, monto, 0);
            window.location.replace('transaccion-realizada.html');
        } else {
           $(".modal").addClass('is-active');
        }
        
    });
    
    //Realizar compra de bonos
    $("#btnComprarBonos").click(function() {
        let idOrigen = $('#selectCuentasCompraBonos option').filter(':selected').val();
        let aliasOrigen = $('#selectCuentasCompraBonos option').filter(':selected').text();
        let idBono = $("#selectBono option").filter(':selected').val();
        let cantidad = parseInt($("#cantidadBonos").val());
        console.log(typeof cantidad)
        
        
        let infoBono = getBono(idBono);
        let monto = infoBono.precioCompra * cantidad;
        if(verificarSaldo(aliasOrigen, monto)) {
            realizarTransaccion(aliasOrigen, "BANCO.FVM.BONOS", monto, 2);
            console.log(cliente.idCliente)
            registrarInversion(cantidad, idBono, cliente.idCliente);
            alert("Confirmar")
            window.location.replace('transaccion-realizada.html');
        } else {
            $(".modal").addClass('is-active');
        }
        
    });
    
    //Ver ultimos n movimientos 
    $("#verUltimosMovimientos").click(function(){
        let idCuenta = $('#selectCuentasUltMov option').filter(':selected').val();
        console.log(idCuenta)
        let cantidad = parseInt($("#cantidad").val());
        getUltimosMovimientos(idCuenta, cantidad);
    });
    
    //Botones del menu
    $(".menu-list > li").click(function() {
        let id = $(this).data("target"); //Uso el data target para saber que boton clickie
        $(".componente").hide(); //Escondo todos
        $("#"+id).show(); //Muestro el que corresponde al boton clickeado
    });
    
});

function setClienteInfo(cliente) {
    $(".id-cliente").text(cliente.idCliente);
    $(".id-usuario").text(cliente.usuario);
    $(".id-nombre").text(cliente.nombre);
    $(".id-direccion").text(cliente.direccion);
}

function getUltimosMovimientos(idCuenta, cantidad) {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/transacciones/'+idCuenta+'/ultimas/'+cantidad,
        contentType: 'application/json',
        dataType: 'json',
        type: 'get',
        success: function(movimientos) {
            for(m in movimientos) {
                let mov = movimientos[m];
                let htmlAppend = '\
                    <br><div class="card">\n\
                        <div class="card-header">\n\
                            <div class="card-header-title">Movimiento del '+mov.fecha+'</div>\n\
                        </div>\n\
                        <div class="card-content">\n\
                            <div class="content">\n\
                                <p>Origen: '+mov.aliasOrigen+'</p>\n\
                                <p>Destino: '+mov.aliasDestino+'</p>\n\
                                <p>Monto: '+mov.monto+'</p></div>\n\
                            </div>\n\
                        </div>\n\
                    </div>'
                $(".lista-ultimos-mov").append(htmlAppend);
            }
        }
    })
}

function mostrarCuentas(cuentas) {
    for(c in cuentas) { //c es el indice
        let option = new Option(cuentas[c].aliasCuenta,cuentas[c].id); 
        $(".selectCuentas").append($(option));
    }
}

function mostrarBonos() {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/bonos',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(bonos) {
            for(b in bonos) {
                let bono = bonos[b];
                let option = new Option(bono.nombre+' - $'+bono.precioCompra,bono.id); 
                $('#selectBono').append($(option));
            }
        }
    });
}

function getSession() {
    let cliente;
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/VerSession',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            cliente = data;
        },
        error: function(error) {
            console.log(error);
        }
    });
    return cliente;
}

function verificarSaldo(aliasOrigen, monto) {
    let suficiente = false;
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas/alias/'+aliasOrigen,
        type:'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(response) {
            suficiente = response.saldo >= monto;
        }
    });
    return suficiente;
}

function realizarTransaccion(aliasOrigen, aliasDestino, monto, tipo) {

    let transferencia = {
        "cuentaOrigen": aliasOrigen,
        "cuentaDestino": aliasDestino,
        "monto": monto,
        "tipoTransaccion": tipo,
        "fecha": Date.now()
    };
    
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/transacciones/realizar',
        type: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(transferencia),
        success: function() {
            console.log("Transferencia realizada");
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function getCuentas(idCliente) {
    let cuentas = new Array();
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas/clientes/'+idCliente,
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            cuentas = data;
        },
        error: function(error) {
            //console.log(error)
        }
    });
    return cuentas;
}

function getBono(idBono) {
    let bono;
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/bonos/'+idBono,
        type:'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            bono = data;
        }
    });
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
    };

    //enviar informacion mediante ajax
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas/' + cuenta.id,
        type: 'put',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(cuentaUpdated),
        async: false,
        error: function(error) {
            console.log(error);
        }

    });
}

function getCuentaDestinoByAlias(alias) {
    let cuenta;
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas/alias/' + alias,
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log(data);
            cuenta = data;
        }
    });
    return cuenta;
}

function mostrarInfoCuenta(cuenta) {
    $(".infoCuenta").removeClass('no-mostrar');
    $("#aliasCuenta").text(cuenta.aliasCuenta);
    $("#idCuenta").text('ID de la cuenta: ' + cuenta.id);
    $("#saldoCuenta").text('Saldo de la cuenta: ' + cuenta.saldo);
    $("#idCliente").text('ID del cliente: ' + cuenta.idCliente);
}

function getInfoBonos(idCliente) {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/inversiones/bonos/'+idCliente,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success: function(bonos) {
           let appendBono;
            for(i in bonos) {
                let bono = bonos[i];
                appendBono = "<tr>\n\
                    <td>"+bono.nombre+"</td>\n\
                    <td>"+bono.cantidad+"</td>\n\
                    <td>"+bono.precioCompra+"</td>\n\
                    <td>"+bono.precioPago+"</td>\n\
                    <td>"+bono.vencimiento+"</td>\n\
                    <td>"+bono.ganancia+"</td>\n\
                </tr>";
                $(".infoBonos").append(appendBono);
            }
        },
        error: function(error) {console.log(error);}
    });
}

function mostrarInfoBonos(bonos) {
   
}
    
function registrarInversion(cantidad, idBono, idCliente) {
    let inversion = {
        "cantidadTitulos": cantidad,
        "idTitulo": idBono,
        "idCliente": idCliente
    };
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/inversiones',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(inversion),
        success: function(data) {
            console.log("bono vendido");
        },
        error: function(error) {
            console.log(error);
        }
    });
}