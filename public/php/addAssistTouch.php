<?php
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){

		case 'GET':
			//Recibe nombres, apellidos y id_programa
           
            $con = conectar();
            $fecha = new DateTime($_GET['fecha']); 
            $fecha = $fecha->format('Y-m-d');

            mysqli_set_charset($con,"utf8");
			$query = "SELECT * from asistencias where programa=".$_GET['programa']." and nombre like '".$_GET['nombre']."' and apellidos like '".$_GET['apellidos']."' and fecha like '".$fecha."'";
			//agregado
			
            $res = mysqli_query($con,$query);
            $json = array();
            if(mysqli_num_rows($res)==0){
                $json = "Error";
            }else{
                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;
            }

            echo json_encode($json);

		break;

        case 'POST':
            $_POST = json_decode(file_get_contents('php://input'),true);

            $con = conectar();
            mysqli_set_charset($con,"utf8");

            $horaRegistro = new DateTime($_POST['hora_registro']);
            $fecha = new DateTime($_POST['fecha']); 
            $fecha = $fecha->format('Y-m-d');
            $query ="";
            $mensaje="";

            if($_POST['mensaje']=="Registrar Salida"){
                $horaE = new DateTime($_POST['hora_entrada']);
                $horaS = new DateTime($_POST['hora_registro']);
                $total = $horaE -> diff($horaS) -> format('%H:%I');

                $query = "UPDATE asistencias SET horas_permanencia = '".$total."', hora_salida = '".$_POST['hora_registro']."' WHERE  programa=".$_POST['programa']." and nombre like '".$_POST['nombre']."' and apellidos like '".$_POST['apellidos']."' and fecha like '".$fecha."'";

            }else{
                //INSERT INTO `asistencias` (`id`, `nombre`, `apellidos`, `fecha`, `hora_entrada`, `hora_salida`, `horas_permanencia`, `programa`) VALUES (NULL, 'dasda', 'dasdasd', '2022-05-26', '17:20:47', NULL, NULL, '2') 
                $query = "INSERT INTO asistencias (nombre, apellidos, fecha, hora_entrada, programa) VALUES('".$_POST['nombre']."','".$_POST['apellidos']."','".$_POST['fecha']."','".$_POST['hora_registro']."','".$_POST['programa']."')";
            }

            if(mysqli_query($con,$query)){
                $mensaje=$query;
            }else{
                $mensaje=$query;
            }

            echo $mensaje;

        break;
	}
?>