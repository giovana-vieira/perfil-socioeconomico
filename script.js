
function uploadfile() {
    Papa.parse(document.getElementById('uploadfile').files[0],
        {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(results)
                readData(results)
            }
        })
}

function readData(infoCsv) {

    const csvKeys = Object.keys(infoCsv.data[0]);

    infoCsv.data.forEach(data => {
        csvKeys.forEach(key => {
            console.log(data[key])
        });
    })

}


