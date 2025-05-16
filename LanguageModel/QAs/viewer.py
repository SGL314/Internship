file = 'a_revolucao_dos_bichos.txt'
# Abrir o arquivo com caracteres nulos
with open(file, 'r', encoding='utf-8', errors='ignore') as f:
    conteudo = f.read()

# Remover caracteres nulos (\x00)
conteudo_limpo = conteudo.replace('\x00', '')

# Salvar o resultado limpo
with open(file, 'w', encoding='utf-8') as f:
    f.write(conteudo_limpo)