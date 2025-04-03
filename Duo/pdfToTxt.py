from PyPDF2 import PdfReader

# Transforma .pdf em .txt
file = "aRevolucaoDosBichos"
reader = PdfReader(file+".pdf")
qt = 0
last = 0

with open("txt_cap1.txt",'w',encoding="utf-8") as txt_file:
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text = page.extract_text()
        # verifica passagem de capítulo
        block = ["1","1","1","1"]
        result = ""
        ardb = open("ardb.txt","a",encoding="utf-8")
        # ardb.write(text) # +"\n\n\n\n\n ------------------------------------------------------------------------ \n\n\n\n\n"
        for char in text:
            block[0] = block[1]
            block[1] = block[2]
            block[2] = block[3]
            block[3] = char
            # qt+=1
            # if (qt >= 14491) :
            # ardb.write(f"{block}\n")
            for num in range(1,11):
                if ((block[1] == f"{num}" and block[2] == "." and block[3] == "\n") or (block[1] == "1" and block[2] == "0" and block[3] == "." and num==10)):
                    if last>num:
                        break
                        pass
                    print(f"cap {num}: {block} : {last}")
                    last = num
                    txt_file = open(f"txt_cap{num}.txt","w",encoding="utf-8")
        txt_file.write(text)
#