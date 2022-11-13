<?php

	header('Access-Control-Allow-Origin:*');
    include_once 'conexion.php';
	include_once 'cif_aes.php';
	


    //Llenar arreglo POST
    $_POST = json_decode(file_get_contents('php://input'),true);
    $opcion = $_POST['op'];
    $json = array();

    switch ($opcion) {
    	case '1':
    		//Cambiar contraseña
    		$id = $_POST['id'];
    		$a_pass = cifrar($_POST['a_pass']);
    		$n_pass = cifrar($_POST['n_pass']);

			//Para primer login o cambio de contraseña despues de 6 meses: Fecha actual
			$currentDate = $_POST['currentDate'];
			
		

    		//Consultamos si existe usuario con esa contraseña actual
			$query = 'SELECT * from usuarios where id="'.$id.'" and password="'.$a_pass.'"';
    		$con = conectar();

			//agregado
			mysqli_set_charset($con,"utf8");

    		$res = mysqli_query($con,$query);
    		if(mysqli_num_rows($res)>0){
    			//Existe la cuenta
    			$query = "UPDATE usuarios SET password='".$n_pass."', first_login=0, lastpass_modif='".$currentDate."' where id='".$id."'";
                //Generamos consulta y enviamos respuesta
                if(mysqli_query($con,$query)){
                    $json = array("respuesta"=>"correcto");
                }else{
                    $json = array("respuesta"=>"error update");
                }
                echo(json_encode($json));
	
    		}else{
    			//No existe
                $json = array("respuesta"=>"error password");
    			echo(json_encode($json));
    		}	

    		break;
    }
?>