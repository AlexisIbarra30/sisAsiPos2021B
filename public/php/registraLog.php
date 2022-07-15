<?php
	header('Access-Control-Allow-Origin:*');

    switch($_SERVER['REQUEST_METHOD']){

        case 'POST':

            $_POST = json_decode(file_get_contents('php://input'),true);
            $registro=json_encode($_POST);
            $bites = file_put_contents("history.log", $registro.PHP_EOL,FILE_APPEND); 
            echo ($registro);
            break;
    }


?>