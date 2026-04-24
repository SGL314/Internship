function doGet(e) {
  var sheetName = e.parameter.sheet; // Recebe o nome da aba via URL
  var ss = SpreadsheetApp.openById("1UOG3efEmOsUGTFmd4kHr_P6o0jjvNoKPppjHyUa4olE"); // Coloque o ID da sua planilha
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Aba não encontrada" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getDataRange().getValues();
  var headers = data.shift(); // primeira linha como cabeçalho
  var json = data.map(row => {
    var obj = {};
    headers.forEach((header, i) => obj[header] = row[i]);
    return obj;
  });
  var json = sheet.getDataRange().getValues();

  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {

  const data = JSON.parse(e.postData.contents);
  //
  for (var block of data.blocks) {
    var sheetName = block.nameSheet;
    var sheet = SpreadsheetApp.openById("1UOG3efEmOsUGTFmd4kHr_P6o0jjvNoKPppjHyUa4olE").getSheetByName(sheetName);;
    //
    var totalColunas = block.columns;
    sheet.getRange(1, 1, 1, 1)
      .setValues([[block.name]]);
    for (var line of block.lines) {
      // console.log(line);
      sheet.getRange(line.line + 2, // +1 pra colocar o título
        1, 1, line.values.length)
        .setValues([line.values]);
    }
  }
  //
  // sheet.appendRow([
  //   new Date(),
  //   data.nome,
  //   data.email,
  //   data.valor
  // ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

