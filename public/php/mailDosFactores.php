<?php
include_once 'conexion.php';
include_once 'cif_aes.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = '';
$mail->Password = '';
$mail->SMTPSecure = 'ssl';
$mail->CharSet = 'UTF-8';
$mail->Port = 465;




function enviarCodigo($usuario){
    
    global $mail;
    $correo = getCorreo($usuario);
    $codigo = generarCodigo($usuario);

    $mail->setFrom("asistencia.seguridad.2022b2@gmail.com");
    $mail->addAddress($correo);
    $mail->isHTML(true);

    $mail->Subject = "Código de verificación";
    $mail->Body = "<p>Tu código de verificación es: ".$codigo. ".<br>Este código tiene un tiempo de validez de 2 minutos</p>";

    $mail->send();
    
}

function enviarCredenciales($usuario, $nombre_usuario, $contrasena){
    global $mail;
    $correo = getCorreo($usuario);


    $mail->setFrom("asistencia.seguridad.2022b2@gmail.com");
    $mail->addAddress($correo);
    $mail->isHTML(true);

    $mail->Subject = "Credenciales temporales";
    $mail->Body = "<p>Tu nombre de usuario es: ".$nombre_usuario. ".<br>Tu contraseña es: ".$contrasena. ".<br>Esta contraseña es temporal, tendrás que cambiarla la primera vez que ingreses al sistema</p>";

    $mail->send();
}


/*
Genera el codigo de verificacion el tiempo de validez.
*/
function generarCodigo($usuario){
    $codigo_temp = rand(10000, 99999);

    $codigo = cifrar($codigo_temp);

    $cur_time = strtotime("now");
    $end_time = $cur_time + 120;

    /*
    Inserta el codigo y el tiempo de validez en el registro del usuario en la base de datos
    */
    $con = conectar();
    mysqli_set_charset($con,"utf8");
    $query = "UPDATE usuarios SET cod_temp='".$codigo."', tiempo_temp='".$end_time."' WHERE usuario='".$usuario."'";
    

    mysqli_query($con,$query);
    mysqli_close($con);
    return $codigo_temp;
}


/*
Valida que el codigo sea correcto
*/
function validarCodigo($usuario, $codigo){
    $con = conectar();
    mysqli_set_charset($con,"utf8");
    $query = "SELECT tiempo_temp FROM usuarios WHERE usuario='".$usuario."' AND cod_temp ='".$codigo."'";

    $res = mysqli_query($con,$query);

    if(mysqli_num_rows($res) == 0){
        
        mysqli_close($con);
        
        return array(false, "El código que ingresaste es incorrecto.");
    }else{
       
        /*
        El codigo es correcto, por lo tanto, se verifica el tiempo de validez
        */
        $fila=mysqli_fetch_array($res);
        $tiempo = $fila['tiempo_temp'];
        
        $cur_time = strtotime("now");

        if ($cur_time <= $tiempo) {
            mysqli_close($con);
            return array(true, "Correcto");
        }
        mysqli_close($con); 
        return array(false, "El código ingresado ya expiro. Da clic en 'Volver a enviar'");
    }

}


/*
Obtiene el correo del usuario
*/

function getCorreo($usuario){
    $correo = null;
    $con = conectar();
    mysqli_set_charset($con,"utf8");
    $query = "SELECT correo FROM usuarios WHERE usuario='".$usuario."'";
    $res = mysqli_query($con,$query);

    if(mysqli_num_rows($res) == 0){
        $correo = null;
    }else{
        $fila=mysqli_fetch_array($res);
        $correo = $fila['correo'];
    }

    mysqli_close($con);
    return $correo;   
    

}


?>

