
from transformers import pipeline
import os
import time as tm

# Nome do arquivo
init = tm.time()
file = "a_revolucao_dos_bichos.txt"

# Verifica se o arquivo existe
if not os.path.exists(file):
    raise FileNotFoundError(f"Arquivo '{file}' não encontrado.")

# Lê o conteúdo do arquivo
with open(file, 'r', encoding='utf-8', errors='ignore') as f:
    context = f.read().replace('\x00', '')  # remove caracteres nulos

# Inicializa o pipeline de QA
qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased", tokenizer="distilbert-base-uncased")

# Função para fazer perguntas
def perguntar(pergunta):
    resposta = qa_pipeline({
        'question': pergunta,
        'context': context
    })
    print(f"Pergunta: {pergunta}")
    print(f"Resposta: {resposta['answer']}")

# Exemplo de uso
perguntar("Qual é o assunto principal do texto?")
print(f"Tempo: {tm.time()-init} segundos")