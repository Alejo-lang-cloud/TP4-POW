// variables globales
let numeroSecreto;
let intentosActuales = 0;

// referencias al DOM: captura de los elementos del html
const inputNumero = document.getElementById('input-numero');
const btnAdivinar = document.getElementById('btn-adivinar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const mensajeFeedback = document.getElementById('mensaje-feedback');
const txtIntentos = document.getElementById('intentos-actuales');

// funciones del juego
// reiniciar o iniciar la partida
function iniciarJuego() {
    // generamos el número aleatorio entre 1 y 1000 usando los objetos matemáticos de js
    numeroSecreto = Math.floor(Math.random() * 1000) + 1;
    
    // reiniciamos contadores visuales y variables
    intentosActuales = 0;
    txtIntentos.innerText = intentosActuales;
    
    // limpiamos la interfaz
    mensajeFeedback.classList.add('oculto');
    inputNumero.value = '';
    inputNumero.disabled = false;
    btnAdivinar.disabled = false;
    inputNumero.focus();
    
    // restauramos el color de fondo 
    document.body.style.backgroundColor = '#ffd700'; 
}

// comprobar el número ingresado
function comprobarNumero() {
    // obtenemos el valor del campo de texto
    const intento = parseInt(inputNumero.value);

    // validamos que sea un número correcto
    if (isNaN(intento) || intento < 1 || intento > 1000) {
        alert("CHE! Ingresá un número entre 1 y 1000");
        return;
    }

    // aumentamos el intento, actualizar el DOM 
    intentosActuales++;
    txtIntentos.innerText = intentosActuales;
    mensajeFeedback.classList.remove('oculto');

    // comparación
    if (intento < numeroSecreto) {
        mensajeFeedback.innerHTML = "¡Muy <strong>FLOJITO!</strong> Sigue intentando.";
        mensajeFeedback.style.backgroundColor = "#e0ffff";
    } else if (intento > numeroSecreto) {
        mensajeFeedback.innerHTML = "¡Muy <strong>CEBADO!</strong> Baja un cambio.";
        mensajeFeedback.style.backgroundColor = "#ff1493";
    } else {
        // acierta
        victoria();
    }
}

function victoria() {
    mensajeFeedback.innerHTML = "ENHORABUENA! Adivinastes el número secreto.";
    mensajeFeedback.style.backgroundColor = "#00ff00"; 
    document.body.style.backgroundColor = "#00ffff"; 
    
    // bloqueo de controles para que no siga jugando esta partida
    inputNumero.disabled = true;
    btnAdivinar.disabled = true;

    // función ajax para enviar el resultado al servidor
    enviarEstadisticas(intentosActuales);
}

// ajax y comunicación con el servidor
function enviarEstadisticas(intentos) {
    // usamos fetch (ajax) para enviar los datos hacia el recurso en php mediante post
    fetch('../php/ej1.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'intentos=' + intentos // parámetro que mandamos al servidor
    })
    .then(respuesta => respuesta.json()) // esperamos un json de vuelta
    .then(datos => {
        // manipulamos el DOM con los datos puros recibidos en segundo plano
        document.getElementById('mejor-puntaje').innerText = datos.mejor_puntaje;
        document.getElementById('partidas-finalizadas').innerText = datos.partidas_finalizadas;
        document.getElementById('promedio-intentos').innerText = datos.promedio_intentos;
    })
    .catch(error => {
        console.error("Error en la petición AJAX:", error);
    });
}

// eventos
// permite agregar eventos a los elementos html separando el JS del HTML
btnAdivinar.addEventListener("click", comprobarNumero);
btnReiniciar.addEventListener("click", iniciarJuego);

// permitir que la tecla "Enter" también dispare la función comprobarNumero
inputNumero.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        comprobarNumero();
    }
});

// iniciamos el juego por primera vez al cargar el script
iniciarJuego();