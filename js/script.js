"use strict";

let tamanoTablero = 8;
let nBombas = 10;

let bombasRestantes = 0;

let tiempo = 0;
let idTemporizador;

let primerClick;
let clickSeguro = true;

let tBombas = [];//0's y 1 en las bombas
let tInterno = [];//0's, num indicando cantidad de bombas (conbo) y -1's en las bombas.

let tMostrado = []//0's si no se ha desvelado en pantalla esa casilla y 1's si se ha desvelado

let tBanderas = [];//0's si no hay bandera, 1's si hay bandera, 2's si hay interrogación

let tPantalla = [];//la situación actual mostrada en la pantalla, -2's para las casillas sin descubrir y 0's para las vacias y num's en caso de conbo's y -1's en las bombas.

//basura
function actualizaTPantalla() {
    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            tPantalla[i][j] = tMostrado[i][j] ? tInterno[i][j] : -2;
        }
    }
}

function preparaClicks() {
    const casillas = document.getElementsByClassName("casilla");

    for (let casilla of casillas) {
        anadeClick(casilla);
        anadeClickBandera(casilla);
    }
}

function anadeClick(casilla) {
    casilla.addEventListener("click", gestionaClick, true);
}

function anadeClickBandera(casilla) {
    casilla.addEventListener("contextmenu", gestionaClickBanderas, true);
}

function quitarClick(casilla) {
    casilla.removeEventListener("click", gestionaClick, true);
}

function quitarClickBandera(casilla) {
    casilla.removeEventListener("contextmenu", gestionaClickBanderas, true);
}

function gestionaClickBanderas(evento) {
    evento.preventDefault();
    let casilla = evento.currentTarget;



    let [x, y] = obtieneCoords(casilla);

    if (tBanderas[x][y]) {
        bombasRestantes++;
        anadeClick(casilla);
    } else {
        bombasRestantes--;
        quitarClick(casilla);
    }

    tBanderas[x][y] = tBanderas[x][y] ? 0 : 1;

    actualizaMonitorBombas();
    actualizaTableroHtml();
}



function gestionaClick(evento) {
    console.log("CLICK");
    let casilla = evento.currentTarget;

    let [x, y] = obtieneCoords(casilla);


    if (primerClick) {
        inicioPostPC(x, y);
    }

    if (tInterno[x][y] > 0) {
        trataDeMostrarAlrededor(x, y, tInterno[x][y]);
    }

    mostrarSinExlosion(x, y);

    compruebaFin();

    actusPostClick();
}

function trataDeMostrarAlrededor(fila, columna, conbo) {
    if (conbo <= nBanderasAlrededorDe(fila, columna)) {
        for (let i = fila - 1; i <= fila + 1; i++) {
            for (let j = columna - 1; j <= columna + 1; j++) {
                if (i >= 0 && i < tamanoTablero && j >= 0 && j < tamanoTablero) {
                    if (!tBanderas[i][j] && !tMostrado[i][j]) {
                        mostrarSinExlosion(i, j);
                    }
                }
            }
        }
    }
}

function nBanderasAlrededorDe(fila, columna) {
    let contador = 0;

    for (let i = fila - 1; i <= fila + 1; i++) {
        for (let j = columna - 1; j <= columna + 1; j++) {
            if (i >= 0 && i < tamanoTablero && j >= 0 && j < tamanoTablero) {
                if (tBanderas[i][j]) {
                    contador++;
                }
            }
        }
    }
    return contador;
}

function actusPostClick() {
    quitaClicksCasillasMostradas();
    actualizaTableroHtml();
}

function inicioPostPC(x, y) {
    iniciarTemporizador();
    primerClick = false;
    iniciaTablerosPostClick(x, y);
}

function quitaClicksCasillasMostradas() {
    const casillas = document.getElementsByClassName("casilla");
    let contador = 0;
    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            if (tMostrado[i][j]) {
                //quitarClick(casillas[contador]);
                quitarClickBandera(casillas[contador]);
            }
            contador++;
        }
    }
}

function compruebaFin() {
    if (juegoTerminado()) {
        quitaClicksTodo();
        desactivaCaras()
        pararTemporizador();
    };
}

function juegoTerminado() {

    if (hayBombasMostradas()) {
        acabarConDerrotaEn();
        return true;
    }

    if (tableroCompletado()) {
        acabarConVictoria();
        return true;
    }
    return false;
}

function hayBombasMostradas() {
    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            if (tMostrado[i][j] && tBombas[i][j]) {
                return true;
            }
        }
    }
    return false;
}

