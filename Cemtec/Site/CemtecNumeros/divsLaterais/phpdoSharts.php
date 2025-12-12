add_action('wp_footer', function () {
    ?>
    <script type="text/javascript">
    google.charts.load('current', { packages: ['corechart'] });

    google.charts.setOnLoadCallback(() => {
        setTimeout(drawEquipamentosChart, 500);
    });

    var tipoGrafico = 'PieChart';

    // --- TODO O SEU CÓDIGO EXATAMENTE COMO VOCÊ ENVIOU ---

    function drawFinalidadeChart() {
        const query = new google.visualization.Query(
            'https://docs.google.com/spreadsheets/d/1GjFHo8gTf3WbQhANTKDpcrL3nVUGJCh6Sd7dhoUkn5I/gviz/tq?sheet=Sheet1&headers=1'
        );
        query.setQuery("select G where G is not null");

        query.send(function (response) {
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

                if (finalidade.includes("tesla")) finalidade = "Usina Tesla";
                if (finalidade.includes("pesquisa")) finalidade = "Pesquisa";
                if (finalidade.includes("treinamento")) finalidade = "Treinamento";
                if (finalidade.includes("aula")) finalidade = "Aula Prática";
                if (finalidade.includes("ensino")) finalidade = "Ensino";
                if (finalidade.includes("projeto")) finalidade = "Projeto";
                if (finalidade.includes("grea")) finalidade = "GREA";
                if (finalidade.includes("trevizoli")) finalidade = "StreamLab";
                if (finalidade.includes("cemtec")) finalidade = "CEMTEC";

                finalidade = finalidade.charAt(0).toUpperCase() + finalidade.slice(1);
                counts[finalidade] = (counts[finalidade] || 0) + 1;
            }

            const dataArray = [['Finalidade', 'Usos']];
            for (const finalidade in counts) {
                dataArray.push([finalidade, counts[finalidade]]);
            }

            const data = google.visualization.arrayToDataTable(dataArray);

            let chart = new google.visualization.PieChart(document.getElementById('graficoFinalidadeUso'));
            chart.draw(data, { pieHole: 0.4 });
        });

    }

    function drawEquipamentosChart() {
        const query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1GjFHo8gTf3WbQhANTKDpcrL3nVUGJCh6Sd7dhoUkn5I/gviz/tq?sheet=Sheet1&headers=1');
        query.setQuery("select I where I is not null");
        query.send(function (response) {
            if (response.isError()) {
                console.error('Erro ao buscar dados da planilha:', response.getMessage());
                return;
            }

            const dataTable = response.getDataTable();
            const contagem = {};

            const apelidos = {
                "SR-800N": "SR-800N",
                "Corpo Negro": "Corpo Negro",
                "SR-800N-8HT": "Corpo Negro SR-800N-8HT",
                "SR-2-33": "Corpo negro SR-2-33",
                "TPW": "célula TPW",
                "Solarimétrica": "Estação Solarimétrica",
                "9118A": "Forno Fluke 9118A",
                "9170": "Forno Fluke 9170 / 9172",
                "9172": "Forno Fluke 9170 / 9172",
                "7341": "Banho Fluke 7341",
                "Laser": "Termografia Ativa: Laser",
                "Lâmpada": "Termografia Ativa: Lâmpada",
                "Flash": "Termografia Ativa Flash",
                "Vibra": "Termografia Ativa Vibração",
                "Solar Check": "Termografia Ativa: Solarcheck",
                "3450": "Termorresistência : PT100",
                "3451": "Termorresistência : PT100",
                "SPRT": "termômetro SPRT",
                "440": "Termohigrômetro Testo 440",
                "1586A": "Sistema de aquisição Fluke 1586A",
                "1529": "Sistema de aquisição Fluke 1529",
                "T1020": "Termocâmera:T1020, SC660, X6801sc",
                "SC660": "Termocâmera:T1020, SC660, X6801sc",
                "X6801sc": "Termocâmera:T1020, SC660, X6801sc",
                "622": "Termohigrômetro Testo 622 / 971",
                "971": "Termohigrômetro Testo 622 / 971",
                "Traçador": "Traçador de curvas",
                "Pirômetro": "Pirômetro",
                "Megômetro": "Megômetro"
            };

            for (let i = 0; i < dataTable.getNumberOfRows(); i++) {
                let texto = dataTable.getValue(i, 0);
                if (!texto) continue;

                const lista = texto.split(/,|;| e /i);
                lista.forEach(item => {
                    item = item.replace(/\([^)]*\)/g, '').replace(/CEMTEC\s*/gi, '').trim();
                    if (!item) return;

                    let apelido = "Outros";
                    for (const chave in apelidos) {
                        if (item.toLowerCase().includes(chave.toLowerCase())) {
                            apelido = apelidos[chave];
                            break;
                        }
                    }

                    contagem[apelido] = (contagem[apelido] || 0) + 1;
                });
            }

            const dados = [['Equipamento', 'Usos']];
            Object.entries(contagem)
                .sort((a, b) => b[1] - a[1])
                .forEach(([nome, valor]) => dados.push([nome, valor]));

            const data = google.visualization.arrayToDataTable(dados);

            const chart = new google.visualization.ColumnChart(document.getElementById('chartEquipamentos'));
            chart.draw(data, { title: 'Usos por Equipamento' });

            google.charts.setOnLoadCallback(drawFinalidadeChart);
        });
    }
    </script>
    <?php
});
