// npm install smb2 fs
const SMB2 = require('smb2');
const fs = require('fs');
const path = require('path');

// CONFIGURAÇÃO
const smb2Client = new SMB2({
  share: '\\\\192.168.1.144\\CEMTEC', // IP + nome do share
  domain: '', // geralmente vazio
  username: 'Cemtec',
  password: 'CemtecLIPq2024#'
});

const REMOTE_FILE = 'Teste.osheet'; // nome do arquivo no share
const LOCAL_DIR = path.join(__dirname, 'nkl');
const LOCAL_PATH = path.join(LOCAL_DIR, REMOTE_FILE);

// cria a pasta local se não existir
if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true });

// lê o arquivo via SMB e salva localmente
smb2Client.readFile(REMOTE_FILE, (err, data) => {
  if (err) return console.error('Erro ao ler arquivo SMB:', err);

  fs.writeFileSync(LOCAL_PATH, data);
  console.log('Arquivo salvo em:', LOCAL_PATH);
});
