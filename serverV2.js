// normalement, on utiliserez des dns diffèrents mais sur une seule machine,
// c'est compliqué ^^
const portsByZone = require('./portsByZone');

let zone;
let ports;

require('yargs')
  .command('run <zone>', "lance le serveur pour la zone indiquée",  (yargs) => {
    yargs
      .positional('zone', {
        describe: 'zone du serveur',
        type: 'string',
        choices: ['europe', 'asie', 'amerique']
      })
  }, (yargs) => {
    if (yargs.verbose) console.info(`Run server for ${yargs.zone}`)
    zone = yargs.zone;
    ports = portsByZone[yargs.zone];
  })
  .option('verbose', {
    alias: 'v',
    default: false
  })
  .demandCommand(1, 'Vous devez fournir au moins une commande')
  .strict()
  .help()
  .argv

let Db = require('tingodb')().Db;
let assert = require('assert');

let db = new Db('./db', {});
let collection = db.collection(zone);

// Publish -> diffusion des messages
// PULL -> recevoir les messages
let zmq = require('zeromq');
let publisher = zmq.socket('pub');
let receiver = zmq.socket('pull');
let othersOne = zmq.socket('push');
let othersTwo = zmq.socket('push');
let serveursReceiver = zmq.socket('pull');

receiver.on('message', function(buf) {
  console.log("received :", buf.toString());
  const data = JSON.parse(buf);
  if(data.zone === zone) {
    collection.insert([data], {w:1}, function(err) {
      assert.equal(null, err);
    });
  }
  publisher.send(["general", buf]);
  othersOne.send(buf);
  othersTwo.send(buf);
});

serveursReceiver.on('message', function(buf) {
  console.log("received from serveurs:", buf.toString());
  publisher.send(["general", buf]);
});

publisher.bindSync(`tcp://*:${ports.pub}`);
receiver.bindSync(`tcp://*:${ports.pull}`);
serveursReceiver.bindSync(`tcp://*:${ports.serveur}`);
othersOne.connect(`tcp://localhost:${ports.others[0]}`);
othersTwo.connect(`tcp://localhost:${ports.others[1]}`);

console.log("Server run");
