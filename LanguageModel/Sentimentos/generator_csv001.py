import random
import csv

# Listas com frases positivas e negativas
positive_sentences = [
    "Excelente atendimento, fui muito bem tratado.",
    "Produto chegou antes do prazo e em perfeitas condições.",
    "Superou minhas expectativas, parabéns!",
    "O filme é incrível, recomendo muito!",
    "Fiquei muito satisfeito com a compra.",
    "Tudo funcionou perfeitamente, nota 10.",
    "Adorei a experiência, voltarei com certeza.",
    "Serviço rápido e de qualidade.",
    "Muito feliz com o resultado, obrigado!",
    "Recomendo para todos, vale cada centavo.",
    "Produto de ótima qualidade, estou muito feliz com a compra.",
    "Fiquei muito satisfeito com o atendimento e a entrega!",
    "Excelente experiência de compra, com certeza comprarei novamente.",
    "Recomendo totalmente, o produto é perfeito.",
    "Foi um ótimo atendimento e a entrega foi super rápida.",
]

negative_sentences = [
    "Péssimo atendimento, não resolveram meu problema.",
    "Produto veio com defeito e ninguém respondeu meu e-mail.",
    "Demorou demais para entregar, não gostei.",
    "Não funcionou como esperado, decepção total.",
    "Atendimento demorado e sem solução.",
    "Me arrependi da compra, fraco demais.",
    "Veio errado e ainda cobraram a mais.",
    "Qualidade horrível, parece de plástico barato.",
    "Nunca mais compro com essa loja.",
    "Serviço mal feito e caro.",
    "Produto com falhas, não valeu o preço.",
    "Infelizmente o produto não correspondeu às minhas expectativas.",
    "Demorou demais para chegar e a qualidade não é boa.",
    "O produto chegou com defeito e o suporte não ajudou em nada.",
    "Serviço de péssima qualidade, não vale a pena.",
]

# Função para gerar um conjunto de dados
def generate_data(num_samples):
    data = []
    for _ in range(num_samples):
        # Aleatoriamente escolher se a frase será positiva ou negativa
        label = random.choice([1, 0])
        sentence = random.choice(positive_sentences) if label == 1 else random.choice(negative_sentences)
        
        data.append([sentence, label])
    
    return data

# Gerar 1000 amostras de dados
generated_data = generate_data(1000)

# Salvar em um arquivo CSV
with open('sentiment_data.csv', mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['texto', 'label'])
    writer.writerows(generated_data)

print("Arquivo CSV gerado com 1000 exemplos!")
