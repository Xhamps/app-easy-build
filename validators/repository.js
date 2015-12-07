'use strict';

// load deps
let Joi = require('joi');

let RepositoryValidator = {
  list: list,
  create: create,

};

module.exports = RepositoryValidator;

function list () {
  return {};
}

function create () {
  return {
    payload: {
      name: Joi
        .string()
        .min(1)
        .max(30)
        .trim()
        .required(),
      url: Joi
        .string()
        .trim()
        .required()
    }
  };
}
