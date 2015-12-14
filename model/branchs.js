'use strict';

let Promise = require('bluebird');
let Path = require('path');
let fs = require('fs');
let helperGit = require('../helpers/git');
let helperObject = require('../helpers/object');


function BranchsModel(name, repo){
  this.name = name;
  this.links = {};
  this._repo = repo;

  if(this.name && this._repo)
    this.bildLinks();
};

BranchsModel.prototype.buildLinks = function() {
  let nameRepo =  this._repo.buildName();
  this.links = {
    build:{
      ios: 'http://0.0.0.0:8000/repository/' + nameRepo + '/branch/' + this.name + '/build/ios',
      android: 'http://0.0.0.0:8000/repository/' + nameRepo + '/branch/' + this.name + '/build/anroid',
    }
  }
};

BranchsModel.prototype.setReposotory = function(repo){
  this._repo = repo;
  this.buildLinks();
};

BranchsModel.prototype.list = function(repo){
  return new Promise((resolve, reject) => {
    let path = repo.getPath();

    helperGit.getBranches(path, BranchsModel)
      .then((branchs) => {
        return Promise.map(branchs, (branch) => {  branch.setReposotory(repo);  return branch; });
      })
      .then(helperObject.removePrivetyKey)
      .then((branchs) => {
        resolve({ branchs: branchs });
      })
      .catch(reject);
  });
};

module.exports = BranchsModel;


