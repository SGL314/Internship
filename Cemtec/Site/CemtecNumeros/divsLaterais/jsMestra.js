const link01 = "https://script.google.com/macros/s/AKfycbzFjyx8CsxJsQcPjQDAi6Qo6NrLzwI-Z-_N0YkfXNdTC8olFC070aXAE7Y0cM7tIFx3/exec";
const link02 = "https://script.google.com/macros/s/AKfycbwT-8h2HsO2zvFFCwfS_3tZS3J6bb_kZlftmOFkgbFQxrsH6QMxOsx5WS_ypIw92OShvA/exec";
var link = link02;

function lerJSON() {
    console.log("Lendo Sheets ...");

    fetch(link) //link pega sheet
        .then(res => res.json())
        .then(data => {
            print("Dados coletados do Sheets.");
            sheets2table(data);
            console.log("JSON carregado !");
            print("Sheets lido.");
        })
        .catch(err => console.error('Erro ao carregar JSON:', err));

    print("afterrr ...");
}

function sheets2table(datas) {
    var put = [];
    for (var data of datas) {
        var ano = data[0][0];
        if (ano > 2024) continue;
        print(data);
        put.push(data);
    }

    var ord = [];
    for (var i = put.length - 1; i >= 0; i--) {
        ord.push(put[i]);
    }
    put = ord;

    for (var year of put) {
        var body = document.getElementById("tabelaMestra").getElementsByTagName("TBODY")[0];

        ano = year[0][0];

        var i = -1;
        // print(year);

        for (var line of year) {
            var tr = document.createElement("tr");
            // print(line);
            i += 1;
            if (i == 0) continue;
            var td = document.createElement("td");
            td.innerHTML = ano;
            tr.appendChild(td);
            for (var item in line) {
                // print(item);
                td = document.createElement("td");
                td.innerHTML = line[item];

                if (ano == 2019 && item == "") { // atualização da área em 2019
                    td.innerHTML = "Engenharias III";
                }
                if (item == "Observações") { // muda a ordem da apresentação das coisas
                    td.innerHTML = line["Beneficiados do resultado 1"];
                } else if (item == "Beneficiados do resultado 1") {
                    td.innerHTML = line["Observações"];
                }

                tr.appendChild(td);
            }

            body.appendChild(tr);
        }
    }
}