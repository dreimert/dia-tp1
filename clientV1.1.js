// https://nodejs.org/api/readline.html
const readline = require('readline');

//initialisation de l'interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

let user = {};

// Permet d'afficher proprement les messages extérieurs
const displayOutputMessage = (msg) => {
  process.stdout.clearLine(); // enleve le > du prompt
  process.stdout.cursorTo(0); // remet le curseur en debut de ligne pour éviter le bug graphiques
  console.log(msg);
  rl.prompt(true); // réaffiche le prompt
}

// Set la zone géographique
let getUserZone = function() {
  rl.question("Quel est votre zone géographique ? (europe, amerique ou asie) ", function(zone) {
      switch (zone.toLowerCase()) {
        case "europe":
        case "amerique":
        case "asie":
          user.zone = zone.toLowerCase();
          break;
        default:
          console.log("Zone inconnue !");
          process.exit(0);
      }
      rl.prompt(true); // Affiche le prompt : >
  });
}

// Set the username
let getUserName = function() {
  rl.question("Quel est votre nom d'utilisateur ? ", function(name) {
      user.name = name;
      getUserZone()
  });
}

getUserName()

// SUB -> recevoir diffusion des messages
// push -> envoyer les messages
let zmq      = require('zeromq');
let receiver = zmq.socket('sub')
let sender   = zmq.socket('push');

receiver.on('message', function(chan, buf) {
  // console.log("chan", chan, "->", chan.toString());
  // console.log("buf:", buf, "->", buf.toString());
  // Passage des messages au format JSON
  const data = JSON.parse(buf.toString()); // parsing
  displayOutputMessage(`${data.user} : ${data.msg}`); // affichage
});

receiver.connect('tcp://localhost:5557');
receiver.subscribe("general");
sender.connect('tcp://localhost:5558');

rl.on('line', (line) => { // Quand l'utilisateur appuie sur entrée.
  //console.log(`Vous avez dit : '${line.trim()}'`);
  // on envoie du JSON
  // Il n'y a rien à changer coté serveur.
  sender.send(JSON.stringify({
    user: user.name,
    msg: line.trim()
  }));
  rl.prompt();
}).on('close', () => { // Quand il ferme le programme
  console.log('Have a great day!');
  receiver.close();
  sender.close();
  process.exit(0);
});
