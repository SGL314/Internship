from transformers import BertTokenizer, BertForSequenceClassification
from transformers import TrainingArguments, Trainer
from transformers import pipeline
import pandas as pd
from datasets import Dataset

import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["OMP_NUM_THREADS"] = "1"



df = pd.read_csv("sentimentos.csv")
dataset = Dataset.from_pandas(df)


# Exemplo com BERT em português
model_name = "pierreguillou/bert-base-cased-pt-sentiment"
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2)  # num_labels depende da tarefa

def tokenize_function(examples):
    return tokenizer(examples["texto"], padding="max_length", truncation=True)

tokenized_dataset = dataset.map(tokenize_function, batched=True)

tamRam = 3

training_args = TrainingArguments(
    output_dir="./results",
    evaluation_strategy="epoch",
    num_train_epochs=3,
    per_device_train_batch_size=tamRam,
    per_device_eval_batch_size=tamRam,
    save_total_limit=2,
    load_best_model_at_end=True,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    eval_dataset=tokenized_dataset,  # ideal seria dividir treino/validação
)

trainer.train()

model.save_pretrained("meu_bert_modelo")
tokenizer.save_pretrained("meu_bert_modelo")


classifier = pipeline("text-classification", model="meu_bert_modelo", tokenizer="meu_bert_modelo")
classifier("Esse produto é maravilhoso!")








