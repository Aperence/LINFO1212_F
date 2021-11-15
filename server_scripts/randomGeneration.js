var help = require('./modifierMethods')

function generateNumber(min,max){
    /**
     * @pre : min : un entier
     * @pre : max : un entier tel que max>min
     * @post : retourne un entier aléatoire compris dans l'interval [min,max[
     */
    if (min>max){
        throw new Exception()
    }
    return Math.floor(Math.random()*(max-min)+min)
}

function randomCollections(DatabaseAccess){
    var number = 50   // nombre d'éléments
    randomAnimalCollection(DatabaseAccess,number/2)
    randomEmployeeCollection(DatabaseAccess,number/2)
    randomTimeTableCollection(DatabaseAccess,number)
}

function randomEmployeeCollection(DatabaseAccess,number){
    console.log("employee")
    for (var count = 0; count<number; count++){
        DatabaseAccess.collection("employee").insertOne(randomEmployee())
    }
}

function randomAnimalCollection(DatabaseAccess,number){
    console.log("animal")
    for (var count = 0; count<number; count++){
        DatabaseAccess.collection("animal").insertOne(randomAnimal())
    }
}

function randomTimeTableCollection(DatabaseAccess,number){
    console.log("time")
    for (var count = 0; count<number; count++){
        DatabaseAccess.collection("timetable").insertOne(randomTime(DatabaseAccess))
    }
}

function randomAnimal(){
    var name = generateAnimalName()
    var description = generateDescription()
    return {name : name, description :  description}
}

function randomEmployee(){
    var animalName = generateEmployeeName()
    var description = generateDescription()

    var hour = generateNumber(0,24)
    var halfhour = generateNumber(0,2)
    var time = help.formatHourString([hour,halfhour*30])

    var endHour = (hour+8) %24
    var endTime = help.formatHourString([endHour,halfhour*30])

    var isAdmin = generateNumber(0,10) >= 9 ? true : false
    return {name : animalName, description : description, password : "test", admin : isAdmin, startHour : time, endHour: endTime}
}

function randomTime(DatabaseAccess){
    const DayList = ["Dimanche","Lundi" , "Mardi" , "Mercredi" , "Jeudi", "Vendredi" , "Samedi" ]
    var date = new Date(generateNumber(1950,2021), generateNumber(0,11), generateNumber(1,31))
    dateString = help.formatDateFromObject(date)
    var time = generateTime()
    var choiceCase = generateNumber(0,5)
    var name;
    if (choiceCase==0){
        name = "null"
    }else{
        name = generateEmployeeName()
    }
    var animalName = generateAnimalName()
    return {day : DayList[date.getDay()] , date : dateString, time : time, staffName : name, animalName : animalName}
}


function generateEmployeeName(){
    const listName = ["Jean", "Michel", "Georges", "Luc", "Exedius", "Rick", "Elvis", "Astley", "Xander", "Takumi", "Simon"]
    return listName[generateNumber(0,listName.length)]
}

function generateAnimalName(){
    const listAnimal = ["Lion", "Turtle", "Sparrow", "Caterpillar", "Butterfly", "Bat", "Crocodile", "Snakes", "Hyena", "Dolphin"]
    return listAnimal[generateNumber(0,listAnimal.length)]
}

function generateDescription(){
    const listdescription = ["lazy", "angry", "luxury", "envy", "glutony", "pride", "greed"]
    return listdescription[generateNumber(0,listdescription.length)]
}


function generateTime(){
    var hour = generateNumber(0,24)
    var halfhour = generateNumber(0,2)
    var time = help.formatHourString([hour,halfhour*30])
    return time
}


module.exports = {
    "randomCollections" : randomCollections
}