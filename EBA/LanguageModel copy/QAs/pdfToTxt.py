# Transforma .pdf em .txt
import PyPDF2
file = "BíbliaSagrada_NVI"
PATH = "content/"
reader = PyPDF2.PdfReader(""+PATH+""+file+".pdf")
qt = 0
last = 0

with open(PATH+file+".txt",'w',encoding="utf-8") as txt_file:
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text = page.extract_text()
        txt_file.write(text)