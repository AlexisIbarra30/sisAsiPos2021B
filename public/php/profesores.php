<?php 
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';



    switch($_SERVER['REQUEST_METHOD']){

        case 'GET':
            //Aqui solo entrara para listar a todos los profesores
            $con = conectar();

            //agregado
            mysqli_set_charset($con,"utf8");

            //Solo los usuarios con ID de programa igual a 5 ya que serán los profesores
            $query ="SELECT usuarios.id as id,nombre,apellidos,usuario,programa_nombre,programa,password,tipo_usuario,picture_url from usuarios inner join programas where programas.id = usuarios.programa and programas.id =5 and usuarios.id_estatus=1";
            $json = array();

            $res = mysqli_query($con,$query);

            while($fila=mysqli_fetch_assoc($res))
                $json[] = $fila;
            
            mysqli_close($con);
            echo json_encode($json);

            break;

    }
?>