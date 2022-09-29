class PerfilSocioeconomico {
    constructor() {
        this.title = '';
        this.xValues = [];
        this.yValues = [];
    }
}

let barColors = [];

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
