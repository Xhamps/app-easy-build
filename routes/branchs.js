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
      path: '/repository/{repo}/branchs',
      config: {
        handler: controller.list,
        validate: Validator.list()
      }
    },
    {
      method: 'GET',
      path: '/repository/{repo}/branch/{branch}/build/{version}',
      config: {
        handler: controller.build,
        validate: Validator.build()
      }
    },
    {
      method: 'GET',
      path: '/repository/{repo}/branch/{base}/{branch}/build/{version}',
      config: {
        handler: controller.build,
        validate: Validator.build()
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'branchs-route',
  version: '1.0.0'
};
