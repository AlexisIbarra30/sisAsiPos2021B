<?php
    function conectar(){
		//datos de conexion servidor uaemex
		/*$servidor="localhost";
		$user = "uSisAsiPos";
		$pass = "pS!s@s!Pos";
		$nombreBD = "dbsisasipos";*/
		
		//Servidor local (de desarrollo)
		$servidor = "localhost";
		$user="root";
		$pass = "";
		$nombreBD = "dbsisasipos";



		//Conectar a la bd
		$conexion = mysqli_connect($servidor,$user,$pass,$nombreBD);
	
		return $conexion;
	}
?>