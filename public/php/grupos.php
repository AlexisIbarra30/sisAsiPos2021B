<?php
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

    switch($_SERVER['REQUEST_METHOD']){

        case 'POST':
            //Para agregar un nuevo grupo

            //Recuperamos valores de POST e iniciamos la conexion
            $_POST = json_decode(file_get_contents('php://input'),true);
            $con = conectar();

            //agregado
			mysqli_set_charset($con,"utf8");

            if(isset($_POST['id'])){
                //Si viene el ID del grupo significa que va a modificar
                
            }else{
                //Si no viene significa que agregará uno nuevo 
                $query = "INSERT into grupos(nombre,descripcion,id_profesor,fecha_inicio,fecha_fin,hora_inicio,hora_fin) values";
                $query = $query."('".$_POST['nombre']."','".$_POST['descripcion']."','".$_POST['id_profesor']."','".$_POST['fecha_inicio']."','".$_POST['fecha_fin']."','".$_POST['hora_inicio']."','".$_POST['hora_fin']."')";
            }
            mysqli_query($con,$query);
            mysqli_close($con);
            //Escribimos la actividad en un log
            $registro=json_encode($_POST['registro']);
            $bites = file_put_contents("history.log", $registro.PHP_EOL,FILE_APPEND); 
            echo ("correcto");
            break;

        case 'GET':

            if(isset($_GET['id'])){
                //Significa que vamos a borrar un registro
				$con = conectar();
				
				//agregado
				mysqli_set_charset($con,"utf8");

                //$query = "DELETE from grupos where id=".$_GET['id']; actualizar estatus en lugar de borrar
                $query = "UPDATE grupos SET id_estatus=2 where id=".$_GET['id'];
				mysqli_query($con,$query);
				mysqli_close($con);
				echo('correcto');

            }else{
                 //Enviamos todos los datos del grupo
                $con = conectar();

                //agregado
                mysqli_set_charset($con,"utf8");
                //Definimos el query
                $query = "SELECT grupos.id as grupoID,grupos.nombre as grupoNombre,descripcion,usuarios.nombre as profNombre,usuarios.apellidos as profApe,fecha_inicio,fecha_fin,hora_inicio,hora_fin FROM grupos INNER JOIN usuarios where grupos.id_profesor = usuarios.id and grupos.id_estatus = 1";
                
                //Guardamos y enviamos la información
                $json = array();
                $res = mysqli_query($con,$query);

                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;
                
                mysqli_close($con);
                echo json_encode($json);

            }
           

            break;
    }

?>