let barColors = [
    "rgba(245, 39, 39, 0.8)",
    "rgba(250, 107, 1, 0.8)",
    "rgba(250, 227, 1, 0.8)",
    "rgba(190, 250, 1, 0.8)",
    "rgba(87, 250, 1, 0.8)",
    "rgba(0, 195, 14, 0.8)",
    "rgba(0, 166, 85, 0.8)",
    "rgba(0, 166, 157, 0.8)",
    "rgba(0, 99, 166, 0.8)",
    "rgba(0, 19, 166, 0.8)",
    "rgba(112, 0, 166, 0.8)",
    "rgba(192, 0, 186, 0.8)",
    "rgba(192, 0, 138, 0.8)",
    "rgba(235, 0, 90, 0.8)",
    "rgba(255, 0, 24, 0.8)",
    "rgba(250, 107, 1, 0.8)",
    "rgba(250, 227, 1, 0.8)",
    "rgba(190, 250, 1, 0.8)",
    "rgba(87, 250, 1, 0.8)",
    "rgba(0, 195, 14, 0.8)",
    "rgba(0, 166, 85, 0.8)",
    "rgba(0, 166, 157, 0.8)",
    "rgba(0, 99, 166, 0.8)",
    "rgba(0, 19, 166, 0.8)",
    "rgba(112, 0, 166, 0.8)",
    "rgba(192, 0, 186, 0.8)",
    "rgba(192, 0, 138, 0.8)",
    "rgba(235, 0, 90, 0.8)",
    "rgba(255, 0, 24, 0.8)",
    "rgba(250, 107, 1, 0.8)",
    "rgba(250, 227, 1, 0.8)",
    "rgba(190, 250, 1, 0.8)",
    "rgba(87, 250, 1, 0.8)",
    "rgba(0, 195, 14, 0.8)",
    "rgba(0, 166, 85, 0.8)",
    "rgba(0, 166, 157, 0.8)",
    "rgba(0, 99, 166, 0.8)",
    "rgba(0, 19, 166, 0.8)",
    "rgba(112, 0, 166, 0.8)",
    "rgba(192, 0, 186, 0.8)",
    "rgba(192, 0, 138, 0.8)",
    "rgba(235, 0, 90, 0.8)",
    "rgba(255, 0, 24, 0.8)",
    "rgba(250, 107, 1, 0.8)",
    "rgba(250, 227, 1, 0.8)",
    "rgba(190, 250, 1, 0.8)",
    "rgba(87, 250, 1, 0.8)",
    "rgba(0, 195, 14, 0.8)",
    "rgba(0, 166, 85, 0.8)",
    "rgba(0, 166, 157, 0.8)",
    "rgba(0, 99, 166, 0.8)",
    "rgba(0, 19, 166, 0.8)",
    "rgba(112, 0, 166, 0.8)",
    "rgba(192, 0, 186, 0.8)",
    "rgba(192, 0, 138, 0.8)",
    "rgba(235, 0, 90, 0.8)"
];

let listaResultado = [];

let wordCloud = [];

// faz a limpeza das variaveis globais e do HTML ao clicar no botão de "Enviar"
function clear() {

    listaResultado = []; // limpa a variavel de lista resultado

    wordCloud = []; // limpa a variavel de nuvem de palavras

    // limpa o html de select, remove todas as options dele
    let select = document.getElementById('idCharts');
    while (select.options.length > 0) {
        select.remove(0);
    }

    // limpa ali no html a nuvem de palavras
    var myList = document.getElementById('word-cloud');
    myList.innerHTML = '';

}

// realiza a leitura do arquivo .csv atraves da biblioteca do papa.parse
function uploadfile() {

    clear();

    Papa.parse(document.getElementById('uploadfile').files[0],
        {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log('Resultado do CSV', results)
                readData(results)
            }
        }
    )
}

// recebe os dados após a leitura pela biblioteca do papa.parse
// orgazina os dados para serem inseridos futuramente no grafico
function readData(linhasCsv) {

    const colunasCsv = Object.keys(linhasCsv.data[0]);

    colunasCsv.forEach((coluna) => {
        listaResultado.push(
            {
                title: coluna,
                xValues: [],
                yValues: [],
            }
        )
    });

    linhasCsv.data.forEach((linha) => {
        for (let i = 0; i < colunasCsv.length; i++) {
            // dentro desse if vamos pegar as informações para depois montar a nuvem de palavras
            if (listaResultado[i].title.includes('Escreva algumas linhas sobre sua história e seus sonhos de vida')) {
                wordCloud.push(linha[colunasCsv[i]]); // adiciona os dados no vetor de 'nuvem de palavras'
            }
            listaResultado[i].xValues.push(linha[colunasCsv[i]]);
        }
    });

    listaResultado.forEach((itemResultado) => {
        let valoresGrafico = compararValoresGrafico(itemResultado.xValues);
        itemResultado.xValues = Object.keys(valoresGrafico);
        itemResultado.yValues = Object.values(valoresGrafico);
    });

    removerItensListaResultado();

    createWordCloud(); // faz a chamada para criação da nuvem de palavras

    createOptionsSelect();

}

