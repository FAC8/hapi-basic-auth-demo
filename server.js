const Hapi = require('hapi');

// Bcrypt module - creates a hash and provides method for comparing a string to a hash
const Bcrypt = require('bcrypt');

// Basic Authentication Scheme for Hapi (https://github.com/hapijs/hapi-auth-basic)
const Basic = require('hapi-auth-basic');

// Create server and start a connection
const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 3000 });

// Dummy data for users database (n.b. unhashed password === 'bacon')
const users = {
  john: {
    username: 'john',
    password: '$2a$08$fV9AJ7I21AhZhtRoXoV16u4h/pN1kWBLMPKkQE8BkH/.cgaOwbMi2',
    name: 'John Doe',
    id: '2133d32a',
    isAdmin: false,
  },
};


// validateFunc required by Basic Auth strategy, must call callback with upto 3 arguments:
// 1: error
// 2: boolean value of whether validation succeeded
// 3:
const validate = (request, username, password, callback) => {
  const user = users[username];
  if (!user) return callback(null, false);

  Bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid, { id: user.id, name: user.name, isAdmin: user.isAdmin });
  });
};

const validateAdmin = (request, username, password, callback) => {
  const user = users[username];
  if (!user) return callback(null, false);

  Bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid && user.isAdmin, { id: user.id, name: user.name, isAdmin: user.isAdmin });
  });
};

server.register(Basic, err => {
  if (err) throw err;

  server.auth.strategy('simple', 'basic', { validateFunc: validate });
  server.auth.strategy('admin', 'basic', { validateFunc: validateAdmin });

  server.route({
    method: 'GET',
    path: '/authenticated',
    config: {
      auth: 'simple',
      handler(request, reply) {
        reply(`hello ${request.auth.credentials.name}`);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/admin',
    config: {
      auth: 'admin',
      handler(request, reply) {
        reply(`hello ${request.auth.credentials.name}`);
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply('Unauthenticated');
    }
  });

  server.start(err => {
    if (err) throw err;
    console.log(`server running at: ${server.info.uri}`);
  });
});
