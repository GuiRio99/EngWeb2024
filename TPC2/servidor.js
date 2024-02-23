var http = require('http');
var url = require('url')
var axios = require('axios');

http.createServer((req,res) => {
    console.log(req.method + " " + req.url);

    var q = url.parse(req.url,true)

    res.writeHead(200, {'Content-Type' : 'text/html; charset=utf-8'})

    if(q.pathname == "/"){

        res.write("<h1>Escola de Música</h1>")
        res.write("<ul>")
        res.write("<li><a href='/cursos'>Lista de cursos</a></li>")
        res.write("<li><a href='/instrumentos'>Lista de instrumentos</a></li>")
        res.write("<li><a href='/alunos'>Lista de alunos</a></li>")
        res.write("</ul>")
        res.end()

    }else if(q.pathname == "/cursos")
    {
        axios.get("http://localhost:3000/cursos?_sort=designacao")
        .then((resp) => {
            var data = resp.data

            res.write("<h1>Escola de Música</h1>")
            res.write("<h3>Lista de cursos:</h3>")
            res.write("<ul>")
            for(i in data)
            {
                res.write("<li><a href='/cursos/" + data[i].id + "'>" + data[i].designacao + "</a></li>")
            }
            res.write("</ul>")
            res.end()
        })
        .catch((erro) => {
            console.log("Erro" + erro)
        })
    }
    else if(q.pathname == "/alunos")
    {
        axios.get("http://localhost:3000/alunos?_sort=nome")
        .then((resp) => {
            var data = resp.data

            res.write("<h1>Escola de Música</h1>")
            res.write("<h3>Lista de alunos:</h3>")
            res.write("<ul>")
            for(i in data)
            {
                res.write("<li><a href='/alunos/" + data[i].id + "'>" + data[i].nome + "</a></li>")
            }
            res.write("</ul>")
            res.end()
        })
        .catch((erro) => {
            console.log("Erro" + erro)
        })
    }
    else if(q.pathname == "/instrumentos")
    {
        axios.get("http://localhost:3000/instrumentos")
        .then((resp) => {
            var data = resp.data

            res.write("<h1>Escola de Música</h1>")
            res.write("<h3>Lista de instrumentos:</h3>")
            res.write("<ul>")
            for(i in data)
            {
                res.write("<li>" + data[i]["#text"] + "</li>")
            }
            res.write("</ul>")
            res.end()
        })
        .catch((erro) => {
            console.log("Erro" + erro)
        })
    }
    else if (q.pathname.startsWith("/cursos/C")) // Página detalhes de um curso
    {
        let id = req.url.split("/").pop()
        axios.get("http://localhost:3000/cursos/" + id)
        .then((resp) => {
            var data = resp.data

            res.write("<h1>Escola de Música</h1>")
            res.write("<h2>" + data.designacao + "</h2>")
            res.write("<p>Id: " + data.id + "</p>")
            res.write("<p>Duração: " + data.duracao + "</p>")
            res.write("<p>Instrumento: " + data.instrumento["#text"] + "</p>")
            res.end()
        })
        .catch((erro) => {
            console.log("Erro" + erro)
        })
    }
    else if (q.pathname.startsWith("/alunos/A"))
    {
        let id = req.url.split("/").pop()
        axios.get("http://localhost:3000/alunos/" + id)
        .then((resp) => {
            var data = resp.data
            res.write("<h1>Escola de Música</h1>") 
            res.write("<h2>Info do Aluno</h2>")
            res.write("<p>Id: " + data.id + "</p>")
            res.write("<p>Nome: " + data.nome + "</p>")
            res.write("<p>Data Nascimento: " + data.dataNasc + "</p>")
            res.write("<p>Curso: " + data.curso + "</p>")
            res.write("<p>Ano do Curso: " + data.anoCurso + "</p>")
            res.write("<p>Instrumento: " + data.instrumento + "</p>")
            res.end()
        })
        .catch((erro) => {
            console.log("Erro" + erro)
        })
    }
    else
        console.log("Erro" + erro)
    

}).listen(1902);

console.log("Servidor à escuta na porta 1902...");