const displayNumero = document.getElementById('numero-display');
const msjEstado = document.getElementById('mensaje-estado');
const inputInf = document.getElementById('limite-inf');
const inputSup = document.getElementById('limite-sup');

// al cargar la pag, pedimos al servidor los datos guardados
document.addEventListener('DOMContentLoaded', () => {
    enviarPeticion('cargar');
});

document.getElementById('btn-generar').addEventListener('click', () => {
    enviarPeticion('generar');
});

document.getElementById('btn-reiniciar').addEventListener('click', () => {
    enviarPeticion('reiniciar');
});

document.getElementById('btn-generar').addEventListener("keydown", function(event){
    if (event.key === "Enter") {
        enviarPeticion('generar');
    }
});

async function enviarPeticion(accion) {
    const limInf = parseInt(inputInf.value);
    const limSup = parseInt(inputSup.value);

    // validamos inf>0
    if (limInf < 0) {
        alert("El límite inferior no puede ser negativo.");
        return; 
    }

    // validamos inf<sup
    if (limInf >= limSup) {
        alert("El límite inferior debe ser estrictamente menor al límite superior.");
        return; 
    }

    const datos = {
        accion: accion,
        limite_inf: limInf,
        limite_sup: limSup
    };

    try {
        const respuesta = await fetch('../php/ej2.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const resultado = await respuesta.json();
        actualizarUI(resultado);
        
    } catch (error) {
        console.error("Error en AJAX:", error);
        msjEstado.innerText = "Error de conexión";
    }
}

function actualizarUI(datos) {
    // actualizamos los inputs 
    inputInf.value = datos['limite inferior'];
    inputSup.value = datos['limite superior'];

    if (datos.estado === 'lleno') {
        displayNumero.innerText = "FIN";
        msjEstado.innerText = "Todos los números están generados";
        msjEstado.style.color = "#dc2626"; 
    } else if (datos.estado === 'reiniciado') {
        displayNumero.innerText = "--";
        msjEstado.innerText = "Sistema reiniciado";
        msjEstado.style.color = "#64748b";
    } else if (datos.ultimo_numero) {
        displayNumero.innerText = datos.ultimo_numero;
        msjEstado.innerText = "Turno actual";
        msjEstado.style.color = "#3b82f6"; 
    }
}