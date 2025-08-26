from flask import Flask

app = Flask(__name__)

arquivoHtml = "index.html"
arquivoCss = "estilo.css"
arquivoDados = "dadosSalvos.txt"



@app.route('/',methods=["GET","POST"])
def home():

    dadosSalvados = getData()
    texto = processHtml(dadosSalvados)

    return texto

def processHtml(dados):
    put = True
    identificator = "</div"

    textoCss = ["<style>\n"]
    with open(arquivoCss,"r") as file:
        for line in file.readlines():
            textoCss.append(line)
    textoCss.append("</style>\n")

    texto = ""
    with open(arquivoHtml,"r") as file:
        for line in file.readlines():
            texto += line
            if put and (identificator in line):
                put = False
                texto += """

<table id="tabela-container">
  <thead>
    <tr>
      <th>Nome</th>
      <th>Aparelho</th>
      <th>Problema</th>
      <th>Sala</th>
    </tr>
  </thead>
  <tbody>
                """
                # block-by-block
                for dado in dados:
                    texto += "<tr>\n"
                    for info in dado:
                        texto += "<td>"
                        texto += str(info)
                        texto += "</td>\n"
                    texto += "</tr>\n"

                # final
                texto += """
    </tbody>
</table>"""
                # css
                for line2 in textoCss:
                    texto += line2            

    return texto


def getData():

    send = []
    with open(arquivoDados,"r") as file:
        for line in file.readlines():
            send.append(stringToDado(line))
    
    return send

def stringToDado(string):
    frags = string.replace("'","").replace("[","").replace("]","").split(",")
    dado = [
        frags[0],
        frags[1],
        frags[2],
        int(frags[3])
    ]
    return dado


if __name__ == '__main__':
    app.run(debug=True, port=8080)
