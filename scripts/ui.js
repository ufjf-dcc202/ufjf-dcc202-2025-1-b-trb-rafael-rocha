const CONFIG_UI = {
    precosVenda: {
        cenoura: 8,
        tomate: 12,
        batata: 17,
    },
    tamanhoTabela: 12,
    chancePedra: 0.08,
    chanceErva: 0.18,
    corModoRegar: '#2196f3',
};

let sementeSelecionada = null;
let modoRegar = false;

const corpoTabela = document.querySelector('table.canteiro tbody');
const botoesSementes = document.querySelectorAll('#sementes button');
const botaoRegar = document.getElementById('btn-regar');

function atualizarTextoElemento(id, texto) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = texto;
}

window.atualizarUI = function() {
    atualizarTextoElemento('timer-texto', 'Tempo: ' + (window.tickAtual || 0));
    atualizarTextoElemento('dinheiro-texto', 'Dinheiro: R$ ' + (window.dinheiroJogador || 0));
};

function criarCelula() {
    const celula = document.createElement('td');
    const aleatorio = Math.random();
    if (aleatorio < CONFIG_UI.chancePedra) {
        celula.className = 'pedra';
    } else if (aleatorio < CONFIG_UI.chanceErva) {
        celula.className = 'erva';
    }
    return celula;
}

function criarTabela() {
    for (let linha = 0; linha < CONFIG_UI.tamanhoTabela; linha++) {
        const elementoLinha = document.createElement('tr');
        for (let coluna = 0; coluna < CONFIG_UI.tamanhoTabela; coluna++) {
            const cel = criarCelula();
            cel.dataset.linha = String(linha);
            cel.dataset.coluna = String(coluna);
            elementoLinha.appendChild(cel);
        }
        corpoTabela.appendChild(elementoLinha);
    }

    corpoTabela.addEventListener('click', (e) => {
        const td = e.target.closest('td');
        if (!td || !corpoTabela.contains(td)) return;
        aoClicarCelula(td);
    });
}

function alternarModoRegar() {
    if (sementeSelecionada) {
        sementeSelecionada = null;
        botoesSementes.forEach(b => b.classList.remove('semente-selecionada'));
    }
    modoRegar = !modoRegar;
    botaoRegar.style.background = modoRegar ? CONFIG_UI.corModoRegar : '';
}

function selecionarSemente(botao) {
    if (modoRegar) {
        modoRegar = false;
        botaoRegar.style.background = '';
    }
    const semente = botao.getAttribute('data-semente');
    if (sementeSelecionada === semente) {
        sementeSelecionada = null;
        botoesSementes.forEach(b => b.classList.remove('semente-selecionada'));
        return;
    }
    sementeSelecionada = semente;
    botoesSementes.forEach(b => b.classList.remove('semente-selecionada'));
    botao.classList.add('semente-selecionada');
}

function aoClicarCelula(celula) {
    const linha = Number(celula.dataset.linha);
    const coluna = Number(celula.dataset.coluna);
    const key = `${linha}-${coluna}`;

    //Colheita
    if (window.estadoPlantas[key] && window.estadoPlantas[key].fase === window.FASES_POR_PLANTA) {
        const tipo = window.estadoPlantas[key].tipo;
        const valorVenda = CONFIG_UI.precosVenda[tipo];
        window.removerSpritePlantaCelula(celula);
        window.limparEstadoPlantaCelula(celula);
        celula.className = '';
        celula.innerHTML = '';
        if (window.dinheiroJogador !== undefined) window.dinheiroJogador += valorVenda;
        if (window.atualizarUI) window.atualizarUI();
        return;
    }

    //Regar
    if (modoRegar && window.estadoPlantas[key]) {
        const planta = window.estadoPlantas[key];
        planta.regado = true;
        planta.ticksSemAgua = 0;
        celula.classList.add('regado');
        celula.classList.remove(CONFIG.CLASSE_AVISO_MORTE);
        return;
    }

    //Remoção
    if (celula.className === 'pedra' || celula.className === 'erva') {
        window.removerSpritePlantaCelula(celula);
        window.limparEstadoPlantaCelula(celula);
        celula.className = '';
        celula.innerHTML = '';
        return;
    }

    //Preparar solo
    if (celula.className === '' && !sementeSelecionada) {
        window.removerSpritePlantaCelula(celula);
        window.limparEstadoPlantaCelula(celula);
        celula.className = 'preparado';
        celula.innerHTML = '';
        return;
    }

    //Plantio
    if (sementeSelecionada) {
        if (celula.className !== 'preparado') return;

        const botao = Array.from(botoesSementes).find(b => b.getAttribute('data-semente') === sementeSelecionada);
        const preco = botao && botao.hasAttribute('data-preco') ? parseInt(botao.getAttribute('data-preco')) : 7;

        if (window.dinheiroJogador !== undefined && window.dinheiroJogador >= preco) {
            window.dinheiroJogador -= preco;
            if (window.atualizarUI) window.atualizarUI();
            celula.className = sementeSelecionada;
            celula.innerHTML = '';
            window.adicionarSpritePlantaCelula(celula, sementeSelecionada);
            window.estadoPlantas[key] = { tipo: sementeSelecionada, fase: 1, regado: false, ticks: 0 };
        }
    }
}

criarTabela();

botoesSementes.forEach(botao => {
    botao.addEventListener('click', () => selecionarSemente(botao));
});

botaoRegar.onclick = alternarModoRegar;