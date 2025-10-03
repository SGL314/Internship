html = ""
# sem '.html'
names = ["slider/index","page02","slider"]

for name in names:
    with open(name+".html", "r", encoding="utf-8") as file:
        html += "<!-- "+name+" -->"
        for line in file.readlines():
            html += line
        html += "\n\n"

with open("index.html", "w", encoding="utf-8") as file:
    file.write(html)