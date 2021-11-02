/**
 * Autor: grupo 7 G12
 * Versión: 1.0
 * Creado:24/10/2021
 */

/**
 * Endpoints API desplegados en máquina virtual.
 */
const endDeleteAdmin="http://129.151.115.37:8080/api/Admin/"
const endGetAdmin="http://129.151.115.37:8080/api/Admin/all"
const endPostAdmin="http://129.151.115.37:8080/api/Admin/save"
const endPutAdmin="http://129.151.115.37:8080/api/Admin/update"

const endDeleteAudience="http://129.151.115.37:8080/api/Audience/"
const endGetAudience="http://129.151.115.37:8080/api/Audience/all"
const endPostAudience="http://129.151.115.37:8080/api/Audience/save"
const endPutAudience="http://129.151.115.37:8080/api/Audience/update"

const endDeleteCategory="http://129.151.115.37:8080/api/Category/"
const endGetCategory="http://129.151.115.37:8080/api/Category/all"
const endPostCategory="http://129.151.115.37:8080/api/Category/save"
const endPutCategory="http://129.151.115.37:8080/api/Category/update"

const endDeleteClient="http://129.151.115.37:8080/api/Client/"
const endGetClient="http://129.151.115.37:8080/api/Client/all"
const endPostClient="http://129.151.115.37:8080/api/Client/save"
const endPutClient="http://129.151.115.37:8080/api/Client/update"

const endDeleteMessage="http://129.151.115.37:8080/api/Message/"
const endGetMessage="http://129.151.115.37:8080/api/Message/all"
const endPostMessage="http://129.151.115.37:8080/api/Message/save"
const endPutMessage="http://129.151.115.37:8080/api/Message/update"

const endDeleteReservation="http://129.151.115.37:8080/api/Reservation/"
const endGetReservation="http://129.151.115.37:8080/api/Reservation/all"
const endPostReservation="http://129.151.115.37:8080/api/Reservation/save"
const endPutReservation="http://129.151.115.37:8080/api/Reservation/update"

const endDeleteScore="http://129.151.115.37:8080/api/Score/"
const endGetScore="http://129.151.115.37:8080/api/Score/all"
const endPostScore="http://129.151.115.37:8080/api/Score/save"
const endPutScore="http://129.151.115.37:8080/api/Score/update"

/**
 * Cargar campos de selección cuando se inicie index.html.
 * Limitar el mínimo de fecha de entrega de reserva a la hora actual.
 */
$("#document").ready(function(){
    cargarCamposOpcionales();
    $("#start_date_reserva").prop('min', obtenerFechaActual());
});

/**
 * Recupera todos los elementos de la tabla correspondiente.
 * @param {*} endPoint endpoint de la API correspondiente.
 */
function peticionGet(endPoint){
    $.ajax({
        url:endPoint,
        method:'GET',
        dataType:'json',
        success:function(respuesta){
            if (respuesta.length<1){
                alert("No se encontraron registros");
                limpiarTabla(endPoint);
            } else {
                limpiarTabla(endPoint);
                mostrarElementosTabla(endPoint, respuesta);
            }
        }
    })
}

/**
 * Envía los datos del formulario a la API correspondiente.
 * @param {*} endPoint endpoint de la API correspondiente.
 */
function peticionPost(endPoint){
    let valores = recuperarValoresPost(endPoint);
    if (validarCampos(endPoint)) {
        $.ajax({
            url:endPoint,
            method:'POST',
            data:valores,
            dataType:'json',
            contentType:'application/JSON',
            complete:function(response){
                if (response.status==201){
                    cargarCamposOpcionales();
                    alert("Nuevo elemento creado con éxito");
                    limpiarCampos(endPoint);
                } else {
                    alert("Error: No pudo guardarse el elemento. Consulte con el administrador.");
                }
            }
        })
    } else {
        alert("Complete todos los campos, por favor.");
    }
}

/**
 * Actualiza los datos de un elemento en la BD correspondiente..
 * @param {*} endPoint endpoint de la API correspondiente.
 */
