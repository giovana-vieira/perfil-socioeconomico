let barColors = [
    "rgba(255,0,0,1.0)",
    "rgba(255,0,0,0.8)",
    "rgba(255,0,0,0.6)",
    "rgba(255,0,0,0.4)",
    "rgba(255,0,0,0.2)"
];

let listaResultado = [];

// realiza a leitura do arquivo .csv atraves da biblioteca do papa.parse
function uploadfile() {
    Papa.parse(document.getElementById('uploadfile').files[0],
        {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log('Resultado do CSV', results)
                readData(results)
            }
        })
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
            listaResultado[i].xValues.push(linha[colunasCsv[i]]);
        }
    });

    listaResultado.forEach((itemResultado) => {
        let valoresGrafico = compararValoresGrafico(itemResultado.xValues);
        itemResultado.xValues = Object.keys(valoresGrafico);
        itemResultado.yValues = Object.values(valoresGrafico);
    });
    console.log(listaResultado)

    createOptionsSelect(listaResultado);

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
function createOptionsSelect(listaResultado) {

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
