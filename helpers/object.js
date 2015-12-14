'use strict';

let Promise   = require('bluebird');

let helperObject = {
  removePrivetyKey: function(objs){
    return Promise.map(objs, (obj) =>{
      let keys = Object.keys(obj);
      for (let i in keys){
        let key = keys[i];
        if(key.indexOf('_') === 0)
          delete obj[key];
      }
      return obj;
    });
  }
};

module.exports = helperObject;
