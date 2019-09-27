/*global module, process*/

// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';

exports.routes = {
  '/hybrid/catalog': { host: `http://${localhost}:8002` },
  '/apps/catalog': { host: `http://${localhost}:8002` },
  '/api/catalog': { host: 'http://localhost:3000' }
};
