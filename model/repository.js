'use strict';

let Promise = require('bluebird');
let Path = require('path');
let fs = require('fs');
let git = require('../helpers/git');


function RepositoryModel (name, url) {
  this.name = name || '';
  this.url = url || '';
  this.links = {};

  if(this.name)
    this.buildLinks();
}

RepositoryModel.prototype.buildName = function(){
  return this.name.replace(' ', '_') || '';
};

RepositoryModel.prototype.getPath = function(){
  var name = this.buildName();
  return (name)? git.buildPath(name) : '';
};

RepositoryModel.prototype.buildLinks = function(){
  var name = this.buildName();
  this.links = {
    branchs: 'http://0.0.0.0:8000/repository/' + name + '/branchs'
  }
};

RepositoryModel.prototype.list = function(){
  return new Promise((resolve, reject) => {
    let reposBase = Path.join(__dirname, '../', 'repos');

    fs.readdir(reposBase, function (err, data) {
      if((err && err.code !== 'ENOENT'))
        return reject({ message: "No records"});

      if(!data)
        resolve({ repositories: [] });

      Promise.map(data, git.mapConfig(RepositoryModel))
        .then(function(data){
          resolve({ repositories: data });
        });
    });
  });
};

RepositoryModel.prototype.create = function(payload){
  return git.clone(payload.url, payload.name);
};

module.exports = RepositoryModel;


