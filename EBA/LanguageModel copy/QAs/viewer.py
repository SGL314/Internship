file = 'BíbliaSagrada_NVI.txt'
conteudo = ">"
i=0
# Abrir o arquivo com caracteres nulos
with open(file, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f.readlines():
        conteudo += line.replace("\n"," ")
        i+=1
        print(f"Linha: {i+1}")

# Remover caracteres nulos (\x00)
conteudo_limpo = conteudo.replace('\x00', 'fi')

# Salvar o resultado limpo
with open(file.replace(".txt","_allinone.txt"), 'w', encoding='utf-8') as f:
    f.write(conteudo_limpo)