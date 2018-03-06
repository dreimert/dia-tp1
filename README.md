# Dia : TP1

TP1 du cours de développement et intégration d'applications distribuées.

L'objectif de ce TP est de mettre en place une application de communication multi-clusters répartie au niveau mondiale stockant les données dans la zone géographie qui lui est associée.

## Installation de node

Voir le TD2 : https://github.com/dreimert/dia-td2

## Protocole

Le but est de faire une application distribuée de communication répartie sur 3 zones géographiques : Amérique, Europe et Asie. Chaque utilisateur est lié à une de ces zones. Les messages produits par chaque utilisateur sont stockés dans la zone correspondante. Il y a 3 base de données : `amerique`, `europe` et `asie`.

Tant que les utilisateurs communiquent au sein d'une même région, pas de difficultés majeures. Maintenant, les utilisateurs de la région `europe` peuvent communiquer avec des utilisateurs de la région `asie`. Dans ce cas, les messages des utilisateurs sont stockés dans la zone correspondante mais sont consultables par les deux ! Ça devient un peu plus sportif :)

## Implémentation

Cloner ce dépot :

    git clone https://github.com/dreimert/dia-tp1.git

Installation des dépendances :

    npm install

Vérifier que le client se lance et jouez un peu avec :

    npm run client

Commencez par mettre en place une architecture simple :

* les clients communiquent avec un unique serveur via ØMQ.
* le serveur envoie le message à tous les clients.
* le serveur stocke le message dans une base données.

Passage au niveau supérieur :

* mettre en place trois serveurs.
* quand l'utilisateur choisie sa zone, se connecter au serveur correspondant
* les serveurs doivent être interconnecté entre eux pour diffuser les messages à tous les clients.
* les serveurs ne doivent stocker que les messages de leur clients.

Vous en voulez encore ? Vous en êtes vraiment là ? Bravo ! Chapeau ! Bon, vous avez le choix entre continuer sur le coté serveur décentralisé ou implémenter les fonctions distribuées avec une autre technologie.

### Distribuons encore les serveurs

Du coup, faites en sorte qu'une zone ne puisse contenir que 3 utilisateurs. Rendez les zones anonymes, quand un utilisateur se connecte, s'il n'y a plus de zones disponibles, lancer un nouveau serveur et il se connecte à celui-ci. S'il y a deux zone avec un seul utilisateur, les fusionner.

### Fonctions distribuées

Autres fonctions utilent mais pour lesquelles ØMQ n'est pas adaptés et où il vaut mieux passer par d'autres technologies comme socket.io.

Récupération de l'historique :

* Quand un client se connecte, lui renvoyer l'historique des conversations.

Messages directes :

* Implémentez une commande permettant d'envoyer un message à un unique utilisateur.

Login unique :

* le login d'un utilisateur doit être unique, quelque-soit la zone géographique

Si vous avez fini tout ça en quatre heures, j'ai très envi d'en discuter avec vous et de voir vos solutions !

## Test

Vos yeux et vos doigts.

## Par où commencer ?

Regarder le code du client.

Regarder les TDs précédents et codez votre serveur.

Pour installer une dépendence : `npm install <nom de la dépendence>`.

N'hésitez pas à utiliser des messages de la forme :

```Javascript
{
  type: "msg|historique|login"
  data: "..."
}
```

et des switch sur le type.

Allez-y petit à petit !

Posez des questions.

## Ce que je dois retenir

Des éléments qui peuvent sembler très compliqués au départ peuvent aller très vite à mettre en place avec les bonnes technologies.

Mettre un truc intelligent ici.

## Pour aller plus loin

Vous en voulez encore plus ? https://www.google.fr/
