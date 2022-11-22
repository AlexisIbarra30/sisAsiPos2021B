<?php 
	header('Access-Control-Allow-Origin:*');
	include_once 'conexion.php';
    include_once 'mailDosFactores.php';
	include_once 'cif_aes.php';
	include_once 'sesion.php';

	session_id("hao4iijmbv7cl4nouna3hmldjs");	
	session_start();


	switch($_SERVER['REQUEST_METHOD']){
	 	//Verificar que el usuario existe y devolver sus datos
	 	case 'POST':

	 		$_POST = json_decode(file_get_contents('php://input'),true);
	 		if(isset($_POST['codigo']) and isset($_POST['usuario'])){


				if (!verificar_intentos_hora()){
					$json[] = array("valido"=>false, "motivo"=>"TresIntentos","tiempo"=>get_tiempo_sobrante());
					echo json_encode($json);
					break;
				}

                $json = array();
				$codigo = cifrar($_POST['codigo']);



				list($status, $mensaje) = validarCodigo($_POST['usuario'], $codigo);
                if ($status){
					borrar_cookies();
                    $json[] = array("valido"=>true, "token"=>$codigo);
                }
                else {
					
					aumenta_contador();
					$intentos = get_intentos_restantes();
					if ($intentos == 0) {
						verificar_intentos_hora();
						$json[] = array("valido"=>false, "motivo"=>"TresIntentos","tiempo"=>get_tiempo_sobrante());

					}else {
						$json[] = array("valido"=>false,"motivo"=>$mensaje,"intentos"=>$intentos);
					}

                }

				echo json_encode($json);

			} else if(isset($_POST['reenviar']) and isset($_POST['usuario'])){

				if (!verificar_intentos_hora()){
					$json[] = array("valido"=>false, "motivo"=>"TresIntentos","tiempo"=>get_tiempo_sobrante());
					echo json_encode($json);
					break;
				}

				enviarCodigo($_POST['usuario']);
				$json[] = array("valido"=>true);
				echo json_encode($json);
			}
	 		break;

		

	 }


?>