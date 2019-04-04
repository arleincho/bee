<?php
/**
 *
 * Clase que gestiona los menús de los usuarios según los recursos asignados
 *
 * @category
 * @package     Models
 * @subpackage
 */

class RecurrentEvents extends ActiveRecord {

    /**
     * Método para registrar un acceso
     * @param string $tipo Tipo de acceso acceso/salida
     * @param int $usuario Usuario que accede
     * @param string $ip  Dirección ip
     */
    public static function setRecurrentEvent($recurrent_id, $event_id) {
        $obj = new RecurrentEvents();
        $obj->recurrent_id = $recurrent_id;
        $obj->evento_id = $event_id;
        return ($obj->create()) ? $obj : FALSE;
    }

}