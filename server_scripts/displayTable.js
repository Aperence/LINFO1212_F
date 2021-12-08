//3 first functions made by @Aperence

const { comprisedBetween } = require("./modifierMethods")
const modifHelp = require("./modifierMethods")

const length = 20    //nombre d'animaux affiché par page

function calc_pagenum(list,length){
    /**
     * @pre : list : liste des incidents
     * @pre : length : la longueur d'une page (le nombre d'incidents affiché par page)
     * @post : le nombre de page total nécessaire pour afficher tous les incidents
     */
    num_page = (list.length - list.length%length)/length
    if (list.length%length!=0){
        num_page+=1
    }
    return num_page
}

function get_num(list,length,actual=1){
    /**
     * @pre : list : la liste des incidents
     * @pre : length : la longueur d'une page (le nombre d'incidents affiché par page)
     * @pre : actual : le numéro de la page que l'on cherche à charger
     * @post : retourne une liste permettant d'intégrer les numéros de page sur la template html (lien vers ce numéro et string du numéro à afficher)
     */
    num_page = calc_pagenum(list,length)
    var lst = []
    if (num_page<=6){     // si moins de 6 pages, affiche tous les numéros à la suite
        for (var num = 1; num<=num_page;num++){
            var main = num==actual
            lst.push({
                "ref" : `display?num=${num}`,
                "number" : num, 
                'main' : main
            })
        }
        return lst
    }

    // numéros de page 1 et 2 toujours affiché par soucis de facilité
    // dernier et avant-dernier numéros de page toujours affiché par soucis de facilité

    // Si on est au début des numéros de pages, affiche tous ceux du début à la suite ex:  1 2 3 4 ... n-1 n
    if (actual<=5){
        for (var i = 1; i<actual+3;i++){
            var main = i==actual
            lst.push({"ref" : `display?num=${i}`,
            "number" : i, 
            "main" : main})
        }
        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page-1}`,
        "number" : num_page-1, 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page}`,
        "number" : num_page, 'main' : "false"})
    }

    // Si on est au centre des numéros de pages, affiche deux numéros de page avant et après   ex:  1 2 ...  7 8 9 10 11 ...  n-1 n
    if (actual>5 && actual <= num_page-5){
        lst.push({"ref" : `display?num=${1}`,
        "number" : 1, 'main' : "false"})
        lst.push({"ref" : `display?num=${2}`,
        "number" : 2, 'main' : "false"})
        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        for (var i = actual-2; i<actual+3;i++){
            var main = i==actual
            lst.push({"ref" : `display?num=${i}`,
            "number" : i, 
            'main' : main})
        }

        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page-1}`,
        "number" : num_page-1, 'main' : "false"})
        lst.push({"ref" : `display?num=${num_page}`,
        "number" : num_page, 'main' : "false"})
    }
    // Si on est à la fin des numéros de pages, affiche les 4 dernier   ex : 1 2 ... n-3 n-2 n-1 n
    if (actual>num_page-5){
        lst.push({"ref" : `display?num=${1}`,
        "number" : 1, 'main' : "false"})
        lst.push({"ref" : `display?num=${2}`,
        "number" : 2, 'main' : "false"})
        lst.push({"ref" : "#",
        "number" : "...", 'main' : "false"})
        for (var i = actual-2; i<=num_page;i++){
            var main = i==actual
            lst.push({"ref" : `display?num=${i}`,
            "number" : i, 
            'main' : main})
        }
    }
    //retourne la liste contenant les string des références des numéros de page ainsi que leur chiffre
    return lst
}

function getListForAnimal(name, timetable){
    var ret = []
    for (let item of timetable){
        if (item.animalName === name || item.staffName === name){
            ret.push(item)
        }
    }
    return ret
}

function defineDateStatus(listTime, isAnimal, Employee){
    var date = new Date()
    var count = date.getDay()
    const DayList = ["Dimanche","Lundi" , "Mardi" , "Mercredi" , "Jeudi", "Vendredi" , "Samedi" ]  
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            for (let halfHour = 0; halfHour < 60; halfHour+=30) {
                if (!isAnimal){
                    var formatedStartHour = modifHelp.formatHour(Employee.startHour)
                    var formatedEndHour = modifHelp.formatHour(Employee.endHour)
                    if (!modifHelp.comprisedBetween(formatedStartHour, formatedEndHour, [hour,halfHour])){
                        continue
                    }
                }
                var hasNotHour = true
                for (let item of listTime) {
                    if (item.day === DayList[(count+day)%7] && item.time === modifHelp.formatHourString([hour,halfHour])){
                        hasNotHour = false
                        break
                    }
                }
                if (hasNotHour){
                    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + day)
                    return [['bx bx-x-circle bx-tada','color:#fa0000'],`${DayList[(count+day)%7]} ${newDate.getDate()}`, 336 - 48*day - 2*hour - halfHour]
                }
            }
        }
    }
    return [['bx bxs-check-circle','color:#29f40a'],"Complet", -1]
}

function defineNameLink(name, isAnimal){
    if (isAnimal){
        return `/modif/animalmodif?name=${name}`
    }
    return `/modif/staffmodif?name=${name}`
}

function formatRenderObjects(doc, timetable){
    var ret = []
    for (let index = 0; index < doc.length; index++) {
        var name = doc[index].name
        var isAnimal = doc[index].password === undefined // le mot de passe est d'office rempli => permet de déterminer si c'est un animal ou un employé
        var nameLink = defineNameLink(name, isAnimal)
        var listTime = getListForAnimal(name, timetable)
        var temp = defineDateStatus(listTime, isAnimal , doc[index])
        var element = temp[0][0]
        var color = temp[0][1]
        var date = temp[1]
        var sortIndex = temp[2]
        ret.push({status1 : element, status2 : color,  nameLink : nameLink, name : name, date : date, sortIndex : sortIndex})
    }
    return ret
}

function returnPages(doc, req, timetable, sorted=null){
    /**
     * @pre : doc : la liste des animaux (triés ou non)
     * @pre : req : la variable permettant de déterminer les requêtes ayant été faites (notamment le numéro de page)
     * @pre : sortpages : l'ordre de tri (par défaut : pas de tri)
     * @post : retourne un objet json pour pouvoir remplir la template associée
     */ 
    num = get_num(doc,length,parseInt(req.session.num))  // retourne la liste des numéros de page avec les bons liens
    num_page = calc_pagenum(doc,length)   // calcule le nombre de numéros de page
    doc = formatRenderObjects(doc, timetable, req.session.isAnimal)
    if (req.session.isAnimal){
        options = [{"value" : true, "title" : "Animal"}, {"value" : false, "title" : "Employé"}]
    }else{
        options = [{"value" : false, "title" : "Employé"}, {"value" : true, "title" : "Animal"}]
    }
    if (sorted){
        doc.sort((o1,o2)=>{
            return sorted*(o1.sortIndex - o2.sortIndex)
        })
    }
    doc = doc.slice((req.query.num-1)*length,(req.query.num-1)*length+length)   //prend les éléments de [numéro_page: numéro_page+length_claims]  => affiche seulement 1 page (nombre incident arbitraire) et pas toute base données
    var error = ""
    if (req.session.error){
        error = req.session.error
        req.session.error = undefined
        req.session.searched = undefined
        req.session.searchResult = undefined
    }
    return {     //retourne l'objet pour remplir la template
        "cat" : req.session.cat,
        "sort" : req.session.sort,
        "list" : doc,
        "numlist" : num,
        "Mode" : req.session.theme,
        "imageMode" : req.session.theme,
        "options" : options,
        "error" : error
    }
}

module.exports = {
    "returnPages" : returnPages,
    "get_num" : get_num,
    "calc_pagenum" : calc_pagenum
}