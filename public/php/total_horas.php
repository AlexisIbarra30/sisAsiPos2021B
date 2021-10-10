<?php
    include_once 'conexion.php';

    header('Access-Control-Allow-Origin:*');
    
    /*
        Parametros GET: 
        fecha_inicio : primer fecha dentro del rango
        fecha_fin: ultima fecha dentro del rango
        nombre: nombre(s) del usuario a buscar
        apellidos: apellidos del usuario a buscar
        Para buscar por nombre se requiere que tanto nombre y apellidos esten definidos. Caso contrario devolverá todos los nombres
    */

    switch($_SERVER['REQUEST_METHOD']){

        //Obtenemos el total de horas de los alumnos respecto a un rango de tiempo
        case 'GET':
            $query=""; //Consulta vacia (inicio)

            //En caso de dar un nombre, consulta solo los resultados de un alumno
            if(isset($_GET['nombre']) and isset($_GET['apellidos']) and isset($_GET['programa'])){
                $query="SELECT nombre,apellidos,SEC_TO_TIME(SUM(TIME_TO_SEC(horas_permanencia))) as total_horas from asistencias where fecha BETWEEN '".$_GET['fecha_inicio']."' and '".$_GET['fecha_fin']."' and nombre like'".$_GET['nombre']."' and apellidos like '".$_GET['apellidos']."'";
            }else{
                //Si no dan un nombre en concreto, consulta todos los alumnos                
                $query="SELECT nombre,apellidos,SEC_TO_TIME(SUM(TIME_TO_SEC(horas_permanencia))) as total_horas from asistencias where fecha BETWEEN '".$_GET['fecha_inicio']."' and '".$_GET['fecha_fin']."' and programa='".$_GET['programa']."' group by nombre,apellidos";
            }

            //Conectamos y Ejecutamos la consulta
            $con=conectar();
            $res = mysqli_query($con,$query);
            //Generamos JSON
            if(mysqli_num_rows($res)==0){
                $json = array();
                echo json_encode($json);
            }else{
                $json= array();
                while($fila=mysqli_fetch_assoc($res))
                    $json[] = $fila;
                
                echo json_encode($json);
            }   
            mysqli_close($con);
        break;

    }

    
?>