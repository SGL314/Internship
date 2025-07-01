__author__='thiagocastroferreira'

from flask import Flask, request, jsonify

app = Flask(__name__)

arquivoHtml = "index.html"
arquivoCss = "estilo.css"
arquivoDados = "dadosSalvos.txt"

@app.route('/', methods=['POST'])
def main():
    data = request.get_json(silent=True)
    print(data)

    dadosProcessados = printSplitted(data)
    dadosSalvados = saveData(dadosProcessados)
    
    texto = "<h1>Porta verdadeira: 8080</h1>"

    return texto

def saveData(dados):
    with open(arquivoDados,"a") as file:
        file.write(str(dados)+"\n")

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

def printSplitted(dados):
    query = dados['queryResult']
    nomePessoa = query['parameters']['person']['name']
    contextoProblema = query['outputContexts'][0]['parameters']
    
    aparelho = contextoProblema['aparelho']
    problema = contextoProblema['problema']
    sala = contextoProblema['sala']

    lista = [nomePessoa,aparelho,problema,int(sala)]
    print(lista)
    return lista

# run Flask app
if __name__ == "__main__":
    app.run(debug=True, port=5000)