function makeRenderObject(isAnimal, Name, Request){
    /**
     * @pre : 
     * @post : 
     */
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var ListNextWeek = calculateListNextWeek(date);
    return {
        "Mode" : Request.session.theme || "light",
        "title" : isAnimal ? "animaux" : "employés",
        "Name" : Name,
        "isAnimal" : isAnimal,
        "StaffAnimalName" : Name,
        "ActualDate" : `${day}/${month+1}/${year}`,
        "dateSelection" : ListNextWeek
    }
}


function calculateListNextWeek(date){
    /**
     * @pre : 
     * @post : 
     */
    const DayList = ["Dimanche","Lundi" , "Mardi" , "Mercredi" , "Jeudi", "Vendredi" , "Samedi" ]  
    var dateHelp = date;
    var ListNextWeek = []
    for (var numberDay = 0; numberDay<7 ; numberDay++){
        ListNextWeek.push( {
            exactDate : `${dateHelp.getFullYear()}/${dateHelp.getMonth()+1}/${dateHelp.getDate()}`+"/"+`${DayList[dateHelp.getDay()]}`  ,
            dateText: DayList[dateHelp.getDay()] + " " +dateHelp.getDate()
        })
        dateHelp = new Date(dateHelp.getFullYear(), dateHelp.getMonth(), dateHelp.getDate()+1)
    }
    return ListNextWeek
}


function createListItem(isAnimal, TimeTable, DatabaseDocument){
    var item;
    for (var hour = 0; hour<24; hour++){    
        for (var halfhour = 0; halfhour <2 ; halfhour++){
            strHour = hour.toString()
            if (strHour.length===1){
                strHour = '0' + strHour
            }
            strhalfhour = (halfhour*30).toString()
            if (strhalfhour.length===1){
                strhalfhour = '0' + strhalfhour
            }
            var exactHour =  `${strHour}:${strhalfhour}`
            item = getIfTimesExists(DatabaseDocument,exactHour)
            var status = defineState(item,isAnimal)
            var name = getName(item,isAnimal)
            TimeTable.push({status : status, time : exactHour, name : name})
        }
    }
}


function getIfTimesExists(DatabaseDocument,exactHour){
    for(let item of DatabaseDocument){
        if (item.time === exactHour){
            return item
        }
    }
    return {}
}

function defineState(item, isAnimal){
    if (Object.keys(item).length === 0){ // objet vide
        return 'requiredField'
    }
    if (isAnimal){
        if (item.staffName === "null"){
            return "unrequiredField"
        }
        return "FilledField"
    }else{
        if (item.animalName === "null"){
            return "unrequiredField"
        }
        return "FilledField"
    }
}

function getName(item, isAnimal){
    if (Object.keys(item).length === 0){    // objet vide
        return "Pas d'employé"
    }
    if (isAnimal){
        return item.staffName === "null" ? "-" : item.staffName
    }else{
        return item.animalName === "null" ? "-" : item.animalName
    }
}


function renderTimeTable(TimeTable){
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



module.exports = {
    "makeRenderObject" : makeRenderObject,
    "renderTimeTable" : renderTimeTable,
    "createListItem" : createListItem
}