function peticionPut(endPoint){
    var valores = recuperarValoresPut(endPoint);
    var endGetTemporal = endPoint.substring(0, endPoint.length-6);
    if (validarCampos(endPoint)){
        $.ajax({
            url:endPoint,
            method:'PUT',
            data:valores,
            dataType:'json',
            contentType: 'application/JSON',
            complete:function(response){
                if (response.status==201){
                    alert("Nuevo elemento actualizado con éxito");
                    limpiarCampos(endPoint);
                    peticionGet(endGetTemporal+"all");
                    cargarCamposOpcionales();
                } else {
                    alert("Error: No pudo actualizarse el elemento. Consulte con el administrador.");
                }
            }
        })
    } else {
        alert("Complete todos los campos, por favor.")
    }
}

/**
 * Borra un elemento de la BD a través de una petición DELETE.
 * @param {*} endPoint endpoint de la API correspondiente.
 * @param {*} id el id del elemento que se borrará.
 */
function peticionDelete(endPoint, id){
    $.ajax({
        url:endPoint + id,
        method: 'DELETE',
        success:function(){
            alert("¡Registro eliminado con éxito!");
            peticionGet(endPoint+"all");
        },
        error: function(jqHXR, textStatus, errorThrown){
            if (jqHXR.status == 500){
                alert("Error en el orden de borrado. Consulte las instrucciones de borrado.");
            }
        }
    })
}

/**
 * Carga los valores recuperados a los campos del formulario correspondiente.
 * @param {*} endPoint el endPoint que indica los campos que se llenarán.
 * @param {*} valores un array en formato JSON con los valores que se cargarán.
 */
function cargarDatosActualizar(endPoint, valores){  
    /**
     * Cargar los datos correspondientes en el formulario.
     */
    switch (endPoint){
        case endPutAdmin:
            $("#btn_actu_admin").show();
            $("#id_admin").val(valores.id).prop('disabled', true);
            $("#name_admin").val(valores.name);
            $("#email_admin").val(valores.email).prop('disabled', true);
            $("#password_admin").val(valores.password);
            break;
        case endPutAudience:
            $("#btn_actu_auditorio").show();
            $("#id_audience").val(valores.id).prop('disabled', true);
            $("#owner_auditorio").val(valores.owner);
            $("#name_auditorio").val(valores.name);
            $("#capacity_auditorio").val(valores.capacity);
            $("#description_auditorio").val(valores.description);
            $("#category_id_auditorio").val(valores.category.id).prop('disabled', true);
            break;
        case endPutCategory:
            $("#btn_actu_categoria").show();
            $("#id_category").val(valores.id).prop('disabled', true);
            $("#name_categoria").val(valores.name);
            $("#description_categoria").val(valores.description);
            break;
        case endPutClient:
            $("#btn_actu_cliente").show();
            $("#id_client").val(valores.idClient).prop('disabled', true);
            $("#name_cliente").val(valores.name);
            $("#email_cliente").val(valores.email).prop('disabled', true);
            $("#age_cliente").val(valores.age);
            $("#password_cliente").val(valores.password);
            break;
        case endPutMessage:
            $("#btn_actu_mensaje").show();
            $("#id_message").val(valores.idMessage).prop('disabled', true);
            $("#message_text").val(valores.messageText);
            $("#client_id_mensaje").val(valores.client.idClient).prop('disabled', true);
            $("#audience_id_mensaje").val(valores.audience.id).prop('disabled', true);
            break;
        case endPutReservation:
            $("#btn_actu_reserva").show();
            $("#status_reserva").show();
            $("#id_reservation").val(valores.idReservation).prop('disabled', true);
            $("#start_date_reserva").val(ajustarFormatoDate(valores.startDate));
            $("#devolution_date_reserva").val(ajustarFormatoDate(valores.devolutionDate));
            $("#audience_id_reserva").val(valores.audience.id).prop('disabled', true);
            $("#client_id_reserva").val(valores.client.idClient).prop('disabled', true);
            $("#status_reserva").val(valores.status);
            break;
        case endPutScore:
            $("#btn_actu_calificacion").show();
            $("#id_score").val(valores.id).prop('disabled', true);
            $("#score_calificacion").val(valores.score);
            $("#message_calificacion").val(valores.message);
            $("#reservation_id_calificacion").val(valores.reservation.idReservation).prop('disabled', true);
            break;
    }
}

