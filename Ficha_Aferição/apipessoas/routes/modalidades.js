var express = require('express');
var router = express.Router();
var Pessoa = require("../controllers/pessoas")

router.get('/', function(req, res,next) {
    Pessoa.getModalidades()
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

router.get('/:modalidade', function(req, res,next) {
  Pessoa.getAtletasByModalidade(req.params.modalidade)
    .then(data => res.jsonp(data))
    .catch(erro => res.jsonp(erro))
});

module.exports = router;
