<?php
	
	header('Access-Control-Allow-Origin:*');
    include_once 'conexion.php';

    if(isset($_POST)){
        $json=array();
        $id=$_POST['id'];
    	$img=$_FILES['imagen'];
        $extension = pathinfo($img['name'], PATHINFO_EXTENSION);
    	$nombreTemp=$img['tmp_name'];
        $nombre = "image0".$id;
    	
    	//ruta destino: IMPORTANTE Cambiar a ruta PUBLIC para deploy
    	$destinoUp="../images/profiles/".$nombre.".".$extension;
        $destino="images/profiles/".$nombre.".".$extension;
        //$destino="../../../".$nombre.".".$extension;
    	//guardamos la ruta en la BD
        $con = conectar();
        $query = "UPDATE usuarios SET picture_url='".$destino."' where id='".$id."'";
        if(mysqli_query($con,$query)){
            mysqli_close($con);
            move_uploaded_file($nombreTemp, $destinoUp);
            $json = array("respuesta"=>"correcto","nueva_ruta"=>$destino);
            echo(json_encode($json));
        }
    	
    }else{
    	echo("error");
    }

?>