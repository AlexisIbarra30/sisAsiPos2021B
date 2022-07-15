<?php
    header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';

	switch($_SERVER['REQUEST_METHOD']){
        case 'POST':
            $_POST = json_decode(file_get_contents('php://input'),true);
            $con = conectar();
            //agregado
			mysqli_set_charset($con,"utf8");

           
            //Recorremos arreglo de alumnos
            foreach($_POST['alumnos'] as $alumno){
                $id = $_POST['id_grupo'];
                $id2 = $alumno['id'];
                $query = "INSERT into grupos_alumnos(id_grupo,id_alumno)";
                $query = $query." VALUES('$id','$id2')";

                mysqli_query($con,$query);
            }
            
            mysqli_close($con);
            echo "correcto";
            break;
    }

?>