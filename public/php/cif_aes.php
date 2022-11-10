<?php

    // Obtiene la llave del archivo
    function get_key(){
        
        $llave = null;
        $file = fopen("key", "r");
        if ($file) {
            while (($line = fgets($file)) !== false) {
                $llave = $line;
            }
    
            fclose($file);
        }
        
        return $llave;
    }
    


    // Cifra el mensaje con AES y la llave del archivo
    function cifrar($mensaje){
        $llave = get_key();
        $men_encriptado = openssl_encrypt($mensaje, "AES-256-ECB", $llave, 0);     // Metodo para cifrar el mensaje
        return $men_encriptado;
    }

    // Descifra el mensaje con AES y la llave del archivo
    function descifrar($mensaje){
        $llave = get_key(); 
        $men_desencriptado = openssl_decrypt($mensaje, "AES-256-ECB", $llave, 0);
        return $men_desencriptado;
    }

?>