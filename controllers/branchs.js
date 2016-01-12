'use strict';

let BranchsModel = require('../model/branchs');
let RepositoryModel = require('../model/repository');
let helperCordova = require('../helpers/cordova');
let helperGit = require('../helpers/git');
let Boom = require('boom');
let shell = require('shelljs');

function BranchsController () {
  this.model = new BranchsModel();
}

module.exports = BranchsController;

BranchsController.prototype.list = function (request, reply) {
  let repo = new RepositoryModel(request.params.repo);

  this.model.list(repo)
    .then(reply)
    .catch((err) => {
      reply(Boom.badImplementation(err.message));
    });
};

BranchsController.prototype.build = function (request, reply) {
  let nameBranch = (request.params.base)? request.params.base + '/' +  request.params.branch : request.params.branch;
  let repo = new RepositoryModel(request.params.repo);
  let branch = new BranchsModel(nameBranch, repo);
  let version = request.params.version;
  let path = repo.getPath();

  shell.cd(path);

  helperGit.clean();
  helperGit.checkout(branch);
  helperCordova.buildCordova(path, version)
    .then(() => {
      return helperCordova.buildFile(repo.getPath(), version)
    })
    .then(reply)
    .catch((err) => {
      reply(Boom.badImplementation(err.message));
    });
};