/**
 * Ajusta el formato de un elemento Date a YYYY-mm-dd.
 * @param {*} valorDate el valor Date que se ajustará.
 * @returns el valor Date ajustado a formato YYYY-mm-dd.
 */
function ajustarFormatoDate(valorDate){
    let objDate = new Date(valorDate);

    return objDate.toISOString().slice(0, 16);
}

/**
 * Obtiene la fecha y hora actuales.
 * @returns fecha actual en formato YYYY-mm-ddTHH:i
 */
function obtenerFechaActual(){
    var hoy = new Date();
    var fecha = hoy.getFullYear()+"-"+(hoy.getMonth()+1)+"-"+hoy.getDate();
    var hora = hoy.getHours()+":"+hoy.getMinutes();
    var fechaActual = fecha+"T"+hora;
    
    return fechaActual;
}

/**
 * Limita la fecha de devolución de reserva para que sólo pueda ser mayor a la fecha de entrega de reserva. 
 */
function limitarDevolucionReserva(){
    var fechaMinima = $("#start_date_reserva").val();
    $("#devolution_date_reserva").prop('min', fechaMinima);
}

/**
 * Recupera los valores del elemento seleccionado para la edición y los pasa a la función cargarDatosActualizar.
 * @param {*} endPoint indicador del endPoint del que se recuperarán los valores.
 * @param {*} index el índice del elemento que se recuperará.
 */
