// Publish -> diffusion des messages
// Pull -> recevoir les messages
let zmq = require('zeromq');
let publisher = zmq.socket('pub');
let receiver = zmq.socket('pull');

// Quand on reçoit un message, on l'envoie à tous les clients
receiver.on('message', function(buf) {
  console.log("received :", buf.toString());
  publisher.send(["general", buf.toString()]);
});

publisher.bindSync("tcp://*:5557");
receiver.bindSync("tcp://*:5558");

console.log("Server run");
