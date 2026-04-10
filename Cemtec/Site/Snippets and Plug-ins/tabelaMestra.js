
const link01 = "https://script.google.com/macros/s/AKfycbxg09vGIustEFDI41OQbIcG-YSTyL4_N_5lPmVqKKDxYisfH7_IIZzguRZOk4fhuUtwww/exec";
const link02 = "https://script.google.com/macros/s/AKfycbwT-8h2HsO2zvFFCwfS_3tZS3J6bb_kZlftmOFkgbFQxrsH6QMxOsx5WS_ypIw92OShvA/exec";
const link03 = "https://script.google.com/macros/s/AKfycbz2bReGU_Ms8ByeSCTUljYIvFlI2bAG5j8rekPUbVvutt-Ctdxumq9s50-wB_ryhA0A1g/exec";

const sheetName = "From NAS-demands"

var link = link03 + "?sheet=" + sheetName;

function lerJSON() {
    console.log("Lendo Sheets ...");

    fetch(link) //link pega sheet
        .then(res => res.json())
        .then(data => {
            //             print("Dados coletados do Sheets.");
            sheets2table(data);
            console.log("JSON carregado !");
            //             print("Sheets lido.");
        })
        .catch(err => console.error('Erro ao carregar JSON:', err));

    //     print("afterrr ...");
}

function sheets2table(datas) {
    var put = [], process = [];
    const tamanhoBlocoDados = 5;
    const anosColocados = 7;
    // console.log(datas);
    for (var data of datas) {
        for (var a = 0; a < anosColocados; a++) {
            if (data[a * tamanhoBlocoDados] == "Artigo científico") {
                var show = [];
                for (var i = 0; i < tamanhoBlocoDados; i++) {
                    show.push(data[a * tamanhoBlocoDados + i]);
                }
                if (!isStrange(show)) {
                    process.push(show);
                }
            }
        }
    }
    // sort & cut type
    process.sort(function (a, b) {
        return b[1] - a[1]; // Ordena pelo segundo elemento (ano)
    });
    process = process.map(function (item) {
        var a = [];
        for (var i = 1; i < item.length; i++) {
            a.push(item[i]);
        }
        return a;
    });
    // console.log(process);
    // put there
    var body = document.getElementById("tabelaMestra").getElementsByTagName("TBODY")[0];
    for (var data of process) {
        var tr = document.createElement("tr");
        for (var item of data) {
            var td = document.createElement("td");
            td.innerHTML = item;
            tr.appendChild(td);
        }
        body.appendChild(tr);
    }
    return;
}

function isStrange(show) {
    for (var item of show) {
        if (item == undefined || item == null || item == "" || item == "-" || item == "n/a") return true;
    }
    return false;
}

lerJSON();
