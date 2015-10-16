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
    
    public $page_title = 'Principal';
    
    public $page_module = 'Dashboard';
    
    public function index() { 
        $this->eventos = Calendario::getCalendario(Session::get('id'));
    }

}
