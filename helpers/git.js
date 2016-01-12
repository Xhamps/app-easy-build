'use strict';

let Promise   = require('bluebird');
let gitConfig = require('git-config');
let Path      = require('path');
let git       = require('gitty');
let fs        = require('fs');
let mkdirp    = require('mkdirp');
let shell     = require('shelljs');
let moutArray = require('mout/array');

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
      shell.cd(path);
      let result = shell.exec('git branch --all');

      if(result.code !== 0)
        return reject(new Error("Erro na execução da quer"));

      let data = result.output;

      data = data.split('\n');
      data = data.map((branch) => {
        var name; 

        name = branch.slice(2,branch.length).replace('remotes/origin/', '');

        if(name.indexOf(' ->') > -1){
          name = name.slice(0, name.indexOf(' ->'));
        }

        return name;
      });
      data = data.filter( (branch) => { return !!branch; });
      data = moutArray.unique(data, (branch1, branch2) => { return branch1 === branch2});
      data = data.map( (branch) => {return new Class(branch);} );

      resolve(data); 

    });
  },

  clean: function(path){
    shell.exec('git checkout -- .');
    shell.exec('git clean -df');
  },

  checkout:function(branch){
    shell.exec('git checkout ' + branch.name);
  },

};

module.exports = helperGit;
