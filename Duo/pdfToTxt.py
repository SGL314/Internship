from PyPDF2 import PdfReader

# Transforma .pdf em .txt
file = "aRevolucaoDosBichos"
reader = PdfReader(file+".pdf")
qt = 0
last = 0

with open("txt_cap1.txt",'w') as txt_file:
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text = page.extract_text()
        # verifica passagem de capítulo
        block = []
        result = ""
        for char in text:
            # break
            block[0] = block[1]
            block[1] = block[2]
            block[2] = block[3]
            block[3] = char
            qt+=1
            for num in range(1,11):
                if block[0] == "4" and ((block[1] == f"{num}" and block[2] == ".") or (block[1] == "1" and block[2] == "0" and block[3] == "." and num==10)):
                    if last>num:
                        # break
                        pass
                    print(f"cap {num}: {block} : {last}")
                    last = num
                    txt_file = open(f"txt_cap{num}.txt","w")
        txt_file.write(text)
#