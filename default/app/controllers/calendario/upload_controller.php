<?php
/**
 *
 * Descripcion: Controlador para el panel principal de los usuarios logueados
 *
 * @category    
 * @package     Controllers 
 */

Load::models('calendario/calendario', 'calendario/reporte');

class  UploadController extends BackendController {

    public $page_title = 'Subir Ficheros';
    
    public $page_module = 'upload';
    
    public function index() {
        Redirect::toAction('listar');
    }

    public function reports($key, $order='order.fecha.asc', $page='page.1') { 
        $page = (Filter::get($page, 'page') > 0) ? Filter::get($page, 'page') : 1;     
        if(!$id = Security::getKey($key, 'upload_reports', 'int')) {
            return Redirect::toAction('listar');
        }        
        
        $reportes = new Reporte();
        $this->reportes = $reportes->getListadoReportePorUsuario($id, $order, $page);
        
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



        if(Input::hasPost('reporte')) {
            $upload = new DwUpload($report, 'files/upload/' . $report);
            $upload->setAllowedTypes('pdf');
            $upload->setEncryptName(true);
            if(!$data = $upload->save()) { //retorna un array('path'=>'ruta', 'name'=>'nombre.ext');
                $data = array('error'=>TRUE, 'message'=>$upload->getError());
            }else{
                $this->data = $data;
                $post = Input::post('reporte');
                if ($post){
                    if(!$id = Security::getKey($post['key'], 'upload_reports', 'int')) {
                        return Redirect::toAction('listar');
                    }
                    $date = DateTime::createFromFormat('Y-m', $post['date_report']);
                    $info = array(
                        'usuario_id' => $id,
                        'fecha' => $date->format('Y-m-d'),
                        'nombre' => $report,
                        'ruta' => PUBLIC_PATH . "files/upload/{$report}/{$this->data['name']}"
                    );
                    if(!Reporte::setReporte('create', $info)){
                        $data = array('error'=>TRUE, 'message'=>'El archivo no se subio!.');
                    }
                    View::json();
                }
            }
        }
    }


}
