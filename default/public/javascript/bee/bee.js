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

var addImageNew = null;

var menuHide = false;

$(document).ready(function() {
	
	
   	//document.getElementsByClassName('fc-day').addEventListener('click', AgregarFuncionDias);
	$("#agregar").hide();
	$('#uploadModule').hide();
	$(".alert").hide();
    crearCalendario();

    SetEventsCalendar();

    reSise();
   
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

        console.log("eventRefence", eventRefence);

        //información del formulario
        var formData = new FormData();
        formData.append('archivo', $('#imagen')[0].files[0])
        formData.append('fechaSelect', fechaSelect)
        formData.append('hora', $("#timepicker1").val())
        formData.append('id', (eventRefence != null)?eventRefence._id : null)

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
                Events.push(data);
				$('#calendar').fullCalendar( 'addEventSource', Events);
				// editEvents(data);
				addImageNew = data.id;
            },
            //si ha ocurrido un error
            error: function(e){
            	addImageNew = null;
                message = $("<span class='error'>Error.</span>");
                console.log('data.error ', e);
            }
        });
    });
	if($(window).width()< 720){
		$('#calendar').fullCalendar( 'changeView', 'basicDay' );
		AgregarFuncionDias();
	}
	
	$('#menu').click(function(){
		if($(window).width()< 720){
		    console.log('click, ', menuHide);
		    if(!menuHide){
		        $('#panels').animate({left: 0},300);
		        setTimeout(function(){menuHide = true;},700)
		    }else{
		        $('#panels').animate({left: -300},300);
		        setTimeout(function(){menuHide = false;},700)
		    }
			
		}
	});

