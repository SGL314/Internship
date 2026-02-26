const fetch = require('node-fetch');
const https = require('https');
const XLSX = require('xlsx');

// Ignora certificado SSL (necessário para IP local / QuickConnect interno)
const agent = new https.Agent({ rejectUnauthorized: false });

// Configurações
const BASE_URL = 'https://publishToSite.synology.me:5001'; // const BASE_URL = 'https://192.168.1.149:5001';
const USER = 'MatheusPorto';
const PASS = 'CemtecLIPq2024#';
const arq = 'teste.xlsx'; // '\'LM-03_Lista de equipamentos.xlsx\''
const FILE_PATH = '/volume1/site/libreoffice/downloads/' + arq;

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

        const downloadUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent('/Site/equipments.xlsx')}&mode=download&_sid=${sid}`;
        // const downloadUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent(FILE_PATH)}&mode=open&_sid=${sid}`;
        console.log("fetching ...");
        const res = await fetch(downloadUrl, { agent });

        if (!res.ok) {
            throw new Error(`Erro no download: ${res.status} ${res.statusText}`);
        }

        const arrayBuffer = await res.arrayBuffer();

        const workbook = XLSX.read(arrayBuffer, {
            type: 'array'
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        console.log(sheet['C40']);
        var sending = [];
        //
        const range = XLSX.utils.decode_range(sheet['!ref']);
        const tetoMaxThings = range.e.r - range.s.r + 1;
        var rems = 0;
        for (var i = 0; i < tetoMaxThings; i++) {
            var putIn = [
                    sheet['B' + (i + 1)]?.v || "",
                    sheet['C' + (i + 1)]?.v || "",
                    sheet['D' + (i + 1)]?.v || ""
                ];
            if (putIn.every(v => v == "")){
                console.log(i+1);
                rems++;
                continue;
            }
            sending.push({
                "line": i+1-rems, // no google sheets começa na linha 1, não 0
                "values": putIn
            });
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

    const URL = "https://script.google.com/macros/s/AKfycbzkiF9LVOG-yx1ei3f6EOnISVQGdQZ-7TrNf_8SO52NYrGi-7mj_7zllPhNKNv3zlI_Nw/exec";

    async function enviar() {
        try {
            // console.log(await sending);
            const response = await axios.post(URL, {
                "lines": await sending,
                "columns": await sending[0]['values'].length
            });
            // console.log(sending);

            console.log(response.data);
        } catch (err) {
            console.error("Erro:", err.message);
        }
    }

    enviar();

}

sendTo_GSheets();
