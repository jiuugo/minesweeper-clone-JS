function iniciaTableros() {


}

function iniciaTableroPreClick() {
    iniciaTMostrado();
    iniciaTBanderas();
}

function iniciaTablerosPostClick() {
    iniciaTBombas();
    iniciaTInterno();
}

function iniciaTPantalla() {
    tPantalla = creaTableroCeros();
    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            tPantalla[i][j] = -2;
        }
    }
}

function iniciaTMostrado() {
    tMostrado = creaTableroCeros();
}

function iniciaTBanderas() {
    tBanderas = creaTableroCeros();
}

function iniciaTBombas() {
    let bombasRestantes = nBombas;

    tBombas = creaTableroCeros();

    while (bombasRestantes) {
        const filaRand = Math.floor(tamanoTablero * Math.random());
        const columnaRand = Math.floor(tamanoTablero * Math.random());

        if (tBombas[filaRand][columnaRand]) continue;

        tBombas[filaRand][columnaRand] = 1;
        bombasRestantes--;
    }
}

function iniciaTInterno() {
    tInterno = creaTableroCeros();

    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            tInterno[i][j] = tBombas[i][j] ? -1 : conBoEnCoord(i, j);
        }
    }
}

function conBoEnCoord(fila, columna) {
    let conbo = 0;
    if (tBombas[fila - 1]) {
        if (tBombas[fila - 1][columna - 1]) {
            conbo++;
        }
        conbo += tBombas[fila - 1][columna];
        if (tBombas[fila - 1][columna + 1]) {
            conbo++;
        }
    }

    if (tBombas[fila][columna - 1]) {
        conbo++;
    }
    //conbo += tBombas[fila][columna]; NO SE CUENTA LA PROPIA BOMBA
    if (tBombas[fila][columna + 1]) {
        conbo++;
    }

    if (tBombas[fila + 1]) {
        if (tBombas[fila + 1][columna - 1]) {
            conbo++;
        }
        conbo += tBombas[fila + 1][columna];
        if (tBombas[fila + 1][columna + 1]) {
            conbo++;
        }
    }
    return conbo;
}

function creaTableroCeros() {
    let tablero = [];
    for (let i = 0; i < tamanoTablero; i++) {
        tablero[i] = [];
        for (let j = 0; j < tamanoTablero; j++) {
            tablero[i][j] = 0;
        }
    }
    return tablero;
}

function iniciaTableroHtml() {
    const tablero = document.getElementById("tablero");
    tablero.innerHTML = "";

    tablero.style.gridTemplateColumns = `repeat(${tamanoTablero}, 1.4em)`;

    for (let i = 0; i < tamanoTablero * tamanoTablero; i++) {
        let div = document.createElement("div");
        div.classList.add("casilla");
        div.classList.add("tapada");

        tablero.appendChild(div);
    }
}