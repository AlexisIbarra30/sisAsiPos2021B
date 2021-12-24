<?php
    function conectar(){
		//datos de conexion servidor uaemex
		$servidor="localhost";
		$user = "uSisAsiPos";
		$pass = "pS!s@s!Pos";
		$nombreBD = "dbsisasipos";
		
		//Servidor local
		/*$servidor = "localhost";
		$user="root";
		$pass = "";
		$nombreBD = "bdasistencias";*/

		//Conexion hosting gratuito
		/*$servidor="localhost";
		$user = "mysisasipo";
		$pass = "hVJTqVdQ";
		$nombreBD = "bdasistencias";*/


		//Conectar a la bd
		$conexion = mysqli_connect($servidor,$user,$pass,$nombreBD);
	
		return $conexion;
	}
?>