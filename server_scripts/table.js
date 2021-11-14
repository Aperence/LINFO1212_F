
const modifierHelp = require("./modifierMethods")


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
                                </tr>`
    var status;
    var name;
    var namePassed;
    for (let i = 0; i<TimeTable.length; i++){
        actualHour = [ Math.floor(i/2) , (i%2)*30 ]
        strActualHour = modifierHelp.formatHourString(actualHour)
        name = `<select name='nameSelection${strActualHour}' id='nameSelection${strActualHour}' style='width:150px'>`
        namePassed = "";
        switch(TimeTable[i].status){
            case "requiredField":
                status = "<i class='bx bx-x-circle bx-tada' style='color:#fa0000' ></i>"
                name += `<option value=''></option>`   //option vide par défaut
                break;
            case "unrequiredField":
                status = "<i class='bx bx-minus-circle' style='color:#e1ac0e'  ></i>"
                name = "-"  // pas d'option choisisable
                break;
            case "FilledField":
                status = "<i class='bx bxs-check-circle' style='color:#29f40a'  ></i>"
                name += `<option value=${TimeTable[i].name}>${TimeTable[i].name}</option>`  //option préalablement choisie dans la base de données
                namePassed = TimeTable[i].name;
                break;
        }
        if (TimeTable[i].status != 'unrequiredField'){   // champs requis -> doit faire modifications
            if (!isAnimal){

                for (let item of ListAnimalStaff){
                    if (item.name === namePassed){
                        continue
                    }
                    name += `<option value=${item.name}>${item.name}</option>`
                }
    
            }else{
    
                for (let item of ListAnimalStaff){
                    if (item.name === namePassed){
                        continue
                    }
                    var startHourFormated = modifierHelp.formatHour(item.startHour)   // pour avoir un array de int à partir de l'heure     ex : [17,0] ou [14,30]  => 17h00 ou 14h30
                    var endHourFormated = modifierHelp.formatHour(item.endHour)
    
                    if (modifierHelp.comprisedBetween(startHourFormated, endHourFormated, actualHour)){
                        name += `<option value=${item.name}>${item.name}</option>`
                    }
                }
            }
            name += "</select>"
        }

        renderedTimeTable += `<tr>
                                <td style="min-width: 50px;">${status}</td>
                                <td style="min-width: 100px;">${TimeTable[i].time}</td>
                                <td style="min-width: 200px;">${name}</td>
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
                                    <th>Status</th>
                                    <th>Heure</th>
                                    <th>Assignation</th>
                                </tr>`
    var status;
    for (let i = 0; i<TimeTable.length; i++){
        switch(TimeTable[i].status){
            case "requiredField":
                status = "<i class='bx bx-x-circle bx-tada' style='color:#fa0000' ></i>"
                break;
            case "unrequiredField":
                status = "<i class='bx bx-minus-circle' style='color:#e1ac0e'  ></i>"
                break;
            case "FilledField":
                status = "<i class='bx bxs-check-circle' style='color:#29f40a'  ></i>"
                break;
        }
        renderedTimeTable += `<tr>
                                <td style="min-width: 50px;">${status}</td>
                                <td style="min-width: 100px;">${TimeTable[i].time}</td>
                                <td style="min-width: 200px;">${TimeTable[i].name}</td>
                             </tr>`
    }
    renderedTimeTable += "</table>"
    return renderedTimeTable
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
        dbo.collection(collectionSearch).find({}).toArray((err,documentEmployee)=>{
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
