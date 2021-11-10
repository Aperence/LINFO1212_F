function makeRenderObject(isAnimal, Name){
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
        "title" : isAnimal ? "animaux" : "employés",
        "StaffAnimalName" : Name,
        "ActualDate" : `${day}/${month}/${year}`,
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
            exactDate : `${dateHelp.getFullYear()}/${dateHelp.getMonth()}/${dateHelp.getDate()}`,
            dateText: DayList[dateHelp.getDay()] + " " +dateHelp.getDate()
        })
        dateHelp = new Date(dateHelp.getFullYear(), dateHelp.getMonth(), dateHelp.getDate()+1)
    }
    return ListNextWeek
}



module.exports = {
    "makeRenderObject" : makeRenderObject
}