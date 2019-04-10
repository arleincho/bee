<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */



Load::models('calendario/calendario', 'calendario/reporte',  'calendario/evento', 'calendario/recurrent', 'calendario/recurrent_events');

class IndexController extends BackendController {
    
    public $page_title = 'Calendario';
    
    public $page_module = 'Calendario';
    
    public function index() {
        
    }

    public function guardar() {

        View::select(null, null);
        $this->data = array('success' => false);
        $this->eventos = array();

        if(Input::hasPost('eventos')) {
            $data = Input::post('eventos');

            if (isset($data['start']) && $data['start'] != "" && isset($data['end']) && $data['end'] != ""){

                $recurrent = Input::post('recurrent');

                if (isset($recurrent['recurrent']) && $recurrent['recurrent'] === "true"){
                    $this->eventos = Calendario::setRecurrente($data, $recurrent, array());
                    if(APP_AJAX) {
                        Flash::valid('El Calendario se ha creado correctamente! <br/>Por favor recarga la página para verificar los cambios.');
                    } else {
                        Flash::valid('El Evento se ha creado correctamente!');
                    }

                }else{
                    if(Evento::setEvento('create', $data, Session::get('id'))){
                        if(APP_AJAX) {
                            Flash::valid('El Calendario se ha creado correctamente! <br/>Por favor recarga la página para verificar los cambios.');
                        } else {
                            Flash::valid('El Evento se ha creado correctamente!');
                        }
                    }
                }
                $this->data = array('success' => true, 'eventos' => $this->eventos);
            }
        }
        View::json();
    }

    public function editar($id=null) {

        View::select(null, null);
        $this->data = array('success' => false, 'eventos' => array());

        if (isset($id) && is_numeric($id)){

            if(Input::hasPost('eventos')) {
                $data = Input::post('eventos');
                if (isset($data['start']) && $data['start'] != "" && isset($data['end']) && $data['end'] != ""){
                    if(Evento::setEvento('update', $data, Session::get('id'))){
                        if(APP_AJAX) {
                            Flash::valid('El Calendario se ha creado correctamente! <br/>Por favor recarga la página para verificar los cambios.');
                            $this->data = array('success' => true);
                        } else {
                            Flash::valid('El Evento se ha creado correctamente!');
                        }
                        $this->data = array('success' => true);
                    }
                }
            }

            $recurrent = Input::post('recurrent');
            if (isset($recurrent['recurrent']) && $recurrent['recurrent'] === "true"){
                $this->data['eventos'] = Calendario::setRecurrente($data, $recurrent, array(0));
                if(APP_AJAX) {
                    Flash::valid('El Calendario se ha creado correctamente! <br/>Por favor recarga la página para verificar los cambios.');
                } else {
                    Flash::valid('El Evento se ha creado correctamente!');
                }
            }
        }
        View::json();
    }

    /**
     * Método para eliminar
     */
    public function eliminar($id) {

        View::select(null, null);
        $this->data = array('success' => false);

        if (isset($id) && is_numeric($id)){
            $evento = new Evento();
            
            if(!$evento->find_first($id)) {
                Flash::error('Lo sentimos, pero no se ha podido establecer la información del evento');
            }
            try {
                if($evento->delete()) {
                    Flash::valid('El evento se ha eliminado correctamente!');
                    $this->data = array('success' => true);
                } else {
                    Flash::warning('Lo sentimos, pero este evento no se puede eliminar.');
                }
            } catch(KumbiaException $e) {
                Flash::error('Este evento no se puede eliminar porque se encuentra relacionado con otro registro.');
            }
        }
        View::json();
    }

    /**
     * Método para eliminar
     */
    public function eliminareventos($id) {

        View::select(null, null);
        $this->data = array('success' => false);

        if (isset($id) && is_numeric($id)){
            try {

                $recurrent = new Recurrent();
                $recurrent->find($id);

                $recurrents = new RecurrentEvents();

                $eventos = $recurrents->find("recurrent_id = {$id}");

                foreach ($eventos as $key => $value) {
                    $evento = new Evento();
                    $evento->delete($value->evento_id);
                }

                $recurrents->delete("recurrent_id = {$id}");
                $recurrent->delete($id);

                $this->eventos = Evento::getListadoEventos(Session::get('id'));
                $this->data = array('success' => true, 'eventos' => $this->eventos);
                
            } catch(KumbiaException $e) {
                Flash::error('Estos eventos no se pueden eliminar');
            }
        }
        View::json();
    }


    public function fileEventSave() {

        View::select(null, null);
        $data = null;



        if(Input::hasPost('fechaSelect')) {

            $tmpFiles = $_FILES;
            $tmpUploads = array();
            if (is_array($tmpFiles) && isset($tmpFiles['files'])){
                foreach ($tmpFiles['files'] as $key => $value) {
                    if ($key == 'tmp_name' && count($value) > 0){
                        foreach ($value as $keyTN => $valueTN) {
                            $_FILES = array(
                                'archivo' => array(
                                    'name' => $tmpFiles['files']['name'][$keyTN],
                                    'type' => $tmpFiles['files']['type'][$keyTN],
                                    'tmp_name' => $tmpFiles['files']['tmp_name'][$keyTN],
                                    'error' => $tmpFiles['files']['error'][$keyTN],
                                    'size' => $tmpFiles['files']['size'][$keyTN],
                                )
                            );
                            $upload = new DwUpload('archivo', 'img/upload/eventos/');
                            //$upload->setAllowedTypes('png|jpg|gif|jpeg|png');
                            $upload->setEncryptName(TRUE);
                            // $this->data = $upload->save();
                            $tmpUploads[] = $upload->save();
                        }
                    }
                }
            }

            // die();


            // $upload = new DwUpload('archivo', 'img/upload/eventos/');
            //$upload->setAllowedTypes('png|jpg|gif|jpeg|png');
            // $upload->setEncryptName(TRUE);

            // $this->data = $upload->save();
            // if(!$this->data) { //retorna un array('path'=>'ruta', 'name'=>'nombre.ext');
            //     $data = array('error'=>TRUE, 'message'=>$upload->getError());
            // }else{
                $fecha = Input::post('fechaSelect');
                $hora = Input::post('hora');
                $id = Input::post('id');

                $urlFiles = array();
                
                if (is_array($tmpUploads) && count($tmpUploads) > 0){
                    foreach ($tmpUploads as $keyTU => $valueTU) {
                        $urlFiles[] = "img/upload/eventos/{$valueTU['name']}";
                    }
                }

                $evento = new Evento();
                if(is_numeric($id) && $evento->find_first($id)) {
                    if (is_array($tmpUploads) && count($tmpUploads) > 0){
                        $evento->urlFiles = json_encode($urlFiles);
                        $evento->urlFile = '';
                    }
                    $evento->update();
                    $data = array('success' => true);
                    $data = $evento;
                    $data->networks = json_decode($data->networks); 
                    $data->urlFiles = $urlFiles;
                }else{

                    $return = array(
                        "start" => $fecha,
                        "urlFiles" => json_encode($urlFiles),
                        "urlFile" => '',
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
                    $data = Evento::setEvento('create', $return, Session::get('id'));
                    $data->networks = json_decode($data->networks);
                    $data->urlFiles = $urlFiles;
                }
            // }
        }
        $this->data = $data;
        
        View::json();
    }


    public function enviar(){
        View::select(null, null);
        $to = Input::post('email');
        $message = Input::post('message');
        Load::model('calendario/mail');
        Mail::send($to, $to, 'Bee Calendar Notification', $message . "</span>");
        
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
