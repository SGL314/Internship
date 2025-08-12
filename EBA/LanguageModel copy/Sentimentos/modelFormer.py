from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from transformers import TrainingArguments, Trainer
from transformers import pipeline
import pandas as pd
from datasets import Dataset
from prompt_toolkit import prompt

import os

modelo = "modelo_sents_100"
arquivo = "sentiment_data.csv"

def treinar(arquivo,nomeModelo):
    os.environ["TOKENIZERS_PARALLELISM"] = "false"
    os.environ["OMP_NUM_THREADS"] = "1"

    # Carregar dados
    df = pd.read_csv(arquivo)
    dataset = Dataset.from_pandas(df)

    # Carregar modelo e tokenizer
    model_name = "distilbert-base-uncased"
    tokenizer = DistilBertTokenizer.from_pretrained(model_name)
    model = DistilBertForSequenceClassification.from_pretrained(model_name)

    # Função de tokenização
    def tokenize_function(examples):
        return tokenizer(examples["texto"], padding="max_length", truncation=True)

    # Aplicar tokenização no dataset
    tokenized_dataset = dataset.map(tokenize_function, batched=True)

    # Configurações do treinamento
    tamRam = 3

    training_args = TrainingArguments(
        output_dir="./results",  # Diretório de saída
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
        # prompt("Digite algo: ", default="Texto inicial")
        print(classifier(pergunta))

# treinar(arquivo,modelo)
perguntar()
