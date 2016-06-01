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
    
    public function changed() {

        View::select('index');

        $usuario_id = Session::get('id');

        $this->eventos = Calendario::getCalendario($usuario_id);

        // $this->eventos = Evento::getListadoEventos($usuario_id);
        $this->eventos = json_encode($this->eventos);
        

        $reporte = new Reporte();
        $this->progress_report = $reporte->getListadoReportePorTipo($usuario_id, 'progress_report');
        $this->demographics_report = $reporte->getListadoReportePorTipo($usuario_id, 'demographics_report');
        $this->beehive_report = $reporte->getListadoReportePorTipo($usuario_id, 'beehive_report');
        $this->read_only = false;
    }


    public function index() {

        $usuario_id = Session::get('id');

        $this->eventos = Evento::getListadoEventos($usuario_id);
        
        $reporte = new Reporte();
        $this->progress_report = $reporte->getListadoReportePorTipo($usuario_id, 'progress_report');
        $this->demographics_report = $reporte->getListadoReportePorTipo($usuario_id, 'demographics_report');
        $this->beehive_report = $reporte->getListadoReportePorTipo($usuario_id, 'beehive_report');
        $this->read_only = false;
    }



    // public function migrate() {

    //     View::select(null, null);
    //     $this->data = array();
    //     $all = Calendario::all();
    //     foreach ($all as $key => $value) {
    //         $usuario_id = $value->usuario_id;
    //         $data = json_decode($value->configuracion, true);
    //         foreach ($data as $keyData => $valueData) {
    //             $valueData['description'] = $valueData['constraint'];
    //             $result = Evento::setEvento('create', $valueData, $usuario_id);
    //             if ($result){
    //                 $this->data[$result->id]['ori'] = $valueData;
    //                 $this->data[$result->id]['end'] = $result;
    //             }
    //         }
    //     }
    //     View::json();
    // }

}