import fitz  # PyMuPDF
import pytesseract
from PIL import Image
import io
import os
from langchain.llms import Ollama

# ============ FUNÇÕES ============

def extract_text_and_images_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    full_text = ""
    images = []

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        full_text += page.get_text()

        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image = Image.open(io.BytesIO(image_bytes))
            images.append(image)

    return full_text, images

def ocr_images(images):
    ocr_results = []
    for img in images:
        try:
            text = pytesseract.image_to_string(img)
            ocr_results.append(text)
        except Exception as e:
            ocr_results.append(f"[Erro ao processar imagem: {e}]")
    return "\n".join(ocr_results)

def carregar_arquivo_texto(caminho):
    try:
        with open(caminho, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"[Erro ao ler {caminho}: {e}]"

# ============ INSERIR CAMINHOS DOS ARQUIVOS ============

pdf1_path = "iconologia00ripa.pdf"
pdf2_path = "Livro 1 - imagens.pdf"
html_path = "index.html"
css_path = "styles.css"
js_path = "script.js"

# ============ PROCESSAMENTO DE PDFs ============

pdf1_text, pdf1_images = extract_text_and_images_from_pdf(pdf1_path)
pdf2_text, pdf2_images = extract_text_and_images_from_pdf(pdf2_path)

pdf1_ocr = ocr_images(pdf1_images)
pdf2_ocr = ocr_images(pdf2_images)

# ============ LEITURA DE HTML e CSS ============

html_content = carregar_arquivo_texto(html_path)
css_content = carregar_arquivo_texto(css_path)
js_content = carregar_arquivo_texto(js_path)

# ============ COMBINAR TODO O CONTEÚDO ============

conteudo_total = f"""
# CONTEÚDO DOS PDFs

## Texto do PDF 1:
{pdf1_text}

## Texto extraído das imagens do PDF 1:
{pdf1_ocr}

## Texto do PDF 2:
{pdf2_text}

## Texto extraído das imagens do PDF 2:
{pdf2_ocr}

# CONTEÚDO DO HTML
{html_content}

# CONTEÚDO DO CSS
{css_content}

# CONTEÚDO DO JS
{js_content}
"""

# ============ INTERAÇÃO COM OLLAMA ============

llm = Ollama(model="mistral")  # ou outro modelo instalado localmente

while True:
    pergunta = "pegue as imagens de inoconologia.pdf e coloque no index.html, do jeito que já está dentro de "
    if pergunta.lower() in ["sair", "exit", "quit"]:
        break

    prompt = f"""
A seguir está o conteúdo combinado de dois PDFs, um arquivo HTML e um CSS.
Você deve analisar o material e responder à pergunta do usuário com base nesse conteúdo.

Pergunta: {pergunta}

Conteúdo:
{conteudo_total}
"""
    resposta = llm.invoke(prompt)
    print("\n🧠 Resposta da IA:\n", resposta)
    break
