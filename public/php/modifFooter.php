<?php
	
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	/*
		Utilizamos GET para obtener los datos actuales a modificar
		Utilizamos POST para enviar los nuevos cambios

	*/

	switch($_SERVER['REQUEST_METHOD']){
		
		case 'GET':
			$con = conectar();
			$query = 'SELECT * from datos_footer';
			$res = mysqli_query($con,$query);
			$json = array();

			while($fila = mysqli_fetch_assoc($res)){
				$json[] = $fila;
			}

			mysqli_close($con);
			echo json_encode($json);

		break;

		case 'POST':
			$_POST = json_decode(file_get_contents('php://input'),true);
			$con = conectar();
			$respuesta="";


			//Si no define en que parte se mostrara significa que solo va a actualizar el campo
			if(!isset($_POST['mostrar']) and !isset($_POST['eliminar'])){
				$query = "UPDATE datos_footer SET nombre='".$_POST['nombre']."', valor='".$_POST['valor']."' WHERE id='".$_POST['bdid']."'";
				if(mysqli_query($con,$query)){
					$respuesta="correcto";
				}else{
					$respuesta="error";
				}

			}else if(isset($_POST['mostrar'])){
				$query = "SELECT * from datos_footer WHERE nombre like '".$_POST['nombre']."' or valor like '".$_POST['valor']."'";
				$res = mysqli_query($con,$query);
				$respuesta="";

				if(mysqli_num_rows($res)==0){
					$query = "INSERT INTO datos_footer(nombre,valor,mostrar) VALUES('".$_POST['nombre']."','".$_POST['valor']."','".$_POST['mostrar']."')";
					if(mysqli_query($con,$query)){
						$respuesta="correcto";
					}
				}else{
					$respuesta="repetido";
				}
				

			}
			else if($_POST['eliminar']){
				$query = "DELETE from datos_footer where id='".$_POST['bdid']."'";
				mysqli_query($con,$query);
				$respuesta="eliminado";

			}

			mysqli_close($con);
			echo $respuesta;
			

		break;


	}



?>