function acabarConDerrotaEn() {
    ponCara(4);
    let contador = 0;

    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            if (tBombas[i][j] && tMostrado[i][j]) {
                bombaExplotadaRojo(contador);
            }
            contador++;
        }
    }

    muestraBombas();
}

function tableroCompletado() {
    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            if (!tBombas[i][j] && !tMostrado[i][j])
                return false;
        }
    }
    return true;
}

function acabarConVictoria() {
    ponCara(3);
    console.log("victoria magistral");

    ponerRestoBanderas();

}

function ponerRestoBanderas() {
    tBanderas = tBombas;
    bombasRestantes = 0;
}

function ponCara(num) {
    const cara = document.getElementById("cara");
    cara.src = "img/cara" + num + ".png";
}

function bombaExplotadaRojo(contador) {
    const casillas = document.getElementsByClassName("casilla");
    casillas[contador].style.backgroundColor = "red";
}

function muestraBombas() {
    for (let i = 0; i < tamanoTablero; i++) {
        for (let j = 0; j < tamanoTablero; j++) {
            if (tBombas[i][j] && !tBanderas[i][j]) tMostrado[i][j] = 1;
        }
    }
}

function quitaClicksTodo() {
    const casillas = document.getElementsByClassName("casilla");

    for (let casilla of casillas) {
        quitarClick(casilla);
        quitarClickBandera(casilla);
    }
}

function obtieneCoords(casilla) {
    let nElem = Array.from(casilla.parentElement.childNodes).indexOf(casilla);
    let fila = Math.floor(nElem / tamanoTablero);
    let columna = nElem % tamanoTablero;

    return [fila, columna];
}

function activaCarasEnClick() {
    const tablero = document.getElementById("tabla");

    tablero.addEventListener("mousedown", ponCaraSorprendida);
    tablero.addEventListener("mouseup", ponCaraContenta);
    tablero.addEventListener("mouseleave", ponCaraContenta);
}

function desactivaCaras() {
    const tablero = document.getElementById("tabla");

    tablero.removeEventListener("mousedown", ponCaraSorprendida);
    tablero.removeEventListener("mouseup", ponCaraContenta);
    tablero.removeEventListener("mouseleave", ponCaraContenta);
}


function ponCaraContenta() {
    ponCara(1);
}

function ponCaraSorprendida() {
    ponCara(2);
}

function descomponeNum3(num) {
    if (num > 999) {
        return ["9", "9", "9"];
    }
    if (num < -99) {
        return ["-", "9", "9"];
    }

    let lista = num < 0 ? (-num).toString().split("") : num.toString().split("");

    while (lista.length < 3) {
        lista.unshift("0");
    }

    if (num < 0) {
        lista[0] = "-";
    }

    return lista;
}

function actualizaMonitor(monitor, num) {
    const pantalla = document.getElementById(monitor);

    const digitos = pantalla.children;

    let numP = descomponeNum3(num);

    for (let i = 0; i < 3; i++) {
        digitos[i].setAttribute("src", "img/" + numP[i] + "r.png");
    }
}

function actualizaMonitorBombas() {
    actualizaMonitor("bombasRestantes", bombasRestantes);
}

function actualizaMonitorTemporizador() {
    actualizaMonitor("tiempo", tiempo);
}

function aumentaTemporizador() {
    tiempo++;
    actualizaMonitorTemporizador();
}

function iniciarTemporizador() {
    reiniciaTemporizador();
    idTemporizador = setInterval(aumentaTemporizador, 1000);
}

function reiniciaTemporizador() {
    pararTemporizador();
    tiempo = 0;
    actualizaMonitorTemporizador();
}

function pararTemporizador() {
    window.clearInterval(idTemporizador);
}



function buscaminas() {
    primerClick = true;
    bombasRestantes = nBombas;

    iniciaTableroPreClick();

    ponCaraContenta();

    iniciaTableroHtml();

    reiniciaTemporizador();
    actualizaMonitorBombas();

    activaCarasEnClick();
    preparaClicks();
}

/* document.getElementById("cambiar").addEventListener("click", function () {
    const tamanoInput = document.getElementById("tamano").value;
    const nBombasInput = document.getElementById("nBombas").value;

    // Validar y aplicar cambios
    if (tamanoInput > 0 && nBombasInput > 0 && nBombasInput < (tamanoInput * tamanoInput - 9)) {
        tamanoTablero = tamanoInput;
        nBombas = nBombasInput;
        buscaminas();
    } else {
        alert("Por favor, introduce valores válidos.");
    }
}); */

document.getElementById("botonReinicio").addEventListener("click", buscaminas, true);

document.addEventListener("DOMContentLoaded", buscaminas);