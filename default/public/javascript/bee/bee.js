var facebook = false;
var twitter = false;
var instagram = false;
var linkedin = false;
var pinterest = false;
var youtube = false;
var plus = false;
var nameWinner= "";
var urlFile="";
var id=0;
var currentId = 0;
var Events=[];
var fechaSelect;
var editando = false;
var hora;
var fileExtension = "";
var file;
//obtenemos el nombre del archivo
var fileName;
//obtenemos el tamaño del archivo
var fileSize;
//obtenemos el tipo de archivo image/png ejemplo
var fileType;
var eventFile = "";

$(document).ready(function() {
	$("#agregar").hide();
	$('#uploadModule').hide();
    crearCalendario();

    SetEventsCalendar();


   
    //función que observa los cambios del campo file y obtiene información
    $(':file').change(function()
    {
        //obtenemos un array con los datos del archivo
        file = $("#imagen")[0].files[0];
        //obtenemos el nombre del archivo
        fileName = file.name;
        //obtenemos la extensión del archivo
        fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
        //obtenemos el tamaño del archivo
        fileSize = file.size;
        //obtenemos el tipo de archivo image/png ejemplo
        fileType = file.type;
        //mensaje con la información del archivo
        showMessage("<span class='info'>File to load: "+fileName+", size: "+fileSize+" bytes.</span>");
    });
 
    //al enviar el formulario
    $(':button').click(function(){
        //información del formulario
        var formData = new FormData($(".formulario")[0]);
        var message = ""; 
        //hacemos la petición ajax  
        $.ajax({
            url: '../php/upload.php',  
            type: 'POST',
            // Form data
            //datos del formulario
            data: formData,
            //necesario para subir archivos via ajax
            cache: false,
            contentType: false,
            processData: false,
            //mientras enviamos el archivo
            beforeSend: function(){
                message = $("<span class='before'>Uploading file...</span>");
                showMessage(message)        
            },
            //una vez finalizado correctamente
            success: function(data){
                message = $("<span class='success'>Done!</span>");
                showMessage(message);
                
                //$(".showImage").html("<img src='files/"+fileName+"' />");
                $('#imagen').val("")
                eventFile = "../upload/"+fileName;
                console.log('data:', data);
            },
            //si ha ocurrido un error
            error: function(){
                message = $("<span class='error'>Ha ocurrido un error.</span>");
                showMessage(message);
            }
        });
    });
});

function showMessage(message){
    $(".messages").html("").show();
    $(".messages").html(message);
}


function crearCalendario(){
	 $('#calendar').fullCalendar({
		editable: true,
		eventStartEditable:true,
		dragable:true,
		fixedWeekCount :false,

		
	    eventClick: function(calEvent, jsEvent, view) {
	        //alert('Event: ' + calEvent.title+', author:'+calEvent.author);
	        editEvents(calEvent);
	    },
	    dayMouseover: function( event, jsEvent, view ) {
	    	console.log('roll over' +date);
	    },
	    dayMouseout: function( event, jsEvent, view ) {
	    	console.log('roll out' +date);
	    }
    });

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    var alto = $(window).width() / 2.4;

    $('#calendar').fullCalendar('option', 'height', alto);

    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();


    $( ".fc-left" ).empty();
   	$( ".fc-left" ).append('<h2 style="display: block; float: right">' + months[month] + '</h2><span style="display: block; float: right; clear: both; margin-top: -14px; position: relative;">'+year+'</span>');

   	var newEvent;

	$(".fc-day").click(function(){
		fechaSelect = $(this).context.dataset.date;

		$("#taskText textarea").val("add task");
		$("#taskDescription textarea").val("add description");
		$("#taskAuthor textarea").val("author name");
		$("#agregar").show();

		$("#taskText textarea").click(function(){$("#taskText textarea").val("");})
		$("#taskDescription textarea").click(function(){$("#taskDescription textarea").val("");})
		$("#taskAuthor textarea").click(function(){$("#taskAuthor textarea").val("");})

		
	});
	$('#timepicker1').timepicker();

	$("#discard").click(function(){
		$("#agregar").hide();
	});
	//click redes
	$(".fa").click(function(){
		lightNetworks(this.id);
	});
	$("#save").click(function(){
		var hora = $("#timepicker1").val();
		newEvent = {
				title: $("#taskText textarea").val(),
				start: fechaSelect,
				constraint: $("#taskDescription textarea").val(), // defined below
				color: '#257e4a',
				author: $("#taskAuthor textarea").val(),
				file: urlFile,
				idPosicion:id,
				hour:hora,
				fileUrl:eventFile,
				networks:{
					facebook:facebook,
					twitter:twitter,
					instagram:instagram,
					linkedin:linkedin,
					pinterest:pinterest,
					youtube:youtube,
					plus:plus
				},
				winner:nameWinner
			};
		if(editando == true){
			Events[currentId]=newEvent;
		}else{
			Events[id]=newEvent;
			id = id+1;
		}
		
		

		$.ajax({
			type: "POST",
			data: {eventos: Events},
			dataType: "json",
			url: PUBLIC_PATH + 'calendario/index/guardar',
			success: function(data){
				console.log(data)
			}
		})
		$("#agregar").hide();
		$('#calendar').fullCalendar( 'removeEventSource', Events);
		$('#calendar').fullCalendar( 'addEventSource', Events);
		editando = false;
		console.log("Events = ", Events);

	});
	$("#WinnerButton").click(function(){
		var texto = $(".texto").val();
		var candidatos = texto.split("\n");
		console.log('candidatos :',candidatos);
		var winner = parseInt(Math.random()*candidatos.length);
		var name= candidatos[winner];
		$("#winnerName").text(name);

		nameWinner = name;
		$(".texto").val("");
	});
	$('#upload').click(function(){
		$('#uploadModule').toggle( 'display' );
	})
	
}
function SetEventsCalendar(){
	console.log('setevents ',Eventos.length);
	$('#calendar').fullCalendar( 'addEventSource', Eventos);
	if(Eventos != undefined || Eventos != null){
		Events = Eventos;
		id = Eventos.length;
	}
}
function editEvents(evento){
	console.log("edit event ",evento);

	$("#taskText textarea").val(evento.title);
	fechaSelect=evento.start._i;
	console.log("currentId",evento.idPosicion)
	$("#taskDescription textarea").val(evento.constraint);
	color = evento.color,
	$("#taskAuthor textarea").val(evento.author),
	urlFile = evento.file;
	currentId = evento.idPosicion;
	hora = evento.hour;
	$("#timepicker1").val(hora);
	eventFile = evento.fileUrl;
	facebook= stringToBoolean(""+evento.networks.facebook);
	lightNetworks2("facebook");
	twitter= stringToBoolean(""+evento.networks.twitter);
	lightNetworks2("twitter");
	instagram=stringToBoolean(""+ evento.networks.instagram);
	lightNetworks2("instagram");
	linkedin= stringToBoolean(""+evento.networks.linkedin);
	lightNetworks2("linkedin");
	pinterest= stringToBoolean(""+evento.networks.pinterest);
	lightNetworks2("pinterest");
	youtube= stringToBoolean(""+evento.networks.youtube);
	lightNetworks2("youtube");
	plus= stringToBoolean(""+evento.networks.plus);
	lightNetworks2("plus");



	function stringToBoolean(string){
		console.log('string rec',string)
	    switch(string.toLowerCase().trim()){
	        case "true": case "yes": case "1": return true;
	        case "false": case "no": case "0": case null: return false;
	        default: return Boolean(string);
	    }
	}
	nameWinner = evento.winner;
	editando = true;
	$("#agregar").show();
}

