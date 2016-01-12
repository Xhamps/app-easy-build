'use strict';

let Promise = require('bluebird');
let shell = require('shelljs');
let Path = require('path');
let git = require('./git');

let helperCordova = {
  
  buildPath: function(){
    return Path.join(__dirname, '../')
  },

  cleanCordova: function (path, type){
    this._execShell(path, 'git checkout -- .');
    return this._execShell(path, 'git clean -df');
  },

  buildCordova: function (path, type){
    return this._execShell(path, 'cordova build ' + type);
  },

  buildFile: function (pathBase, type){
    let path = Path.join(pathBase, 'platforms', type);
    var cmd = '';

    if(type === 'ios')
      cmd = 'gym --scheme "Medicinia" --export_method ad-hoc --use_legacy_build_api false';
    else
      cmd = 'ant build'

    return this._execShell(path, cmd);
  },
  _execShell: function (path, command){
    return new Promise((resolve, reject) => {

      shell.cd(path);

      let process = shell.exec(command, {async:true});

      process.stdout.on('data', function(data) {
        console.log(data);
      });

      process.stdout.on('end', function(data) {
        resolve({build: 'ok'});
      });

    });
  }
};

module.exports = helperCordova;
