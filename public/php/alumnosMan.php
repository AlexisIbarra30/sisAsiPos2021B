<?php
    header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            $_POST = json_decode(file_get_contents('php://input'),true);
            $con = conectar();
            //agregado
			mysqli_set_charset($con,"utf8");

            if(isset($_POST['id'])){
                //Si viene el ID del grupo significa que va a modificar
                
            }else{
                $query = "INSERT into alumnos(nombres,apePaterno,apeMaterno,id_programa,id_estatus) values";
                $query = $query."('".$_POST['nombre']."','".$_POST['apePat']."','".$_POST['apeMat']."','".$_POST['programa']."','".$_POST['estatus']."')";
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

                $query = "UPDATE alumnos SET id_estatus=2 where id=".$_GET['id'];
				mysqli_query($con,$query);
				mysqli_close($con);
				echo($query);

            }
            else if(isset($_GET['id_grupo'])){
                // SELECT grupos_alumnos.id_horario,alumnos.nombres,alumnos.apePaterno,alumnos.apeMaterno,grupos_alumnos.hora_inicio,grupos_alumnos.hora_fin FROM alumnos inner join grupos_alumnos where alumnos.id = grupos_alumnos.id_alumno and grupos_alumnos.id_grupo = 4;
                $con = conectar();

                //agregado
                mysqli_set_charset($con,"utf8");
                //Definimos el query
                $query = "SELECT grupos_alumnos.id_horario as id_horario,alumnos.nombres as nombres,alumnos.apePaterno as apePat,alumnos.apeMaterno as apeMat,grupos_alumnos.hora_inicio as hora_inicio,grupos_alumnos.hora_fin as hora_fin FROM alumnos inner join grupos_alumnos where alumnos.id = grupos_alumnos.id_alumno and grupos_alumnos.id_grupo = ".$_GET['id_grupo'];
                //Guardamos y enviamos la información
                $json = array();
                $res = mysqli_query($con,$query);

                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;
                
                mysqli_close($con);
                echo json_encode($json);
            }
            else{
                //Enviamos todos los datos del grupo
                $con = conectar();

                //agregado
                mysqli_set_charset($con,"utf8");
                //Definimos el query
                $query = "SELECT alumnos.id,nombres,apePaterno,apeMaterno,programas.programa_nombre as programa,programas.id as programa_id,estatus.nombre as estatus from alumnos inner join programas inner join estatus where alumnos.id_programa=programas.id and alumnos.id_estatus = estatus.id_estatus and alumnos.id_estatus=1";
                //Guardamos y enviamos la información
                $json = array();
                $res = mysqli_query($con,$query);

                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;
                
                mysqli_close($con);
                echo json_encode($json);
            }
    }


?>