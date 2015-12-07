'use strict';

let RepositoryModel = require('../model/repository');
let Boom = require('boom');

function RepositoryController () {
  this.model = RepositoryModel;
}

module.exports = RepositoryController;

RepositoryController.prototype.list = function (request, reply) {
  this.model.list()
    .then(reply)
    .catch((err) => {
      console.log(err);
      reply(Boom.badImplementation(err.message));
    });
};

RepositoryController.prototype.create = function (request, reply) {
  let payload = request.payload;

  this.model.create(payload)
    .then(reply)
    .catch((err) => {
      reply(Boom.badImplementation(err.message));
    });
};
