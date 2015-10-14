<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */

Load::models('calendario/calendario');

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



}
