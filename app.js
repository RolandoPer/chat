var express = require('express'),http = require('http'); //envolver la aplicacion express con node
var app = express();
var server = http.createServer(app); //contendra la aplicacion
app.set('views',__dirname + '/views'); //ruta en q estaran las vistas //dirname :referencia a la carpeta de las vistas
app.configure(function(){
	app.use(express.static(__dirname));
});
app.get('/',function(req, res){
	res.render('index.jade',{layout:false});
});
server.listen(2013);

//
var io = require('socket.io').listen(server);
var usuariosConectados = {}; //obvio
io.sockets.on('connection',function(socket){
	/*console.log("Una nueva socket se ha conectado");
	socket.on('prueba', function(){
		console.log("La socket se ha iniciado correctamente");
		//hablarle al cliente
		var mensaje = "Hola socket :)";
		io.sockets.emit('nuevoMensaje', mensaje);*/
	socket.on('enviarNombre', function(dato){
		if(usuariosConectados[dato])
			socket.emit('errorName');
		else{
			socket.nickname = dato;
			usuariosConectados[dato] = socket.nickname;
		}
		data = [dato, usuariosConectados];
		io.sockets.emit('mensaje', data);
	});
	socket.on('enviarMensaje', function(mensaje){
		var data = [socket.nickname, mensaje];
		io.sockets.emit('newMessage', data);
	});
	socket.on('disconnect', function(){
		delete usuariosConectados[socket.nickname];
		data = [usuariosConectados, socket.nickname];
		io.sockets.emit('usuarioDesconectado', data);
	});
});