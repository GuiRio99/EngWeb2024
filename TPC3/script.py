import re


with open("filmes.json", encoding="utf-8") as file:
    filmes = file.read()

new_file = re.sub(r'^({.*?})$', r'\1,', filmes, flags=re.M)[:-2]

new_file = '{\n"filmes":[\n' + new_file + ']}'

with open("new_filmes.json", "w", encoding="utf-8") as file:
    file.write(new_file)