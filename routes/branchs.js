'use strict';

let Controller = require('../controllers/branchs');
let Validator = require('../validators/branchs');

exports.register = (server, options, next) => {
  // instantiate controller
  let controller = new Controller();

  server.bind(controller);
  server.route([
    {
      method: 'GET',
      path: '/repository/{name}/branchs',
      config: {
        handler: controller.list,
        validate: Validator.list()
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'branchs-route',
  version: '1.0.0'
};
