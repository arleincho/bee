<?php
/**
 * Descripcion: Controlador que se encarga de la gestión de los permisos a los perfiles de usuarios
 *
 * @category    
 * @package     Controllers  
 */

Load::models('calendario/empresa');

class EmpresaController extends BackendController {
    
    /**
     * Método que se ejecuta antes de cualquier acción
     */
    protected function before_filter() {
        //Se cambia el nombre del módulo actual
        $this->page_module = 'Gestión de empresas';
    }
    
    /**
     * Método principal
     */
    public function index() {
        Redirect::toAction('listar');
    }
    
    /**
     * Método para listar
     */
    public function listar($order='order.id.asc', $page='page.1') {
        $page = (Filter::get($page, 'page') > 0) ? Filter::get($page, 'page') : 1;
        $empresa = new Empresa();
        $this->empresas = $empresa->getListadoEmpresas($order, $page);
        $this->order = $order;        
        $this->page_title = 'Empresas para la asignación en Calendarios';        
    }   


        /**
     * Método para agregar
     */
    public function agregar() {
        if(Input::hasPost('empresa')) {
            if(Empresa::setEmpresa('create', Input::post('empresa'))){
                Flash::valid('la Empresa se ha creado correctamente!');
                return Redirect::toAction('listar');
            }
        }
        $this->page_title = 'Agregar Empresa';
    }

        /**
     * Método para ver
     */
    public function ver($key) {        
        if(!$id = Security::getKey($key, 'shw_empresa', 'int')) {
            return Redirect::toAction('listar');
        }
        
        $empresa = new Empresa();
        if(!$usuario->getInformacionEmpresa($id)) {
            Flash::error('Lo sentimos, no se ha podido establecer la información de la Empresa');    
            return Redirect::toAction('listar');
        }                
                
        $this->empresa = $empresa;
        $this->page_title = 'Información de la Empresa';
        
    }

}

