import os
from transformers import pipeline
from PIL import Image

# Caminho com imagens para processar
pasta_imagens = "./content/chairs/"

# Usando modelo pré-treinado para detecção de objetos (baseado em DETR - Facebook)
detector = pipeline("object-detection", model="facebook/detr-resnet-50")

# Função para contar cadeiras
def contar_cadeiras(imagem_path):
    imagem = Image.open(imagem_path).convert("RGB")
    resultados = detector(imagem)

    # Contar apenas objetos com label "chair"
    cadeiras = [obj for obj in resultados if obj['label'].lower() == "chair"]
    return len(cadeiras), cadeiras

# Processar imagens no diretório
for nome in os.listdir(pasta_imagens):
    if nome.lower().endswith((".jpg", ".png", ".jpeg")):
        caminho = os.path.join(pasta_imagens, nome)
        qtd, _ = contar_cadeiras(caminho)
        print(f"{nome}: {qtd} cadeira(s)")