function removerItensListaResultado() {
    for (let i = 0; i < listaResultado.length; i++) {
        if (
            listaResultado[i].title.includes('Escreva algumas linhas sobre sua história e seus sonhos de vida') ||
            listaResultado[i].title.includes('Carimbo')
        ) {
            listaResultado.splice(i, 1);
        }
    }
}

// organiza os valores por quantidade de repetição, por exemplo:::
// ADS : 33
// DSM : 2
function compararValoresGrafico(array) {
    return array.reduce((accumulator, value) => {
        return Object.assign(Object.assign({}, accumulator), { [value]: (accumulator[value] || 0) + 1 });
    }, {});
}

// recupara os dados do 'listaResultado' para montar as 'options' do 'select' no HTML
function createOptionsSelect() {

    let select = document.getElementById('idCharts');

    for (let i = 0; i < listaResultado.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = listaResultado[i].title;
        select.appendChild(opt);
    }

}

let myChart;
function criarGrafico() {

    if (myChart) { // verifica se a variavel não é nula, se já foi criado um grafico antes
        myChart.destroy(); // deleta o grafico anterior
    }

    // recupera qual o 'value' selecionado na tela pelo 'select'
    let listaResultadoPosicao = document.getElementById('idCharts').value;

    // pega o valor da 'listaResultado' a partir da sua posição no vetor
    const dadosGrafico = listaResultado[listaResultadoPosicao];

    let xValues = dadosGrafico.xValues;
    let yValues = dadosGrafico.yValues;

    myChart = new Chart("myChart", {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
            title: {
                display: true,
                text: dadosGrafico.title
            }
        }
    });

    console.log(myChart)

}

// criação da nuvem de palavras
function createWordCloud() {

    // recupera e armazena as respostas em apenas uma string
    // dessa forma ficou mais facil de trabalhar com a separação das palavras
    let todasRespostas = '';
    for (let i = 0; i < wordCloud.length; i++) {
        // replaceAll para remover caracteres especiais
        wordCloud[i] = wordCloud[i].replaceAll(',', ' ');
        wordCloud[i] = wordCloud[i].replaceAll('.', ' ');
        wordCloud[i] = wordCloud[i].replaceAll('(', ' ');
        wordCloud[i] = wordCloud[i].replaceAll(')', ' ');
        wordCloud[i] = wordCloud[i].replaceAll('/', ' ');
        wordCloud[i] = wordCloud[i].replaceAll(':', ' ');
        todasRespostas += `${' ' + wordCloud[i].toLowerCase()}`;
    }

    // nesse trecho usamos o "split" do JS, para criar um vetor a partir do ' ' entre as palavras
    // ja que no for acima deletamos os caracteres especiais
    let vetorRespostas = todasRespostas.split(' ');

    // esse for será para remover palavras que não serão utilizadas como por exemplo 'a', 'da', 'de'
    for (let i = 0; i < vetorRespostas.length; i++) {

        const palavra = vetorRespostas[i].trim().toUpperCase();

        // lista de palavras que serão removidas
        switch (palavra) {
            case 'E':
            case 'DE':
            case 'NA':
            case 'QUE':
            case 'É':
            case 'EU':
            case 'MEU':
            case 'A':
            case 'O':
            case 'DA':
            case 'DO':
            case 'EM':
            case 'UM':
            case 'UMA':
            case 'MINHA':
            case 'POR':
            case 'OS':
            case 'AS':
            case 'NAS':
            case 'ME':
            case 'NO':
            case 'TAMBÉM':
            case 'PRA':
            case 'PARA':
            case 'COMO':
            case 'COM':
            case 'MEUS':
            case '':
                vetorRespostas.splice(i, 1);
                break;
            default:
                console.log('Palavra não encontrada --> ' + palavra);
        }
    }

    let wordCloudResult = compararValoresGrafico(vetorRespostas)

    console.log(wordCloudResult)

    let ulWordCloud = document.getElementById('word-cloud');

    const wordCloudKeys = Object.keys(wordCloudResult); // recupera as chaves como por exemplo "Familia", "Curso" e outras palavras

    const wordCloudValues = Object.values(wordCloudResult); // recupera os valores, tipo 4,6,7

    // faz a criação no HTML da nuvem de palavras
    for (let i = 0; i < wordCloudKeys.length; i++) {
        let li = document.createElement('li');
        li.innerHTML = `<a href="#" style="--size: ${wordCloudValues[i]};">${wordCloudKeys[i]}</a>`;
        ulWordCloud.appendChild(li);
    }

}
