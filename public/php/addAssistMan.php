<?php
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){
        case "POST":
            $_POST = json_decode(file_get_contents('php://input'),true);

            if(isset($_POST['fecha']) && isset($_POST['id_alumnos']) && isset($_POST['id_grupo'])){
                //Asistencias registradas por el profesor

                $con = conectar();
                $ids = array();
                //Datos POST
                $fecha = new DateTime($_POST['fecha']); 
                $fecha = $fecha->format('Y-m-d');
                $horaI = new DateTime($_POST['h_inicio']);
                $horaF = new DateTime($_POST['h_fin']);
                $id_grupo = intval($_POST['id_grupo']);
                $respuesta="";
                $total = $horaI -> diff($horaF) -> format('%H:%I');


                //2.- Seleccionar los IDs de horario de los alumnos que SI tienen asistencia
                $queryBase = "SELECT id_horario from grupos_alumnos where id_grupo = '".$id_grupo."'";

                foreach($_POST['id_alumnos'] as $a){
                    if($a != 0){
                        $query = $queryBase." and id_alumno = '".$a."'";
                        $res = mysqli_query($con,$query);
                        $ids[] = mysqli_fetch_assoc($res)['id_horario'];
                    }
                }

                //3.- Insertamos horas totales, fecha y id_horario obtenidos (opcional, validar que no exista otro registro de asistencia)
               
                
                $queryBase = "INSERT into profasistencias(id_horario,fecha,total_horas) VALUES ";
                

                foreach($ids as $i){
                    $query = $queryBase."('".$i."','".$fecha."','".$total."')";
                    mysqli_query($con,$query);
                }
                
                //4.- Insertar o Actualizar horas en tabla asistencias
                    //4.1.- Obtener nombre completo de los alumnos y el ID del programa al que pertenecen
                $nombres = array();
                $apellidos = array();
                $programas = array();

                $queryBase ="SELECT nombres,apePaterno,apeMaterno,id_programa from alumnos inner join grupos_alumnos where alumnos.id = grupos_alumnos.id_alumno and id_horario = ";

                foreach($ids as $id){
                    $query = $queryBase ."'".$id."'";  
                    $res = mysqli_fetch_assoc(mysqli_query($con,$query));

                    $nombres[] = $res['nombres'];
                    $apellidos[] = $res['apePaterno']." ".$res['apeMaterno'];
                    $programas[] =$res['id_programa'];


                }

                    //4.2.- Consultar si existe una asistencia en la fecha F en tabla asistencia
                for($i = 0;$i<sizeof($nombres);$i++){
                    $queryBase = "SELECT * from asistencias where nombre like '".$nombres[$i]."' and apellidos like '".$apellidos[$i]."' and fecha like '".$fecha."'";
                    $res = mysqli_query($con,$queryBase);
                    if(mysqli_num_rows($res)>0){
                        //Si existe un registro de asistencia, verificar el programa y horas de inicio y fin.
                        $asis = mysqli_fetch_assoc($res);
                        if($total<$asis['horas_permanencia']){
                            $query = "UPDATE asistencias SET horas_permanencia = '".$asis['horas_permanencia']."' where id='".$asis['id']."'";
                            mysqli_query($con,$query);
                            $programas[] = $query;
                        }
                    }else{
                        $query = "INSERT INTO asistencias(nombre,apellidos,fecha,hora_entrada,hora_salida,horas_permanencia,programa) values ";
                        $query = $query." ('".$nombres[$i]."','".$apellidos[$i]."','".$fecha."','".$_POST['h_inicio']."','".$_POST['h_fin']."','".$total."','".$programas[$i]."')";
                        mysqli_query($con,$query);
                    }
                }

                mysqli_close($con);
                $respuesta = "correcto";
                echo $respuesta;

            }
            
            break;

        case "GET":

            //Para traer los grupos deacuerdo al ID del profesor
            if(isset($_GET['id'])){
            
                $id = $_GET['id'];
                $con = conectar();
                //agregado
                mysqli_set_charset($con,"utf8");

                //Definimos el query
                $query="SELECT grupos.nombre as nombre, grupos.descripcion as descripcion, usuarios.id as usuario_id, grupos.id as grupo_id, fecha_inicio,fecha_fin,hora_inicio,hora_fin from grupos INNER JOIN usuarios where grupos.id_profesor = usuarios.id";
                $query =$query." and usuarios.id = '$id'";

                //Guardamos los resultados
                $res=mysqli_query($con,$query);
                $json= array();

                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;

                mysqli_close($con);
                echo json_encode($json);
            }
            //Para traer a los alumnos segun el grupo al que pertenecen

            else if(isset($_GET['id_grupo'])){
                
                //Debemos agregar un arreglo que contenga los registros de asistencias y 
                //faltas en caso de consultar una fecha en la cual ya se tenga dicho registro

                $id_grupo = $_GET['id_grupo'];
                $con = conectar();
                //agregado
                mysqli_set_charset($con,"utf8");

                //1.- Recuperamos a todos los alumnos que pertenecen al grupo y se guardan en "$JSON"
                $query = "SELECT alumnos.id as id, grupos_alumnos.id_horario as id_horario,nombres,apePaterno, apeMaterno,programa_nombre from programas inner join alumnos inner join grupos_alumnos where alumnos.id = grupos_alumnos.id_alumno and alumnos.id_programa = programas.id";
                $query = $query." and id_grupo = '$id_grupo'";
                $res=mysqli_query($con,$query);
                $json= array();

                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;
                
                //2.- Recuperamos las asistencias (si existen) de los alumnos
                
                $json2 = array();
                $json3 = array();
                $fecha = new DateTime($_GET['fecha']); 
                $fecha = $fecha->format('Y-m-d');
                
                $queryBase = "SELECT * from profasistencias where fecha = '".$fecha."' and id_horario=";
                foreach($json as $a){
                    $query = $queryBase."'".$a['id_horario']."'";
                    $res = mysqli_query($con,$query);
                    if(mysqli_num_rows($res)==0){
                        $json2[] = 0;
                        $json3[] = 0;
                    }else{
                        $json2[] = 1;
                        $json3[] = $a['id'];
                    }
                }

                $r = ["alumnos"=>$json,"asistencias"=>$json2,"ids_asistencias"=>$json3];
                mysqli_close($con);
                echo json_encode($r);
            }

            break;

    }

?>