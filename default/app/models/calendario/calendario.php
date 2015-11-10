<?php
/**
 *
 * Clase que gestiona los menús de los usuarios según los recursos asignados
 *
 * @category
 * @package     Models
 * @subpackage
 */

class Calendario extends ActiveRecord {

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
    public static function setCalendario($method, $data, $optData=null) {
        $obj = new Calendario($data); //Se carga los datos con los de las tablas
        if($optData) { //Se carga información adicional al objeto
            $obj->dump_result_self($optData);
        }
        //Verifico que no exista otro menu, y si se encuentra inactivo lo active
        $conditions = "usuario_id = $obj->usuario_id";
        $old = new Calendario();
        if($old->find_first($conditions)) {
            if($method == 'create') {
                $obj->id = $old->id;
                $method = 'update';
            }
        }

        return ($obj->$method()) ? $obj : FALSE;
    }

    public static function getCalendario($id){
        $cal = new Calendario();
        $conditions = "usuario_id = {$id}";
        $eventos = array();
        if($cal->find_first($conditions)) {
            $eventos = json_decode($cal->configuracion, true);
        }
        return $eventos;
    }

}