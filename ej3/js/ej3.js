const btnBuscar = document.getElementById('btn-buscar');
const inputPersonaje = document.getElementById('input-personaje');
const msjEstado = document.getElementById('mensaje-estado');

// capturamos las dos partes de la interfaz
const resultadoFoto = document.getElementById('resultado-foto');
const resultadoInfo = document.getElementById('resultado-info');

btnBuscar.addEventListener('click', () => {
    const personaje = inputPersonaje.value.trim().toLowerCase();
    if (personaje !== "") {
        buscarSuperheroe(personaje);
    }
});

inputPersonaje.addEventListener("keydown", function(event){
    if (event.key === "Enter") {
        const personaje = inputPersonaje.value.trim().toLowerCase();
        if (personaje !== "") {
            buscarSuperheroe(personaje);
        }
    }
});

async function buscarSuperheroe(nombre) {
    msjEstado.innerText = "Accediendo a la Baticomputadora...";
    msjEstado.classList.remove('oculto');
    
    // ocultamos ambas tarjetas para iniciar una nueva búsqueda
    resultadoFoto.classList.add('oculto');
    resultadoInfo.classList.add('oculto');

    const url = 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json';

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la descarga");

        const data = await response.json();
        const heroe = data.find(p => p.name.toLowerCase().includes(nombre));
        
        if (heroe) {
            // completar datos
            document.getElementById('nombre-personaje').innerText = heroe.name;
            document.getElementById('nombre-real').innerText = heroe.biography.fullName || "IDENTIDAD DESCONOCIDA";
            
            const raza = heroe.appearance.race || "Desconocida";
            const origen = heroe.biography.publisher ? heroe.biography.publisher.toUpperCase() : "DESCONOCIDO";
            document.getElementById('desc-personaje').innerText = 
                `EDITORIAL: ${origen} | RAZA: ${raza.toUpperCase()} | ALTURA: ${heroe.appearance.height[1]} | PESO: ${heroe.appearance.weight[1]}`;
            
            document.getElementById('stats-combate').innerHTML = 
                `<strong>INT:</strong> ${heroe.powerstats.intelligence} | <strong>FUE:</strong> ${heroe.powerstats.strength} | <strong>VEL:</strong> ${heroe.powerstats.speed} <br> <strong>RES:</strong> ${heroe.powerstats.durability} | <strong>POD:</strong> ${heroe.powerstats.power} | <strong>COM:</strong> ${heroe.powerstats.combat}`;
            
            document.getElementById('afiliacion-personaje').innerText = `EQUIPO: ${heroe.connections.groupAffiliation}`;
            document.getElementById('foto-personaje').src = heroe.images.lg;

            // mostramos ambas tarjetas y ocultamos el mensaje
            msjEstado.classList.add('oculto');
            resultadoFoto.classList.remove('oculto');
            resultadoInfo.classList.remove('oculto');
        } else {
            msjEstado.innerText = "Sujeto no encontrado en los archivos confidenciales.";
        }

    } catch (error) {
        msjEstado.innerText = "Error de conexión con los satélites.";
    }
}