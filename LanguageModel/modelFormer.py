from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from transformers import TrainingArguments, Trainer
from transformers import pipeline
import pandas as pd
from datasets import Dataset

import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"

# Carregar dados
df = pd.read_csv("sentimentos.csv")
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
model.save_pretrained("meu_distilbert_modelo")
tokenizer.save_pretrained("meu_distilbert_modelo")

# Testar o modelo com uma frase
classifier = pipeline("text-classification", model="meu_distilbert_modelo", tokenizer="meu_distilbert_modelo")
print(classifier("Esse produto é maravilhoso!"))
