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
        $conditions = "usuario_id = {$usuario_id}";
        $columns = "id, start, end, color, author, notes, urlFile, idPosicion, hour1, day1, hour2, day2, fileUrl, networks, description";
        return $obj->find("columns: $columns", "conditions: $conditions");
    }


     /**
     * Callback que se ejecuta antes de guardar/modificar
     */
    public function before_save() {
        if (!is_array($this->networks)){
            $this->networks = array();
        }
        $this->networks     = json_encode($this->networks);
    }

}