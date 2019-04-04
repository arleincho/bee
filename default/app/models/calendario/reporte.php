<?php
/**
 *
 * Clase que gestiona los menús de los usuarios según los recursos asignados
 *
 * @category
 * @package     Models
 * @subpackage
 */

class Reporte extends ActiveRecord {

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
    public static function setReporte($method, $data, $optData=null) {
        $obj = new Reporte($data); //Se carga los datos con los de las tablas
        if($optData) { //Se carga información adicional al objeto
            $obj->dump_result_self($optData);
        }
        //Verifico que no exista otro menu, y si se encuentra inactivo lo active
        $conditions = "usuario_id = $obj->usuario_id and nombre = '{$data['nombre']}' and  DATE_FORMAT(fecha, '%Y-%m') = DATE_FORMAT('{$data['fecha']}', '%Y-%m')";
        $old = new Reporte();
        if($old->find_first($conditions)) {
            if($method == 'create') {
                $obj->id = $old->id;
                $method = 'update';
            }
        }

        return ($obj->$method()) ? $obj : FALSE;
    }
    
    public function getListadoReportePorUsuario($usuario_id, $order='', $page=0) {

        $conditions = "usuario_id = {$usuario_id}";
        $order = $this->get_order($order, 'nombre', array(                        
            'fecha' => array(
                'ASC'=>'fecha ASC', 
                'DESC'=>'fecha DESC'
            ),
            'nombre' => array(
                'ASC'=>'nombre ASC', 
                'DESC'=>'nombre DESC'
            )
        ));
        if($page) {
            return $this->paginated("conditions: $conditions", "order: $order", "page: $page", "group: DATE_FORMAT(fecha, '%Y-%m'), nombre");
        }
    }

    public function getListadoReportePorTipo($usuario_id, $tipo) {
        $conditions = "usuario_id = {$usuario_id} AND nombre = '{$tipo}'";
        $group = "DATE_FORMAT(fecha, '%Y-%m')";
        return $this->find("conditions: {$conditions}", "limit: 4", "group: {$group}", "order: fecha desc");
    }

}