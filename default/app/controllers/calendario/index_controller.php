<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */

Load::models('calendario/calendario', 'calendario/reporte',  'calendario/evento');

class IndexController extends BackendController {
    
    public $page_title = 'Calendario';
    
    public $page_module = 'Calendario';
    
    public function index() {
        
    }

    public function guardar() {

    	View::select(null, null);

    	if(Input::hasPost('eventos')) {
    		$data = Input::post('eventos');
            if(Evento::setEvento('create', $data, Session::get('id'))){
                if(APP_AJAX) {
                    Flash::valid('El Calendario se ha creado correctamente! <br/>Por favor recarga la página para verificar los cambios.');
                } else {
                    Flash::valid('El Evento se ha creado correctamente!');
                }
            }
        }
    }


    public function fileEventSave() {

        View::select(null, null);
        $data = null;



        if(Input::hasPost('fechaSelect')) {


            $upload = new DwUpload('archivo', 'img/upload/eventos/');
            //$upload->setAllowedTypes('png|jpg|gif|jpeg|png');
            $upload->setEncryptName(TRUE);

            $data = $upload->save();
            if(!$data) { //retorna un array('path'=>'ruta', 'name'=>'nombre.ext');
                var_dump('expressionexpressionexpression');
                $data = array('error'=>TRUE, 'message'=>$upload->getError());
            }else{
                $fecha = Input::post('fechaSelect');
                $hora = Input::post('hora');
                if ($fecha){
                    $this->data = $data;
                    $eventos = Calendario::getCalendario(Session::get('id'));
                    $find = false;

                    if (count($eventos) > 0){
                        foreach ($eventos as $key => $value) {
                            if (isset($value['start']) && $value['start'] == $fecha){
                                $find = true;
                                $eventos[$key]["urlFile"] = "img/upload/eventos/{$this->data['name']}";
                                $return = $eventos[$key];
                            }
                        }
                    }

                    if (!$find){
                        $return = array(
                            "start" => $fecha,
                            "urlFile" => "img/upload/eventos/{$this->data['name']}",
                            "constraint" => "",
                            "author" => "",
                            "hour" => $hora,
                            "networks" => array(
                                "facebook" => "false",
                                "twitter" => "false",
                                "instagram" => "false",
                                "linkedin" => "false",
                                "pinterest" => "false",
                                "youtube" => "false",
                                "plus" => "false"
                            )
                        );
                        $eventos[] = $return;
                    }
                    $data = array('configuracion' => json_encode($eventos), 'usuario_id' => Session::get('id'));
                    if(!Calendario::setCalendario('create', $data)){
                        $return = array('error'=>TRUE, 'message'=>'El archivo no se subio!.');
                    }
                    $this->data = $return;
                }
                View::json();
            }
        }
        
    }


    public function enviar(){
        View::select(null, null);
        $to = Input::post('email');
        $message = Input::post('message');
        Load::model('calendario/mail');
        Mail::send($to, $to, 'Bee Calendar Notification', $message);
        
    }

    public function show($key) {

        if(!$id = Security::getKey($key, 'show_calendar', 'int')) {
            return Redirect::toAction('listar');
        }
        
        $usuario_id = $id;

        $this->eventos = Calendario::getCalendario($usuario_id);

        $reporte = new Reporte();
        $this->progress_report = $reporte->getListadoReportePorTipo($usuario_id, 'progress_report');
        $this->demographics_report = $reporte->getListadoReportePorTipo($usuario_id, 'demographics_report');
        $this->beehive_report = $reporte->getListadoReportePorTipo($usuario_id, 'beehive_report');
        $this->read_only = true;
        View::setPath('dashboard/index');
        View::select('index', 'backend/bee');

    }

}
