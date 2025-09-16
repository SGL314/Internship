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

js = js.replace("""E</button>
                    <button onclick="removeTask('${task.id}')">L""",especific)

with open("index.html", "w") as file:
    file.write(f"<style>\n{css}\n</style>\n{html}\n<script>\n{js}\n</script>")

with open("all.html", "w") as file:
    file.write(f"<style>\n{css}\n</style>\n{html}\n<script>\n{js}\n</script>")

#out of WP

html = ""
js = ""
css = ""
especific = """
✏️</button>
                    <button onclick="removeTask('${task.id}')">🗑️"""
with open("outOfWP/index.html", "r") as file:
    for line in file.readlines():
        html += line
with open("outOfWP/script.js", "r") as file:
    for line in file.readlines():
        js += line
with open("outOfWP/style.css", "r") as file:
    for line in file.readlines():
        css += line

js = js.replace("""E</button>
                    <button onclick="removeTask('${task.id}')">L</button>
                </span> <!-- EMOJIS -->""",especific)

with open("localhost/index.html", "w") as file:
    file.write(f"<style>\n{css}\n</style>\n{html}\n<script>\n{js}\n</script>")