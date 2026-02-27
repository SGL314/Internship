const fetch = require('node-fetch');
const https = require('https');
const XLSX = require('xlsx');

// Ignora certificado SSL (necessário para IP local / QuickConnect interno)
const agent = new https.Agent({ rejectUnauthorized: false });

// Configurações
const BASE_URL = 'https://publishToSite.synology.me:5001'; // const BASE_URL = 'https://192.168.1.149:5001';
const USER = 'MatheusPorto';
const PASS = 'CemtecLIPq2024#';
const models = [
    {
        'name': "Equipamentos",
        'nameSheet': "From NAS",
        'file': 'equipments.xlsx',
        'sheet': 'Lista de equipamentos para o si',
        'columns': ['B'],
        'initReading': 2
    }
    // ,
    // {
    //     'name': "Equipamentos Utilizados",
    //     'nameSheet': "From NAS",
    //     'file': 'uses_equipments.xlsx',
    //     'sheet': 'Controle de uso de equipamentos',
    //     'columns': ['S','T','U','V'],
    //     'initReading': 3
    // }
]; // '\'LM-03_Lista de equipamentos.xlsx\''
const FILE_PATH = '/Site/';

// Login no Synology e retorna SID
async function login() {
    const url = `${BASE_URL}/webapi/auth.cgi?api=SYNO.API.Auth&version=6&method=login&account=${encodeURIComponent(USER)}&passwd=${encodeURIComponent(PASS)}&session=FileStation&format=sid`;

    console.log("Fetching logging");
    const res = await fetch(url, { agent });
    // console.log(res);
    console.log("Jsonning");
    const data = await res.json();

    if (!data.success) {
        throw new Error('Erro no login: ' + JSON.stringify(data));
    }

    return data.data.sid;
}

// Baixa o Excel e converte para JSON
async function baixarArquivo() {
    try {
        console.log("Logando ...");
        const sid = await login();

        const rootsUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list_share&folder_path=${encodeURIComponent('/Site')}&_sid=${sid}`;

        const rootsRes = await fetch(rootsUrl, { agent });
        const rootsData = await rootsRes.json();
        // console.log(JSON.stringify(rootsData, null, 2));
        var sending = [];
        console.log("--------")
        for (var model of models) {
            console.log(`Processando ${model['file']} ... {`);
            const downloadUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(FILE_PATH + model['file'])}&mode=download&_sid=${sid}`;
            console.log("fetching ...");
            const res = await fetch(downloadUrl, { agent });

            if (!res.ok) {
                throw new Error(`Erro no download: ${res.status} ${res.statusText}`);
            }

            const arrayBuffer = await res.arrayBuffer();

            const workbook = XLSX.read(arrayBuffer, {
                type: 'array',
                cellStyles: true
            });

            console.log("Nomes das sheets: ", workbook.SheetNames);
            const sheet = workbook.Sheets[model['sheet']]; // o 'te' do 'site' corta estranhamente
            // baixa o arquivo localmente para debug
            const baixar = true;
            if (baixar) {
                try {
                    const fs = require('fs');
                    fs.writeFileSync(model['file'], Buffer.from(arrayBuffer));
                } catch (err) {
                    if (err.code == 'EACCES') console.log("Erro de acesso: " + err);
                    else console.error("Erro ao salvar arquivo localmente:", err);
                }
            }
            // console.log(sheet['B5'], "", sheet['B6']);
            //
            const range = XLSX.utils.decode_range(sheet['!ref']);
            const tetoMaxThings = range.e.r - range.s.r + 1;
            var rems = 0, removeds = [], puts = [], initReading = model['initReading'] || 0; // começa na linha 3 (índice 2) para pular headers
            var send = [];
            for (var i = initReading; i < tetoMaxThings; i++) {
                var putIn = [];
                // sheet[ + (i + 1)]?.v || "",
                for (var col of model['columns']) {
                    putIn.push(sheet[col + (i + 1)]?.v || "");
                }
                if (putIn.every(v => v == "")) {
                    removeds.push(i + 1);
                    rems++;
                    continue;
                }
                puts.push(putIn);
                send.push({
                    "line": i - initReading + 1 - rems, // no google sheets começa na linha 1, não 0
                    "values": putIn
                });
            }
            //
            sending.push({
                "name": model['name'],
                'nameSheet': model['nameSheet'],
                "lines": send,
                "columns": send[0]['values'].length,
            });
            //
            console.log("Removeds: " + removeds.length);
            console.log("Last one of puts: '" + puts[puts.length - 1] + "'");
            console.log("}")
        }
        console.log("Sending ...");
        return sending;

    } catch (err) {
        console.error('Erro:', err.message);
    }
}

async function sendTo_GSheets() {
    var sending = await baixarArquivo();

    const axios = require('axios');

    const URL = "https://script.google.com/macros/s/AKfycbxwNfXCVEEVD0fkwr3-EYnF7AnbczwGxbDE7dGY5uYoo30faXF1RnJ3RN-zPYmx6lJr-g/exec";

    async function enviar() {
        try {
            // console.log(await sending);
            const response = await axios.post(URL, {
                "blocks": await sending
            });
            // console.log(sending);

            console.log(response.data);
        } catch (err) {
            if (err.response) {
                console.error("Status:", err.response.status);
                console.error("Data:", err.response.data);
            } else {
                console.error("Erro:", err.message);
            }
        }
    }

    enviar();

}

sendTo_GSheets();
