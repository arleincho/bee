<?php
/**
 *
 * Clase que gestiona los menús de los usuarios según los recursos asignados
 *
 * @category
 * @package     Models
 * @subpackage
 */


use Recurr\DateExclusion;
use Recurr\DateInclusion;
use Recurr\Frequency;
use Recurr\Rule;
use Recurr\Exception\InvalidArgument;
use Recurr\Exception\InvalidRRule;


class Calendario extends ActiveRecord {


    /**
     * Método para definir las relaciones y validaciones
     */
    protected function initialize() {
        $this->belongs_to('usuario');        
    }

    public function     setRecurrente($data=array(), $recurrent=array(), $exclude=array()){

        if (isset($data['id']) && $data['id'] != ""){
            unset($data['id']);
        }
        
        $timezone = 'America/Los_Angeles';
        $startDate = new \DateTime("{$data['start']}", new \DateTimeZone($timezone));
        $endDate  = new \DateTime("{$data['end']}", new \DateTimeZone($timezone));
        $untilDateYear  = $endDate->format('Y') . '-12-31';
        $untilDateMonth  = $startDate->format('m');

        $freqs = array(
            'day' => array(
                'freq' => 'DAILY',
                'end' => $endDate,
                'interval' => 1,
                'until' => $untilDateYear,
                'bymonth' => $untilDateMonth
            ),
            'week' => array(
                'freq' => 'WEEKLY',
                'end' => $endDate,
                'interval' => 1,
                'until' => $untilDateYear
            ),
            '2week' => array(
                'freq' => 'WEEKLY',
                'end' => $endDate,
                'interval' => 2,
                'until' => $untilDateYear
            ),
            'month' => array(
                'freq' => 'MONTHLY',
                'end' => $endDate,
                'interval' => 1,
                'until' => $untilDateYear
            ),
            'year' => array(
                'freq' => 'YEARLY',
                'interval' => 1,
                // 'count' => 2
            ),
        );

        if (isset($recurrent['quantity']) && !is_numeric($recurrent['quantity'])){
            $recurrent['quantity'] = 0;
        }

        $recurrent['quantity'] = intval($recurrent['quantity']);
    
        $freqRule = array();
        $freqRule[] = "FREQ={$freqs[$recurrent['info']]['freq']}";

        if (isset($freqs[$recurrent['info']]['interval']) && $freqs[$recurrent['info']]['interval'] != ""){
            $freqRule[] = "INTERVAL={$freqs[$recurrent['info']]['interval']}";
        }

        $freqRule[] = "COUNT={$recurrent['quantity']}";

        // if (isset($freqs[$recurrent['info']]['count']) && $freqs[$recurrent['info']]['count'] != ""){
        //     $freqRule[] = "COUNT={$freqs[$recurrent['info']]['count']}";
        // }

        // if (isset($freqs[$recurrent['info']]['until']) && $freqs[$recurrent['info']]['until'] != ""){
        //     $freqRule[] = "UNTIL={$freqs[$recurrent['info']]['until']}";
        // }

        // if (isset($freqs[$recurrent['info']]['bymonth']) && $freqs[$recurrent['info']]['bymonth'] != ""){
        //     $freqRule[] = "BYMONTH={$freqs[$recurrent['info']]['bymonth']}";
        // }

        $rule = new \Recurr\Rule(implode(';', $freqRule), $startDate, $freqs[$recurrent['info']]['end'], $timezone);
        $transformer = new \Recurr\Transformer\ArrayTransformer();

        $transformerConfig = new \Recurr\Transformer\ArrayTransformerConfig();
        $transformerConfig->enableLastDayOfMonthFix();
        $transformer->setConfig($transformerConfig);

        $dates = $transformer->transform($rule);

        if ($dates){
            $recurrent_obj = Recurrent::setRecurrent();
            foreach ($dates as $keyDate => $valueDate) {
                if (is_array($exclude) && count($exclude) > 0 && in_array($keyDate, $exclude)){
                    continue;
                }
                $newEvent = $data;
                $newEvent['start'] = $valueDate->getStart()->format('Y-m-d');
                $newEvent['day1'] = $newEvent['start'];

                $newEvent['end'] = $valueDate->getEnd()->format('Y-m-d');
                $newEvent['day2'] = $newEvent['end'];
                $newEvent['recurrent'] = true;
                
                $event_obj = Evento::setEvento('create', $newEvent, Session::get('id'));
                $ppp = RecurrentEvents::setRecurrentEvent($recurrent_obj->id, $event_obj->id);
            }
            return Evento::getListadoEventos($usuario_id = Session::get('id'));
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

    public static function all(){
        $calendario = new Calendario();
        return $calendario->find();
    }

}