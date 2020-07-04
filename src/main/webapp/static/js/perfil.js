$(document).ready(function() {
    
    $.ajax({
        url:'http://localhost:8080/TP1-FVM/VerSession',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(cliente) {
            
            if(cliente.idCliente) {
            
                //Muestro la informacion del cliente
                setClienteInfo(cliente);

                //set bonos del cliente
                setBonosCliente(cliente.idCliente);

                //Get cuentas para los desplegables
                setSelectCuentas(cliente.idCliente);

                //Get bonso para los desplegables
                setSelectBonos();

                $(".logout").click(function(e) {
                    e.preventDefault();
                    console.log('pasa')
                    logout();
                });

                //Gestionar cuentas
                $("#verDatosCuenta").click(function(e) {
                    e.preventDefault();
                    let idCuenta = $("#selectCuentasGestionarCuentas option").filter(':selected').val();
                    mostrarInfoCuenta(idCuenta);
                });
                
                //Nueva cuenta bancaria
                $("#btnNuevaCuentaBancaria").click(function(e) {
                    e.preventDefault();
                    $(".nuevaCuenta").show();
                    $(".btnNuevaCuentaBancaria").hide();
                    $(".cuentasActivas").hide();
                });

                //Realizar transferencia
                $("#realizar").click(function(e) {
                    e.preventDefault();

                    let aliasOrigen = $('#selectCuentasTransferencia option').filter(':selected').text();
                    let cuentaDestino = $("#cuentaDestino").val().toUpperCase();
                    let monto = parseFloat($("#monto").val());

                    realizarTransaccion(aliasOrigen, cuentaDestino, monto, 0);

                });

                //Realizar compra de bonos
                $("#btnComprarBonos").click(function() {
                    let idOrigen = $('#selectCuentasCompraBonos option').filter(':selected').val();
                    let aliasOrigen = $('#selectCuentasCompraBonos option').filter(':selected').text();

                    let idBono = $("#selectBono option").filter(':selected').val();
                    let cantidad = parseInt($("#cantidadBonos").val());

                    let infoBono = getBono(idBono);
                    let monto = infoBono.precioCompra * cantidad;

                    realizarTransaccionBonos(aliasOrigen, "BANCO.FVM.BONOS", monto, 2, cantidad, idBono, cliente.idCliente);

                });

                //Ver ultimos n movimientos 
                $("#verUltimosMovimientos").click(function(){
                    let idCuenta = $('#selectCuentasUltMov option').filter(':selected').val();
                    let cantidad = parseInt($("#cantidad").val());
                    getUltimosMovimientos(idCuenta, cantidad);
                });
                
                //Abrir cuenta bancaria
                $("#btnAbrirCuentaBancaria").click(function() {
                    let alias = $("#alias").val();
                    let saldo = parseFloat($("#saldo").val());
                    console.log("alias: " + alias);
                    console.log("saldo: " + saldo + " " + typeof saldo);
                    abrirCuentaBancaria(alias, saldo, cliente.idCliente);
                    $(".nuevaCuenta").hide();
                    $(".btnNuevaCuentaBancaria").show();
                    $(".cuentasActivas").show();
                });

                //Botones del menu
                $(".menu-list > li").click(function() {
                    let id = $(this).data("target"); //Uso el data target para saber que boton clickie
                    $(".componente").hide(); //Escondo todos
                    $("#"+id).slideDown(600); //Muestro el que corresponde al boton clickeado
                });
            } else {
                window.location = 'login.html';
            }
        },
        error: function(error) {
            console.log(error);
        },
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
            $(".lista-ultimos-mov").html(""); //Vacio la lista primero
            for(m in movimientos) {
                let mov = movimientos[m];
                let htmlAppend = '\
                    <br><div class="card">\n\
                        <div class="card-header">\n\
                            <div class="card-header-title">Movimiento del '+formatDate(mov.fecha)+'</div>\n\
                        </div>\n\
                        <div class="card-content">\n\
                            <div class="content">\n\
                                <p>Origen: '+mov.aliasOrigen+'</p>\n\
                                <p>Destino: '+mov.aliasDestino+'</p>\n\
                                <p>Monto: $'+mov.monto+'</p></div>\n\
                            </div>\n\
                        </div>\n\
                    </div>'
                $(".lista-ultimos-mov").append(htmlAppend);
            }
        }
    })
}

