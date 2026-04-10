const fetch = require('node-fetch');
const https = require('https');
const XLSX = require('xlsx');

// Ignora certificado SSL (necessário para IP local / QuickConnect interno)
const agent = new https.Agent({ rejectUnauthorized: false });

// Configurações
const BASE_URL = 'https://publishToSite.synology.me:5001'; // const BASE_URL = 'https://192.168.1.149:5001';
const USER = 'MatheusPorto';
const PASS = 'CemtecLIPq2024#';
// demands
var demands = [2019, 2025];
var sheetsDemands = []
for (var i = demands[1]; i >= demands[0]; i--) {
    sheetsDemands.push("" + i + "");
}
//
const models = [
    { // nas cemtec -> pasta de equipa -> listas mestra -> LM-03Lista de euipamntos
        'name': "Equipamentos",
        'nameSheet': "From NAS-equipments",
        'file': 'equipments.xlsx',
        'sheets': ['Lista de equipamentos para o si'],
        'columns': ['B'],
        'initReading': 2
    }
    ,
    {
        'name': "Equipamentos Utilizados",
        'nameSheet': "From NAS-uses_equipments",
        'file': 'uses_equipments.xlsx',
        'sheets': ['Controle de uso de equipamentos'],
        'columns': ['N', 'S', 'T', 'U', 'V'],
        'initReading': 3
    }
    ,
    {
        'name': "Demandas",
        'nameSheet': "From NAS-demands",
        'file': 'demands.xlsx',
        'sheets': sheetsDemands,
        'columns': ['A', 'C', 'K', 'AF', 'AP'], // tipo, ano, título, autores, revista
        'initReading': 4,
        'funcs': {
            'filter_putting_putIn': function (sheetName,thing,  col,pos) {
                if (thing && col == "C") {
                    // && Number.isInteger(thing) && thing > 5000
                    return sheetName; // ano
                    //     console.log("("+pos+") "+thing+">"+excelDateToJS(thing));
                    // return excelDateToJS(thing);
                }
                return thing;
            }
        }
    }
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

// converte numero em data
function excelDateToJS(serial) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const ms = serial * 86400000;
    return new Date(excelEpoch.getTime() + ms);
}

// Baixa o Excel e converte para JSON
async function baixarArquivo() {
    try {
        console.log("Logando ...");
        const sid = await login();

        const rootsUrl = `${BASE_URL}/webapi/entry.cgi?api=SYNO.FileStation.List&version=2&method=list_share&folder_path=${encodeURIComponent(FILE_PATH)}&_sid=${sid}`;

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

            console.log("Nomes das sheets: ", model['sheets'],"from",workbook.SheetNames);
            var indSheet = 0, maxColumns = 0;
            var send = [],initDefault=[];
            for (var sheetName of model['sheets']) {
                send.push([]);
                console.log(sheetName+" ...");
                const sheet = workbook.Sheets[sheetName]; // o 'te' do 'site' corta estranhamente
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
                var cols = 0;
                for (var i = initReading; i < tetoMaxThings; i++) {
                    var putIn = [];
                    // sheet[ + (i + 1)]?.v || "",
                    for (var col of model['columns']) {
                        var thing = sheet[col + (i + 1)]?.v || "";
                        // function 'filter_putting_putIn'
                        if (model['funcs'] && model['funcs']['filter_putting_putIn']) {
                            thing = model['funcs']['filter_putting_putIn'](sheetName,thing, col,(i + 1));
                            // console.log(thing);
                        }
                        // coloca lá
                        putIn.push(thing);

                    }
                    if (putIn.every(v => v == "")) {
                        removeds.push(i + 1);
                        rems++;
                        continue;
                    }

                    puts.push(putIn);
                    // coloca as sheets uma do lado da outra
                    send[indSheet].push({
                        "line": i - initReading - rems, // 
                        "values": initDefault.concat(putIn)
                    });
                    
                    // else {
                    //     // console.log(" -"+i - initReading - rems);
                    //     send[i - initReading - rems]['values'] = send[i - initReading - rems]['values'].concat(putIn);
                    // }
                    // cols++;
                    // maxColumns = (cols>maxColumns)?cols:maxColumns;
                }
                console.log("qt.send: " + send.length);
                // colcoa espaços na planilha pra colocar certas áreas pra certos anos
                var addList = [];
                for (var s of model['columns']) {
                    addList.push("");
                }
                initDefault = initDefault.concat(addList);
                //
                indSheet++;
            }
            // compacta o send
            var sendA = send;
            for (var i=0;i<sendA.length-1;i++) {
                for (var j=0;j<sendA[i].length;j++) {
                    if (j>=sendA[i+1].length) {
                        sendA[i+1].push(sendA[i][j]);
                    }
                    if (sendA[i+1][j]['values'][i*model['columns'].length]=="") {
                        var newLine = sendA[i+1][j]['values'];
                        for (var k=0;k<model['columns'].length*(i+1);k++) {
                            newLine[k] = sendA[i][j]['values'][k];
                        }
                        sendA[i+1][j]['values'] = newLine;
                    }

                }
                // break;
            }
            console.log("qt. sendA: "+sendA.length);
            send = sendA[sendA.length-1]; // (sendA.length>=2)?2:
            // send = sendA[1];
            //envia
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
        return sending;

    } catch (err) {
        console.error('Erro(baixarArquivo):', err.message);
    }
}

async function sendTo_GSheets() {
    var sending = await baixarArquivo();
    console.log("Sending ...");

    const axios = require('axios');

    const URL = "https://script.google.com/macros/s/AKfycbwTIe__agkkoq7NcU-EFz6seaZcJ6BxXwjVUI6JYDA3N0S_Pz2h1otcGzzPEoqHNUz3aA/exec";

    async function enviar() {
        try {
            // console.log(await sending);
            const response = await axios.post(URL, {
                "blocks": sending
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
// Eis que venho sem demora !