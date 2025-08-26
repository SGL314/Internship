from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from transformers import TrainingArguments, Trainer
from transformers import pipeline
import pandas as pd
from time import sleep
from datasets import Dataset
from prompt_toolkit import prompt
from PIL import Image

import os

localImages = "./content/Images_process_001/"
localImages_toAsk = "./content/Images_process_002/"
diretorioDeSaida = "../../../Modelos/Imager/"
modelo = "imager_001"
arquivo = "imager_001.csv"
classes = [] # 1: puro branco, 0: puro preto

def classificador(local):
    global classes
    lista = os.listdir(local)
    ind = 1
    for image in lista:
        if "_p." in image or "_c0." in image:
            renomear(ind,local,image,"_c0")
            if local == localImages: 
                classes.append(0)
        elif "_b." in image or "_c1." in image:
            renomear(ind,local,image,"_c1")
            if local == localImages: 
                classes.append(1)
        elif "_c0" in image:
            renomear(ind,local,image,"_c0"+image.split("_c0")[1].replace(".jpg",""))
            if local == localImages: 
                classes.append(float(f"0.{image.split("_c0")[1].replace(".jpg","")}"))
        ind +=1
    print(classes)

def de_classificador(local):
    lista = os.listdir(local)
    ind = 1
    for image in lista:
        if "_p." in image or "_c0." in image:
            renomear(ind,local,image,"_declass_c0")
        elif "_b." in image or "_c1." in image:
            renomear(ind,local,image,"_declass_c1")
        elif "_c0" in image:
            renomear(ind,local,image,"_declass_c0"+image.split("_c0")[1].replace(".jpg",""))
        
        ind +=1

def redimensionar_imagem(caminho_imagem_entrada, caminho_imagem_saida, nova_largura=None, nova_altura=None, manter_proporcao=True):
    """
    Redimensiona uma imagem.

    Args:
        caminho_imagem_entrada (str): Caminho para a imagem original.
        caminho_imagem_saida (str): Caminho para salvar a imagem redimensionada.
        nova_largura (int, optional): Nova largura desejada. Defaults to None.
        nova_altura (int, optional): Nova altura desejada. Defaults to None.
        manter_proporcao (bool, optional): Se True, mantém a proporção original.
                                         Se False, pode distorcer a imagem se nova_largura e nova_altura forem fornecidas.
                                         Se apenas uma dimensão for fornecida, a outra será calculada para manter a proporção.
    """
    if not nova_largura and not nova_altura:
        print("Erro: Você precisa fornecer uma nova largura ou uma nova altura.")
        return

    try:
        with Image.open(caminho_imagem_entrada) as img:
            largura_original, altura_original = img.size
            print(f"Dimensões originais: {largura_original}x{altura_original}")

            if manter_proporcao:
                if nova_largura and nova_altura:
                    # Se ambas as dimensões são dadas e manter_proporcao é True,
                    # calcula a melhor dimensão que cabe dentro do box, mantendo proporção.
                    # Pode ser melhor avisar o usuário ou escolher uma estratégia (ex: fit, fill)
                    print("Aviso: nova_largura e nova_altura foram fornecidas com manter_proporcao=True.")
                    print("A imagem será redimensionada para caber no retângulo especificado, mantendo a proporção.")
                    img.thumbnail((nova_largura, nova_altura)) # thumbnail redimensiona in-place e mantém proporção
                    nova_largura_calculada, nova_altura_calculada = img.size
                elif nova_largura:
                    proporcao = altura_original / largura_original
                    nova_altura_calculada = int(nova_largura * proporcao)
                    nova_largura_calculada = nova_largura
                elif nova_altura:
                    proporcao = largura_original / altura_original
                    nova_largura_calculada = int(nova_altura * proporcao)
                    nova_altura_calculada = nova_altura
            else: # Não manter proporção (pode distorcer)
                if not nova_largura:
                    nova_largura_calculada = largura_original # Mantém original se não fornecido
                else:
                    nova_largura_calculada = nova_largura
                if not nova_altura:
                    nova_altura_calculada = altura_original # Mantém original se não fornecido
                else:
                    nova_altura_calculada = nova_altura

            if not 'img' in locals() or img.size == (largura_original, altura_original) and not (nova_largura and nova_altura and manter_proporcao) : # Se thumbnail não foi usado
                # Usa LANCZOS para melhor qualidade de redimensionamento (anteriormente ANTIALIAS)
                # PIL.Image.Resampling.LANCZOS (Pillow >= 9.0.0)
                # Image.ANTIALIAS (Pillow < 9.0.0)
                resample_filter = Image.Resampling.LANCZOS if hasattr(Image, 'Resampling') else Image.ANTIALIAS
                img_redimensionada = img.resize((nova_largura_calculada, nova_altura_calculada), resample_filter)
            else: # Se thumbnail foi usado
                img_redimensionada = img


            print(f"Novas dimensões calculadas: {nova_largura_calculada}x{nova_altura_calculada}")

            # Salva a imagem redimensionada
            img_redimensionada.save(caminho_imagem_saida)
            print(f"Imagem redimensionada salva em: {caminho_imagem_saida}")

    except FileNotFoundError:
        print(f"Erro: Imagem de entrada não encontrada em '{caminho_imagem_entrada}'")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

