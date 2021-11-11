function makeRenderObject(isAnimal, Name, Request,DatabaseAccess){
    /**
     * @pre : 
     * @post : 
     */
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var ListNextWeek = calculateListNextWeek(date);
    var TimeTable = makeTimeTable(isAnimal,DatabaseAccess, Request);
    console.log("OK")
    return {
        "title" : isAnimal ? "animaux" : "employés",
        "Mode" : Request.session.theme || "light",
        "StaffAnimalName" : Name,
        "ActualDate" : `${day}/${month}/${year}`,
        "dateSelection" : ListNextWeek,
        'TimeTable' : TimeTable
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
            exactDate : `${dateHelp.getFullYear()}/${dateHelp.getMonth()}/${dateHelp.getDate()}`,
            dateText: DayList[dateHelp.getDay()] + " " +dateHelp.getDate()
        })
        dateHelp = new Date(dateHelp.getFullYear(), dateHelp.getMonth(), dateHelp.getDate()+1)
    }
    return ListNextWeek
}


function makeTimeTable(isAnimal, DatabaseAccess,Request){
    var TimeTable = []
    var state;
    var name;
    for (var hour = 0; hour<24; hour++){    
        for (var halfhour = 0; halfhour <2 ; halfhour++){
            console.log("called")
            if (isAnimal){
                DatabaseAccess.collection("timetable").find({animalName : Request.query.name, time : `${hour}:${halfhour*30}`}).toArray((err,doc)=>{
                    console.log(doc)
                    state = defineState(doc, isAnimal)
                    name = getName(isAnimal,doc)
                    TimeTable.push({ status : state, time : `${hour}:${halfhour*30}`, name : name})
                })
            }else{
                DatabaseAccess.collection("timetable").find({staffName : Request.query.name, time : `${hour}:${halfhour*30}`}).toArray((err,doc)=>{
                    state = defineState(doc, isAnimal)
                    name = getName(isAnimal,doc)
                    TimeTable.push({ status : state, time : `${hour}:${halfhour*30}`, name : name})
                })
            }
        }
    }
    TimeTable = await TimeTable;
    return TimeTable;
}

function defineState(DatabaseDocument, isAnimal){
    if (DatabaseDocument.length===0){
        return 'requiredField'
    }
    if (isAnimal){
        if (DatabaseDocument[0].staffName === null){
            return "nonRequiredField"
        }
        return "FilledField"
    }else{
        if (DatabaseDocument[0].animalName === null){
            return "nonRequiredField"
        }
        return "FilledField"
    }
}

function getName(isAnimal, DatabaseDocument){
    if (DatabaseDocument.length===0){
        return '/'
    }
    if (isAnimal){
        return DatabaseDocument[0].animalName
    }else{
        return DatabaseDocument[0].staffName
    }
}



module.exports = {
    "makeRenderObject" : makeRenderObject
}