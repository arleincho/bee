<?php
/** 
 *
 * Clase que gestiona todo lo relacionado con los
 * recursos de los usuarios con su respectivo grupo
 *
 * @category
 * @package     Models 
 */

class Empresa extends ActiveRecord {

    /**
     * Método que retorna los recursos asignados a un perfil de usuario
     * @param int $perfil Identificador el perfil del usuario
     * @return array object ActieRecord
     */
    public function getListadoEmpresas($order='', $page=0) {
        $order = $this->get_order($order, 'id', array(            
            'nombre' => array(
                'ASC' => 'nombre ASC',
                'DESC' => 'nombre DESC'
            )
        ));
        if($page) {
            return $this->paginated("order: $order", "page: $page");
        } else {
            return $this->find("order: $order");
        }
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
    public static function setEmpresa($method, $data, $optData=null) {
        $obj = new Empresa($data); //Se carga los datos con los de las tablas
        if($optData) { //Se carga información adicional al objeto
            $obj->dump_result_self($optData);
        }
        //Verifico que no exista otro menu, y si se encuentra inactivo lo active
        $conditions = "nombre = '{$obj->nombre}'";
        $old = new Empresa();
        if($old->find_first($conditions)) {
            if($method == 'create') {
                $obj->id = $old->id;
                $method = 'update';
            }
        }

        return ($obj->$method()) ? $obj : FALSE;
    }

    /**
     * Método para obtener la información de  la empresa
     * @return type
     */
    public function getInformacionEmpresa($empresa) {
        $empresa = Filter::get($empresa, 'int');
        if(!$empresa) {
            return NULL;
        }
        $condicion = "id = {$usuario}";        
        return $this->find_first("conditions: $condicion");
    } 
}