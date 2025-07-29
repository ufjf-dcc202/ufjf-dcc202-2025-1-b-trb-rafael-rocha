

const corpoTabela = document.querySelector('table.canteiro tbody');
const plantasCanteiro = document.querySelector('.plantas-canteiro');
const tabelaCanteiro = document.querySelector('table.canteiro');
const botoesSementes = document.querySelectorAll('#sementes button');
const botaoRegar = document.getElementById('btn-regar');
let sementeSelecionada = null;
let modoRegar = false;

function criarCelula() {
    const celula = document.createElement('td');
    const aleatorio = Math.random();
    if (aleatorio < 0.08) {
        celula.className = 'pedra';
    } else if (aleatorio < 0.18) {
        celula.className = 'erva';
    }
    celula.addEventListener('click', () => aoClicarCelula(celula));
    return celula;

function aoClicarCelula(celula) {
    if (modoRegar && (celula.className === 'cenoura' || celula.className === 'tomate' || celula.className === 'batata')) {
        celula.classList.add('regado');
        return;
    }
    // Remove sprite se limpar a célula
    if (celula.className === 'pedra' || celula.className === 'erva') {
        removerSpritePlantaCelula(celula);
        celula.className = '';
        celula.innerHTML = '';
    } else if (celula.className === '') {
        removerSpritePlantaCelula(celula);
        celula.className = 'preparado';
        celula.innerHTML = '';
    } else if (celula.className === 'preparado' && sementeSelecionada) {
        celula.className = sementeSelecionada;
        celula.innerHTML = '';
        adicionarSpritePlantaCelula(celula, sementeSelecionada);
    }

}

function adicionarSpritePlantaCelula(celula, tipo) {
    // Descobre a posição da célula na tabela
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    // Remove sprite antiga se houver
    removerSpritePlantaCelula(celula);
    // Cria sprite
    let spriteDiv = document.createElement('div');
    if (tipo === 'cenoura') {
        spriteDiv.className = 'planta-cenoura-fase1';
    } else if (tipo === 'batata') {
        spriteDiv.className = 'planta-batata-fase1';
    } else if (tipo === 'tomate') {
        spriteDiv.className = 'planta-tomate-fase1';
    } else {
        return;
    }
    spriteDiv.style.position = 'absolute';
    // Usa o tamanho real da célula para posicionar
    const td = tabelaCanteiro.rows[linha].cells[coluna];
    const cellWidth = td.offsetWidth;
    const cellHeight = td.offsetHeight;
    spriteDiv.style.left = (coluna * cellWidth + (cellWidth - 24) / 2) + 'px';
    spriteDiv.style.top = (linha * cellHeight + (cellHeight + 12) / 2) + 'px';
    spriteDiv.style.pointerEvents = 'none';
    // Marca para remoção futura
    spriteDiv.dataset.linha = linha;
    spriteDiv.dataset.coluna = coluna;
    plantasCanteiro.appendChild(spriteDiv);
}

function removerSpritePlantaCelula(celula) {
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    // Remove sprite correspondente
    const sprite = plantasCanteiro.querySelector('[data-linha="' + linha + '"][data-coluna="' + coluna + '"]');
    if (sprite) plantasCanteiro.removeChild(sprite);
}
}

function criarTabela() {
    for (let linha = 0; linha < 12; linha++) {
        const elementoLinha = document.createElement('tr');
        for (let coluna = 0; coluna < 12; coluna++) {
            elementoLinha.appendChild(criarCelula());
        }
        corpoTabela.appendChild(elementoLinha);
    }
}

function selecionarSemente(botao) {
    if (modoRegar) {
        modoRegar = false;
        botaoRegar.style.background = '';
    }
    sementeSelecionada = botao.getAttribute('data-semente');
    botoesSementes.forEach(b => b.style.outline = '');
    botao.style.outline = '2px solid #c25c09';
}

function alternarModoRegar() {
    if (sementeSelecionada) {
        sementeSelecionada = null;
        botoesSementes.forEach(b => b.style.outline = '');
    }
    modoRegar = !modoRegar;
    botaoRegar.style.background = modoRegar ? '#2196f3' : '';
}

criarTabela();
botoesSementes.forEach(botao => {
    botao.addEventListener('click', function() {
        selecionarSemente(botao);
    });
});
botaoRegar.onclick = alternarModoRegar;