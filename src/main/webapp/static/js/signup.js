$(".registrarse").click(function(e) {
       e.preventDefault();
       var nombre = $("#nombre").val();
       var usuario = $("#usuario").val();
       var direccion = $("#direccion").val();
       var password = $("#password").val();
       $.ajax({
           url: "http://localhost:8080/TP1-FVM/rest/clientes",
           data:JSON.stringify({"nombre":nombre, "usuario":usuario, "direccion":direccion, "password":password}),
           contentType: "application/json",
           dataType: "json",
           type:"POST",
           success: function(response) {
               alert("Cuenta creada!");
               window.location.replace("../index.html");
           },
           error: function(error) {
               alert("Ocurrio un error en el servidor");
               console.log(error);
           }
       }) 
    });