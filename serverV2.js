// normalement, on utiliserez des dns diffèrents mais sur une seule machine,
// c'est compliqué ^^
// Du coup, utilisation de ports diffèrents ce qui complique un peu le code.
const portsByZone = require('./portsByZone');

let zone;
let ports;

// Mise en place d'une commande pour lancer le serveur
// permet d'être sur de la zone et de ne faire le test qu'au lancement
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

    // On selection la bonne zone et ports
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
let collection = db.collection(zone); // ne pas oublier d'enregistrer dans des bases de données diffèrentes

// Publish -> diffusion des messages
// PULL -> recevoir les messages
let zmq = require('zeromq');
let publisher = zmq.socket('pub');
let receiver = zmq.socket('pull');
// Il y a des solutions plus élégantes
// mais cette là est simple dans ce cas
let othersOne = zmq.socket('push'); // création de socket pour parler au premier autre serveur
let othersTwo = zmq.socket('push'); // création de socket pour parler au second autre serveur
let serveursReceiver = zmq.socket('pull'); // création d'une socket pour recevoir les messages des autres serveurs

receiver.on('message', function(buf) {
  console.log("received :", buf.toString());
  const data = JSON.parse(buf);

  // Avant d'écrire, je vérifie la zone du message.
  // Ne sert à rien car 'normalement' seul les clients de la zone se connectent
  if(data.zone === zone) {
    collection.insert([data], {w:1}, function(err) {
      assert.equal(null, err);
    });
  }
  publisher.send(["general", buf]);
  // je notifie les autres serveurs
  othersOne.send(buf);
  othersTwo.send(buf);
});


// Quand je reçois un message d'un autre serveur,
// je l'envoie à mes utilisateurs
serveursReceiver.on('message', function(buf) {
  console.log("received from serveurs:", buf.toString());
  publisher.send(["general", buf]);
});

// Bind des ports
publisher.bindSync(`tcp://*:${ports.pub}`);
receiver.bindSync(`tcp://*:${ports.pull}`);
serveursReceiver.bindSync(`tcp://*:${ports.serveur}`);
// connection aux autres serveurs
othersOne.connect(`tcp://localhost:${ports.others[0]}`);
othersTwo.connect(`tcp://localhost:${ports.others[1]}`);

console.log("Server run");
