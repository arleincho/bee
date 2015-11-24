var facebook = "false";
var twitter = "false";
var instagram = "false";
var linkedin = "false";
var pinterest = "false";
var youtube = "false";
var plus = "false";
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
var eventRefence;

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
        var formData = new FormData();
        formData.append('archivo', $('#imagen')[0].files[0])
        formData.append('fechaSelect', fechaSelect)
        formData.append('hora', $("#timepicker1").val())
        var message = ""; 
        
        //hacemos la petición ajax  
        $.ajax({
            url: PUBLIC_PATH + 'calendario/index/fileEventSave',
            type: 'POST',
            // Form data
            //datos del formulario
            data: formData,
            //necesario para subir archivos via ajax
            cache: false,
            contentType: false,
            dataType: 'json',
            processData: false,
            //mientras enviamos el archivo
            beforeSend: function(){
                message = $("<span class='before'>Uploading file...</span>");
            },
            //una vez finalizado correctamente
            success: function(data){
                message = $("<span class='success'>Done!</span>");
                $("#imaEvent").html("<img src='"+ PUBLIC_PATH + data.urlFile+"' />");
                //$(".showImage").html("<img src='files/"+fileName+"' />");
                $('#imagen').val("");
                urlFile = data.urlFile;
                console.log('data:', data);
                console.log('data.urlFile:', data.urlFile);
            },
            //si ha ocurrido un error
            error: function(e){
                message = $("<span class='error'>Error.</span>");
                console.log('data.error ', e);
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
		droppable: true,
		drop: function(date) {
	        console.log("Dropped on " + date.format());
	    },
		
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
    
    var alto = $(window).width() / 1.7;

    $('#calendar').fullCalendar('option', 'height', alto);

    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();


    $( ".fc-left" ).empty();
   	$( ".fc-left" ).append('<h2 style="display: block; float: right">' + months[month] + 
   		'</h2>'+
   			'<span id="buttonsCalendar">'+
	   			'<span id="prevButton" class="arrow">'+
	   				'<i class="fa fa-chevron-left"></i>'+
	   			'</span>'+
	   			'<span id="nextButton" class="arrow">'+
	   				'<i class="fa fa-chevron-right"></i>'+
	   			'</span>'+
	   			'<span style="display: block; float: right; margin-top: -14px; position: relative;">'+
   				year+'</span>'+
	   		'</span>');
   			
   	var newEvent;
   	$("#prevButton").click(function(){
   		$('#calendar').fullCalendar('prev');
   	});
   	$("#nextButton").click(function(){
   		$('#calendar').fullCalendar('next');
   	});
	$(".fc-day").click(function(){
		//setear iconos redes deseleccionados
		facebook = "false";
		twitter = "false";
		instagram = "false";
		linkedin = "false";
		pinterest = "false";
		youtube = "false";
		plus = "false";
		urlFile="";
		id=0;
		currentId = 0;
		editando = false;
		hora = '';
		fileExtension = "";
		file = '';
		//obtenemos el nombre del archivo
		fileName = '';
		//obtenemos el tamaño del archivo
		fileSize = '';
		//obtenemos el tipo de archivo image/png ejemplo
		fileType = '';
		eventRefence = null;
		console.log('crear evento nuevo')
		fechaSelect = $(this).context.dataset.date;

		$("#taskText textarea").val("add task");
		$("#taskDescription textarea").val("add description");
		$("#taskAuthor textarea").val("author name");
		$("#imaEvent").html('<img src="http://beesocialgroup.com/test/img/upload/indice.png">');
		$("#agregar").show();

		$("#taskText textarea").click(function(){$("#taskText textarea").val("");})
		$("#taskDescription textarea").click(function(){$("#taskDescription textarea").val("");})
		$("#taskAuthor textarea").click(function(){$("#taskAuthor textarea").val("");});

		$('#redes ul li #facebook').css('color', '#333');
		$('#redes ul li #twitter').css('color', '#333');
		$('#redes ul li #instagram').css('color', '#333');
		$('#redes ul li #linkedin').css('color', '#333');
		$('#redes ul li #pinterest').css('color', '#333');
		$('#redes ul li #youtube').css('color', '#333');
		$('#redes ul li #plus').css('color', '#333');		
	});
	$('#timepicker1').timepicker();

	$("#discard").click(function(){
		$("#agregar").hide();
		$("#imaEvent").html("<img src='' />");
		editando = false;
	});
	//click redes
	$(".fa").click(function(){
		lightNetworks(this.id);
	});
	$("#save").click(function(){
		var hora = $("#timepicker1").val();
		console.log("editando", editando);
		//$('#calendar').fullCalendar( 'removeEventSource', Events);
		if(editando == true){		
			console.log("modificar evento")	
			eventRefence.title= $("#taskText textarea").val(),
			//eventRefence.start = fechaSelect;
			eventRefence.constraint = $("#taskDescription textarea").val(); // defined below
			eventRefence.color = '#257e4a';
			eventRefence.author = $("#taskAuthor textarea").val();
			eventRefence.urlFile = urlFile;
			eventRefence.idPosicion = id;
			eventRefence.hour = hora;
			eventRefence.fileUrl = urlFile;
			eventRefence.networks.facebook = facebook;
			eventRefence.networks.twitter = twitter;
			eventRefence.networks.instagram = instagram;
			eventRefence.networks.linkedin = linkedin;
			eventRefence.networks.pinterest = pinterest;
			eventRefence.networks.youtube = youtube;
			eventRefence.networks.plus = plus;
			console.log('editar evento');
			console.log('urlFile ', urlFile);
			// $('#calendar').fullCalendar('updateEvent', eventRefence);
			// i = Events.getIndexBy("start", fechaSelect)
			
			// Events[i] = eventRefence;
			
			// Events = $('#calendar').fullCalendar( 'clientEvents');
			// Events[tv.getIndexBy("start", eventRefence.start)] = eventRefence;
			// console.log(Events)
		}else{
			console.log("crear nuevo evento");
			$('#calendar').fullCalendar('removeEvents');
			newEvent = {
				title: $("#taskText textarea").val(),
				start: fechaSelect,
				constraint: $("#taskDescription textarea").val(), // defined below
				color: '#257e4a',
				author: $("#taskAuthor textarea").val(),
				urlFile: urlFile,
				idPosicion:id,
				hour:hora,
				fileUrl:urlFile,
				networks:{
					facebook:facebook,
					twitter:twitter,
					instagram:instagram,
					linkedin:linkedin,
					pinterest:pinterest,
					youtube:youtube,
					plus:plus
				}
			};
			Events.push(newEvent);
			$('#calendar').fullCalendar( 'addEventSource', Events);
		}
		
		

		$.ajax({
			type: "POST",
			data: {eventos: $('#calendar').fullCalendar('clientEvents')},
			dataType: "json",
			url: PUBLIC_PATH + 'calendario/index/guardar'
			// ,
			// success: function(data){
			// 	console.log(data);
			// 	urlFile = data.urlFile;
			// }
		})
		$("#agregar").hide();
		
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

		
		//$(".texto").val("");
	});
	$('#upload').click(function(){
		$('#uploadModule').toggle( 'display' );
	});
	//generar pdf
	var doc = new jsPDF();
	

	$('#iconos .fa-download').click(function () {		
	   /* var table = $('.fc-view-container div table').tableToJSON();
	    console.log('table > ', table);
        var doc = new jsPDF('p','pt', 'a4', true);
        doc.cellInitialize();
        $.each(table, function (i, row){
            console.debug(row);
            $.each(row, function (j, cell){
                doc.cell(0, 50,50, 50, cell, i);  // 2nd parameter=top margin,1st=left margin 3rd=row cell width 4th=Row height
            })
        })
	    doc.save('sample-file.pdf');*/
	    var calendarHtml = $('.fc-view-container div').html();
	    var dat = {datos:calendarHtml}
	    $.ajax({
            url: '../php/generarPdf.php',  
            type: 'POST',
            // Form data
            //datos del formulario
            data:dat,
            //mientras enviamos el archivo
            success: function(data){
                //console.log('calendario enviado data:', calendarHtml);
            },
            //si ha ocurrido un error
            error: function(){
                console.log('error al enviar el calendario');
            }
        });
	});
	
}
function SetEventsCalendar(){
	setTimeout(function(){				
		if(Eventos != undefined || Eventos != null){
			console.log('setevents ',Eventos.length);
			$('#calendar').fullCalendar( 'addEventSource', Eventos);
			Events = Eventos;
			id = Eventos.length;
		}
	},300);
}
function editEvents(evento){
	console.log("edit event ",evento);
	eventRefence = evento;
	$("#taskText textarea").val(evento.title);
	fechaSelect=evento.start._i;
	console.log("currentId",evento.idPosicion)
	$("#taskDescription textarea").val(evento.constraint);
	color = evento.color,
	$("#taskAuthor textarea").val(evento.author),
	currentId = evento.idPosicion;
	hora = evento.hour;
	$("#timepicker1").val(hora);
	$("#imaEvent").html("<img src='"+PUBLIC_PATH+evento.urlFile+"' />")
	urlFile = evento.urlFile;
	facebook= evento.networks.facebook;
	lightNetworks2("facebook");
	twitter= evento.networks.twitter;
	lightNetworks2("twitter");
	instagram= evento.networks.instagram;
	lightNetworks2("instagram");
	linkedin= evento.networks.linkedin;
	lightNetworks2("linkedin");
	pinterest= evento.networks.pinterest;
	lightNetworks2("pinterest");
	youtube= evento.networks.youtube;
	lightNetworks2("youtube");
	plus= evento.networks.plus;
	lightNetworks2("plus");



	function stringToBoolean(string){
		console.log('string rec',string)
	    switch(string.toLowerCase().trim()){
	        case "true": case "yes": case "1": return "true";
	        case "false": case "no": case "0": case null: return "false";
	        default: return Boolean(string);
	    }
	}
	editando = true;
	$("#agregar").show();
}

function lightNetworks(idButton){
	switch(idButton){
			case "facebook":
			twitter = "false";
			$('#redes ul li #twitter').css('color', '#333');
			instagram = "false";
			$('#redes ul li #instagram').css('color', '#333');
			linkedin = "false";
			$('#redes ul li #linkedin').css('color', '#333');
			pinterest = "false";
			$('#redes ul li #pinterest').css('color', '#333');
			youtube = "false";
			$('#redes ul li #youtube').css('color', '#333');
			plus = "false";
			$('#redes ul li #plus').css('color', '#333');
			if(facebook == "true"){
				facebook = "false";
				$('#redes ul li #facebook').css('color', '#333');
			}else{
				$('#redes ul li #facebook').css('color', '#3a5a98');
				facebook = "true";				
			}
			break;
			case "twitter":
			facebook = "false";
			$('#redes ul li #facebook').css('color', '#333');
			instagram = "false";
			$('#redes ul li #instagram').css('color', '#333');
			linkedin = "false";
			$('#redes ul li #linkedin').css('color', '#333');
			pinterest = "false";
			$('#redes ul li #pinterest').css('color', '#333');
			youtube = "false";
			$('#redes ul li #youtube').css('color', '#333');
			plus = "false";
			$('#redes ul li #plus').css('color', '#333');
			if(twitter == "true"){
				twitter = "false";
				$('#redes ul li #twitter').css('color', '#333');
			}else{
				twitter = "true";				
				$('#redes ul li #twitter').css('color', '#60caef');
			}
			break;
			case "instagram":
			facebook = "false";
			$('#redes ul li #facebook').css('color', '#333');
			twitter = "false";
			$('#redes ul li #twitter').css('color', '#333');
			linkedin = "false";
			$('#redes ul li #linkedin').css('color', '#333');
			pinterest = "false";
			$('#redes ul li #pinterest').css('color', '#333');
			youtube = "false";
			$('#redes ul li #youtube').css('color', '#333');
			plus = "false";
			$('#redes ul li #plus').css('color', '#333');
			if(instagram == "true"){
				instagram = "false";
				$('#redes ul li #instagram').css('color', '#333');
			}else{
				instagram = "true";	
				$('#redes ul li #instagram').css('color', '#326699');
			}
			break;
			case "linkedin":
			facebook = "false";
			$('#redes ul li #facebook').css('color', '#333');
			twitter = "false";
			$('#redes ul li #twitter').css('color', '#333');
			instagram = "false";
			$('#redes ul li #instagram').css('color', '#333');
			pinterest = "false";
			$('#redes ul li #pinterest').css('color', '#333');
			youtube = "false";
			$('#redes ul li #youtube').css('color', '#333');
			plus = "false";
			$('#redes ul li #plus').css('color', '#333');
			if(linkedin == "true"){
				linkedin = "false";
				$('#redes ul li #linkedin').css('color', '#333');
			}else{
				linkedin = "true";	
				$('#redes ul li #linkedin').css('color', '#0177b5');
			}
			break;
			case "pinterest":
			facebook = "false";
			$('#redes ul li #facebook').css('color', '#333');
			twitter = "false";
			$('#redes ul li #twitter').css('color', '#333');
			instagram = "false";
			$('#redes ul li #instagram').css('color', '#333');
			linkedin = "false";
			$('#redes ul li #linkedin').css('color', '#333');
			youtube = "false";
			$('#redes ul li #youtube').css('color', '#333');
			plus = "false";
			$('#redes ul li #plus').css('color', '#333');
			if(pinterest == "true"){
				pinterest = "false";
				$('#redes ul li #pinterest').css('color', '#333');
			}else{
				pinterest = "true";
				$('#redes ul li #pinterest').css('color', '#840d16');
			}
			break;
			case "youtube":
			facebook = "false";
			$('#redes ul li #facebook').css('color', '#333');
			twitter = "false";
			$('#redes ul li #twitter').css('color', '#333');
			instagram = "false";
			$('#redes ul li #instagram').css('color', '#333');
			linkedin = "false";
			$('#redes ul li #linkedin').css('color', '#333');
			pinterest = "false";
			$('#redes ul li #pinterest').css('color', '#333');
			plus = "false";
			$('#redes ul li #plus').css('color', '#333');
			if(youtube == "true"){
				youtube = "false";
				$('#redes ul li #youtube').css('color', '#333');
			}else{
				youtube = "true";		
				$('#redes ul li #youtube').css('color', '#ca2128');
			}
			break;
			case "plus":
			facebook = "false";
			$('#redes ul li #facebook').css('color', '#333');
			twitter = "false";
			$('#redes ul li #twitter').css('color', '#333');
			instagram = "false";
			$('#redes ul li #instagram').css('color', '#333');
			linkedin = "false";
			$('#redes ul li #linkedin').css('color', '#333');
			pinterest = "false";
			$('#redes ul li #pinterest').css('color', '#333');
			youtube = "false";
			$('#redes ul li #youtube').css('color', '#333');
			if(plus == "true"){
				plus = "false";
				$('#redes ul li #plus').css('color', '#333');
			}else{
				plus = "true";		
				$('#redes ul li #plus').css('color', '#e54a55');	
			}
			break;
		}
}
function lightNetworks2(idButton){
	switch(idButton){
			case "facebook":
			if(facebook == "false"){
				$('#redes ul li #facebook').css('color', '#333');
			}else{
				$('#redes ul li #facebook').css('color', '#3a5a98');				
			}
			break;
			case "twitter":
			if(twitter == "false"){
				$('#redes ul li #twitter').css('color', '#333');
			}else{			
				$('#redes ul li #twitter').css('color', '#60caef');
			}
			break;
			case "instagram":
			if(instagram == "false"){
				$('#redes ul li #instagram').css('color', '#333');
			}else{
				$('#redes ul li #instagram').css('color', '#326699');
			}
			break;
			case "linkedin":
			if(linkedin == "false"){
				$('#redes ul li #linkedin').css('color', '#333');
			}else{	
				$('#redes ul li #linkedin').css('color', '#0177b5');
			}
			break;
			case "pinterest":
			if(pinterest == "false"){
				$('#redes ul li #pinterest').css('color', '#333');
			}else{
				$('#redes ul li #pinterest').css('color', '#840d16');
			}
			break;
			case "youtube":
			if(youtube == "false"){
				$('#redes ul li #youtube').css('color', '#333');
			}else{	
				$('#redes ul li #youtube').css('color', '#ca2128');
			}
			break;
			case "plus":
			if(plus == "false"){
				$('#redes ul li #plus').css('color', '#333');
			}else{	
				$('#redes ul li #plus').css('color', '#e54a55');	
			}
			break;
		}
}

Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
}