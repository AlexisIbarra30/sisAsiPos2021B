<?php 
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';
	include_once 'cif_aes.php';

	/*
		Para VALIDAR un usuario: (usuario, password,tipo_usuario)
			METODO GET, enviar usuario, password y tipo_usuario en formato JSON. Retorna JSON del tipo {"validar":true/false}

		Para LISTAR TODOS los usuarios: (sin parametros)
			METODO GET, sin parametros. Retorna JSON con los datos: nombre, aoellidos, usuario y tipo_usuario (no retorna contraseña)

		Para AGREGAR un usuario: (nombre, apellidos,usuario,password,tipo_usuario)
			METODO POST, enviar nombre, apellidos, usuario, password, tipo_usuario en formato JSON. Retorna "correcto", "usuario repetido" o "campos vacios"

		Para ACTUALIZAR usuario: (id,nombre, apellidos,usuario,password,tipo_usuario)
			METODO POST, agregando el ID a los mismos datos para agregar usuario(nombre,apellidos, etc). Retorna "correcto", "usuario repetido" o "campos vacios"

		Para ELIMINAR usuario: (id)
			METODO GET, enviando unicamente el ID del usuario en formato "JSON". Presupone que el usuario con dicho ID existe, por lo que siempre es correcto
			
	*/

	switch($_SERVER['REQUEST_METHOD']){

		
		//POST para agregar y actualizar
		case 'POST':

			$_POST = json_decode(file_get_contents('php://input'),true);
			$json = array();

			if(isset($_POST['nombre']) and isset($_POST['apellidos']) and isset($_POST['usuario']) and isset($_POST['password']) ){
				$con = conectar();

				//agregado
				mysqli_set_charset($con,"utf8");

				//Usuario y password cifrados con AES
				$usuario_cif = cifrar($_POST['usuario']);
				$password_cif = cifrar($_POST['password']);

				//verificamos que no exista ya el usuario (ver si no se repite el nombre o el usuario)
				//$query = "SELECT * from usuarios where nombre like '".$_POST['nombre']."' and apellidos like '".$_POST['apellidos']."' or usuario like '".$_POST['usuario']."'";
				$query = "SELECT * from usuarios where nombre like '".$_POST['nombre']."' and apellidos like '".$_POST['apellidos']."' or usuario like '".$usuario_cif."'";
				$res = mysqli_query($con,$query);

				if(mysqli_num_rows($res)==0){

					$query="";

					if(isset($_POST['id'])){
						//Si viene el id, significa que se actualiza el registro
						//$query = "UPDATE usuarios SET nombre= '".$_POST['nombre']."',apellidos='".$_POST['apellidos']."',usuario = '".$_POST['usuario']."',password='".$_POST['password']."', tipo_usuario = '".$_POST['tipo_usuario']."',programa='".$_POST['programa']."' where id=".$_POST['id'];
						$query = "UPDATE usuarios SET nombre= '".$_POST['nombre']."',apellidos='".$_POST['apellidos']."',usuario = '".$usuario_cif."',password='".$password_cif."', tipo_usuario = '".$_POST['tipo_usuario']."',programa='".$_POST['programa']."' where id=".$_POST['id'];
					}else{
						//si no viene el id, se inserta nuevo registro
						//$query = "INSERT INTO usuarios (nombre,apellidos,usuario,password,tipo_usuario,programa,fecha_registro) VALUES ('".$_POST['nombre']."','".$_POST['apellidos']."','".$_POST['usuario']."','".$_POST['password']."',0,'".$_POST['programa']."','".$_POST['fecha_registro']."')";
						$query = "INSERT INTO usuarios (nombre,apellidos,usuario,password,tipo_usuario,programa,fecha_registro) VALUES ('".$_POST['nombre']."','".$_POST['apellidos']."','".$usuario_cif."','".$password_cif."',0,'".$_POST['programa']."','".$_POST['fecha_registro']."')";
					}

					mysqli_query($con,$query);
					echo ("correcto");	
				}else{
					if(isset($_POST['id'])){
						//Si viene el id, significa que se actualiza el registro
						//$query = "UPDATE usuarios SET nombre= '".$_POST['nombre']."',apellidos='".$_POST['apellidos']."',usuario = '".$_POST['usuario']."',password='".$_POST['password']."', tipo_usuario = '".$_POST['tipo_usuario']."', programa='".$_POST['programa']."' where id=".$_POST['id'];
						$query = "UPDATE usuarios SET nombre= '".$_POST['nombre']."',apellidos='".$_POST['apellidos']."',usuario = '".$usuario_cif."',password='".$password_cif."', tipo_usuario = '".$_POST['tipo_usuario']."', programa='".$_POST['programa']."' where id=".$_POST['id'];
						mysqli_query($con,$query);
						echo ("correcto");	
					}else{
						//si no viene el id, se inserta nuevo registro
						echo ("registro reperido");
					}
				}

				
			}
			else{
				echo json_encode("Campos vacios");
			}	
			
			break;

		case 'GET':

			if(isset($_GET['usuario']) and isset($_GET['password'])){
				//Validar usuario para login: devolver {valido:true/false}
				$con = conectar();

				//agregado
				mysqli_set_charset($con,"utf8");

				//Usuario y password cifrados con AES
				$usuario_cif = cifrar($_GET['usuario']);
				$password_cif = cifrar($_GET['password']);

				//$query = "select * from usuarios where usuario='".$_GET['usuario']."' and password ='".$_GET['password']."' and id_estatus=1";
				$query = "select * from usuarios where usuario='".$usuario_cif."' and password ='".$password_cif."' and id_estatus=1";
				$json = array();

				$res = mysqli_query($con,$query);

				if(mysqli_num_rows($res)==0){
					//No existe el usuario
					$json = array("valido"=>false);
				}else{
					//Existe el usuario, devuelve nombre, apellidos y valido=true
					while($fila=mysqli_fetch_array($res)){
						$nombre = $fila['nombre'];
						$apellidos = $fila['apellidos'];
						$tipo_usuario = $fila['tipo_usuario'];
						$programa = $fila['programa'];
						$fecha_registro = $fila['fecha_registro'];
						$valido=true;
						$json[] = array("nombre"=>$nombre,"apellidos"=>$apellidos,"tipo_usuario"=>$tipo_usuario,"programa"=>$programa,"valido"=>$valido,"fecha_registro"=>$fecha_registro);
					}
				}
				mysqli_close($con);
				echo json_encode($json);

			}else if(isset($_GET['id']) and !isset($_GET['nombre']) and !isset($_GET['apellidos']) and !isset($_GET['usuario']) and !isset($_GET['password'])){
				//Si solo viene el ID en metodo GET, significa que borrará al usuario
				$con = conectar();
				
				//agregado
				mysqli_set_charset($con,"utf8");

				//$query = "DELETE from usuarios where id=".$_GET['id']; en lugar de borrar cambia id_estatus a 2
				$query = "UPDATE usuarios SET id_estatus=2 where id=".$_GET['id'];
				mysqli_query($con,$query);
				mysqli_close($con);
				echo('correcto');
			}
			else{
				//Si no viene ninguna variable, devolver todos los usuarios
				$con = conectar();

				//agregado
				mysqli_set_charset($con,"utf8");
				//Omitimos los usuarios con ID de programa igual a 5 ya que serán los profesores
				$query ="SELECT usuarios.id as id,nombre,apellidos,usuario,programa_nombre,programa,password,tipo_usuario,picture_url from usuarios inner join programas where programas.id = usuarios.programa and programas.id !=5 and usuarios.id_estatus=1";
				$json = array();

				$res = mysqli_query($con,$query);

				while($fila=mysqli_fetch_assoc($res))
					//$men= decifrar($fila['usuario']);
					//echo ($men);
                	$json[] = $fila;
					//FALTA DESCIFRAR EL NOMBRE DE USUARIO
                
                mysqli_close($con);
                echo json_encode($json);

			}
			break;
		
	}
?>