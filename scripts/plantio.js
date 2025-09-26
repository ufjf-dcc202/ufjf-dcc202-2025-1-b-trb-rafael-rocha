const CONFIG = {
    CLASSE_AVISO_MORTE: 'planta-perigo',
    TICKS_SEM_AGUA_MORRE: 10,
    FASES_POR_PLANTA: 5,
    TEMPO_PARA_AVANCAR: 1,
    INTERVALO_TICK: 1000,
};

window.dinheiroJogador = 7;
window.tickAtual = 0;

const estadoPlantas = {};
const plantasCanteiro = document.querySelector('.plantas-canteiro');
const tabelaCanteiro = document.querySelector('table.canteiro');

function obterLinhaColuna(celula) {
    if (celula.dataset && typeof celula.dataset.linha !== 'undefined') {
        return { linha: Number(celula.dataset.linha), coluna: Number(celula.dataset.coluna) };
    }
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    return { linha, coluna };
}

function keyFromCoords(linha, coluna) {
    return `${linha}-${coluna}`;
}

function parseKey(key) {
    return key.split('-').map(Number);
}

function criarSpriteDiv(classe, linha, coluna, cellWidth, cellHeight) {
    const spriteDiv = document.createElement('div');
    spriteDiv.className = classe;
    spriteDiv.style.position = 'absolute';
    spriteDiv.style.left = `${coluna * cellWidth + (cellWidth - 24) / 2}px`;
    spriteDiv.style.top = `${linha * cellHeight + (cellHeight + 16) / 2}px`;
    spriteDiv.style.pointerEvents = 'none';
    spriteDiv.dataset.linha = linha;
    spriteDiv.dataset.coluna = coluna;
    return spriteDiv;
}

function removerSpritePlantaCelula(celula) {
    const { linha, coluna } = obterLinhaColuna(celula);
    const sprite = plantasCanteiro.querySelector(`[data-linha="${linha}"][data-coluna="${coluna}"]`);
    if (sprite) plantasCanteiro.removeChild(sprite);
}

function adicionarSpritePlantaCelula(celula, tipo) {
    const { linha, coluna } = obterLinhaColuna(celula);
    removerSpritePlantaCelula(celula);

    const tipoParaClasse = {
        cenoura: 'planta-cenoura-fase1',
        batata: 'planta-batata-fase1',
        tomate: 'planta-tomate-fase1',
    };

    const classe = tipoParaClasse[tipo];
    if (!classe) return;

    const cellWidth = celula.offsetWidth;
    const cellHeight = celula.offsetHeight;
    const spriteDiv = criarSpriteDiv(classe, linha, coluna, cellWidth, cellHeight);
    plantasCanteiro.appendChild(spriteDiv);
}

function atualizarSpriteFase(key, planta) {
    const [linha, coluna] = parseKey(key);
    const celula = tabelaCanteiro.rows[linha].cells[coluna];
    removerSpritePlantaCelula(celula);

    const tipoParaClasse = {
        cenoura: 'planta-cenoura-fase',
        batata: 'planta-batata-fase',
        tomate: 'planta-tomate-fase',
    };

    const classe = tipoParaClasse[planta.tipo] + planta.fase;
    const cellWidth = celula.offsetWidth;
    const cellHeight = celula.offsetHeight;
    const spriteDiv = criarSpriteDiv(classe, linha, coluna, cellWidth, cellHeight);
    plantasCanteiro.appendChild(spriteDiv);
}

function atualizarRegadoCelula(key, regado) {
    const [linha, coluna] = parseKey(key);
    const celula = tabelaCanteiro.rows[linha].cells[coluna];
    if (regado) celula.classList.add('regado');
    else celula.classList.remove('regado');
}

function limparEstadoPlantaCelula(celula) {
    const { linha, coluna } = obterLinhaColuna(celula);
    const key = keyFromCoords(linha, coluna);
    delete estadoPlantas[key];
}

setInterval(() => {
    window.tickAtual++;
    for (const key in estadoPlantas) {
        const planta = estadoPlantas[key];
        if (planta.ticksSemAgua === undefined) planta.ticksSemAgua = 0;
        if (planta.fase < CONFIG.FASES_POR_PLANTA) {
            const [linha, coluna] = key.split('-').map(Number);
            const celula = tabelaCanteiro.rows[linha].cells[coluna];
            if (planta.regado) {
                planta.ticks++;
                planta.ticksSemAgua = 0;
                celula.classList.remove(CONFIG.CLASSE_AVISO_MORTE);
                if (planta.ticks >= CONFIG.TEMPO_PARA_AVANCAR) {
                    planta.fase++;
                    planta.ticks = 0;
                    atualizarSpriteFase(key, planta);
                    planta.regado = false;
                    atualizarRegadoCelula(key, false);
                }
            } else {
                planta.ticksSemAgua++;
                if (planta.ticksSemAgua === CONFIG.TICKS_SEM_AGUA_MORRE - 3) {
                    celula.classList.add(CONFIG.CLASSE_AVISO_MORTE);
                }
                if (planta.ticksSemAgua < CONFIG.TICKS_SEM_AGUA_MORRE - 3) {
                    celula.classList.remove(CONFIG.CLASSE_AVISO_MORTE);
                }
                if (planta.ticksSemAgua >= CONFIG.TICKS_SEM_AGUA_MORRE) {
                    celula.classList.remove(CONFIG.CLASSE_AVISO_MORTE);
                    removerSpritePlantaCelula(celula);
                    limparEstadoPlantaCelula(celula);
                    celula.className = '';
                    celula.innerHTML = '';
                    continue;
                }
            }
        }
    }
    if (window.atualizarUI) window.atualizarUI();
}, CONFIG.INTERVALO_TICK);

window.estadoPlantas = estadoPlantas;
window.FASES_POR_PLANTA = CONFIG.FASES_POR_PLANTA;
window.adicionarSpritePlantaCelula = adicionarSpritePlantaCelula;
window.removerSpritePlantaCelula = removerSpritePlantaCelula;
window.limparEstadoPlantaCelula = limparEstadoPlantaCelula;