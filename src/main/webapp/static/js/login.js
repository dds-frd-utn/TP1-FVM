 $("#login").click(function(e) {
        e.preventDefault();
        let usuario = $("#usuario").val();
        let password = $("#password").val();
        $.ajax({
            url: "http://localhost:8080/TP1-FVM/rest/clientes/login",
            type: 'post',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({"usuario":usuario, "password":password}),
            success: function(response) {
                if(response.error_code) {
                    alert("Datos erroneos");
                } else {
                    doLogin(response);
                    window.location.replace("perfil.html");
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    })
    
    function doLogin(datos) {
        let id = datos.id;
        let nombre = datos.nombre;
        let usuario = datos.usuario;
        let direccion = datos.direccion;
        let password = datos.password;
        
        $.ajax({
            url: 'http://localhost:8080/TP1-FVM/CrearSession',
            type: "post",
            async: false,
            data: {"id":id,"nombre":nombre,"usuario":usuario,"direccion":direccion,"password":password},
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error)
                alert("Se produjo un error de sesion");
            }
        });
    }