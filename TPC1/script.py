import os
import xml.etree.ElementTree as ET

if not os.path.exists('html'):
    os.mkdir("html")

dir = 'MapaRuas-materialBase/texto'

indice = """
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <title>Mapa</title>
        <meta charset="utf-8">
    </head>
    <body>
"""

indice += "<ul>"

ruas = []

for filename in sorted(os.listdir(dir)):
    nomes = filename.split("-")
    rua = nomes[2].split(".")
    ruas.append(rua)
    indice += f'<li><a href="html/{rua[0]}.html">{rua[0]}</a></li>'

indice += "</ul>"
indice += "</body>"

output = open("indice.html", "w", encoding="utf-8")
output.write(indice)
output.close()


for filename in sorted(os.listdir(dir)):
    tree = ET.parse(f'MapaRuas-materialBase/texto/{filename}')
    root = tree.getroot()

    ruaPage = """
        <!DOCTYPE html>
        <html lang="pt-PT">
        <head>
            <title>Mapa</title>
            <meta charset="utf-8">
        </head>
        <body>
    """

    meta = root.find('meta')
    
    numero = meta.find('número').text
    nome = meta.find('nome').text

    ruaPage += f"""<h1>{numero} - {nome}</h1>"""

    
    for figura in root.findall('corpo/figura'):
        legenda = figura.find('legenda')
        imagem = figura.find('imagem')
        figura = imagem.get('path')
        splits = figura.split('/')
        path = f'../MapaRuas-materialBase/imagem/{splits[2]}'
        ruaPage += f"""
        <figure>
            <img src='{path}' style='width:100%'>
            <figcaption>{legenda.text}</figcaption>
        </figure>
        """
   
    for file in os.listdir('MapaRuas-materialBase/atual'):
        info = file.split('-')
        vista_atual = f'../MapaRuas-materialBase/atual/{file}'
        if numero == info[0]:
            
            if "Vista1" in vista_atual: 
                legenda = f"{nome} - Vista 1"
            elif "Vista2" in vista_atual: 
                legenda = f"{nome} - Vista 2"
            else: 
                legenda = nome
                        
            ruaPage += f"""
            <figure>
                <img src='{vista_atual}' style='width:60%'>
                <figcaption>{legenda}</figcaption>
            </figure>
            """

    corpo = root.find('corpo')
    listadecasas = corpo.find('lista-casas')
    if listadecasas is not None:
        casas = listadecasas.findall('casa')

        ruaPage += f"""<h3> Casas na rua </h3>"""
        for casa in casas:
            numero = casa.find('número').text
            enfiteuta = casa.find('enfiteuta').text if casa.find('enfiteuta') is not None else "Desconhecido"
            foro = casa.find('foro').text if casa.find('foro') is not None else "Desconhecido"

            desc = "<p>"
            desc_elements = casa.find('desc')

            if desc_elements is not None:
                for para in desc_elements:
                    if para.text:
                        desc += para.text
                    for child in para:
                        if child.tag == 'lugar':
                            desc += f" <strong>{child.text}</strong>"
                        elif child.tag == 'entidade':
                            desc += f" <strong>{child.text}</strong>"
                        else:
                            desc += f" {child.text}"
                        if child.tail:
                            desc += child.tail
            else:
                desc = "N/A"

            desc += "</p>"

            ruaPage += f"""
            <div class='casa'>
                <h2>Casa {numero}</h2>
                <ul>
                    <li>Enfiteuta: {enfiteuta}</li>
                    <li>Foro: {foro}</li>
                    <li>Descrição: {desc}</li>
                </ul>
            </div>
            """

    ruaPage += "</body>"

    with open(f"html/{numero}.html", "w", encoding="utf-8") as f:
        f.write(ruaPage)
 