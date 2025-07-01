import requests
import base64
import json

# Caminho da imagem
image_path = "p1_ripa.png"
pergunta = "faça uma html, com css incluso dentro do html, dessa página ai mano. quando passa por cima desses ícones azuis eles aumentam de tamamnho, quando volta, eles recuam de tamanho"

print(f"Pergunta: {pergunta}")

# Codifica a imagem em base64
with open(image_path, "rb") as img_file:
    encoded_image = base64.b64encode(img_file.read()).decode("utf-8")
print("processando ...")
# Envia a imagem para o modelo llava via API REST
response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "llava",
        "prompt": pergunta,
        "images": [encoded_image]
    },
    stream=True  # <- necessário para lidar com múltiplos JSONs
)

# Coleta e imprime as partes da resposta
full_response = ""
for line in response.iter_lines():
    if line:
        data = json.loads(line.decode("utf-8"))
        if "response" in data:
            full_response += data["response"]

print("\nResposta da IA:")
print(full_response)
