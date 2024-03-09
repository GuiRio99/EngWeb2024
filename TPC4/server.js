var http = require('http')
var axios = require('axios')
const { parse } = require('querystring');

var templates = require('./templates.js')        // Necessario criar e colocar na mesma pasta
var static = require('./static.js')             // Colocar na mesma pasta

// Aux functions
function collectRequestBodyData(request, callback) {
    if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}

// Server creation
var server = http.createServer((req, res) => {
    // Logger: what was requested and when it was requested
    var d = new Date().toISOString().substring(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Handling request
    if(static.staticResource(req)){
        static.serveStaticResource(req, res)
    }
    else{
        switch(req.method){
            case "GET": 
                
                if(req.url=='/compositores' || req.url == '/'){
                    axios.get("http://localhost:3000/compositores")
                    .then(resp =>{
                        
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.cmpListPage(resp.data))
                        res.end()
                    })
                    .catch(erro =>{
                        res.writeHead(505, {'Content-Type' : 'text/html'})
                        res.write(templates.errorPage(erro,d))
                        res.end()
                    })
                }
                else if(/\/compositores\/C\d+$/i.test(req.url)){

                    id = req.url.split('/')[2]
                    axios.get("http://localhost:3000/compositores/" + id)
                    .then(resp =>{
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.cmpPage(resp.data))
                        res.end()
                    })
                    .catch(erro =>{
                        res.writeHead(505, {'Content-Type' : 'text/html'})
                        res.write(templates.errorPage(erro,d))
                        res.end()
                    })
                }
                else if(req.url=='/compositores/registo'){

                    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write(templates.cmpFormPage())
                    res.end()
                }
                else if(/\/compositores\/edit\/C\d+$/i.test(req.url)){

                    id = req.url.split('/')[3]
                    axios.get("http://localhost:3000/compositores/" + id)
                    .then(resp =>{
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write(templates.cmpFormEditPage(resp.data))
                        res.end()
                    })
                    .catch(erro =>{
                        res.writeHead(505, {'Content-Type' : 'text/html'})
                        res.write(templates.errorPage(erro,d))
                        res.end()
                    })
                }
                else if(/\/compositores\/delete\/C\d+$/i.test(req.url)){
                    id = req.url.split('/')[3]
                    axios.delete("http://localhost:3000/compositores/" + id)
                    .then(resp =>{
                        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                        res.write("<p>Registo " +id+ " foi eliminado!</p>")
                        res.end()
                    })
                    .catch(erro =>{
                        res.writeHead(505, {'Content-Type' : 'text/html'})
                        res.write(templates.errorPage(erro,d))
                        res.end()
                    })
                }
                else{
                    res.writeHead(505, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write("<p>GET não é possivel --> " + req.url + "</p>")
                    res.end()
                }
                break
            case "POST":
                if(req.url=='/compositores/registo'){

                    collectRequestBodyData(req, result =>{
                        if(result){

                            console.log(result)

                            axios.post("http://localhost:3000/compositores", result)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                                res.write("<p>Registo " + JSON.stringify(resp.data) + "foi adicionado!</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(505, {'Content-Type' : 'text/html'})
                                res.write(templates.errorPage(erro,d))
                                res.end()
                            })
                        }else{
                            res.writeHead(505, {'Content-Type' : 'text/html;charset=utf-8'})
                            res.write("<p>ERRO com dados!</p>")
                            res.end()
                        }
                    })
                }
                else if(/\/compositores\/edit\/C\d+$/i.test(req.url)){

                    collectRequestBodyData(req, result =>{
                        if(result){

                            console.log(result)

                            axios.put("http://localhost:3000/compositores/" + result.id, result)
                            .then(resp => {
                                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'})
                                res.write("<p>Registo " + JSON.stringify(resp.data) + "foi alterado!</p>")
                                res.end()
                            })
                            .catch(erro => {
                                res.writeHead(505, {'Content-Type' : 'text/html'})
                                res.write(templates.errorPage(erro,d))
                                res.end()
                            })
                        }else{
                            res.writeHead(505, {'Content-Type' : 'text/html;charset=utf-8'})
                            res.write("<p>ERRO com dados!</p>")
                            res.end()
                        }
                    })
                }
                else{
                    res.writeHead(505, {'Content-Type' : 'text/html;charset=utf-8'})
                    res.write("<p>POST não é possivel --> " + req.url + "</p>")
                    res.end()
                }
                break
            default: 
                res.writeHead(500, {'Content-Type' : 'text/html;charset=utf-8'})
                res.write("<p>Método não suportado: " + req.method + "</p>")
                res.end()
                break
        }
    }
})

server.listen(1902, ()=>{
    console.log("Servidor à escuta na porta 1902...")
})