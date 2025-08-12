import time as tm
# Nome do arquivo
init = tm.time()
# variáveis globais
from transformers import BertForQuestionAnswering, TrainingArguments, Trainer
from transformers import BertTokenizerFast

model = BertForQuestionAnswering.from_pretrained("bert-base-uncased")
tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
paragrafos = ["oi mano"]
pathModels = "../../../Modelos/"
nameModel = "qa_005"
ind_model = 5

# funções
def getData(file):
    global paragrafos
    livro = ""
    stopIn = "O SEGUNDO LIVRO DE MOIS"
    # Leitura do texto
    with open(file, "r", encoding="utf-8") as f:
        for linha in f.readlines():
            if stopIn in linha:
                break
            livro += linha.replace("\n"," ")
    
    with open(file, "w", encoding="utf-8") as f:
        f.write(livro)

    # Separar o texto em parágrafos relevantes
    paragrafos = [p.strip() for p in livro.split("\n") if len(p.strip()) > 50]

def treinar(encoded_dataset):
    global pathModels,nameModel
    training_args = TrainingArguments(
        output_dir=pathModels+nameModel,
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

    # Salvar modelo e tokenizer após treinamento
    model.save_pretrained(pathModels + nameModel)
    tokenizer.save_pretrained(pathModels + nameModel)

def createModel(file):

    getData(file)

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

    treinar(encoded_dataset)


def perguntar(modelo):
    global init
    from transformers import pipeline
    qa_pipeline = pipeline("question-answering", model=f"{pathModels}{modelo}", tokenizer=tokenizer)
    print(f"{ind_model}_Tempo processamento: {tm.time()-init} segundos")
    while True: 
        # Inferência
        question = input(":> ")
        init = tm.time()
        if (question == "exit"):
            break
        resposta = qa_pipeline(
            question=question,
            context=paragrafos[0]
        )

        print(f"{ind_model}_Resposta:", resposta["answer"])
        print(f"{ind_model}_Tempo: {tm.time()-init} segundos")

arquivo = "BíbliaSagrada_NVI_gn.txt"
getData(arquivo)
todos_paragrafos = " ".join(paragrafos)
createModel(arquivo)
perguntar(nameModel)
