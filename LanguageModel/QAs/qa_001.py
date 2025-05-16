# Carregar texto do livro
with open("a_revolucao_dos_bichos.txt", "r", encoding="utf-8") as f:
    livro = f.read()

# Dividir por parágrafos (ou capítulos)
paragrafos = [p.strip() for p in livro.split("\n") if len(p.strip()) > 50] 

# Visualizar alguns trechos
paragrafos[:2]

data = {
    "id": ["1"],
    "title": ["A Revolução dos Bichos"],
    "context": [paragrafos[0]],
    "question": ["Quem inspirou os animais com um discurso revolucionário?"],
    "answers": [{"text": ["Major"], "answer_start": [17]}]  # ajuste conforme necessário
}

from datasets import Dataset
from transformers import BertTokenizerFast

dataset = Dataset.from_dict(data)
tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")

def preprocess(example):
    inputs = tokenizer(
        example["question"],
        example["context"],
        truncation=True,
        padding="max_length",
        max_length=384,
        return_offsets_mapping=True
    )

    # Pega posição inicial da resposta
    answer = example["answers"]["text"][0]
    start_char = example["answers"]["answer_start"][0]
    end_char = start_char + len(answer)

    # Offset mapping: onde cada token aparece no texto original
    offsets = inputs["offset_mapping"]

    start_pos = end_pos = None
    for i, (start, end) in enumerate(offsets):
        if start <= start_char < end:
            start_pos = i
        if start < end_char <= end:
            end_pos = i
            break

    # fallback caso a correspondência seja exata
    if start_pos is None:
        start_pos = 0
    if end_pos is None:
        end_pos = 0

    inputs["start_positions"] = start_pos
    inputs["end_positions"] = end_pos
    inputs.pop("offset_mapping")  # remover para evitar erro

    return inputs


encoded_dataset = dataset.map(preprocess)

from transformers import BertForQuestionAnswering, TrainingArguments, Trainer

model = BertForQuestionAnswering.from_pretrained("bert-base-uncased")

training_args = TrainingArguments(
    output_dir="./bert-qa-revolucao_001",
    num_train_epochs=2,
    per_device_train_batch_size=1,
    learning_rate=2e-5,
    weight_decay=0.01,
    logging_steps=10,
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=encoded_dataset,
)

trainer.train()

import time

start_time = time.time()

# Seu código aqui

from transformers import pipeline

qa_pipeline = pipeline("question-answering", model=model, tokenizer=tokenizer)

resposta = qa_pipeline({
    "context": paragrafos[0],
    "question": "Napoleão morre?"
})

print("1_Resposta:", resposta["answer"])

result = sum(range(1000000))
end_time = time.time()
execution_time = end_time - start_time
print(f"1_Tempo de execução: {execution_time:.4f} segundos")
