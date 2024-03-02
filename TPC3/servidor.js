var http = require('http')
var url = require('url')
var axios = require('axios')

http.createServer( (req, res) =>{
    
    var q = url.parse(req.url, true)
    

    if (q.pathname == '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write('<h1><b>TPC3: Listas</b></h1>')
        res.write("<ul>");
        res.write("<li><a href='http://localhost:1902/filmes'>Filmes</a></li>");
        res.write("<li><a href='http://localhost:1902/generos'>Géneros</a></li>");
        res.write("<li><a href='http://localhost:1902/atores'>Atores</a></li>");
        res.write("</ul>");
        res.end()
    }
    else if (q.pathname == '/filmes') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                
                let lista = resp.data

                res.write("<h1>Filmes: </h1>")
                res.write("<ul>")

                for(l in lista){
                    res.write("<li><a href='http://localhost:1902/filmes/" + lista[l]._id.$oid + "'>" + lista[l].title + "</a></li>")
                }
                res.write("</ul>")
                res.end()
            })
            .catch(erro => {
                res.write("Erro: " + erro)
                res.end()
            })
    }
    else if (q.pathname == '/generos') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                let lista = resp.data

                let gSet = new Set()

                for(elem in lista){
                    var g = lista[elem].genres

                    if(g != null){
                        for (let i = 0; i < g.length; i++) {
                            gSet.add(g[i])
                        }   
                    }
                    
                }

                res.write("<h1>Géneros: </h1>")
                res.write("<ul>")

                gSet.forEach(g => {
                    res.write("<li><a href='http://localhost:1902/generos/" + g + "'>" + g + "</a></li>")
                })

                res.write("</ul>")
                res.end()
                
            })
            .catch(erro => {
                res.write("Erro: " + erro)
                res.end()
            })
    }
    else if (q.pathname == '/atores') {

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                
                let lista = resp.data
                let setA = new Set()

                for(l in lista){
                    var a = lista[l].cast
                    for (let i = 0; i < a.length; i++) {
                        setA.add(a[i])
                    }
                }

                res.write("<h1>Atores: </h1>")
                res.write("<ul>")

                setA.forEach(g => {
                    res.write("<li><a href='http://localhost:1902/atores/" + g + "'>" + g + "</a></li>")
                })

                res.write("</ul>")
                res.end();
            })
            .catch(erro => {
                res.write("Erro: " + erro)
                res.end()
            })
    }
    else if (q.pathname.match(/\/filmes\/(.+)/)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        let id = q.pathname.substring(8)
        axios.get("http://localhost:3000/filmes?_id.$oid=" + id)
            .then(resp => {
                
                let filme = resp.data
                
                res.write("<h1>" + filme[0].title + "</h1>")
                res.write("<p>Year: " + filme[0].year + "</p>")
                res.write("<p>Cast: " + filme[0].cast + "</p>")
                res.write("<p>Genres: " + filme[0].genres + "</p>")
                res.end()
            })
            .catch(erro => {
                res.write("Erro: " + erro)
                res.end()
            })
    }
    else if (q.pathname.match(/\/generos\/(.+)/)) {

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        let id = q.pathname.substring(9)
        axios.get("http://localhost:3000/filmes")
            .then(resp => {
                
                let genero = id.replace(/%20/g, ' ')
                let lista = resp.data
                let setM = new Set()

                for(l in lista){
                    var g = lista[l].genres

                    if(g != null){
                        for (let i = 0; i < g.length; i++) {
                            if(g[i] == genero){
                                setM.add(lista[l].title)
                            }
                        }
                    }
                    else{
                        if(genero == " "){
                            setM.add(lista[l].title)
                        }
                        
                    }
                }

                res.write("<h1>" + genero +"</h1>")
                res.write("<ul>")

                setM.forEach(filme => {
                    res.write("<li>" + filme + "</li>")
                });

                res.write("</ul>");
                res.end();
            })
            .catch(erro => {
                res.write("Erro: " + erro)
                res.end()
            })
    }
    else if (q.pathname.match(/\/atores\/(.+)/)) {

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        let id = q.pathname.substring(8)
        axios.get("http://localhost:3000/filmes")
            .then(resp => {

                let ator = id.replace(/%20/g, ' ')
                let lista = resp.data
                let setM = new Set()

                for(l in lista){
                    var a = lista[l].cast

                    for (let i = 0; i < a.length; i++) {
                        if(a[i] == ator){
                            setM.add(lista[l].title)
                        }
                    }
                }

                res.write("<h1>" + ator +"</h1>")
                res.write("<ul>")

                setM.forEach(filme => {
                    res.write("<li>" + filme + "</li>")
                });

                res.write("</ul>");
                res.end();
            })
            .catch(erro => {
                res.write("Erro: " + erro)
                res.end()
            })
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.write('<h1>ERRO: 404 Not Found</h1>')
        res.end()
    }
}).listen(1902)

console.log("Servidor à escuta na porta 1902...")