function lightNetworks(idButton){
	switch(idButton){
			case "facebook":
			if(facebook == true){
				facebook = false;
				$('#redes ul li #facebook').css('color', '#333');
			}else{
				$('#redes ul li #facebook').css('color', '#72cfbd');
				facebook = true;				
			}
			break;
			case "twitter":
			if(twitter){
				twitter = false;
				$('#redes ul li #twitter').css('color', '#333');
			}else{
				twitter = true;				
				$('#redes ul li #twitter').css('color', '#72cfbd');
			}
			break;
			case "instagram":
			if(instagram){
				instagram = false;
				$('#redes ul li #instagram').css('color', '#333');
			}else{
				instagram = true;	
				$('#redes ul li #instagram').css('color', '#72cfbd');
			}
			break;
			case "linkedin":
			if(linkedin){
				linkedin = false;
				$('#redes ul li #linkedin').css('color', '#333');
			}else{
				linkedin = true;	
				$('#redes ul li #linkedin').css('color', '#72cfbd');
			}
			break;
			case "pinterest":
			if(pinterest){
				pinterest = false;
				$('#redes ul li #pinterest').css('color', '#333');
			}else{
				pinterest = true;
				$('#redes ul li #pinterest').css('color', '#72cfbd');
			}
			break;
			case "youtube":
			if(youtube){
				youtube = false;
				$('#redes ul li #youtube').css('color', '#333');
			}else{
				youtube = true;		
				$('#redes ul li #youtube').css('color', '#72cfbd');
			}
			break;
			case "plus":
			if(plus){
				plus = false;
				$('#redes ul li #plus').css('color', '#333');
			}else{
				plus = true;		
				$('#redes ul li #plus').css('color', '#72cfbd');	
			}
			break;
		}
}
function lightNetworks2(idButton){
	switch(idButton){
			case "facebook":
			if(facebook == false){
				$('#redes ul li #facebook').css('color', '#333');
			}else{
				$('#redes ul li #facebook').css('color', '#72cfbd');				
			}
			break;
			case "twitter":
			if(twitter == false){
				$('#redes ul li #twitter').css('color', '#333');
			}else{			
				$('#redes ul li #twitter').css('color', '#72cfbd');
			}
			break;
			case "instagram":
			if(instagram == false){
				$('#redes ul li #instagram').css('color', '#333');
			}else{
				$('#redes ul li #instagram').css('color', '#72cfbd');
			}
			break;
			case "linkedin":
			if(linkedin == false){
				$('#redes ul li #linkedin').css('color', '#333');
			}else{	
				$('#redes ul li #linkedin').css('color', '#72cfbd');
			}
			break;
			case "pinterest":
			if(pinterest == false){
				$('#redes ul li #pinterest').css('color', '#333');
			}else{
				$('#redes ul li #pinterest').css('color', '#72cfbd');
			}
			break;
			case "youtube":
			if(youtube == false){
				$('#redes ul li #youtube').css('color', '#333');
			}else{	
				$('#redes ul li #youtube').css('color', '#72cfbd');
			}
			break;
			case "plus":
			if(plus == false){
				$('#redes ul li #plus').css('color', '#333');
			}else{	
				$('#redes ul li #plus').css('color', '#72cfbd');	
			}
			break;
		}
}
