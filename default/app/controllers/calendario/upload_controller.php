<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */

Load::models('calendario/calendario');

class  UploadController extends BackendController {

    public $page_title = 'Subir Ficheros';
    
    public $page_module = 'upload';
    
    public function index() {
        Redirect::toAction('listar');
    }

    public function reports($key, $order='order.perfil.asc', $page='page.1') { 
        $page = (Filter::get($page, 'page') > 0) ? Filter::get($page, 'page') : 1;     
        if(!$id = Security::getKey($key, 'upload_reports', 'int')) {
            return Redirect::toAction('listar');
        }        
        
        $usuario = new Usuario();
        $this->usuarios = $usuario->getListadoUsuariosCalendario('todos', $order, $page);
        
        $this->order = $order;        
        $this->page_title = 'Información del Usuario';
        $this->key = $key;
    }


    /**
     * Método para listar
     */
    public function listar($order='order.id.asc', $page='page.1') { 
        $page = (Filter::get($page, 'page') > 0) ? Filter::get($page, 'page') : 1;
        $usuario = new Usuario();
        $this->usuarios = $usuario->getListadoUsuariosCalendario('todos', $order, $page);
        $this->order = $order;
        $this->page_title = 'Listado de usuarios del sistema';
    }

    /**
     * Método para subir los ficheros
     */
    public function upload($report) {
        $upload = new DwUpload($report, 'files/upload/' . $report);
        $upload->setAllowedTypes('pdf');
        $upload->setEncryptName(true);
        if(!$data = $upload->save()) { //retorna un array('path'=>'ruta', 'name'=>'nombre.ext');
            $data = array('error'=>TRUE, 'message'=>$upload->getError());
        }
        $this->data = $data;
        View::json();
    }


}
