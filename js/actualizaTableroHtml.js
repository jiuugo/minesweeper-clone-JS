//mejorar funciones internas para utlizar tPantalla y crear funciones de cambiaCasilla individualmente
function actualizaTableroHtml() {
    destapaCasillas();
    colocaImagenesBanderas();
    colocaImagenes();

    actualizaMonitorBombas();
}

function colocaImagenes() {
    const casillas = document.getElementsByClassName("casilla");
    let contador = 0;

    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            if (tMostrado[i][j] && tInterno[i][j]) {
                casillas[contador].innerHTML = "";
                let imagen = document.createElement("img");
                imagen.classList.add("sprite");
                const src = document.createAttribute("src");
                src.value = "../img/" + tInterno[i][j] + ".png"
                imagen.setAttributeNode(src);

                const draggable = document.createAttribute("draggable");
                draggable.value = "false";
                imagen.setAttributeNode(draggable);

                const unselectable = document.createAttribute("UNSELECTABLE");
                unselectable.value = "on";
                imagen.setAttributeNode(unselectable);

                casillas[contador].appendChild(imagen);
            }
            contador++;
        }
    }
}

function colocaImagenesBanderas() {
    const casillas = document.getElementsByClassName("casilla");
    let contador = 0;

    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            casillas[contador].innerHTML = "";
            if (!tMostrado[i][j] && tBanderas[i][j]) {
                casillas[contador].innerHTML = "";
                let imagen = document.createElement("img");
                imagen.classList.add("sprite");
                const src = document.createAttribute("src");
                src.value = "../img/-2.png"
                imagen.setAttributeNode(src);

                const draggable = document.createAttribute("draggable");
                draggable.value = "false";
                imagen.setAttributeNode(draggable);

                const unselectable = document.createAttribute("UNSELECTABLE");
                unselectable.value = "on";
                imagen.setAttributeNode(unselectable);

                casillas[contador].appendChild(imagen);
            }
            contador++;
        }
    }
}

function destapaCasillas() {
    const casillas = document.getElementsByClassName("casilla");
    let contador = 0;

    for (let fila of tMostrado) {
        for (let casilla of fila) {
            if (casilla) {
                destapaCasilla(casillas[contador]);
            };
            contador++;
        }
    }
}

function destapaCasilla(casilla) {
    casilla.classList.remove("tapada")
    casilla.classList.add("mostrada");
}