$( window ).resize(function() {
  reSise();
});
function AgregarFuncionDias(){

   		$(".fc-day").click(function(){
			//setear iconos redes deseleccionados
			if(readOnly['read_only'] == false){
				console.log("click dia");
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
				addImageNew = null;
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
				
				fechaSelect = $(this).context.dataset.date;
				console.log('crear evento nuevo : ', fechaSelect);
				var dt = new Date();
				var _hora;
				var aa;
				if(dt.getHours() > 11){
					_hora = dt.getHours()-12;
					aa = ' pm';
				}else{
					_hora = dt.getHours();
					aa = ' am';
				}

				var minutos;
				if(dt.getMinutes() < 10){
					minutos = '0'+dt.getMinutes();
				}else{
					minutos = dt.getMinutes();
				}

				$("#taskText textarea").val("add task");
				$("#taskDescription textarea").val("add description");
				$("#taskAuthor textarea").val("author name");
				$("#taskNotes textarea").val("Notes/Changes");
				$("#imaEvent").html('<img src="http://beesocialgroup.com/test/img/upload/indice.png">');
				var fecAr = fechaSelect.split('-');
				var fechaInicio = fecAr[1]+'-'+fecAr[2]+'-'+fecAr[0];

				$('#datepairExample input')[0].value = fechaInicio;//(dt.getMonth()+1) + "-" + dt.getDate() + "-" + dt.getFullYear();
				$('#datepairExample input')[1].value = _hora + ":" + minutos + aa;
				$('#datepairExample input')[2].value = fecAr[1]+'-'+(parseInt(fecAr[2])+1)+'-'+fecAr[0];//(dt.getMonth()+1) + "-" + dt.getDate() + "-" + dt.getFullYear();
				$('#datepairExample input')[3].value = _hora + ":" + minutos + aa;
				
				$("#delete").hide();
				$("#agregar").show();
				$(".alert").hide();
				$("#taskCont").show();	
				$(".message").hide();

				$("#taskText textarea").click(function(){
					$("#taskText textarea").val("");
				})
				$("#taskDescription textarea").click(function(){
					if($("#taskDescription textarea").val() == 'add task'){
						$("#taskDescription textarea").val("");
					}				
				})
				$("#taskAuthor textarea").click(function(){
					$("#taskAuthor textarea").val("");
				});
				$("#taskNotes textarea").click(function(){
					$("#taskNotes textarea").val("");
				});

				$('#redes ul li #facebook').css('color', '#333');
				$('#redes ul li #twitter').css('color', '#333');
				$('#redes ul li #instagram').css('color', '#333');
				$('#redes ul li #linkedin').css('color', '#333');
				$('#redes ul li #pinterest').css('color', '#333');
				$('#redes ul li #youtube').css('color', '#333');
				$('#redes ul li #plus').css('color', '#333');

				$('.datepicker').datepicker('daysOfWeekHighlighted ', fechaInicio);
			}
			
			
		});
}	
function reSise(){
	console.log('resize');
	$('.edit').css('margin-top', ($('.fc-day').height()-20));
	$(window).resize(function(){if($(window).width()< 720){
		$('#calendar').fullCalendar( 'changeView', 'basicDay' );
		//AgregarFuncionDias();
	}})
}
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
		eventLimit: true, // for all non-agenda views
	    views: {
	        agenda: {
	            eventLimit: 2 // adjust to 6 only for agendaWeek/agendaDay
	        }
	    },
	    dropAccept: '*',
	    eventOverlap: function(stillEvent, movingEvent) {
	        return stillEvent.allDay && movingEvent.allDay;
	    },
	    eventDrop: function(event, delta, revertFunc) {

	        console.log(event.title + " was dropped on " + event.start.format());

	    },
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
    
    var alto = $(window).width() / 1.1;

    $('#calendar').fullCalendar('option', 'height', alto);

    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();


    $( ".fc-left" ).empty();
   	$( ".fc-left" ).append('<h2 style="display: block; float: right">' + months[month] + 
   		'</h2>'+
   			'<span id="buttonsCalendar">'+
   				'<span id="Share" class="arrow">'+
	   				'<i class="fa fa-share"></i>'+
	   			'</span>'+
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
   		if($(window).width()< 720){
			AgregarFuncionDias();
		}
   	});
   	$("#nextButton").click(function(){
   		$('#calendar').fullCalendar('next');
   		if($(window).width()< 720){
			AgregarFuncionDias();
		}
   	});
   	
   	AgregarFuncionDias();
	//$('#timepicker1').timepicker();
	///TIME PICKER//////////////////////
	// initialize input widgets first
	    $('#datepairExample .time').timepicker({
	        'showDuration': true,
	        'timeFormat': 'g:ia'
	    });

	    $('#datepairExample .date').datepicker({
	        'format': 'mm-dd-yyyy',
	        'startDate': '-1d',
	        'autoclose': true
	    });
	    
	    // initialize datepair
	    $('#datepairExample').datepair();

	   ////tIME PICKER END

	$("#discard").click(function(){
		$("#agregar").hide();
		$(".alert").hide();
		$("#imaEvent").html("<img src='' />");
		editando = false;
		addImageNew = null;
	});
	$("#discard2").click(function(){
		$("#mail").hide();
		$("#subject textarea").val("");
		$("#message textarea").val("");
	});
	//click redes
	$(".fa").click(function(){
		lightNetworks(this.id);
		$("#taskDescription").removeClass('rojo');
		$("#taskAuthor").removeClass('rojo');
		$("#redes").removeClass('rojo');
	});
	
	
	$("#save").click(function(){
		dataSend = [];
		var d1 = $('#datepairExample input')[0].value;
		var hora1 = $('#datepairExample input')[1].value;
		var d2 = $('#datepairExample input')[2].value;
		var hora2 = $('#datepairExample input')[3].value;
		$(".alert").hide();
		$("#taskDescription").removeClass('rojo');
		$("#taskAuthor").removeClass('rojo');
		var dia1Array = d1.split('-');
		var dia2Array = d2.split('-');
		
		var dia1 = dia1Array[2]+'-'+dia1Array[0]+'-'+dia1Array[1];
		var dia2 = dia2Array[2]+'-'+dia2Array[0]+'-'+dia2Array[1];
		console.log("editando", editando);
		console.log("dia2Array", dia2);

		console.log("Save");
		//$('#calendar').fullCalendar( 'removeEventSource', Events);
		var RedSeleccionada = comprobarSeleccionRed();
		if(RedSeleccionada == "true"){
            eventSend = {}
			if($("#taskDescription textarea").val() != "" && $("#taskAuthor textarea").val() != "" && $("#taskDescription textarea").val() != "add description" && $("#taskAuthor textarea").val() != "author name"){

				if ($.isNumeric(addImageNew)){
					eventRefence = $("#calendar").fullCalendar('clientEvents', addImageNew);
					if (eventRefence.length == 1){
						eventRefence = eventRefence[0]
						editando = true;
					}
				}
				if(editando == true){		
					console.log("modificar evento")	
					eventRefence.title = $("#taskText textarea").val();

					var tareaText = $("#taskDescription textarea").val();
					var notesText = $("#taskNotes textarea").val();

					eventRefence.description = unescape(tareaText); // defined below
					eventRefence.color = '#257e4a';
					eventRefence.author = $("#taskAuthor textarea").val();
					eventRefence.notes = unescape(notesText);
					eventRefence.urlFile = urlFile;
					eventRefence.idPosicion = id;
					eventRefence.hour1 = hora1;
					eventRefence.day1 = dia1;
					eventRefence.hour2 = hora2;
					eventRefence.day2 = dia2;
					eventRefence.fileUrl = urlFile;
					eventRefence.start = dia1;
					eventRefence.end = dia2;
					eventRefence.networks.facebook = facebook;
					eventRefence.networks.twitter = twitter;
					eventRefence.networks.instagram = instagram;
					eventRefence.networks.linkedin = linkedin;
					eventRefence.networks.pinterest = pinterest;
					eventRefence.networks.youtube = youtube;
					eventRefence.networks.plus = plus;
					console.log('editar evento');

					console.log('urlFile ', urlFile);
					console.log('eventRefence', eventRefence);

                    accion = 'editar/' + eventRefence._id;
                    newEvent = {
                        id: eventRefence._id, 
                        title:  escape($("#taskText textarea").val()),
                        start: dia1,
                        end: dia2,
                        description: escape(tareaText), // defined below
                        color: '#257e4a',
                        author: $("#taskAuthor textarea").val(),
                        notes: escape(notesText),
                        urlFile: urlFile,
                        idPosicion:id,
                        hour1: hora1,
                        day1: dia1,
                        hour2: hora2,
                        day2: dia2,
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

					$('#calendar').fullCalendar('updateEvent', eventRefence);
		            
				}else{

                    accion = 'guardar'
					console.log("crear nuevo evento");
					$('#calendar').fullCalendar('removeEvents');
					var tareaText2 = $("#taskDescription textarea").val();
					var notesText2 = $("#taskNotes textarea").val();
					newEvent = {
						title: escape($("#taskText textarea").val()),
						start: dia1,
						end: dia2,
						description: escape(tareaText2), // defined below
						color: '#257e4a',
						author: $("#taskAuthor textarea").val(),
						notes: escape(notesText2),
						urlFile: urlFile,
						idPosicion:id,
						hour1: hora1,
						day1: dia1,
						hour2: hora2,
						day2: dia2,
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
                    eventSend = eventRefence;
					Events.push(newEvent);
					$('#calendar').fullCalendar( 'addEventSource', Events);
				}
				$("#taskCont").hide();				
				console.log('ejecutar guardado');
				editando = false;
				$(".message").html('Saving...');
				$(".message").show();
                console.log("esto es lo que se envia para la creacion de eventos:", dataSend)
				$.ajax({
					type: "POST",
					data: {eventos: newEvent},
					dataType: "json",
					url: PUBLIC_PATH + 'calendario/index/' + accion,
					
					success:function(data){
						console.log('guardado exitoso');
						addImageNew = null;
						editando = false;
		                $(".message").html('Saving suscessfully');
						$(".message").show();
						setTimeout(function(){
							$("#agregar").hide();
						},600);
					},
					error:function(data){
						console.log('error al guardar, ');
						$(".message").html('Error saving, the database not respond');
						$(".message").show();
						setTimeout(function(){
							$("#agregar").hide();
						},1000);
					}
				})
				// console.log("Events = ", Events);
			}else{
				if($("#taskDescription textarea").val() == "add description" || $("#taskDescription textarea").val() == ""){
					Rojo('taskDescription');
				}else if($("#taskAuthor textarea").val() == "author name" || $("#taskAuthor textarea").val() == ""){
					Rojo('taskAuthor');
				}				
			}
		}else{
			Rojo('redes');
		}
	});
	function Rojo(objname){
		$('#'+objname).addClass('rojo');
		$(".alert").show();
	}
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
            // Form dataset
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
	$('#subject input').click(function(){
		$('#subject input').val('');
	});
	$('#mail').hide();
	$('#Share').click(function(){
		$('#mail').show();
		$('#subject input').val('Type Mail');		
	});
	$('#sendMessage').click(function(){
		console.log('enviar mensaje')
		var email = $("#subject input").val();
            validacion_email = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
            // mensaje = $("#message textarea").val();
            mensaje = "Greetings,<br><br>Please view your upcoming social media planning week on Bee Social Group's calendar. Click on the <a href='http://www.beesocialgroup.com/test/'>link</a> to view details. (Please note, you must be logged in to view details)<br><br><strong>Additional Notes:</strong><br><br>" + $("#message textarea").val();
 
        // if(email == "" || !validacion_email.test(email)){
        if(email == ""){
            $("#subject input").focus();    
            return false;
        }else if(mensaje == ""){
            $("#message textarea").focus();
            return false;
        }else{
            var datos = 'name=Bee' + '&email=' + email + '&message=' + mensaje;

			$.ajax({
			    type: "POST",
			    url: PUBLIC_PATH + 'calendario/index/enviar',
			    data: datos,
			    success: function() {
			    	console.log('enviado')  
			        $("#mail").hide();
					$("#subject textarea").val("");
					$("#message textarea").val("");
			    },
			    error: function() {
			        console.log('fallo al enviar')
			        $('.msg').text('Hubo un error!').addClass('msg_error').animate({ 'right' : '130px' }, 300); 
			        $("#mail").hide();                
			    }
			});
        }
	})
	
}
function SetEventsCalendar(){
	console.log("Setear Eventos" , Eventos);
	setTimeout(function(){				
		if(Eventos == undefined || Eventos == null || Eventos == ""){
			Eventos = [];
			Events = [];			
		}else{
			console.log('setevents ',Eventos.length);
			$('#calendar').fullCalendar( 'addEventSource', Eventos);
			Events = Eventos;
			id = Eventos.length;
		}
		console.log("Setear Eventos", Eventos);
	},300);
}
function editEvents(evento){
	console.log("edit event ",evento);
	eventRefence = evento;
	$("#taskText textarea").val(evento.title);
	fechaSelect=evento.start._i;
	console.log("currentId",evento.idPosicion)
	$("#taskDescription textarea").val(unescape(evento.description));
	color = evento.color,
	$("#taskAuthor textarea").val(evento.author),
	$("#taskNotes textarea").val(unescape(evento.notes)),
	currentId = evento.idPosicion;
	hora = evento.hour;
	$("#timepicker1").val(hora);
	$("#imaEvent").html('<a href="'+PUBLIC_PATH+evento.urlFile+'" ><i class="fa fa-download"></i></a><img src="'+PUBLIC_PATH+evento.urlFile+'" />');

	var dia1Array = evento.day1.split('-');
	var dia2Array = evento.day2.split('-');
	
	var dia1 = dia1Array[1]+'-'+dia1Array[2]+'-'+dia1Array[0];
	var dia2 = dia2Array[1]+'-'+dia2Array[2]+'-'+dia2Array[0];

	$('#datepairExample input')[0].value = dia1;
	$('#datepairExample input')[1].value = evento.hour1;
	$('#datepairExample input')[2].value = dia2;
	$('#datepairExample input')[3].value = evento.hour2;
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
	editando = true;
		$("#delete").show();
		$("#agregar").show();
	if(readOnly['read_only'] == true){
		$("#delete").hide();
		$("#save").hide();
		$("#upload").hide();
	}
	$("#taskCont").show();	
	$(".message").hide();
}
function stringToBoolean(string){
	console.log('string rec',string)
    switch(string.toLowerCase().trim()){
        case "true": case "yes": case "1": return "true";
        case "false": case "no": case "0": case null: return "false";
        default: return Boolean(string);
    }
}
$("#delete").click(function(e){
	if($(e.target).is('#delete')){
		console.log("eliminar");

        console.log("eventRefence._id", eventRefence._id);
        _id = eventRefence._id;

/*		$('#calendar').fullCalendar('removeEvents', function(_id){
            return true;
        });*/

        
		//var dataEvents = $('#calendar').fullCalendar('clientEvents');
        //Events = []



		/*var dataSend = [];
		if(dataEvents.length > 0){
			//almacenamos la informacion como objetos json
			console.log('convertir info: ',dataEvents);

            $.each($('#calendar').fullCalendar('clientEvents'), function(k, v){

                newEvent = {
                    start: v.day1,
                    end: v.day2,
                    description: v.description, // defined below
                    color: v.color,
                    author: v.autor,
                    urlFile: v.urlFile,
                    idPosicion: v.idPosicion,
                    hour1: v.hour1,
                    day1: v.day1,
                    hour2: v.hour2,
                    day2: v.day2,
                    fileUrl: v.fileUrl,
                    networks:{
                        facebook: v.networks.facebook,
                        twitter: v.networks.twitter,
                        instagram: v.networks.instagram,
                        linkedin: v.networks.linkedin,
                        pinterest: v.networks.pinterest,
                        youtube: v.networks.youtube,
                        plus: v.networks.plus
                    }
                };
               dataSend.push(newEvent)
            })
			
		}*/
		
		
        $("#taskCont").hide();	
		$(".message").html('Deleting...');
		$(".message").show();	
		$.ajax({
			type: "POST",
			//data: {eventos: {id: eventRefence._id}},
			dataType: "json",
			url: PUBLIC_PATH + 'calendario/index/eliminar/' + eventRefence._id,
			success:function(data){
				console.log('eliminado exitoso');
                $('#calendar').fullCalendar('removeEvents', eventRefence._id);                
				$(".message").html('Deleting successfully');
				$(".message").show();
				setTimeout(function(){
					$("#agregar").hide();
				},600);
			},
			error:function(data){
				console.log('error al eliminar, ');
				$(".message").html("Deleting Error, cant't connect to database");
				$(".message").show();
				setTimeout(function(){
					$("#agregar").hide();
				},600);
			}
		});
        /*.always(function() {
            $('#calendar').fullCalendar('removeEvents', eventRefence._id);
        });*/
		//Events = dataSend;
		
		//
	}
});

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
				$('#redes ul li #instagram').css('color', '#895a4d');
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
				$('#redes ul li #instagram').css('color', '#895a4d');
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
function comprobarSeleccionRed(){
		if(facebook == "true"){
			return "true";
		}else if(twitter == "true"){
			return "true";
		}else if(instagram == "true"){
			return "true";
		}else if(linkedin == "true"){
			return "true";
		}else if(pinterest == "true"){
			return "true";
		}else if(youtube == "true"){
			return "true";
		}else if(plus == "true"){
			return "true";
		}else{
			return "false";
		}
		return "false";
	}
Array.prototype.getIndexBy = function (name, value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][name] == value) {
            return i;
        }
    }
}

});