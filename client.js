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

// simulation de messages de Jean tous les 5 secondes pour illustrer displayOutputMessage
let setPeriodiqueMsg = function() {
  setInterval(() => {
    displayOutputMessage("Jean : Tu bosses ?");
  }, 5000);
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
      setPeriodiqueMsg()
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

rl.on('line', (line) => { // Quand l'utilisateur appuie sur entrée.
  console.log(`Vous avez dit : '${line.trim()}'`);
  rl.prompt();
}).on('close', () => { // Quand il ferme le programme
  console.log('Have a great day!');
  process.exit(0);
});
