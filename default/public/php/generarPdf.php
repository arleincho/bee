<?php 
	$html = $_POST["datos"];
	include('myPdf.class.php');
	//debug_to_console("generarPdf");
	
	 /* Una vez escrito el HTML crearemos el objeto que
	    está dentro de la librería que hemos importado
	 */
	 $pdf = new HTML2FPDF(); 
	 //Añadimos una página al pdf
	 $pdf -> AddPage(); 
	 //escribimos todo el html en esta pagina creada
	 $pdf -> WriteHTML($html);
	 /*Si necesitáramos más pagina abria que repetir la
	 funcion de AddPage() y la de WriteHTML aquí*/
	 
	 /*Finalmente escribimos el nombre de fichero y la 
	 ruta donde lo queremos guardar en este caso la raiz */
	 //$pdf -> Output('tabla_tiempo.pdf');
	 //debug_to_console($html);

	 function debug_to_console( $data ) {

	    if ( is_array( $data ) )
	        $output = "<script>console.log( 'Debug Objects: " . implode( ',', $data) . "' );</script>";
	    else
	        $output = "<script>console.log( 'Debug Objects: " . $data . "' );</script>";

	    echo $output;
	}
 ?>