google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawFinalidadeChart);

    let tipoGrafico = 'PieChart'; // Valor inicial

    function drawFinalidadeChart() {
        const query = new google.visualization.Query(
        'https://docs.google.com/spreadsheets/d/1GjFHo8gTf3WbQhANTKDpcrL3nVUGJCh6Sd7dhoUkn5I/gviz/tq?sheet=Sheet1&headers=1'
        );
        query.setQuery("select G where G is not null");

        query.send(function(response) {
        if (response.isError()) {
            console.error('Erro ao buscar dados: ' + response.getMessage());
            return;
        }

        const dataTable = response.getDataTable();
        const counts = {};

        for (let i = 0; i < dataTable.getNumberOfRows(); i++) {
            let finalidade = dataTable.getValue(i, 0);
            if (!finalidade || finalidade === "-") continue;

            finalidade = finalidade.toLowerCase().trim();

            // Normalizações e substituições
            if (finalidade.includes("tesla")) finalidade = "Usina Tesla";
            if (finalidade.includes("pesquisa")) finalidade = "Pesquisa";
            if (finalidade.includes("treinamento")) finalidade = "Treinamento";
            if (finalidade.includes("aula")) finalidade = "Aula Prática";
            if (finalidade.includes("ensino")) finalidade = "Ensino";
            if (finalidade.includes("projeto")) finalidade = "Projeto";
            if (finalidade.includes("grea")) finalidade = "GREA";
            if (finalidade.includes("trevizoli")) finalidade = "StreamLab";
            if (finalidade.includes("cemtec")) finalidade = "CEMTEC";
            if (finalidade.includes("Cemtec (sala 1906)")) finalidade = "CEMTEC";
            if (finalidade.includes("Oásis cad 3")) finalidade = "Oásis CAD 3";

            finalidade = finalidade.charAt(0).toUpperCase() + finalidade.slice(1);
            counts[finalidade] = (counts[finalidade] || 0) + 1;
        }

        const dataArray = [['Finalidade', 'Usos']];
        for (const finalidade in counts) {
            dataArray.push([finalidade, counts[finalidade]]);
        }

        const data = google.visualization.arrayToDataTable(dataArray);

        const optionsBar = {
            title: 'Distribuição por Finalidade de Uso',
            chartArea: { width: '75%', height: '80%' },
            hAxis: { title: 'Nº de usos', minValue: 0, textStyle: { fontSize: 12 } },
            vAxis: { title: 'Finalidade', textStyle: { fontSize: 12 } },
            colors: ['#00796b'],
            legend: 'none'
        };

        const optionsColumn = {
            title: 'Distribuição por Finalidade de Uso',
            chartArea: { width: '80%', height: '70%' },
            hAxis: { title: 'Finalidade', slantedText: true, slantedTextAngle: 45, textStyle: { fontSize: 12 } },
            vAxis: { title: 'Nº de usos', minValue: 0, textStyle: { fontSize: 12 } },
            colors: ['#42a5f5'],
            legend: 'none'
        };

        const optionsPie = {
            title: 'Distribuição por Finalidade de Uso',
            pieHole: 0.4,
            pieSliceText: 'percentage',
            legend: { position: 'right', textStyle: { fontSize: 13, color: '#444' } },
            chartArea: { width: '70%', height: '80%' },
            colors: ['#ff7043', '#26a69a', '#f4c20d', '#ab47bc', '#42a5f5', '#66bb6a', '#ef5350']
        };

        let chart;
        if (tipoGrafico === 'BarChart') {
            chart = new google.visualization.BarChart(document.getElementById('graficoFinalidadeUso'));
            chart.draw(data, optionsBar);
        } else if (tipoGrafico === 'ColumnChart') {
            chart = new google.visualization.ColumnChart(document.getElementById('graficoFinalidadeUso'));
            chart.draw(data, optionsColumn);
        } else {
            chart = new google.visualization.PieChart(document.getElementById('graficoFinalidadeUso'));
            chart.draw(data, optionsPie);
        }
        });
    }
    // sheets pros trem da planilha "listra mestra"
    const link01 = "https://script.google.com/macros/s/AKfycbzFjyx8CsxJsQcPjQDAi6Qo6NrLzwI-Z-_N0YkfXNdTC8olFC070aXAE7Y0cM7tIFx3/exec";
    const link02 = "https://script.google.com/macros/s/AKfycbzV0d0vb0nfhXmCCsdHp1T6VL7s9tmkLf3FHoBj9EBVH1m3ZIrVoCv3bn2ZeeuauCVneA/exec";
    var link = link02;

    async function lerJSON() {
        print("Lendo Sheets ...");
        
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

    function sheets2table(datas){
        var put = [];
        for (var data of datas){    
            var ano = data[0][0];
            if (ano > 2024) continue;
            print(data);
            put.push(data);
        }

        var ord = [];
        for (var i=put.length-1;i>=0;i--){
            ord.push(put[i]);
        }
        put = ord;

        for (var year of put){
            var body = document.getElementById("tabelaMestra").getElementsByTagName("TBODY")[0];
            
            ano = year[0][0];
            
            var i = -1;
            // print(year);
            
            for (var line of year){
                var tr = document.createElement("tr");
                // print(line);
                i+=1;
                if (i==0) continue;
                var td = document.createElement("td");
                td.innerHTML = ano;
                tr.appendChild(td);
                for (var item in line){
                    // print(item);
                    td = document.createElement("td");
                    td.innerHTML = line[item];

                    if (ano == 2019 && item == ""){ // atualização da área em 2019
                        td.innerHTML = "Engenharias III";
                    }
                    if (item == "Observações"){ // muda a ordem da apresentação das coisas
                        td.innerHTML = line["Beneficiados do resultado 1"];
                    }else if (item == "Beneficiados do resultado 1"){
                        td.innerHTML = line["Observações"];
                    }

                    tr.appendChild(td);
                }

                body.appendChild(tr);   
            }
        }
    }

    function print(thing) {
        // return;
        if (thing == null || thing == undefined) console.log(thing);
        else console.log(JSON.parse(JSON.stringify(thing)));
    }
    lerJSON();