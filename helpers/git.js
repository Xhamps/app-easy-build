'use strict';

let Promise   = require('bluebird');
let gitConfig = require('git-config');
let Path      = require('path');
let git       = require('gitty');
let fs        = require('fs');
let mkdirp    = require('mkdirp');

let helperGit = {
  mapConfig: function(repo){
    let deferred = Promise.pending();
    let configFile = Path.join(__dirname, '../', 'repos', repo, '.git', 'config');

    gitConfig(configFile, function (err, config){
      if(err)
          deferred.reject(err);

      deferred.resolve({
        name: repo.replace('_', ' '),
        url: config['remote "origin"'].url
      });
    });

    return deferred.promise;
  },

  clone: function(url, folder){
    let deferred = Promise.pending();
    let path = Path.join(__dirname, '../', 'repos', folder.replace(' ', '_'));
    let opts = { username: url.split('@')[0] };

    if (fs.existsSync(path)){
      deferred.reject(new Error("Repository already exists"));
    }

    mkdirp.sync(path);

    git.clone(path, url, opts, function(){ deferred.resolve({ok: true}); });
    
    return deferred.promise;
  }
};

module.exports = helperGit;
