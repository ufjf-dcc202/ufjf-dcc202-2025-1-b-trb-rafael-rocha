// Lógica de crescimento, fases, timer e sprites das plantas

const estadoPlantas = {};
const FASES_POR_PLANTA = 5;
const TEMPO_PARA_AVANCAR = 3;
const INTERVALO_TICK = 1000;
let tickAtual = 0;

const plantasCanteiro = document.querySelector('.plantas-canteiro');
const tabelaCanteiro = document.querySelector('table.canteiro');


const timerDiv = document.getElementById('timer-jogo');
setInterval(() => {
    tickAtual++;
    if (timerDiv) timerDiv.textContent = 'Tempo: ' + tickAtual;
    for (const key in estadoPlantas) {
        const planta = estadoPlantas[key];
        if (planta.fase < FASES_POR_PLANTA && planta.regado) {
            planta.ticks++;
            if (planta.ticks >= TEMPO_PARA_AVANCAR) {
                planta.fase++;
                planta.ticks = 0;
                atualizarSpriteFase(key, planta);
                planta.regado = false;
                atualizarRegadoCelula(key, false);
            }
        }
    }
}, INTERVALO_TICK);

function adicionarSpritePlantaCelula(celula, tipo) {
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    removerSpritePlantaCelula(celula);
    let spriteDiv = document.createElement('div');
    if (tipo === 'cenoura') spriteDiv.className = 'planta-cenoura-fase1';
    else if (tipo === 'batata') spriteDiv.className = 'planta-batata-fase1';
    else if (tipo === 'tomate') spriteDiv.className = 'planta-tomate-fase1';
    else return;
    spriteDiv.style.position = 'absolute';
    const td = tabelaCanteiro.rows[linha].cells[coluna];
    const cellWidth = td.offsetWidth;
    const cellHeight = td.offsetHeight;
    spriteDiv.style.left = (coluna * cellWidth + (cellWidth - 24) / 2) + 'px';
    spriteDiv.style.top = (linha * cellHeight + (cellHeight + 16) / 2) + 'px';
    spriteDiv.style.pointerEvents = 'none';
    spriteDiv.dataset.linha = linha;
    spriteDiv.dataset.coluna = coluna;
    plantasCanteiro.appendChild(spriteDiv);
}

function removerSpritePlantaCelula(celula) {
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    const sprite = plantasCanteiro.querySelector(`[data-linha="${linha}"][data-coluna="${coluna}"]`);
    if (sprite) plantasCanteiro.removeChild(sprite);
}

function atualizarSpriteFase(key, planta) {
    const [linha, coluna] = key.split('-').map(Number);
    const celula = tabelaCanteiro.rows[linha].cells[coluna];
    removerSpritePlantaCelula(celula);
    let spriteDiv = document.createElement('div');
    let classe = '';
    if (planta.tipo === 'cenoura') classe = 'planta-cenoura-fase' + planta.fase;
    if (planta.tipo === 'batata') classe = 'planta-batata-fase' + planta.fase;
    if (planta.tipo === 'tomate') classe = 'planta-tomate-fase' + planta.fase;
    spriteDiv.className = classe;
    const cellWidth = celula.offsetWidth;
    const cellHeight = celula.offsetHeight;
    spriteDiv.style.position = 'absolute';
    spriteDiv.style.left = (coluna * cellWidth + (cellWidth - 24) / 2) + 'px';
    spriteDiv.style.top = (linha * cellHeight + (cellHeight + 16) / 2) + 'px';
    spriteDiv.style.pointerEvents = 'none';
    spriteDiv.dataset.linha = linha;
    spriteDiv.dataset.coluna = coluna;
    plantasCanteiro.appendChild(spriteDiv);
}

function atualizarRegadoCelula(key, regado) {
    const [linha, coluna] = key.split('-').map(Number);
    const celula = tabelaCanteiro.rows[linha].cells[coluna];
    if (regado) celula.classList.add('regado');
    else celula.classList.remove('regado');
}

function limparEstadoPlantaCelula(celula) {
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    const key = linha + '-' + coluna;
    delete estadoPlantas[key];
}

window.estadoPlantas = estadoPlantas;
window.FASES_POR_PLANTA = FASES_POR_PLANTA;
window.adicionarSpritePlantaCelula = adicionarSpritePlantaCelula;
window.removerSpritePlantaCelula = removerSpritePlantaCelula;
window.limparEstadoPlantaCelula = limparEstadoPlantaCelula;