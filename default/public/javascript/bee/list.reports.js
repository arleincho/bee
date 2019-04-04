$(function(){
    $.ajax({ dataType: "script",cache: true, url: 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.5.0/js/bootstrap-datepicker.min.js'}).done(function(){    
        $("#reporte\\[date_report\\]").datepicker({
            orientation: "bottom",
            format: "yyyy-mm",
            viewMode: "months", 
            minViewMode: "months"
        }).on('changeDate', function(e){
            $('#progress_report').prop('disabled', false);
            $('#demographics_report').prop('disabled', false);
            $('#beehive_report').prop('disabled', false);
        })
    });
    selectTab = function(){
        a = $('.nav-tabs a:last');
        console.log(a)
        href = a.attr('href').replace(/\/$/g, '');
        console.log(href)
        a.attr('href', href);
        a.tab('show')
    }
});