'use strict';

let Promise   = require('bluebird');
let gitConfig = require('git-config');
let Path      = require('path');
let git       = require('gitty');
let fs        = require('fs');
let mkdirp    = require('mkdirp');

let helperGit = {

  buildPath: function(folder){
    return Path.join(__dirname, '../', 'repos', folder.replace(' ', '_'))
  },

  mapConfig: function(Class){
    return  function(repo){
      return new Promise((resolve, reject) => {
        let configFile = Path.join(__dirname, '../', 'repos', repo, '.git', 'config');

        gitConfig(configFile, function (err, config){
          if(err)
              reject(err);

          let name = repo.replace('_', ' ');
          let uri = config['remote "origin"'].url;

          var obj = {};

          if(Class){
            obj = new Class(name, uri);
          }else{
            obj = {
              name: name,
              url: uri
            }
          }

          resolve(obj);
        });
      });
    }
  },

  clone: function(url, folder){
    return new Promise((resolve, reject) => {
      let path = this.buildPath(folder);
      let opts = { username: url.split('@')[0] };

      if (fs.existsSync(path))
        reject(new Error("Repository already exists"));

      mkdirp.sync(path);

      git.clone(path, url, opts, function(){ resolve({ok: true}); });
    });
  },

  getBranches: function(path, Class){
    return new Promise((resolve, reject) => {
      let repo = git(path);

      repo.getBranches((err, branches) => {
        if(err)
          reject(err);

        branches.others.push(branches.current);

        Promise.map(branches.others, (branch) => {
            let name = branch.replace('remotes/origin/', '');

            if(name.indexOf('HEAD') === -1)
              return new Class(name);

            return false;
          }).then(function(result){
            return result.filter((branch) => { return !!branch});
          })
          .then(resolve)
          .catch(reject);
      });

    });
  }
};

module.exports = helperGit;
