<?php 
	header('Access-Control-Allow-Origin:*');
	
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){
	 	//Verificar que el usuario existe y devolver sus datos
	 	case 'POST':

	 		$_POST = json_decode(file_get_contents('php://input'),true);
	 		if(isset($_POST['usuario']) and isset($_POST['password'])){
				//Validar usuario para login: devolver {valido:true/false}
				$con = conectar();

				//agregado
				mysqli_set_charset($con,"utf8");

				$query = "SELECT usuarios.id as id,programas.id as programa_id,nombre,apellidos,usuario,programa_nombre,tipo_usuario,fecha_registro,picture_url from usuarios inner join programas where programas.id = usuarios.programa and usuario='".$_POST['usuario']."' and password ='".$_POST['password']."'";
				$json = array();

				$res = mysqli_query($con,$query);

				if(mysqli_num_rows($res)==0){
					//No existe el usuario en tabla de usuarios, se busca ahora en tabla de alumnos
					$query = "SELECT * from alumnos where usuario='".$_POST['usuario']."' and password ='".$_POST['password']."'";
					$res = mysqli_query($con,$query);
					if(mysqli_num_rows($res)==0){
						$json[] = array("valido"=>false);
					}
					else{
						while($fila=mysqli_fetch_array($res)){
							$id = $fila['id'];
							$nombre = $fila['nombres'];
							$apellidos = $fila['apePaterno']." ".$fila['apeMaterno'];
							$programa_nombre ='Alumno';
							$tipo_usuario = 'Alumno';
							$id_programa = $fila['id_programa'];
							$picture_url = $fila['picture_url'];
							$valido=true;
							$json[] = array("id"=>$id,"nombre"=>$nombre,"apellidos"=>$apellidos,"programa_nombre"=>$programa_nombre,"tipo_usuario"=>$tipo_usuario,"programa_id"=>$id_programa,"valido"=>$valido,"picture_url"=>$picture_url);
						}
					}
					
				}else{
					//Existe el usuario, devuelve nombre, apellidos y valido=true
					while($fila=mysqli_fetch_array($res)){
						$id = $fila['id'];
						$nombre = $fila['nombre'];
						$apellidos = $fila['apellidos'];
						$programa_nombre = $fila['programa_nombre'];
						$tipo_usuario = $fila['tipo_usuario'];
						$id_programa = $fila['programa_id'];
						$fecha_registro = $fila['fecha_registro'];
						$picture_url = $fila['picture_url'];
						$valido=true;
						$json[] = array("id"=>$id,"nombre"=>$nombre,"apellidos"=>$apellidos,"programa_nombre"=>$programa_nombre,"tipo_usuario"=>$tipo_usuario,"programa_id"=>$id_programa,"valido"=>$valido,"fecha_registro"=>$fecha_registro,"picture_url"=>$picture_url);
					}
				}
				mysqli_close($con);
				echo json_encode($json);

			}
	 		break;

	 }


?>