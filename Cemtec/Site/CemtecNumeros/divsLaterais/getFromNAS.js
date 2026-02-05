const axios = require("axios");
const fs = require("fs");
const qs = require("qs");

const DSM_HOST = "https://192.168.1.144:5001"; // sem barra no final
const USER = "CEMTEC";
const PASS = "CemtecLIPq2024#";

const SPREADSHEET_ID = ""; // ID do osheet
const OUTPUT_PATH = "/volume1/dados/registro.csv";

// --- 1) LOGIN NO DSM ---
async function login() {
  const url = `${DSM_HOST}/webapi/auth.cgi`;

  const params = {
    api: "SYNO.API.Auth",
    version: "6",
    method: "login",
    account: USER,
    passwd: PASS,
    session: "Drive",
    format: "sid",
  };

  const res = await axios.post(url, qs.stringify(params), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!res.data.success) {
    throw new Error("Falha no login DSM");
  }

  return res.data.data.sid;
}

// --- 2) EXPORTAR OSHEET ---
async function exportSheet(sid) {
  const url = `${DSM_HOST}/webapi/entry.cgi`;

  const params = {
    api: "SYNO.Drive.Spreadsheet",
    version: "1",
    method: "export",
    spreadsheet_id: SPREADSHEET_ID,
    format: "csv",
    _sid: sid,
  };

  const res = await axios.post(url, qs.stringify(params), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    responseType: "arraybuffer",
  });

  fs.writeFileSync(OUTPUT_PATH, res.data);
}

// --- MAIN ---
(async () => {
  try {
    const sid = await login();
    await exportSheet(sid);
    console.log("CSV exportado com sucesso!");
  } catch (err) {
    console.error("ERRO:", err.message);
  }
})();