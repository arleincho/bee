$(document).ready(function() {
	$("#agregar").hide();
	
   crearCalendario();
});

var facebook = false;
var twitter = false;
var instagram = false;
var linkedin = false;
var pinterest = false;
var youtube = false;
var plus = false;

function crearCalendario(){
	 $('#calendar').fullCalendar({
		editable: true,
		eventStartEditable:true,
		dragable:true,
		fixedWeekCount :false,

		
	    eventClick: function(calEvent, jsEvent, view) {
	        alert('Event: ' + calEvent.title+', author:'+calEvent.author);
	    },
	    dayMouseover: function( event, jsEvent, view ) {
	    	console.log('roll over' +date);
	    },
	    dayMouseout: function( event, jsEvent, view ) {
	    	console.log('roll out' +date);
	    }
    });
	var Events=[];

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    var alto = $(window).width() / 2.4;

    $('#calendar').fullCalendar('option', 'height', alto);

    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();


    $( ".fc-left" ).empty();
   	$( ".fc-left" ).append('<h2 style="display: block; float: right">' + months[month] + '</h2><span style="display: block; float: right; clear: both; margin-top: -14px; position: relative;">'+year+'</span>');

   	var fechaSelect;
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
	$("#dtBox").DateTimePicker({// "date", "time", or "datetime"
				mode: "time",
				defaultDate: new Date(),

				dateSeparator: "-",
				timeSeparator: ":",
				timeMeridiemSeparator: " ",
				dateTimeSeparator: " "

				/*dateTimeFormat: "dd-MM-yyyy HH:mm:ss",
				dateFormat: "dd-MM-yyyy",
				timeFormat: "HH:mm",

				maxDate: null,
				minDate:  null,

				maxTime: null,
				minTime: null,

				maxDateTime: null,
				minDateTime: null,

				shortDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				fullDayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				shortMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				fullMonthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
				formatHumanDate: function(sDate) 
				{
				  return sDate.dayShort + ", " + sDate.month + " " + sDate.dd + ", " + sDate.yyyy;
				},

				minuteInterval: 1,
				roundOffMinutes: true,

				titleContentDate: "Set Date",
				titleContentTime: "Set Time",
				titleContentDateTime: "Set Date & Time",

				buttonsToDisplay: ["HeaderCloseButton", "SetButton", "ClearButton"],
				setButtonContent: "Set",
				clearButtonContent: "Clear",
				setValueInTextboxOnEveryClick: false,

				animationDuration: 400,

				isPopup: true,

				parentElement: null,

				addEventHandlers: null,  // addEventHandlers(oDateTimePicker)
				beforeShow: null,  // beforeShow(oInputElement)
				afterShow: null,  // afterShow(oInputElement)
				beforeHide: null,  // beforeHide(oInputElement)
				afterHide: null,  // afterHide(oInputElement)
				buttonClicked: null  // buttonClicked(sButtonType, oInputElement) where sButtonType = "SET"|"CLEAR"|"CANCEL"*/
			}
		);
	$("#discard").click(function(){
		$("#agregar").hide();
	});
	//click redes
	$(".fa").click(function(){
		switch(this.id){
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
	});
	$("#save").click(function(){
		newEvent = {
				title: $("#taskText textarea").val(),
				start: fechaSelect,
				constraint: $("#taskDescription textarea").val(), // defined below
				color: '#257e4a',
				author: $("#taskAuthor textarea").val(),
				file: "urlFile",
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
		
		console.log("Events = ", Events);
	});
}