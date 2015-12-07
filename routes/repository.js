'use strict';

let Controller = require('../controllers/repository');
let Validator = require('../validators/repository');

exports.register = (server, options, next) => {
  // instantiate controller
  let controller = new Controller();

  server.bind(controller);
  server.route([
    {
      method: 'GET',
      path: '/repository',
      config: {
        handler: controller.list,
        validate: Validator.list()
      }
    },
    {
      method: 'POST',
      path: '/repository',
      config: {
        handler: controller.create,
        validate: Validator.create()
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'repository-route',
  version: '1.0.0'
};
