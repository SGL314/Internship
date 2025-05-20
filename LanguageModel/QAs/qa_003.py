import time as tm
# Nome do arquivo
init = tm.time()
file = "a_revolucao_dos_bichos.txt"

# Leitura do texto
with open(file, "r", encoding="utf-8") as f:
    livro = f.read()

# Separar o texto em parágrafos relevantes
paragrafos = [p.strip() for p in livro.split("\n") if len(p.strip()) > 50]

# Exemplo de QA
data = {
    "id": ["1"],
    "title": ["A Revolução dos Bichos"],
    "context": paragrafos,  # você pode variar para outros parágrafos
    "question": ["Quem inspirou os animais com um discurso revolucionário?"],
    "answers": [{"text": ["Major"], "answer_start": [17]}]  # ajuste conforme o trecho usado
}

# Criação do dataset
from datasets import Dataset
dataset = Dataset.from_dict(data)

# Tokenização
from transformers import BertTokenizerFast
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

    answer = example["answers"]["text"][0]
    start_char = example["answers"]["answer_start"][0]
    end_char = start_char + len(answer)
    offsets = inputs["offset_mapping"]

    start_pos = end_pos = None
    for i, (start, end) in enumerate(offsets):
        if start <= start_char < end:
            start_pos = i
        if start < end_char <= end:
            end_pos = i
            break

    if start_pos is None:
        start_pos = 0
    if end_pos is None:
        end_pos = 0

    inputs["start_positions"] = start_pos
    inputs["end_positions"] = end_pos
    inputs.pop("offset_mapping")
    return inputs

encoded_dataset = dataset.map(preprocess)

# Treinamento
from transformers import BertForQuestionAnswering, TrainingArguments, Trainer

model = BertForQuestionAnswering.from_pretrained("bert-base-uncased")

training_args = TrainingArguments(
    output_dir="./bert-qa-revolucao_003",
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

# Inferência
from transformers import pipeline
qa_pipeline = pipeline("question-answering", model=model, tokenizer=tokenizer)

resposta = qa_pipeline({
    "context": paragrafos[0],
    "question": "Quem inspirou os animais com um discurso revolucionário?"
})

print("3_Resposta:", resposta["answer"])
print(f"3_Tempo: {tm.time()-init} segundos")