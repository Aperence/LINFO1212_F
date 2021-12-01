# LINFO1212_F

## Prérequis

Pour pouvoir lancer notre site, il y a quelque prérequis d'installation nécessaire : 
- MongoDB : vous pouvez télécharger celui-ci à l'[adresse](https://www.mongodb.com/download-center/community?jmp=docs) suivante
- Node.js : vous pouvez le télécharger à cette [adresse](https://nodejs.org/en/)
- Outils MongoDB : vous pouvez les télécharger à cette [adresse](https://www.mongodb.com/try/download/database-tools)

N'oubliez pas d'ajouter node.js, mongoDB et les outils mongoDB à votre ```PATH``` !

Vous n'aurez ensuite qu'à télécharger l'archive zip se trouvant sur le [github](https://github.com/Aperence/LINFO1212_F) ou bien à lancer un ```git clone https://github.com/Aperence/LINFO1212_F``` pour obtenir le dossier.

## Lancement du site

Pour lancer notre site, il vous suffit de lancer les commandes suivantes dans votre invite de commande : 
```bash
mongod --dbpath (chemin/au/fichier/LINFO1212_F)/database*
node app.js
```

```bash
*ex : c:/users/download/LINFO1212_F/LINFO1212_F/database
```

Vous devrez ensuite ajouter les index de recherche à la base de données. Pour cela, entrez les commandes suivantes dans votre invite de commande:
```bash
mongo
use site
db.animal.createIndex({name: "text" })
db.employee.createIndex({name: "text" })
```


Vous pouvez ensuite vous connecter au site en vous rendant dans votre moteur de recherche favori et en vous connectant à l'url suivante ```https://localhost:8080```

## Méthodes de test
Pour tester le bon fonctionnement de notre site, nous avons utilisé divers moyens cités ci-dessous
### Fichiers d'exemple
Dans le dossier database_example, vous pourrez trouver 3 fichiers JSON contenant des exemples basiques l'éléments de la base de données.
Pour la ajouter à la base de données, il vous suffit de lancer les commandes suivantes dans votre invite de commande à partir du dossier database_example: 
```bash
mongoimport -d site -c animal exampleAnimal.json
mongoimport -d site -c employee exampleEmployee.json
mongoimport -d site -c timetable exampleTimeTable.json 
```
Vous aurez ainsi inséré quelques petits examples pour tester le site.
### Fonctions de gestion de la base de donnée et de débuggage
Nous avons aussi, toujours dans une optique de test, rajouté des fonctions accessibles depuis le navigateur pour manipuler la base de données.
Celles-ci sont accessibles à partir du site en tapant le lien : ```https://localhost:8080/tools/(commande)```.
Attention, veillez à désativer ces fonctionnalités lorsque le serveur est en ligne pour éviter à tout utilisateur de pouvoir modifier drastiquement la base de données, en supprimant la ligne ou en la mettant en commentaire ```app.use("/tools", DBTools.DBTools)``` du fichier app.js.

La liste des commandes est la suivante : 
- append : rajoute un certain nombre d'employés, d'animaux et d'affectations aléatoires dans la base de données.
- clear : supprime tous les éléments, de toutes les bases de données utilisées par le site
- serialize : sauvegarde l'entièreté des documents se trouvant dans la base de données dans les 3 fichiers suivant se trouvant dans le dossier database_save: 
    - sauvegarde la collection animal dans animalSave.json
    - sauvegarde la collection employee dans employeeSave.json
    - sauvegarde la collection timetable dans timetableSave.json
- deserialize : recrée la base de données à partir de 3 fichiers tels que ceux cités dans serialize (JSON avec un attribut list : ensemble des document JSON de la collection)
### Fichiers de tests Jest
Nous avons également réalisés des fichiers de test Jest pour tester de manière plus approfondie les fonctionnalités de notre site.
Pour lancer ces tests et s'assurer du bon fonctionnement du site, vous n'avez qu'à lancer la commande suivant en vous trouvant de le dossier LINFO1212_F : 
```npm test```

