html = ""
js = ""
css = ""
especific = """
✏️</button>
                    <button onclick="removeTask('${task.id}')">🗑️"""
with open("teste/index.html", "r") as file:
    for line in file.readlines():
        html += line
with open("teste/script.js", "r") as file:
    for line in file.readlines():
        js += line
with open("teste/style.css", "r") as file:
    for line in file.readlines():
        css += line

js = js.replace("innerStrangeThing_JS_001","")

with open("index.html", "w") as file:
    file.write(f"<style>{css}</style>{html}<script>{js}</script>")

with open("all.html", "w") as file:
    file.write(f"<style>{css}</style>{html}<script>{js}</script>")