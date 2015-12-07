'use strict';

// load env variables
// require('dotenv').load();

// load deps
let Hapi = require('hapi');
let loader = require('./loader');

// instantiate a new server
let server = new Hapi.Server();

// set the port for listening
server.connection({
  host: process.env.SERVER_HOST || '0.0.0.0',
  port: process.env.SERVER_PORT || '8000'
});

// load routes
let plugins = getRoutes();

server.register(plugins, (err) => {
  if (err) { throw err; }

  if (!module.parent) {
    server.start((err) => {
      if (err) { throw err; }

      server.log('info', 'Server running at: ' + server.info.uri);
    });
  }
});

module.exports = server;

/**
 *
 * Load all controllers
 *
 */
function getRoutes () {
  return loader('routes').map((route) => {
    return {
      register: route.File
    };
  });
}
