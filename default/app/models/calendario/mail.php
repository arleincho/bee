<?php

/**
 *  Se encarga de enviar correos
 */
Load::lib('PHPMailerAutoload');

class Mail {

    public static function send($para_correo, $para_nombre, $asunto, $cuerpo, $de_correo=null, $de_nombre=null) {
        
        $mail = new PHPMailer;

        $mail->charSet = "UTF-8";
        
        $mail->IsSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'ssl';
        $mail->Host = Config::get('config.correo.host');
        $mail->Port = Config::get('config.correo.port');
        $mail->Username = Config::get('config.correo.username');
        $mail->Password = Config::get('config.correo.password');


        if ($de_correo != null && $de_nombre != null) {
            $mail->AddReplyTo($de_correo, $de_nombre);
            $mail->From = $de_correo;
            $mail->FromName = $de_nombre;
        } else {
            $mail->AddReplyTo(Config::get('config.correo.from_mail'), Config::get('config.correo.from_name'));
            $mail->From = Config::get('config.correo.from_mail');
            $mail->FromName = Config::get('config.correo.from_name');
        }
        $asunto= "=?utf-8?b?".base64_encode($asunto)."?=";
        $mail->Subject = $asunto;
        $mail->Body = $cuerpo;
        $mail->WordWrap = 50;
        $mail->MsgHTML($cuerpo);
        $emails = explode(';', $para_correo);
        if (count($emails) > 1){
            foreach ($emails as $key => $value) {
                $mail->AddAddress(trim($value), trim($value));
            }
        }else{
            $mail->AddAddress(trim($para_correo), trim($para_correo));
        }
        
        $mail->AddAddress(Config::get('config.correo.from_mail'), Config::get('config.correo.from_name'));
        $mail->IsHTML(true);
        //Enviamos el correo
        $exito = $mail->Send();
        $intentos = 2;

        //esto se realizara siempre y cuando la variable $exito contenga como valor false
        while ((!$exito) && $intentos < 1) {
            sleep(2);
            $exito = $mail->Send();
            $intentos = $intentos + 1;
        }
        $mail->SmtpClose();
        return $exito;
    }
}