<?php
/**
 *
 * Clase que gestiona los menús de los usuarios según los recursos asignados
 *
 * @category
 * @package     Models
 * @subpackage
 */

class Evento extends ActiveRecord {


    /**
     * Método para definir las relaciones y validaciones
     */
    protected function initialize() {
        $this->belongs_to('usuario');        
    }



    /**
     * Método para crear/modificar un objeto de base de datos
     *
     * @param string $medthod: create, update
     * @param array $data: Data para autocargar el modelo
     * @param array $optData: Data adicional para autocargar
     *
     * return object ActiveRecord
     */
    public static function setEvento($method, $data, $usuario=null) {
        $obj = new Evento($data); //Se carga los datos con los de las tablas
        $obj->usuario_id    = $usuario;
        
        if(!empty($obj->id)) {
            $old = new Evento();
            if($old->find_first($obj->id)) {
                if($method == 'create') {
                    $obj->id = $old->id;
                    $method = 'update';
                }
            }
        }
        

        return ($obj->$method()) ? $obj : FALSE;
    }
    
    public static function getListadoEventos($usuario_id) {

        $obj = new Evento();
        $conditions = "evento.usuario_id = {$usuario_id}";
        $columns = "evento.id, evento.start, evento.end, evento.color, evento.author, evento.notes, evento.urlFile, evento.idPosicion, evento.hour1, evento.day1, evento.hour2, evento.day2, evento.fileUrl, evento.networks, evento.urlFiles, evento.description, recurrent_events.recurrent_id recurrent_id";
        $join = "LEFT JOIN recurrent_events ON evento.id = recurrent_events.evento_id ";
        $list = $obj->find("columns: $columns", "conditions: $conditions", "join: $join");
        foreach ($list as $key => $value) {
            $list[$key]->networks = (isset($value->networks) && $value->networks != "")?json_decode($value->networks):array();
            $list[$key]->urlFiles = (isset($value->urlFiles) && $value->urlFiles != "")?json_decode($value->urlFiles):array();
        }
        return $list;
    }

    public static function getListadoEventoss($usuario_id) {

        $obj = new Evento();
        $conditions = "usuario_id = {$usuario_id}";
        $columns = "id, start, end, color, author, notes, urlFile, idPosicion, hour1, day1, hour2, day2, fileUrl, networks, description";
        return $obj->find("columns: $columns", "conditions: $conditions");
    }


     /**
     * Callback que se ejecuta antes de guardar/modificar
     */
    public function before_create() {
        if (!is_array($this->networks) && $this->networks = ""){
            $this->networks = array();
        }
        $this->networks     = json_encode($this->networks);
    }


     /**
     * Callback que se ejecuta antes de guardar/modificar
     */
    public function before_update() {
        if (!is_array($this->networks) && $this->networks = ""){
            $this->networks = array();
        }
        $this->networks     = json_encode($this->networks);
    }

}