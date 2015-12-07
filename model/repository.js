'use strict';

let Promise = require('bluebird');
let Path = require('path');
let fs = require('fs');
let git = require('../helpers/git');


let RepositoryModel = {

  list: function(){
    let deferred = Promise.pending();
    let reposBase = Path.join(__dirname, '../', 'repos');

    fs.readdir(reposBase, function (err, data) {
      if((err && err.errno) || !data)
        return deferred.reject({ message: "No records"});


      Promise.map(data, git.mapConfig).then(function(data){
        deferred.resolve({
          repositories: data
        });
      });
    });

    return deferred.promise;
  },

  create: function(payload){
    return git.clone(payload.url, payload.name)
  }

};

module.exports = RepositoryModel;


