var nombre;
var arrayNames = {};
var websocket = io.connect();

$(document).on("ready", iniciar);

function iniciar(){
	$("#body").css({height:screen.height, width:screen.width});
	var pantallas = [$("#setNombre")];

	$('#formNombre').on("submit", function(e){
		e.preventDefault();
		var bandera = 0;
		var nombreAyuda = $("#name").val();
		for(var i = 0; i<arrayNames.length;i++){
			if(nombreAyuda == arrayNames[i])
				bandera = 1;
		}
		if(bandera == 0)
			sendNames();
		else
			alert("Ese nombre ya existe");
	});

	$("#formMsg").on("submit", function(e){
		e.preventDefault();
		sendMessage();
	});

	//Manejar fx
	websocket.on("mensaje", procesarUsuario);
	websocket.on("newMessage", procesarMensaje);
	websocket.on("usuarioDesconectado", procesarUsuarios);
	websocket.on("errorName", repetirNombre);
}

function sendMessage(){
	var msg = $("#msg").val();
	// q no tnga scripts
	if((msg.indexOf("<") != -1)){
		alert("Mensaje incorrecto");
	}else if((msg.indexOf(">") != -1)){
		alert("Mensaje incorrecto");
	}else if((msg.indexOf(";") != -1)){
		alert("Mensaje incorrecto");
	}else{
		$("#msg").val("");
		websocket.emit('enviarMensaje', msg);
	}
}

function sendNames(){
	nombre = $("#name").val();
	$("#setNombre").fadeOut();
	if (localStorage)
		localStorage.nombreChatUsuario = nombre;
	websocket.emit('enviarNombre', nombre);
}

function procesarUsuario(mensaje){
	$("#users").html('');
	for(i in mensaje[1]){
		$('#users').append($('<p>').text(mensaje[1][i]));
		arrayNames[i] = mensaje[1][i];
	}
}

function procesarMensaje(data){
	$('#chatInsite').append($('<p>').html('<span>'+data[0]+ " says:</span> " + data[1]));
	$('#chat').animate({scrollTop: $('#chatInside').height()},800);
}

function procesarUsuarios(mensaje){
	$("#users").html('');
	for(i in mensaje[2]){
		$('#users').append($('<p>').text(mensaje[0][i]));
		arrayNames[i] = mensaje[0][i];
	}
}

function repetirNombre(){
	alert("El nombre ya esta ocupado");
	location.reload(true);
}