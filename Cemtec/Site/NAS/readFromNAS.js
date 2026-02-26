const fetch = require('node-fetch');
const https = require('https');
const XLSX = require('xlsx');

// Ignora certificado SSL (necessário para IP local / QuickConnect interno)
const agent = new https.Agent({ rejectUnauthorized: false });

// Configurações
const BASE_URL = 'https://SGL314.synology.me:5001'; // const BASE_URL = 'https://192.168.1.149:5001';
const USER = 'MatheusPorto';
const PASS = 'CemtecLIPq2024#';
const FILE_PATH = '/site/libreoffice/downloads/teste.xlsx';

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
        //
        const rootsUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list_share&folder_path=${encodeURIComponent('/Site/')}&_sid=${sid}`;

        const rootsRes = await fetch(rootsUrl, { agent });
        const rootsData = await rootsRes.json();
        console.log(JSON.stringify(rootsData, null, 2));
        //
        const downloadUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.Download&version=2&method=download&path=${encodeURIComponent('/Site')}&mode=open&_sid=${sid}`;

        console.log("fetching ...");
        const res = await fetch(downloadUrl, { agent });

        if (!res.ok) {
            throw new Error(`Erro no download: ${res.status} ${res.statusText}`);
        }

        const buffer = await res.buffer();

        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log('Dados do Excel:');
        console.table(data);

    } catch (err) {
        console.error('Erro:', err.message);
    }
}

// Executa
baixarArquivo();
