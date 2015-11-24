<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */

Load::models('calendario/calendario', 'calendario/reporte');

class IndexController extends BackendController {
    
    public $page_title = 'Calendario';
    
    public $page_module = 'Calendario';
    
    public function index() {
        
    }

    public function guardar() {

    	View::select(null, null);

    	if(Input::hasPost('eventos')) {
    		$data = array('configuracion' => json_encode(Input::post('eventos')), 'usuario_id' => Session::get('id'));
            if(Calendario::setCalendario('create', $data)){
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
            $upload->setAllowedTypes('png|jpg|gif|jpeg|png');
            $upload->setEncryptName(TRUE);

                
            if(!$data = $upload->save()) { //retorna un array('path'=>'ruta', 'name'=>'nombre.ext');
                $data = array('error'=>TRUE, 'message'=>$upload->getError());
            }else{
                $fecha = Input::post('fechaSelect');
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
                            "networks" => array(
                                "facebook" => false,
                                "twitter" => false,
                                "instagram" => false,
                                "linkedin" => false,
                                "pinterest" => false,
                                "youtube" => false,
                                "plus" => falses
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

}
