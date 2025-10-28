
function muestraCasilla(fila, columna) {
    tMostrado[fila][columna] = 1;
}

let visitadas;
function extiendeMostrado(i, j) {
    if (i < 0 || i >= tamanoTablero || j < 0 || j >= tamanoTablero) {
        return;
    }

    if (visitadas[i][j]) return;
    visitadas[i][j] = 1;

    if(tBanderas[i][j]) return;

    if (tInterno[i][j] > 0) {
        muestraCasilla(i, j);
        return;
    }
    if (tInterno[i][j] == -1) {
        muestraCasilla(i, j);
        return;
    }
    if (!tInterno[i][j]) {
        muestraCasilla(i, j);

        extiendeMostrado(i - 1, j);
        extiendeMostrado(i - 1, j - 1);
        extiendeMostrado(i - 1, j + 1);
        extiendeMostrado(i + 1, j);
        extiendeMostrado(i + 1, j - 1);
        extiendeMostrado(i + 1, j + 1);
        extiendeMostrado(i, j - 1);
        extiendeMostrado(i, j + 1);
    }
}

function mostrarSinExlosion(i, j){
    visitadas = creaTableroCeros();
    extiendeMostrado(i, j);
}