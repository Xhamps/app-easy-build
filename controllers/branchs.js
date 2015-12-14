'use strict';

let BranchsModel = require('../model/branchs');
let RepositoryModel = require('../model/repository')
let Boom = require('boom');

function BranchsController () {
  this.model = new BranchsModel();
}

module.exports = BranchsController;

BranchsController.prototype.list = function (request, reply) {
  let repo = new RepositoryModel(request.params.name);

  this.model.list(repo)
    .then(reply)
    .catch((err) => {
      reply(Boom.badImplementation(err.message));
    });
};
