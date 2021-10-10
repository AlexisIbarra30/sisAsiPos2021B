<?php
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){

		case 'POST':
			//Variables respuesta
           	$nuevos = 1;
            $repetidos = 0;
            $errores = 0;
            //inserta los datos de asistencias
            $_POST = json_decode(file_get_contents('php://input'),true);
            $con = conectar();
            $query ="SELECT * from asistencias WHERE nombre='".$_POST['nombre']."' and apellidos='".$_POST['apellidos']."' and fecha='".$_POST['fecha']."' and hora_entrada='".$_POST['hora_entrada']."' and hora_salida='".$_POST['hora_salida']."'";
 			$res = mysqli_query($con,$query);
            if(mysqli_num_rows($res)==0){
            	$query="INSERT INTO asistencias(nombre,apellidos,fecha,hora_entrada,hora_salida,horas_permanencia,programa)";
            	$query=$query."values('".$_POST['nombre']."','".$_POST['apellidos']."','".$_POST['fecha']."','".$_POST['hora_entrada']."','".$_POST['hora_salida']."','".$_POST['horas_permanencia'].":00','".$_POST['programa']."')";
            	mysqli_query($con,$query);
            	$nuevos=1;
            }else{
            	$nuevos=0;
            	$repetidos = 1;
            }
            mysqli_close($con);
            //Construimos respuesta en base a los resultados
            $res = array("nuevos"=>$nuevos,"repetidos"=>$repetidos,"errores"=>$errores);
            echo json_encode($res);

		break;
	}
?>