function recuperarObjetoEditable(endPoint, index){
    /**
     * Peticiones GET para obtener los datos del objeto editable.
     * En cada caso de éxito, se pasa los valores recuperados a la función cargarDatosActualizar.
     */
    switch (endPoint){
        case endPutAdmin:
            $.ajax({
                url:endGetAdmin,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
        case endPutAudience:
            $.ajax({
                url:endGetAudience,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
        case endPutCategory:
            $.ajax({
                url:endGetCategory,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
        case endPutClient:
            $.ajax({
                url:endGetClient,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
        case endPutMessage:
            $.ajax({
                url:endGetMessage,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
        case endPutReservation:
            $.ajax({
                url:endGetReservation,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
        case endPutScore:
            $.ajax({
                url:endGetScore,
                method:'GET',
                dataType:'json',
                success:function(respuesta){
                    cargarDatosActualizar(endPoint, respuesta[index]);
                }
            })
            break;
    }
}

/**
 * Recupera los valores de los campos del área donde el botón fue presionado.
 * @param {*} endPoint endPoint de la API que determina los campos y valores a recuperar.
 * @returns los valores recuperados en un string adecuado para JSON.
 */
function recuperarValoresPut(endPoint){
    /**
     * Valores que se enviarán en la peiticón PUT.
     */
    let valores = null;

    /**
     * Recuperación de los valores del formulario correspondiente.
     */
    switch (endPoint){
        case endPutAdmin:
            valores={
                id:$("#id_admin").val(),
                name:$("#name_admin").val(),
                password:$("#password_admin").val()
            }
            break;
        case endPutAudience:
            valores={
                id:$("#id_audience").val(),
                owner:$("#owner_auditorio").val(),
                name:$("#name_auditorio").val(),
                capacity:$("#capacity_auditorio").val(),
                description:$("#description_auditorio").val()
            }
            break;
        case endPutCategory:
            valores={
                id:$("#id_category").val(),
                name:$("#name_categoria").val(),
                description:$("#description_categoria").val()
            }
            break;
        case endPutClient:
            valores={
                idClient:$("#id_client").val(),
                name:$("#name_cliente").val(),
                age:$("#age_cliente").val(),
                password:$("#password_cliente").val()
            }
            break;
        case endPutMessage:
            valores={
                idMessage:$("#id_message").val(),
                messageText:$("#message_text").val()
            }
            break;
        case endPutReservation:
            valores={
                idReservation:$("#id_reservation").val(),
                startDate:$("#start_date_reserva").val(),
                devolutionDate:$("#devolution_date_reserva").val(),
                status:$("#status_reserva").val()
            }
            break;
        case endPutScore:
            valores={
                id:$("#id_score").val(),
                score:$("#score_calificacion").val(),
                message:$("#message_calificacion").val()
            }
            break;
    }
    return convertirValoresAJSON(valores);
}

/**
 * Recupera los valores de los campos del área donde el botón fue presionado.
 * @param {*} endPoint endPoint de la API que determina los campos y valores a recuperar.
 * @returns los valores recuperados en un string adecuado para JSON.
 */
function recuperarValoresPost(endPoint){
    /**
     * Valores que se enviarán en la peiticón POST.
     */
    let valores = null;

    /**
     * Recuperación de los valores del formulario correspondiente.
     */
    switch (endPoint){
        case endPostAdmin:
            valores={
                name:$("#name_admin").val(),
                email:$("#email_admin").val(),
                password:$("#password_admin").val()
            }
            break;
        case endPostAudience:
            valores={
                owner:$("#owner_auditorio").val(),
                name:$("#name_auditorio").val(),
                capacity:$("#capacity_auditorio").val(),
                description:$("#description_auditorio").val(),
                category:"{\"id\":"+$("#category_id_auditorio").val()+"}"
            }
            break;
        case endPostCategory:
            valores={
                name:$("#name_categoria").val(),
                description:$("#description_categoria").val()
            }
            
            break;
        case endPostClient:
            valores={
                name:$("#name_cliente").val(),
                email:$("#email_cliente").val(),
                age:$("#age_cliente").val(),
                password:$("#password_cliente").val()
            }
            break;
        case endPostMessage:
            valores={
                messageText:$("#message_text").val(),
                audience:"{\"id\":"+$("#audience_id_mensaje").val()+"}",
                client:"{\"idClient\":"+$("#client_id_mensaje").val()+"}"
            }
            break;
        case endPostReservation:
            valores={
                startDate:$("#start_date_reserva").val(),
                devolutionDate:$("#devolution_date_reserva").val(),
                audience:"{\"id\":"+$("#audience_id_reserva").val()+"}",
                client:"{\"idClient\":"+$("#client_id_reserva").val()+"}"
            }
            break;
        case endPostScore:
            valores={
                score:$("#score_calificacion").val(),
                message:$("#message_calificacion").val(),
                reservation:"{\"idReservation\":"+$("#reservation_id_calificacion").val()+"}"
            }
            break;
    }
    return convertirValoresAJSON(valores);
}

/**
 * Transforma los valores en un string adecuado para JSON.
 * @param {*} valores los valores que se transformarán a formato string para JSON.
 * @returns string con los valores en formato adecuado para JSON.
 */
function convertirValoresAJSON(valores) {
    var valoresString = "{";
    for (var key in valores) {
        /**
         * Filtro para casos especiales (llaves externas)
         */
        if (key=="category" || key=="audience" || key=="reservation" || key=="client"){
            valoresString += "\""+key+"\":"+valores[key]+",";
        } else {
            valoresString += "\""+key+"\":\""+valores[key]+"\"";
            valoresString += ","
        }
    }
    /**
     * Eliminar la coma extra al final y cerrar string para JSON.
     */
    valoresString = valoresString.substring(0, valoresString.length-1)+"}";
  
    return valoresString;
}

/**
 * Remueve la tabla del área donde fue presionado el botón.
 * @param {*} endPoint endPoint del API correspondiente que permite saber en qué área aplicar la limpieza.
 */
function limpiarTabla(endPoint){
    switch (endPoint){
        case endPostAdmin:
        case endGetAdmin:
            $("#tabla_admins").html("");
            break;
        case endGetAudience:
        case endPostAudience:
            $("#tabla_auditorios").html("");
            break;
        case endPostCategory:
        case endGetCategory:
            $("#tabla_categorias").html("");
            break;
        case endPostClient:
        case endGetClient:
            $("#tabla_clientes").html("");
            break;
        case endPostMessage:
        case endGetMessage:
            $("#tabla_mensajes").html("");
            break;
        case endPostReservation:
        case endGetReservation:
            $("#tabla_reservas").html("");
            break;
        case endPostScore:
        case endGetScore:
            $("#tabla_calificaciones").html("");
            break;
    }
}

/**
 * Limpia los campos del área donde el botón fue presionado y habilita aquellos campos que están deshabilitados.
 * @param {*} endPoint endPoint del API que permite definir los campos que se limpiarán.
 */
function limpiarCampos(endPoint){
    switch (endPoint){
        case endPostAdmin:
        case endGetAdmin:
        case endPutAdmin:
            $("#btn_actu_admin").hide();
            $("#name_admin").val("");
            $("#email_admin").val("").prop('disabled', false);
            $("#password_admin").val("");
            break;
        case endGetAudience:
        case endPostAudience:
        case endPutAudience:
            $("#btn_actu_auditorio").hide();
            $("#owner_auditorio").val("");
            $("#name_auditorio").val("");
            $("#capacity_auditorio").val("");
            $("#description_auditorio").val("");
            $("#category_id_auditorio").val("default").prop('disabled', false);
            break;
        case endPostCategory:
        case endGetCategory:
        case endPutCategory:
            $("#btn_actu_categoria").hide();
            $("#name_categoria").val("");
            $("#description_categoria").val("");
            break;
        case endGetClient:
        case endPostClient:
        case endPutClient:
            $("#btn_actu_cliente").hide();
            $("#name_cliente").val("");
            $("#email_cliente").val("").prop('disabled', false);
            $("#age_cliente").val("");
            $("#password_cliente").val("");
            break;
        case endGetMessage:
        case endPostMessage:
        case endPutMessage:
            $("#btn_actu_mensaje").hide();
            $("#message_text").val("");
            $("#client_id_mensaje").val("default").prop('disabled', false);
            $("#audience_id_mensaje").val("default").prop('disabled', false);
            break;
        case endGetReservation:
        case endPostReservation:
        case endPutReservation:
            $("#btn_actu_reserva").hide();
            $("#status_reserva").hide();
            $("#start_date_reserva").val("");
            $("#devolution_date_reserva").val("");
            $("#audience_id_reserva").val("default").prop('disabled', false);
            $("#client_id_reserva").val("default").prop('disabled', false);
            break;
        case endGetScore:
        case endPostScore:
        case endPutScore:
            $("#btn_actu_calificacion").hide();
            $("#score_calificacion").val("default");
            $("#message_calificacion").val("");
            $("#reservation_id_calificacion").val("default").prop('disabled', false);
            break;
    }
}

/**
 * Trae los elementos de las tablas y carga las opciones para los campos de selección de Categoría
 * Auditorio, Cliente y Reserva.
 */
function cargarCamposOpcionales(){
    /**
     * Categorias
     */
    $.ajax({
        url:endGetCategory,
        method:'GET',
        success:function(respuesta){
            let infoCategory = "<option value='default'>Seleccione categoría...</option>";
            for (i=0; i<respuesta.length; i++){
                infoCategory += "<option value="+respuesta[i].id+">"+respuesta[i].name+"</option>";
            }
            $("#category_id_auditorio").html(infoCategory);
        }
    })
    /**
     * Auditorios
     */
     $.ajax({
        url:endGetAudience,
        method:'GET',
        success:function(respuesta){
            let infoAudience = "<option value='default'>Seleccione auditorio...</option>";
            for (i=0; i<respuesta.length; i++){
                infoAudience += "<option value="+respuesta[i].id+">"+respuesta[i].name+"</option>";
            }
            $("#audience_id_mensaje").html(infoAudience);
            $("#audience_id_reserva").html(infoAudience);
        }
    })
    /**
     * Clientes
     */
     $.ajax({
        url:endGetClient,
        method:'GET',
        success:function(respuesta){
            let infoClient = "<option value=\"default\">Seleccione cliente...</option>";
            for (i=0; i<respuesta.length; i++){
                infoClient += "<option value="+respuesta[i].idClient+">"+respuesta[i].name+"</option>";
            }
            $("#client_id_reserva").html(infoClient);
            $("#client_id_mensaje").html(infoClient);
        }
    })
    /**
     * Reservas
     */
     $.ajax({
        url:endGetReservation,
        method:'GET',
        success:function(respuesta){
            let infoReserva = "<option value=\"default\">Seleccione reserva...</option>";
            for (i=0; i<respuesta.length; i++){
                infoReserva += "<option value="+respuesta[i].idReservation+">"+respuesta[i].idReservation+"</option>";
            }
            $("#reservation_id_calificacion").html(infoReserva);
        }
    })
}

/**
 * Valida si los campos contienen información antes de enviar información a la API.
 * @param {*} endPoint endPoint de la API que permite saber qué campos se deben evaluar.
 * @returns true si todos los campos tienen información.
 */
function validarCampos(endPoint){
    var infoCompleta = true;

    switch (endPoint){
        case endPostAdmin:
        case endPutAdmin:
            if ($("#name_admin").val() == "" ||
                $("#email_admin").val() == "" ||
                $("#password_admin").val() == "")
                {
                    infoCompleta = false;
            }
            break;
        case endPostAudience:
        case endPutAudience:
            if ($("#owner_auditorio").val() == "" ||
                $("#name_auditorio").val() == "" ||
                $("#capacity_auditorio").val() == "" ||
                $("#description_auditorio").val() == "" ||
                $("#category_id_auditorio").val() == "default")
                {
                    infoCompleta = false;
            }
            break;
        case endPostCategory:
        case endPutCategory:
            if ($("#name_categoria").val() == "" ||
                $("#description_categoria").val() == "")
                {
                    infoCompleta = false;
            }
            break;
        case endPostClient:
        case endPutClient:
            if ($("#name_cliente").val() == "" ||
            $("#email_cliente").val() == "" ||
            $("#age_cliente").val() == "" ||
            $("#password_cliente").val() == "")
                {
                    infoCompleta = false;
            }
            break;
        case endPostMessage:
        case endPutMessage:
            if ($("#message_text").val() == "" ||
            $("#audience_id_mensaje").val() == "default")
                {
                    infoCompleta = false;
            }
            break;
        case endPostReservation:
        case endPutReservation:
            if ($("#start_date_reserva").val() == "" ||
            $("#devolution_date_reserva").val() == "" ||
            $("#audience_id_reserva").val() == "default" ||
            $("#client_id_reserva").val() == "default")
                {
                    infoCompleta = false;
            }
            break;
        case endPostScore:
        case endPutScore:
            if ($("#score_calificacion").val() == "default" ||
            $("#message_calificacion").val() == "" ||
            $("#reservation_id_calificacion").val() == "default")
                {
                    infoCompleta = false;
            }
            break;
    }

    return infoCompleta;
}

/**
 * Crea una tabla para visualizar los datos de una tabla específica.
 * @param {*} endPoint el endPoint de la API que contiene los datos correspondientes.
 * @param {*} items los datos que se presentarán en la tabla.
 */
function mostrarElementosTabla(endPoint, items){
    switch (endPoint){
        case endGetAdmin:
            $("#tabla_admins").append("<table>Administradores</table><br>");
            $("#tabla_admins").append("<tr>")
                $("#tabla_admins").append("<td>&ensp;<strong>Nombre</strong>&ensp;</td>");
                $("#tabla_admins").append("<td>&ensp;<strong>Correo</strong>&ensp;</td>");
            $("#tabla_admins").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_admins").append("<tr>");
                    $("#tabla_admins").append("<td>&ensp;"+items[i].name+"&ensp;</td>");
                    $("#tabla_admins").append("<td>&ensp;"+items[i].email+"&ensp;</td>");
                    $("#tabla_admins").append("<td><button onclick=\"recuperarObjetoEditable(endPutAdmin,"+i+")\">Editar</button></td>");
                    $("#tabla_admins").append("<td><button onclick=\"peticionDelete(endDeleteAdmin, "+items[i].id+")\">Eliminar</button></td>");
                $("#tabla_admins").append("</tr>");
            }
            break;
        case endGetAudience:
            $("#tabla_auditorios").append("<table>Auditorios</table><br>");
            $("#tabla_auditorios").append("<tr>")
                $("#tabla_auditorios").append("<td>&ensp;<strong>Nombre</strong>&ensp;</td>");
                $("#tabla_auditorios").append("<td>&ensp;<strong>Propietario</strong>&ensp;</td>");
                $("#tabla_auditorios").append("<td>&ensp;<strong>Capacidad</strong>&ensp;</td>");
                $("#tabla_auditorios").append("<td>&ensp;<strong>Descripción</strong>&ensp;</td>");
                $("#tabla_auditorios").append("<td>&ensp;<strong>Categoría</strong>&ensp;</td>");
            $("#tabla_auditorios").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_auditorios").append("<tr>");
                    $("#tabla_auditorios").append("<td>&ensp;"+items[i].name+"&ensp;</td>");
                    $("#tabla_auditorios").append("<td>&ensp;"+items[i].owner+"&ensp;</td>");
                    $("#tabla_auditorios").append("<td>&ensp;"+items[i].capacity+"&ensp;</td>");
                    $("#tabla_auditorios").append("<td>&ensp;"+items[i].description+"&ensp;</td>");
                    $("#tabla_auditorios").append("<td>&ensp;"+items[i].category.name+"&ensp;</td>");
                    $("#tabla_auditorios").append("<td><button onclick=\"recuperarObjetoEditable(endPutAudience,"+i+")\">Editar</button></td>");
                    $("#tabla_auditorios").append("<td><button onclick=\"peticionDelete(endDeleteAudience, "+items[i].id+")\">Eliminar</button></td>");
                $("#tabla_auditorios").append("</tr>");
            }
            break;
        case endGetCategory:
            $("#tabla_categorias").append("<table>Categorías</table><br>");
            $("#tabla_categorias").append("<tr>")
                $("#tabla_categorias").append("<td>&ensp;<strong>Nombre</strong>&ensp;</td>");
                $("#tabla_categorias").append("<td>&ensp;<strong>Descripción</strong>&ensp;</td>");
            $("#tabla_categorias").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_categorias").append("<tr>");
                    $("#tabla_categorias").append("<td>&ensp;"+items[i].name+"&ensp;</td>");
                    $("#tabla_categorias").append("<td>&ensp;"+items[i].description+"&ensp;</td>");
                    $("#tabla_categorias").append("<td><button onclick=\"recuperarObjetoEditable(endPutCategory,"+i+")\">Editar</button></td>");
                    $("#tabla_categorias").append("<td><button onclick=\"peticionDelete(endDeleteCategory, "+items[i].id+")\">Eliminar</button></td>");
                $("#tabla_categorias").append("</tr>");
            }
            break;
        case endGetClient:
            $("#tabla_clientes").append("<table>Clientes</table><br>");
            $("#tabla_clientes").append("<tr>")
                $("#tabla_clientes").append("<td>&ensp;<strong>Nombre</strong>&ensp;</td>");
                $("#tabla_clientes").append("<td>&ensp;<strong>Correo</strong>&ensp;</td>");
                $("#tabla_clientes").append("<td>&ensp;<strong>Edad</strong>&ensp;</td>");
            $("#tabla_clientes").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_clientes").append("<tr>");
                    $("#tabla_clientes").append("<td>&ensp;"+items[i].name+"&ensp;</td>");
                    $("#tabla_clientes").append("<td>&ensp;"+items[i].email+"&ensp;</td>");
                    $("#tabla_clientes").append("<td>&ensp;"+items[i].age+"&ensp;</td>");
                    $("#tabla_clientes").append("<td><button onclick=\"recuperarObjetoEditable(endPutClient,"+i+")\">Editar</button></td>");
                    $("#tabla_clientes").append("<td><button onclick=\"peticionDelete(endDeleteClient, "+items[i].idClient+")\">Eliminar</button></td>");
                $("#tabla_clientes").append("</tr>");
            }
            break;
        case endGetMessage:
            $("#tabla_mensajes").append("<table>Mensajes</table><br>");
            $("#tabla_mensajes").append("<tr>")
                $("#tabla_mensajes").append("<td>&ensp;<strong>Mensaje</strong>&ensp;</td>");
                $("#tabla_mensajes").append("<td>&ensp;<strong>Auditorio</strong>&ensp;</td>");
                $("#tabla_mensajes").append("<td>&ensp;<strong>Cliente</strong>&ensp;</td>");
            $("#tabla_mensajes").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_mensajes").append("<tr>");
                    $("#tabla_mensajes").append("<td>&ensp;"+items[i].messageText+"&ensp;</td>");
                    $("#tabla_mensajes").append("<td>&ensp;"+items[i].audience.name+"&ensp;</td>");
                    $("#tabla_mensajes").append("<td>&ensp;"+items[i].client.name+"&ensp;</td>");
                    $("#tabla_mensajes").append("<td><button onclick=\"recuperarObjetoEditable(endPutMessage,"+i+")\">Editar</button></td>");
                    $("#tabla_mensajes").append("<td><button onclick=\"peticionDelete(endDeleteMessage, "+items[i].idMessage+")\">Eliminar</button></td>");
                $("#tabla_mensajes").append("</tr>");
            }
            break;
        case endGetReservation:
            $("#tabla_reservas").append("<table>Reservas</table><br>");
            $("#tabla_reservas").append("<tr>")
                $("#tabla_reservas").append("<td>&ensp;<strong>ID Reserva</strong>&ensp;</td>");
                $("#tabla_reservas").append("<td>&ensp;<strong>Auditorio</strong>&ensp;</td>");
                $("#tabla_reservas").append("<td>&ensp;<strong>ID Cliente</strong>&ensp;</td>");
                $("#tabla_reservas").append("<td>&ensp;<strong>Nombre Cliente</strong>&ensp;</td>");
                $("#tabla_reservas").append("<td>&ensp;<strong>Correo Cliente</strong>&ensp;</td>");
                $("#tabla_reservas").append("<td>&ensp;<strong>Promedio calificaciones</strong>&ensp;</td>");
            $("#tabla_reservas").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_reservas").append("<tr>");
                    $("#tabla_reservas").append("<td>&ensp;"+items[i].idReservation+"&ensp;</td>");
                    $("#tabla_reservas").append("<td>&ensp;"+items[i].audience.name+"&ensp;</td>");
                    $("#tabla_reservas").append("<td>&ensp;"+items[i].client.idClient+"&ensp;</td>");
                    $("#tabla_reservas").append("<td>&ensp;"+items[i].client.name+"&ensp;</td>");
                    $("#tabla_reservas").append("<td>&ensp;"+items[i].client.email+"&ensp;</td>");
                    /**
                     * Mostrar mensaje "sin calificaciones" si la reserva no tiene calificaciones.
                     */
                    if(items[i].score.length<1){
                        $("#tabla_reservas").append("<td>&ensp;Sin calificaciones&ensp;</td>");
                    } else {
                        /**
                         * Calcular promedio calificaciones.
                         */
                        let promedioCalif = 0;
                        for (j=0;j<items[i].score.length;j++){
                            promedioCalif += items[i].score[j].score;
                        }
                        promedioCalif /= items[i].score.length;

                        $("#tabla_reservas").append("<td>&ensp;"+promedioCalif+"&ensp;</td>");
                    }
                    $("#tabla_reservas").append("<td><button onclick=\"recuperarObjetoEditable(endPutReservation,"+i+")\">Editar</button></td>");
                    $("#tabla_reservas").append("<td><button onclick=\"peticionDelete(endDeleteReservation, "+items[i].idReservation+")\">Eliminar</button></td>");
                $("#tabla_reservas").append("</tr>");
            }
            break;
        case endGetScore:
            $("#tabla_calificaciones").append("<table>Calificaciones</table><br>");
            $("#tabla_calificaciones").append("<tr>")
                $("#tabla_calificaciones").append("<td>&ensp;<strong>Calificación</strong>&ensp;</td>");
                $("#tabla_calificaciones").append("<td>&ensp;<strong>Mensaje</strong>&ensp;</td>");
                $("#tabla_calificaciones").append("<td>&ensp;<strong>Reserva</strong>&ensp;</td>");
            $("#tabla_calificaciones").append("</tr>");

            for (i=0; i<items.length; i++){
                $("#tabla_calificaciones").append("<tr>");
                    $("#tabla_calificaciones").append("<td>&ensp;"+items[i].score+"&ensp;</td>");
                    $("#tabla_calificaciones").append("<td>&ensp;"+items[i].message+"&ensp;</td>");
                    $("#tabla_calificaciones").append("<td>&ensp;"+items[i].reservation.idReservation+"&ensp;</td>");
                    $("#tabla_calificaciones").append("<td><button onclick=\"recuperarObjetoEditable(endPutScore,"+i+")\">Editar</button></td>");
                    $("#tabla_calificaciones").append("<td><button onclick=\"peticionDelete(endDeleteScore, "+items[i].id+")\">Eliminar</button></td>");
                $("#tabla_calificaciones").append("</tr>");
            }
            break;
    }
}