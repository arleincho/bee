<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */

Load::models('calendario/calendario', 'calendario/reporte', 'calendario/evento');

class IndexController extends BackendController {
    
    public $page_title = 'Principal';
    
    public $page_module = 'Dashboard';
    
    public function index() {

    	$usuario_id = Session::get('id');

        //$this->eventos = Calendario::getCalendario($usuario_id);
        $this->eventos = Evento::getListadoEventos($usuario_id);
        

        $reporte = new Reporte();
        $this->progress_report = $reporte->getListadoReportePorTipo($usuario_id, 'progress_report');
        $this->demographics_report = $reporte->getListadoReportePorTipo($usuario_id, 'demographics_report');
        $this->beehive_report = $reporte->getListadoReportePorTipo($usuario_id, 'beehive_report');
        $this->read_only = false;
    }

}
