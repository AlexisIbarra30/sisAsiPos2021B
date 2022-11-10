<?php


function verificar_intentos_hora(){
    if(isset($_SESSION['contador'])) {
        $contador = $_SESSION['contador'];
        if ($contador >= 3) {
            cookie_hora_setter();

            $cur_time = strtotime("now");
            $end_time = $_SESSION['hora'];

            if ($cur_time >= $end_time){
                borrar_cookies();
                return true;
            }

            return false;
        }
    }
    return true;
}



// Setea la hora en la cual va a poder realizar nuevos intentos
function cookie_hora_setter(){
    if(!isset($_SESSION['hora'])) { //Crea la cookie si no existe y setea la hora final
        $cur_time = strtotime("now");
        $end_time = $cur_time + 60;		// Tiempo en el cual va a poder realizar un nuevo intento
        $_SESSION['hora'] = $end_time;
        //setcookie($cookie_hora, $end_time, time() + (86400 * 30), "/");

    }
}

// Aumenta el contador en la cookie
function aumenta_contador(){
    
    if(!isset($_SESSION['contador'])) { //Crea la cookie si no existe y setea el contador a 1
        $_SESSION['contador'] = 1;
        
        //setcookie($cookie_contador, 0, time() + (86400 * 30), "/");

    } else {

        $contador = $_SESSION['contador'] + 1;
        $_SESSION['contador'] = htmlspecialchars($contador);
        //setcookie($cookie_contador, $contador, time() + (86400 * 30), "/");
    }
    
}

function borrar_cookies(){
    unset($_SESSION['contador']);
    unset($_SESSION['hora']);
    //setcookie($cookie_contador, "", time() - 3600);
    //setcookie($cookie_hora, "", time() - 3600);
}

?>