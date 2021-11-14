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
            var exactHour =  formatHourString([hour,halfhour*30])
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

function comprisedBetween(startHourFormated, endHourFormated, actualHour){
    var intervalHour = []
    if (endHourFormated[0]<startHourFormated[0]){    // cas où on commence vers 23h par exemple et fini à 7h
        for (let i = 0; i<= startHourFormated[0]-(endHourFormated[0]-24); i++ ){
            for (let j = 0; j< 2; j++ ){
                intervalHour.push([ (i+startHourFormated[0])%24 ,j*30])
            }
        }
    }else{
        for (let i = startHourFormated[0]; i<= endHourFormated[0]; i++ ){
            for (let j = 0; j< 2; j++ ){
                intervalHour.push([i,j*30])
            }
        }
    }
    if (startHourFormated[1] == 30){   // enlève l'élément de trop   ex : [7,0] rajouté alors que doit commencer à [7,30]
        intervalHour.slice(1,intervalHour.length)
    }
    if ( endHourFormated[1] == 0){  // enlève l'élément de trop ex : [17,30] rajouté alors que doit aller que jusquà [17,0]
        intervalHour.pop()
    }
    for(let i of intervalHour){
        if (i[0]==actualHour[0] && i[1]==actualHour[1] ){
            return true
        }
    }
    return false
}

function formatHour(Hour){
    Hour = Hour.split(":")
    Hour[0] = Hour[0][0] == "0" ? Hour[0].slice(1,Hour.length) : Hour[0]
    Hour[1] = Hour[1][0] == "0" ? Hour[1].slice(1,Hour.length) : Hour[1]
    Hour[0] = parseInt(Hour[0])
    Hour[1] = parseInt(Hour[1])
    return Hour
}

function formatHourString(HourArray){
    hour = HourArray[0]
    halfhour = HourArray[1]
    strHour = hour.toString()
    if (strHour.length===1){
        strHour = '0' + strHour
    }
    strhalfhour = halfhour.toString()
    if (strhalfhour.length===1){
        strhalfhour = '0' + strhalfhour
    }
    return `${strHour}:${strhalfhour}`
}


function renderTimeTableAdmin(TimeTable, ListAnimalStaff, isAnimal, Request){
    var renderedTimeTable = `<table>
                                <input type="hidden" id="dateModif" value = '${Request.query.date}/${Request.query.day}'>
                                <tr>
                                    <th>Status</th>
                                    <th>Heure</th>
                                    <th>Assignation</th>
                                </tr>`
    var status;
    var name;
    for (let i = 0; i<TimeTable.length; i++){
        actualHour = [ Math.floor(i/2) , (i%2)*30 ]
        strActualHour = formatHourString(actualHour)
        name = `<select name='nameSelection${strActualHour}' id='nameSelection${strActualHour}' style='width:150px'>`

        switch(TimeTable[i].status){
            case "requiredField":
                status = "<i class='bx bx-x-circle bx-tada' style='color:#fa0000' ></i>"
                name += `<option value=''></option>`
                break;
            case "unrequiredField":
                status = "<i class='bx bx-minus-circle' style='color:#e1ac0e'  ></i>"
                name = "-"
                break;
            case "FilledField":
                status = "<i class='bx bxs-check-circle' style='color:#29f40a'  ></i>"
                break;
        }
        if (TimeTable[i].status != 'unrequiredField'){
            if (!isAnimal){

                for (let item of ListAnimalStaff){
                    name += `<option value=${item._id}>${item.name}</option>`
                }
    
            }else{
    
                for (let item of ListAnimalStaff){
                    
                    var startHourFormated = formatHour(item.startHour)   // pour avoir un array de int à partir de l'heure     ex : [17,0] ou [14,30]  => 17h00 ou 14h30
                    var endHourFormated = formatHour(item.endHour)
    
                    if (comprisedBetween(startHourFormated, endHourFormated, actualHour)){
                        name += `<option value=${item._id}>${item.name}</option>`
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
    "renderTimeTableAdmin" : renderTimeTableAdmin,
    "renderTimeTableNotAdmin" : renderTimeTableNotAdmin,
    "createListItem" : createListItem
}