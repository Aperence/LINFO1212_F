
const modifierHelp = require("./modifierMethods")

function generateTaskList(strActualHour, hasAlreadyTask){
    /**
     * @pre : strActualHour : l'heure sous forme de string "HH:MM"
     * @pre : hasAlreadyTask : un string représentant une des 4 tâches possibles se trouvant dans listOption ou bien null
     * @post : retourne une sélection entre les différentes tâches possibles.
     * Si une tâche est déjà sélectionnée (hasAlreadyTask), alors celle-ci se trouvera en tête de la sélection,
     * sinon ce sera l'option vide qui sera affichée en première
     */
    const listOption = ["Soins", "Nourrir", "Nettoyer l'enclos", "Spectacle"]
    var options = "";
    for (let option of listOption){
        if (option != hasAlreadyTask){
            options += `<option value=${option}>${option}</option>`
        }
    }
    if (hasAlreadyTask){    // met la tâche déjà choisie en première
        options = `<option value=${hasAlreadyTask}>${hasAlreadyTask}</option>` + options + `<option value=""></option>`
    }else{
        options = `<option value=""></option>` + options
    }
    
    return `<select name='taskList${strActualHour}' id='taskList${strActualHour}' style='width:150px'>
                ${options}
            </select>`
}

function returnTaskListAccordingStatus(status, strActualHour, task){
    /**
     * @pre : status : un string représentant le status de la tâche (personne déjà assignée, personne non nécessaire ou personne nécessaire)
     * @pre : task : un string représentant la tâche déjà effectuée
     * @pre : strActualHour : l'heure à laquelle la tâche doit être effectuée, il s'agit d'un string du format "HH:MM"
     * @post : retourne le string pour pouvoir sélectionner la tâche parmis la liste des tâches disponibles,
     * ou bien "-" si l'on ne peut attribuer une tâche à cette heure
     */
    switch(status){
        case "requiredField":
            return generateTaskList(strActualHour, null)  // génère la sélection de tâche 
        case "unrequiredField":
            return "-"
        case "FilledField":
            return generateTaskList(strActualHour, task)
    }
}


function returnNameSelectionAccordingStatus(status, isAnimal, ListAnimalStaff, strActualHour, potentialName){
    /**
     * @pre : status : un string représentant le status de la tâche (personne déjà assignée, personne non nécessaire ou personne nécessaire)
     * @pre : isAnimal : un booléen représentant si l'on recherche une sélection d'animaux ou d'employés
     * @pre : ListAnimalStaff : la liste des employés ou des animaux (en fonction du paramètre isAnimal)
     * @pre : strActualHour : l'heure dont on souhaite avoir la sélection de noms, il s'agit d'un string ayant le format "HH:MM"
     * @pre : potentialName : le nom de l'animal ou de l'employé s'il y avait déjà un animal/employé attribué dans la sélection
     * ex : Pour employé = Luc, on a déjà attribué à 11:00 de devoir s'occuper de animal = Lion => potentialName = Lion
     * 
     * @post : retourne la sélection entre les différents animaux ou employés du site
     * Si la sélection est celle des employés, vérifie également que la sélection ne contient pour cette heure-là que les 
     * employés travaillant sur cette période de temps (strActualHour entre son heure de début et son heure de fin)
     */
    var name = `<select name='nameSelection${strActualHour}' id='nameSelection${strActualHour}' style='width:150px'>`   // en-tête du select
    var nameAlreadyAdded = "";
    switch(status){
        case "requiredField":
            name += `<option value=''></option>`   //option vide par défaut
            break;
        case "unrequiredField":
            return "-"       // pas d'option choisisable -> peut direct renvoyer la sélection vide (juste un string)
        case "FilledField":
            name += `<option value=${potentialName}>${potentialName}</option>`    //option préalablement choisie dans la base de données
            nameAlreadyAdded = potentialName;
            break;
    }

    for (let item of ListAnimalStaff){
        if (!isAnimal){  //ajoute tous les animaux à la liste d'option
            if (item.name === nameAlreadyAdded){
                continue
            }
            name += `<option value=${item.name}>${item.name}</option>`

        }else{    // doit vérifier les heures de début et de fin de journée pour ajouter les employés à la liste

            if (item.name === nameAlreadyAdded){
                continue
            }
            var startHourFormated = modifierHelp.formatHour(item.startHour)   // pour avoir un array de int à partir de l'heure     ex : [17,0] ou [14,30]  => 17h00 ou 14h30
            var endHourFormated = modifierHelp.formatHour(item.endHour)

            if (modifierHelp.comprisedBetween(startHourFormated, endHourFormated, actualHour)){
                name += `<option value=${item.name}>${item.name}</option>`
            }
        }
    }
    if (nameAlreadyAdded){   // si on a le nom déjà sélectionné => oublie pas de rajouter option vide à la fin
        name += `<option value=""></option>`
    }
    name += "</select>"
    return name
}


