<?php

	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';
	include_once 'cif_aes.php';
	include_once 'sesion.php';
	include_once 'mailDosFactores.php';

	
	/*
	Setear el id de la sesion no es correcto, sin embargo arregla el problema que se tenia con el servidor de prueba, el cual
	seteaba un nuevo id para la sesion y por lo tanto no se podian obtener los datos guardados en la sesion. Seria cuestion de ver
	si en un servidor de produccion se arregla el problema. Por lo mientras, funciona.
	*/
	session_id("hao4iijmbv7cl4nouna3hmldjs");	
	session_start();


	switch($_SERVER['REQUEST_METHOD']){
	 	//Verificar que el usuario existe y devolver sus datos
	 	case 'POST':

	 		$_POST = json_decode(file_get_contents('php://input'),true);
	 		if(isset($_POST['usuario']) and isset($_POST['password'])){


				
				//Verifica que no se tengan tres intentos o que ya haya pasado 1 min despues de los 3 intentos
				// Falta modificar el mensaje de error del lado del frontend, mientras manda el mismo mensaje de error al iniciar sesion			
				if (!verificar_intentos_hora()){
					$json[] = array("valido"=>false, "motivo"=>"TresIntentos","tiempo"=>get_tiempo_sobrante());
					echo json_encode($json);
					break;
				}
				
				
				//Validar usuario para login: devolver {valido:true/false}
				$con = conectar();

				//agregado
				mysqli_set_charset($con,"utf8");

				//Usuario y password cifrados con SHA256
				$usuario_cif = cifrar($_POST['usuario']);
				$password_cif = cifrar($_POST['password']);


				//$query = "SELECT usuarios.id as id,programas.id as programa_id,nombre,apellidos,usuario,programa_nombre,tipo_usuario,fecha_registro,picture_url from usuarios inner join programas where programas.id = usuarios.programa and usuario='".$_POST['usuario']."' and password ='".$_POST['password']."'";
				$query = "SELECT usuarios.id as id,programas.id as programa_id,nombre,apellidos,usuario,programa_nombre,tipo_usuario,fecha_registro,picture_url,correo from usuarios inner join programas where programas.id = usuarios.programa and usuario='".$usuario_cif."' and password ='".$password_cif."'";
				$json = array();

				$res = mysqli_query($con,$query);

				if(mysqli_num_rows($res)==0){
					//No existe el usuario en tabla de usuarios, se busca ahora en tabla de alumnos
					//$query = "SELECT * from alumnos where usuario='".$_POST['usuario']."' and password ='".$_POST['password']."'";
					$query = "SELECT * from alumnos where usuario='".$usuario_cif."' and password ='".$password_cif."'";
					$res = mysqli_query($con,$query);
					if(mysqli_num_rows($res)==0){
						aumenta_contador();				//Aumenta el contador de numero de intentos
						$intentos = get_intentos_restantes();
						if ($intentos == 0) {
							verificar_intentos_hora();
							$json[] = array("valido"=>false, "motivo"=>"TresIntentos","tiempo"=>get_tiempo_sobrante());

						}else {
							$json[] = array("valido"=>false,"intentos"=>$intentos);
						}
						
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
							borrar_cookies();
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

						$usuario_nom = $fila['usuario'];
						$correo_nom = $fila['correo'];
						
						$valido=true;
						$json[] = array("id"=>$id,"nombre"=>$nombre,"apellidos"=>$apellidos,"programa_nombre"=>$programa_nombre,"tipo_usuario"=>$tipo_usuario,"programa_id"=>$id_programa,"valido"=>$valido,"fecha_registro"=>$fecha_registro,"picture_url"=>$picture_url,"usuario"=>$usuario_nom,"correo"=>$correo_nom);
						borrar_cookies();
					}

					enviarCodigo($usuario_cif);

				}
				mysqli_close($con);
				echo json_encode($json);

			}
	 		break;
	 }
?>