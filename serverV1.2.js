let Db = require('tingodb')().Db;
let assert = require('assert');

let db = new Db('./db', {});
let collection = db.collection("msgs");

// Publish -> diffusion des messages
// PULL -> recevoir les messages
let zmq = require('zeromq');
let publisher = zmq.socket('pub');
let receiver = zmq.socket('pull');

receiver.on('message', function(buf) {
  console.log("received :", buf.toString());
  const data = JSON.parse(buf);
  collection.insert([data], {w:1}, function(err) {
    assert.equal(null, err);
  });
  publisher.send(["general", buf.toString()]);
});

publisher.bindSync("tcp://*:5557");
receiver.bindSync("tcp://*:5558");

console.log("Server run");