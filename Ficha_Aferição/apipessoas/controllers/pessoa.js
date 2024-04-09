var mongoose = require('mongoose')
const { modelName } = require("../models/pessoa")
var Pessoa = require("../models/pessoa")

module.exports.list = () => {
    return Pessoa
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Pessoa
        .findOne({_id : id})
        .exec()
}

module.exports.insert = pessoa => {
    var newPessoa = new Pessoa(pessoa)
    return newPessoa.save()
}

module.exports.insert = pessoa => {
    if((Pessoa.find({_id : pessoa._id}).exec()).length != 1){
        var newPerson = new Pessoa(pessoa)
        return newPerson.save()
    }
}

module.exports.update = (id, pessoa) => {
    return Pessoa
        .findByIdAndUpdate(id, pessoa, {new : true})
        .exec()
    }

module.exports.remove = id => {
    return Pessoa
        .findByIdAndDelete(id)
        .exec()
}

module.exports.getModalidades = () => {
    return Pessoa
        .distinct('desportos')
        .sort()
        .exec()
}

module.exports.getAtletasByModalidade = mod => {
    return Pessoa
        .find({desportos : mod})
        .sort({nome : 1})
        .exec()
}