<?php
/**
 *
 * Clase que gestiona los menús de los usuarios según los recursos asignados
 *
 * @category
 * @package     Models
 * @subpackage
 */

class Recurrent extends ActiveRecord {


	 /**
     * Método para registrar un acceso
     * @param string $tipo Tipo de acceso acceso/salida
     * @param int $usuario Usuario que accede
     * @param string $ip  Dirección ip
     */
    public static function setRecurrent() {
        $obj = new Recurrent();
        return ($obj->create()) ? $obj : FALSE;
    }

    
    public static function deleteRecurrent($id) {

    }

}