def ler_pixels_imagem(caminho_imagem):
    redimensionar_imagem(caminho_imagem,caminho_imagem,16,16)
    """
    Carrega uma imagem e imprime os valores RGB de cada pixel.
    """
    try:
        # Abre a imagem
        img = Image.open(caminho_imagem)

        # Obtém as dimensões da imagem (largura, altura)
        largura, altura = img.size

        # Carrega os dados dos pixels para acesso rápido
        # Isso retorna um objeto PixelAccess que permite ler e modificar pixels.
        pixels = img.load()

        print(f"Lendo pixels da imagem: {caminho_imagem}")
        print(f"Dimensões: {largura}x{altura}")

        # É uma boa prática fechar a imagem quando não precisar mais dela,
        # embora o Python geralmente cuide disso na saída do escopo.
        img.close()

        pack = []
        for x in range(largura):
            for y in range(altura):
                pack.append(pixels[x, y])

        return pack

    except FileNotFoundError:
        print(f"Erro: Imagem não encontrada em '{caminho_imagem}'")
    except Exception as e:
        print(f"Ocorreu um erro: {e}")

def getData(arquivo,local):
    linhas = ["pixels,classe\n"]
    i = 0
    for imagem in os.listdir(local):
        # novoNome = f"img_00{i+1}.jpg"
        # os.rename(local+imagem,local+novoNome)
        linhas.append(f"\"{ler_pixels_imagem(local+imagem)}\" , {classes[i]}\n")
        i+=1
    with open(arquivo,"w",encoding="UTF-8") as file:
        for linha in linhas:
            file.write(linha)

def renomear(ind,local,file,classe=""):
    classe = classe.replace("_delcass","")
    tempo = 0.025
    os.rename(local+file,local+f"img{ind:03}{classe}.jpg")
    sleep(tempo)

def redefiniTamanhos():
    global localImages_toAsk,localImages

    i = 1
    for file in os.listdir(localImages_toAsk):
        redimensionar_imagem(localImages_toAsk+file,localImages_toAsk+file,4060,3060)
        os.rename(localImages_toAsk+file,localImages_toAsk+f"img00{i}.jpg")
        sleep(0.05)
        i+=1

    for file in os.listdir(localImages):
        redimensionar_imagem(localImages+file,localImages+file,4060,3060)
        os.rename(localImages+file,localImages+f"img00{i}.jpg")
        sleep(0.05)
        i+=1

def treinar(arquivo,nomeModelo,outputDir):
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    os.environ["OMP_NUM_THREADS"] = "1"

    # Carregar dados
    df = pd.read_csv(arquivo)
    dataset = Dataset.from_pandas(df)

    # Carregar modelo e tokenizer
    model_name = "distilbert-base-uncased"
    tokenizer = DistilBertTokenizer.from_pretrained(model_name)
    # Ensure num_labels matches your number of classes (2 for binary classification)
    model = DistilBertForSequenceClassification.from_pretrained(model_name, num_labels=len(set(df['classe'])))

    # Função de tokenização
    def tokenize_function(examples):
        max_length = tokenizer.model_max_length
        tokenized_inputs = tokenizer(examples["pixels"], padding="max_length", truncation=True,max_length=max_length)
        # Add the 'labels' column from your dataset
        tokenized_inputs["labels"] = examples["classe"]
        return tokenized_inputs

    # Aplicar tokenização no dataset
    tokenized_dataset = dataset.map(tokenize_function, batched=True)

    # Configurações do treinamento
    tamRam = 10

    training_args = TrainingArguments(
        output_dir=outputDir",  # Diretório de saída
        num_train_epochs=3,  # Número de épocas
        per_device_train_batch_size=tamRam,  # Tamanho do batch para treino
        per_device_eval_batch_size=tamRam,  # Tamanho do batch para avaliação
        save_total_limit=2,  # Limite de modelos salvos
        eval_strategy="epoch",  # Avaliação ao final de cada época
        save_strategy="epoch",  # Salvamento ao final de cada época
        load_best_model_at_end=True,  # Carregar o melhor modelo ao final do treino
    )

    # Inicialização do trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        eval_dataset=tokenized_dataset,  # Idealmente, dividir em treino/validação
    )

    # Treinamento
    trainer.train()

    # Salvar o modelo e o tokenizer
    model.save_pretrained(nomeModelo)
    tokenizer.save_pretrained(nomeModelo)

def arquivoPArecido(local,file):
    lista = os.listdir(local)
    for image in lista:
        if file in image:
            return image
    print(f"'{file}' não parece com nenhum arquivo em '{local}'\nArquivo '{lista[0]}' selecionado.")
    return lista[0]

def perguntar():
    # Testar o modelo com uma frase
    classifier = pipeline("text-classification", model=modelo, tokenizer=modelo)
    last_pergunta = "nada"
    while True:
        pergunta = input(":> ")
        if (pergunta=="exit"):
            break
        elif (pergunta=="<"):
            pergunta = last_pergunta
        last_pergunta = pergunta

        # transforma em imagem pleo diretorio
        extension = ".jpg"
        file = localImages_toAsk+pergunta
        if file+"_0"+extension in os.listdir(localImages_toAsk):
            pergunta = f"{ler_pixels_imagem(arquivoParecido(localImages_toAsk,file+"_c0"))}"
        elif file+"_1"+extension in os.listdir(localImages_toAsk):
            pergunta = f"{ler_pixels_imagem(arquivoParecido(localImages_toAsk,file+"_c1"))}"

        # prompt("Digite algo: ", default="Texto inicial")
        print(classifier(pergunta, truncation=True))

classificador(localImages)
classificador(localImages_toAsk)
getData(arquivo,localImages)
treinar(arquivo,modelo,diretorioDeSaida)
perguntar()
de_classificador(localImages)
de_classificador(localImages_toAsk)