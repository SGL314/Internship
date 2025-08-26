var colunas = ["todo","doing","done"];

function salvarTasksJSON(tasksJSON) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Kanban");
  // sheet.clear(); // limpa planilha

  // Adiciona cabeçalho

  // Preenche linhas
  
  var linha = 2, coluna = 1;

  for (const col in tasksJSON) {
    for (const task of tasksJSON[col]) {
      sheet.getRange(linha,1).setValue(task.title); // tarefa
      var estado = traduce("estado",col);
      sheet.getRange(linha,2).setValue(estado); // estado
      colorama(sheet,linha,2,col); // cor
      linha++;
    }
  }
  linha--;
  // verifica as próximas se estão cheios e limpa 
  if (sheet.getRange(linha+1,1).getValue() != "") {
    var ultimaLinha = sheet.getLastRow();
    sheet.getRange(linha+1,1,ultimaLinha-linha,2).clearContent(); // limpa conteúdo
    sheet.getRange(linha+1,1,ultimaLinha-linha,2).setBackgrounds(null); // limpa cor
  }
}

function traduce(tipo,string){
  switch (tipo){
    case "estado":
      switch (string){
        case colunas[0]: return "Criado"; break;
        case colunas[1]: return "Fazendo"; break;
        case colunas[2]: return "Feito"; break;
      }
      break;
    case "cor":
      switch (string){
        case colunas[0]: return "#ff0000"; break;
        case colunas[1]: return "#ffff00"; break;
        case colunas[2]: return "#00ff00"; break;
      }
      break;
  }
}

function colorama(sheet, linha, coluna, cor){
  var corHex = traduce("cor",cor);
  sheet.getRange(linha,coluna).setBackground(corHex);
}

function doPost(e){
  salvarTasksJSON(JSON.parse(e.postData.contents));
}

// IP: 200.238.222.118