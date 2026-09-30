<?php
session_start();

// comprobamos si las variables de sesión ya existen
// usando isset($_SESSION['variable'])
if (!isset($_SESSION['partidas_finalizadas'])) {
    // si no existen, inicializamos las variables de sesión asignándoles un valor
    $_SESSION['partidas_finalizadas'] = 0;
    $_SESSION['mejor_puntaje'] = null; 
    $_SESSION['total_intentos_global'] = 0;
}

// acceso a los datos enviados por ajax 
// ajax envio con post, recuperamos usando $_POST['intentos']
if (isset($_POST['intentos'])) {
    $intentos_partida = (int)$_POST['intentos'];

    // sumamos una partida más finalizada a la variable persistente
    $_SESSION['partidas_finalizadas']++;
    
    // sumamos los intentos de esta partida al acumulado global
    $_SESSION['total_intentos_global'] += $intentos_partida;

    // promedio de intentos
    $promedio = $_SESSION['total_intentos_global'] / $_SESSION['partidas_finalizadas'];

    // guardar el mejor puntaje (menor cantidad de intentos)
    if ($_SESSION['mejor_puntaje'] === null || $intentos_partida < $_SESSION['mejor_puntaje']) {
        $_SESSION['mejor_puntaje'] = $intentos_partida;
    }

    // enviar los datos a js en formato json
    $respuesta = array(
        'mejor_puntaje' => $_SESSION['mejor_puntaje'],
        'partidas_finalizadas' => $_SESSION['partidas_finalizadas'],
        'promedio_intentos' => round($promedio, 2)
    );

    // indicamos que el contenido devuelto es un JSON y lo imprimimos
    // con post los datos no se almacenan
    header('Content-Type: application/json');
    echo json_encode($respuesta);
}
?>