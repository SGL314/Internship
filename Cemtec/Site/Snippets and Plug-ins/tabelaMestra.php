add_action('wp_footer', function() {
?>
<script>
// ================================
// SEU código original (SEM ALTERAR)
// ================================

const link01 = "https://script.google.com/macros/s/AKfycbxg09vGIustEFDI41OQbIcG-YSTyL4_N_5lPmVqKKDxYisfH7_IIZzguRZOk4fhuUtwww/exec";
const link02 = "https://script.google.com/macros/s/AKfycbwT-8h2HsO2zvFFCwfS_3tZS3J6bb_kZlftmOFkgbFQxrsH6QMxOsx5WS_ypIw92OShvA/exec";
const link03 = "https://script.google.com/macros/s/AKfycbwTIe__agkkoq7NcU-EFz6seaZcJ6BxXwjVUI6JYDA3N0S_Pz2h1otcGzzPEoqHNUz3aA/exec";

var link = link01;

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
    var put = [];
    for (var data of datas) {
        var ano = data[0][0];
        if (ano > 2024) continue;
//         print(data);
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

        for (var line of year) {
            var tr = document.createElement("tr");
            i += 1;
            if (i == 0) continue;
            var td = document.createElement("td");
            td.innerHTML = ano;
            tr.appendChild(td);
            for (var item in line) {
                td = document.createElement("td");
                td.innerHTML = line[item];

                if (ano == 2019 && item == "") { 
                    td.innerHTML = "Engenharias III";
                }
                if (item == "Observações") { 
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

// ================================
// START AUTOMÁTICO AO ABRIR A PÁGINA
// ================================
document.addEventListener("DOMContentLoaded", function() {
    // evita erro caso a página não tenha tabela
    const tab = document.getElementById("tabelaMestra");
    if (tab) {
        lerJSON();
    }
});
</script>
<?php
});
