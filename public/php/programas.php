<?php
	
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){

		case 'GET':
			$con = conectar();
			$query = "SELECT id,programa_nombre FROM programas";
			$res = mysqli_query($con,$query);
			$json = array();

			while($fila=mysqli_fetch_assoc($res))
                	$json[] = $fila;

            mysqli_close($con);
            echo json_encode($json);
		break;

	}

?>