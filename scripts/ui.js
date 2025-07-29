window.atualizarUI = function() {
    const timerTexto = document.getElementById('timer-texto');
    const dinheiroTexto = document.getElementById('dinheiro-texto');
    if (timerTexto && window.tickAtual !== undefined)
        timerTexto.textContent = 'Tempo: ' + window.tickAtual;
    if (dinheiroTexto && window.dinheiroJogador !== undefined)
        dinheiroTexto.textContent = 'Dinheiro: R$ ' + window.dinheiroJogador;
};

const corpoTabela = document.querySelector('table.canteiro tbody');
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
}

function aoClicarCelula(celula) {
    const tr = celula.parentElement;
    const linha = Array.from(tr.parentElement.children).indexOf(tr);
    const coluna = Array.from(tr.children).indexOf(celula);
    const key = linha + '-' + coluna;
    if (window.estadoPlantas[key] && window.estadoPlantas[key].fase === window.FASES_POR_PLANTA) {
        window.removerSpritePlantaCelula(celula);
        window.limparEstadoPlantaCelula(celula);
        celula.className = '';
        celula.innerHTML = '';
        if (window.dinheiroJogador !== undefined) window.dinheiroJogador += 10;
        if (window.atualizarUI) window.atualizarUI();
        return;
    }
    if (modoRegar && (celula.className === 'cenoura' || celula.className === 'tomate' || celula.className === 'batata')) {
        celula.classList.add('regado');
        if (window.estadoPlantas[key]) {
            window.estadoPlantas[key].regado = true;
        }
        return;
    }
    // Remove sprite se limpar a célula
    if (celula.className === 'pedra' || celula.className === 'erva') {
        window.removerSpritePlantaCelula(celula);
        window.limparEstadoPlantaCelula(celula);
        celula.className = '';
        celula.innerHTML = '';
    } else if (celula.className === '') {
        window.removerSpritePlantaCelula(celula);
        window.limparEstadoPlantaCelula(celula);
        celula.className = 'preparado';
        celula.innerHTML = '';
    } else if (celula.className === 'preparado' && sementeSelecionada) {
        if (window.dinheiroJogador !== undefined && window.dinheiroJogador >= 7) {
            window.dinheiroJogador -= 7;
            if (window.atualizarUI) window.atualizarUI();
            celula.className = sementeSelecionada;
            celula.innerHTML = '';
            window.adicionarSpritePlantaCelula(celula, sementeSelecionada);
            window.estadoPlantas[key] = { tipo: sementeSelecionada, fase: 1, regado: false, ticks: 0 };
        }
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