function renderTimeTableAdmin(TimeTable, ListAnimalStaff, isAnimal, Request){
    /**
     * @pre : TimeTable un array d'objet ayant le format suivant:
     * {status : status, time : exactHour, name : name}
     * avec status : si le champs est requis, non-requis ou déjà remplis
     *      time : heure suivant le format "HH:MM" avec HH qui est une heure appartenant à [0,23] et MM, une demi-heure appartienant à {0, 30}
     *      name : nom de l'animal/employé
     * @pre : ListAnimalStaff : un document avec tous les employés ou animaux
     * @pre : isAnimal : un booléen indiquant si l'objet représente un animal ou un employé 
     * @pre : Request : objet permettant de récupérer les information demandées (queries)
     * @post : retourne un string représentant la table d'affichage avec la personne en charge pour 
     * chaque tranche horaire (version admin => avec sélection d'un employé)
     */
    var renderedTimeTable = `<table>
                                <input type="hidden" id="dateModif" name="dateModif" value = '${Request.query.date}/${Request.query.day}'>
                                <tr>
                                    <th>Status</th>
                                    <th>Heure</th>
                                    <th>Assignation</th>
                                    <th>Tâche</th>
                                </tr>`
    var status;
    var nameList;
    var taskList;
    for (let i = 0; i<TimeTable.length; i++){
        actualHour = [ Math.floor(i/2) , (i%2)*30 ]
        strActualHour = modifierHelp.formatHourString(actualHour)

        status = returnStatusString(TimeTable[i].status)
        taskList = returnTaskListAccordingStatus(TimeTable[i].status, strActualHour, TimeTable[i].task)
        nameList = returnNameSelectionAccordingStatus(TimeTable[i].status, isAnimal, ListAnimalStaff, strActualHour, TimeTable[i].name)

        renderedTimeTable += `<tr>
                                <td style="min-width: 50px;">${status}</td>
                                <td style="min-width: 100px;">${TimeTable[i].time}</td>
                                <td style="min-width: 180px;">${nameList}</td>
                                <td style="min-width: 120px;">${taskList}</td>
                             </tr>`
    }
    renderedTimeTable += "</table>"
    return renderedTimeTable
}


function renderTimeTableNotAdmin(TimeTable){
    /**
     * @pre : TimeTable un array d'objet ayant le format suivant:
     * {status : status, time : exactHour, name : name}
     * avec status : si le champs est requis, non-requis ou déjà remplis
     *      time : heure suivant le format "HH:MM" avec HH qui est une heure appartenant à [0,23] et MM, une demi-heure appartienant à {0, 30}
     *      name : nom de l'animal/employé
     * @post : retourne un string représentant la table d'affichage avec la personne en charge pour 
     * chaque tranche horaire (version non-admin => affiche juste les noms)
     */
    var renderedTimeTable = `<table>
                                <tr>
                                    <th style="min-width: 50px;">Status</th>
                                    <th style="min-width: 100px;">Heure</th>
                                    <th style="min-width: 180px;">Assignation</th>
                                    <th style="min-width: 120px;">Tâche</th>
                                </tr>`
    var status;
    for (let i = 0; i<TimeTable.length; i++){
        status = returnStatusString(TimeTable[i].status)
        if (TimeTable[i].status=="FilledField"){    // affiche que les éléments nécessaires
            renderedTimeTable += `<tr>
            <td style="min-width: 50px;">${status}</td>
            <td style="min-width: 100px;">${TimeTable[i].time}</td>
            <td style="min-width: 1800px;">${TimeTable[i].name}</td>
            <td style="min-width: 120px;">${TimeTable[i].task}</td>
         </tr>`
        }

    }
    renderedTimeTable += "</table>"
    return renderedTimeTable
}

function returnStatusString(status){
    /**
     * @pre : status : un string représentant l'état de la tâche à effectuer
     * @post : retourne les différentes images HTML en fonction du status de la tâche
     */
    switch(status){
        case "requiredField":
            return "<i class='bx bx-x-circle bx-tada' style='color:#fa0000' ></i>"    // rond barré rouge
        case "unrequiredField":
            return "<i class='bx bx-minus-circle' style='color:#e1ac0e'  ></i>"       // rond jaune
        case "FilledField":
            return "<i class='bx bxs-check-circle' style='color:#29f40a'  ></i>"      // rond vert avec V
    }
}


function makeRenderedTable(collectionSearch, Request, isAnimal, doc, res){
    /**
     * @pre : collectionSearch : type de recherche : sur les animaux ou sur les employés
     * @pre : Request : objet permettant de récupérer les information demandées (queries)
     * @pre : isAnimal : un booléen indiquant si l'objet représente un animal ou un employé
     * @pre : doc : un array contenant les résultats de recherche dans timetable pour une certaine date et un certain nom
     * @pre : res : objet permettant d'envoyer la réponse au client
     * @post : envoie la table d'affichage avec la personne en charge pour chaque tranche horaire
     */
    if (Request.session.isAdmin){
        dbo.collection(collectionSearch).find({}).sort({name : 1}).toArray((err,documentEmployee)=>{
            var TimeTable = modifierHelp.createListItem(isAnimal, doc)
            responseTimeTable = renderTimeTableAdmin(TimeTable, documentEmployee, isAnimal , Request);         
            res.send(responseTimeTable)
        })
    
    }else{
        var TimeTable = modifierHelp.createListItem(isAnimal, doc)
        responseTimeTable = renderTimeTableNotAdmin(TimeTable);                 
        res.send(responseTimeTable)
    }
}


module.exports = {
    "makeRenderedTable" : makeRenderedTable
}
