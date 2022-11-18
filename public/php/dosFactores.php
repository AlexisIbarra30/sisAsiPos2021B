<?php 
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';
    include_once 'mailDosFactores.php';
	include_once 'cif_aes.php';



	switch($_SERVER['REQUEST_METHOD']){
	 	//Verificar que el usuario existe y devolver sus datos
	 	case 'POST':

	 		$_POST = json_decode(file_get_contents('php://input'),true);
	 		if(isset($_POST['codigo']) and isset($_POST['usuario'])){

                $json = array();
                
				$codigo = cifrar($_POST['codigo']);

				list($status, $mensaje) = validarCodigo($_POST['usuario'], $codigo);
                if ($status){
                    $json[] = array("valido"=>true, "token"=>$codigo);
                }
                else {
                    $json[] = array("valido"=>false, "motivo"=>$mensaje);
                }

				echo json_encode($json);

			} else if(isset($_POST['reenviar']) and isset($_POST['usuario'])){
				enviarCodigo($_POST['usuario']);
				$json[] = array("valido"=>true);
				echo json_encode($json);
			}
	 		break;

		

	 }


?>