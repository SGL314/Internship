
var xhr = new XMLHttpRequest();
console.log("teste"); 

xhr.open('POST', 'https://sistemas.ufmg.br/idp/posinServlet');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
var data = "acao=verificarAceitePosin&url=" + window.location.href;
//	console.log("dados: " + data);
xhr.send(data);	
xhr.onreadystatechange = function() {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      // A requisi��o foi conclu�da com sucesso
      if (xhr.responseText  == "true") {
//			window.location.href = "https://ws-des.cecom.ufmg.br/idp/posin/posin.jsp";
//			window.location.href = "https://localhost:9443/idp/posin/posin.jsp";
        window.location.href = "https://sistemas.ufmg.br/idp/posin/posin.jsp";
      } else {
        //alert ('Nao exibir posin');
      }
    } else {
      // Ocorreu um erro durante a requisi��o
      var error = xhr.status + ' - ' + xhr.statusText;
      // Trate o erro de acordo com sua necessidade
      console.log(error); 
    }
  }
};