function setSelectBonos() {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/bonos',
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(bonos) {
            let b;
            for(b in bonos) {
                let bono = bonos[b];
                let option = new Option(bono.nombre+' - $'+bono.precioCompra,bono.id); 
                $('#selectBono').append($(option));
            }
        }
    });
}

function logout() {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/logout',
        type: 'get',
        success: function() {
            window.location = "login.html";
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function getSession() {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/VerSession',
        type: 'get',
        dataType: 'xml',
        success: function(data) {
            cliente = data;
        },
        error: function(error) {
            console.log(error);
        }
    });
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
        success: function(response) {
            console.log(response);
            $(".modal").addClass('is-active');
            $(".modal-content").text(response.descripcion);
            if(response.error_code === 1) { //Saldo insuficiente
                $(".modal-content").css('color','#c8102e');
            } else {
                $(".modal-content").css('color', '#00c853')
                getUltimosMovimientos(0,0);
            }
        },
        error: function(error) {
            console.log("ERROR" + error);
        }
    });
}

function realizarTransaccionBonos(aliasOrigen, aliasDestino, monto, tipo, cantidad, idBono, idCliente) {

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
        success: function(response) {
            console.log(response);
            $(".modal").addClass('is-active');
            $(".modal-content").text(response.descripcion);
            if(response.error_code === 1) { //Saldo insuficiente
                $(".modal-content").css('color','#c8102e');
                console.log("ALGO")
            } else {
                $(".modal-content").css('color', '#00c853')
                registrarInversion(cantidad, idBono, idCliente);
                getUltimosMovimientos(0,0);
            }
        },
        error: function(error) {
            console.log("ERROR" + error);
        }
    });
}

function setSelectCuentas(idCliente) {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas/clientes/'+idCliente,
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(cuentas) {
            let c;
            for(c in cuentas) { //c es el indice
                let option = new Option(cuentas[c].aliasCuenta,cuentas[c].id); 
                $(".selectCuentas").append($(option));
            }
        },
        error: function(error) {
            console.log("ERROR" + error);
        }
    });
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

function mostrarInfoCuenta(idCuenta) {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas/'+idCuenta,
        type: 'get',
        contentType: 'application/json',
        dataType: 'json',
        success: function(cuenta) {
            $(".infoCuenta").removeClass('no-mostrar');
            $("#aliasCuenta").text(cuenta.aliasCuenta);
            $("#idCuenta").text('ID de la cuenta: ' + cuenta.id);
            $("#saldoCuenta").text('Saldo de la cuenta: $' + cuenta.saldo);
            $("#idCliente").text('ID del cliente: ' + cuenta.idCliente);
        },
        error: function(error) {
            console.log("ERROR: " + error);
        }
    });
}

function setBonosCliente(idCliente) {
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/inversiones/bonos/'+idCliente,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success: function(bonos) {
            let appendBono;
            for(i in bonos) {
                let bono = bonos[i];
                let fecha = formatDate(bono.vencimiento);
                appendBono = "<tr>\n\
                    <td>"+bono.nombre+"</td>\n\
                    <td>"+bono.cantidad+"</td>\n\
                    <td>$"+bono.precioCompra+"</td>\n\
                    <td>$"+bono.precioPago+"</td>\n\
                    <td>"+fecha+"</td>\n\
                    <td>$"+bono.ganancia+"</td>\n\
                </tr>";
                $(".infoBonos").append(appendBono);
            }
        },
        error: function(error) {console.log(error);}
    });
}

function formatDate(fecha) {
    let date = fecha.split(" ");
    let nueva = date[2]+" "+date[1]+" "+date[5];
    return nueva;
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
        success: function() {
            $(".infoBonos").html(""); //Vacio la tabla de bonos
            setBonosCliente(idCliente); //Vuelvo a obtener los bonos del cliente
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function abrirCuentaBancaria(alias, saldo, idCliente) {
    let nuevaCuenta = {
        "aliasCuenta": alias,
        "saldo": saldo,
        "idCliente": idCliente
    };
    $.ajax({
        url: 'http://localhost:8080/TP1-FVM/rest/cuentas',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(nuevaCuenta),
        success: function() {
            alert('cuenta creada');
            window.location='perfil.html';
        },
        error: function(error) {
            alert('error')
            console.log(error)
        }
    });
};