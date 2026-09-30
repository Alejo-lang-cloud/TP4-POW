<?php
// recibimos el json 
$datos_recibidos = json_decode(file_get_contents("php://input"), true);
$accion = $datos_recibidos['accion'];

// actualizamos los límites si vienen en la petición (excepto al cargar)
if ($accion !== 'cargar' && isset($datos_recibidos['limite_inf'])) {
    
    // verificación de seguridad en el servidor
    if ($datos_recibidos['limite_inf'] < 0 || $datos_recibidos['limite_inf'] >= $datos_recibidos['limite_sup']) {
        // si los datos son inválidos, devolvemos un error y detenemos el script
        header('Content-Type: application/json');
        echo json_encode(["estado" => "error", "mensaje" => "Límites inválidos"]);
        exit;
    }

    $datos_sistema['limite inferior'] = (int)$datos_recibidos['limite_inf'];
    $datos_sistema['limite superior'] = (int)$datos_recibidos['limite_sup'];
}

$archivo_json = 'datos.json';

// valores por defecto
$datos_sistema = [
    "limite inferior" => 1,
    "limite superior" => 100,
    "números" => []
];

// si el archivo ya existe, lo leemos y decodificamos su json a un objeto php
if (file_exists($archivo_json)) {
    $contenido = file_get_contents($archivo_json);
    $datos_sistema = json_decode($contenido, true);
}

// actualizamos los límites si vienen en la petición (excepto al cargar)
if ($accion !== 'cargar' && isset($datos_recibidos['limite_inf'])) {
    $datos_sistema['limite inferior'] = (int)$datos_recibidos['limite_inf'];
    $datos_sistema['limite superior'] = (int)$datos_recibidos['limite_sup'];
}

$limite_inf = $datos_sistema['limite inferior'];
$limite_sup = $datos_sistema['limite superior'];

// array plano solo con los números para facilitar la búsqueda
$numeros_usados = array_column($datos_sistema['números'], 'numero');

$respuesta = $datos_sistema;
$respuesta['estado'] = 'ok';

if ($accion === 'reiniciar') {
    $datos_sistema['números'] = [];
    $respuesta['estado'] = 'reiniciado';
    $respuesta['números'] = [];
} 
elseif ($accion === 'generar') {
    $total_posibles = ($limite_sup - $limite_inf) + 1;
    
    // verificamos si ya salieron todos
    if (count($numeros_usados) >= $total_posibles) {
        $respuesta['estado'] = 'lleno';
    } else {
        $numero_elegido = null;
        $random = rand($limite_inf, $limite_sup);

        // si el random ya existe, buscamos el superior, si no, el inferior
        if (in_array($random, $numeros_usados)) {
            $encontrado = false;
            // buscar hacia arriba
            for ($i = $random + 1; $i <= $limite_sup; $i++) {
                if (!in_array($i, $numeros_usados)) {
                    $numero_elegido = $i;
                    $encontrado = true;
                    break;
                }
            }
            // si no hay hacia arriba, buscar hacia abajo
            if (!$encontrado) {
                for ($i = $random - 1; $i >= $limite_inf; $i--) {
                    if (!in_array($i, $numeros_usados)) {
                        $numero_elegido = $i;
                        break;
                    }
                }
            }
        } else {
            $numero_elegido = $random;
        }

        // guardamos el número en la estructura json solicitada
        if ($numero_elegido !== null) {
            $datos_sistema['números'][] = ["numero" => $numero_elegido];
            $respuesta['ultimo_numero'] = $numero_elegido;
            $respuesta['números'] = $datos_sistema['números'];
        }
    }
}

// persistencia
file_put_contents($archivo_json, json_encode($datos_sistema, JSON_PRETTY_PRINT));

// devolvemos json a js
header('Content-Type: application/json');
echo json_encode($respuesta);
?>