<?php
    function conectar(){
		//datos de conexion
		$servidor="localhost";
		$user = "root";
		$pass = "";
		$nombreBD = "bdasistencias";

		//Conectar a la bd
		$conexion = mysqli_connect($servidor,$user,$pass,$nombreBD);
	
		return $conexion;
	}
?>