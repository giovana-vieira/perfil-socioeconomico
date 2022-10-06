class PerfilSocioeconomico {
    constructor() {
        this.title = '';
        this.xValues = [];
        this.yValues = [];
    }
}

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

function readData(linhasCsv) {
    let listaResultado = [];
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

}

function compararValoresGrafico(array) {
    return array.reduce((accumulator, value) => {
        return Object.assign(Object.assign({}, accumulator), { [value]: (accumulator[value] || 0) + 1 });
    }, {});
}

function criarGrafico() {

    for (let i = 0; i < listaResultado.length; i++) {

        let xValues = [];
        let yValues = [];
        let barColors = [
            "rgba(255,0,0,1.0)",
            "rgba(255,0,0,0.8)",
            "rgba(255,0,0,0.6)",
            "rgba(255,0,0,0.4)",
            "rgba(255,0,0,0.2)"
        ];

        new Chart("myChart", {
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
                    text: [title]
                }
            }
        });
    }
}