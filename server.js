'use strict'
const Hapi = require('hapi');

// Bcrypt module - creates a hash and provides method for comparing a string to a hash
const Bcrypt = require('bcryptjs');

// Basic Authentication Scheme for Hapi (https://github.com/hapijs/hapi-auth-basic)
const Basic = require('hapi-auth-basic');

const Path = require('path');

// Create server and start a connection
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

const Bell = require('bell')

var AuthCookie = require('hapi-auth-cookie');

server.connection({ port: process.env.PORT || 3000 });

// Dummy data for users database (n.b. unhashed password === 'bacon')
const users = {
  troy: {
    username: 'troy',
    password: '$2a$08$fV9AJ7I21AhZhtRoXoV16u4h/pN1kWBLMPKkQE8BkH/.cgaOwbMi2',
    name: 'John Doe',
    id: '2133d32a',
    isAdmin: false,
  },
  rory: {
    username: 'rory',
    password: '$2a$08$fV9AJ7I21AhZhtRoXoV16u4h/pN1kWBLMPKkQE8BkH/.cgaOwbMi2',
    name: 'John Doe',
    id: '4133d32a',
    isAdmin: true,
  },
};
var bellAuthOptions = {
  provider: 'github',
  password: 'github-encryption-password-need-to-reach-32-characters', //Password used for encryption
  clientId: '2febb531827677c14e44',//'YourAppId',
  clientSecret: '8171beef6004dd3be31eca444b268dedd2d24d66',//'YourAppSecret',
  isSecure: false
};
var authCookieOptions = {
  password: 'cookie-encryption-password-need-to-be-longer', //Password used for encryption
  cookie: 'sitepoint-auth', // Name of cookie to set
  isSecure: false
};
// Declare validateFuncs (see docs for full details)
// validateFunc required by Basic Auth strategy, must call callback with upto 3 arguments:
// 1: error
// 2: boolean value of whether validation succeeded
// 3: data which will be available at request.auth.credentials

// validateAsUser - checks a user is in user database and password is valid
const validateAsUser = (request, username, password, callback) => {
  const user = users[username];
  if (!user) return callback(null, false);

  Bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid, { id: user.id, name: user.name });
  });
};

// validateAsAdmin - checks a user is in user database, password is valid and user isAdmin
const validateAsAdmin = (request, username, password, callback) => {
  const user = users[username];
  if (!user) return callback(null, false);

  Bcrypt.compare(password, user.password, (err, isValid) => {
    callback(err, isValid && user.isAdmin, { id: user.id, name: user.name, isAdmin: user.isAdmin });
  });
};

// Register basic auth scheme with Hapi
server.register([Basic,Bell, AuthCookie], err => {
  if (err) throw err;

  // Create user strategy - by supplying the validateAsUser function
  server.auth.strategy('user', 'basic', { validateFunc: validateAsUser });

  // Create admin strategy - by supplying the validateAsAdmin function
  server.auth.strategy('admin', 'basic', { validateFunc: validateAsAdmin });

  //Create oAuth strategy
  server.auth.strategy('github-oauth', 'bell', bellAuthOptions);

  //Create cookie strategy
  server.auth.strategy('site-point-cookie', 'cookie', authCookieOptions);

  // default on cookie
  server.auth.default('site-point-cookie');

  // Create an unauthenticated route
  server.route({
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply.file('index.html');
    }
  });

  // Create a route with user level authentication
  server.route({
    method: 'GET',
    path: '/authenticated',
    config: {
      auth: 'user',
      handler(request, reply) {
        reply(`hello ${request.auth.credentials.name}`);
      }
    }
  });

  // Create a route with admin level authentication
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
  // create oAuth endpoint for github
  server.route({
    method: 'GET',
    path: '/oauth',
    config: {
      auth: 'github-oauth',
      handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
          console.log(request.auth.session)
          request.cookieAuth.set(request.auth.credentials);
          return reply('Hello ' + request.auth.credentials.profile.displayName);
        }
      }
    }
  });

  server.start(err => {
    if (err) throw err;
    console.log(`server running at: ${server.info.uri}`);
  });
});
