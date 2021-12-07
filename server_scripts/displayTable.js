//3 first functions made by @Aperence

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

function get_num(list,length,actual=0){
    /**
     * @pre : list : la liste des incidents
     * @pre : length : la longueur d'une page (le nombre d'incidents affiché par page)
     * @pre : actual : le numéro de la page que l'on cherche à charger
     * @post : retourne une liste permettant d'intégrer les numéros de page sur la template html (lien vers ce numéro et string du numéro à afficher)
     */
    num_page = calc_pagenum(list,length)
    var lst = []
    if (num_page<=6){     // si moins de 6 pages, affiche tous les numéros à la suite
        for (var i = 1; i<=num_page;i++){
            lst.push({
                "ref" : `display?num=${i}`,
                "number" : i})
        }
        return lst
    }

    // numéros de page 1 et 2 toujours affiché par soucis de facilité
    // dernier et avant-dernier numéros de page toujours affiché par soucis de facilité

    // Si on est au début des numéros de pages, affiche tous ceux du début à la suite ex:  1 2 3 4 ... n-1 n
    if (actual<=5){
        for (var i = 1; i<actual+3;i++){
            if (i==actual){
                lst.push({"ref" : `display?num=${i}`,
                "number" : i, "main" : "true"})
                continue;
            }
            lst.push({"ref" : `display?num=${i}`,
            "number" : i, 'main' : "false"})
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
            if (i==actual){
                lst.push({"ref" : `display?num=${i}`,
                "number" : i, 'main' : "true"})
                continue;
            }
            lst.push({"ref" : `display?num=${i}`,
                        "number" : i, 'main' : "false"})
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
            if (i==actual){
                lst.push({"ref" : `display?num=${i}`,
                "number" : i, 'main' : "true"})
                continue;
            }
            lst.push({"ref" : `display?num=${i}`,
                        "number" : i, 'main' : "false"})
        }
    }
    //retourne la liste contenant les string des références des numéros de page ainsi que leur chiffre
    return lst
}

function getListForAnimal(name, timetable, isAnimal){
    var ret = []
    for (let item of timetable){
        if (isAnimal && item.animalName === name){
            ret.push(item)
        }
        if (!isAnimal && item.staffName === name){
            ret.push(item)
        }
    }
    return ret
}


function defineState(listTime){
    if (listTime.length >= 336){
        return ['bx bxs-check-circle','color:#29f40a']
    }
    return  ['bx bx-x-circle bx-tada','color:#fa0000']
}


function defineDate(listTime){
    var date = new Date()
    var count = date.getDay()
    const DayList = ["Dimanche","Lundi" , "Mardi" , "Mercredi" , "Jeudi", "Vendredi" , "Samedi" ]  
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            for (let halfHour = 0; halfHour < 60; halfHour+=30) {
                var hasNotHour = true
                var countItem = 0
                for (let index = 0; index < listTime.length; index++) {
                    countItem = index
                    if (listTime[index].day === DayList[(count+day)%7] && listTime[index].time === modifHelp.formatHourString([hour,halfHour])){
                        hasNotHour = false
                        break;
                    }
                }
                listTime.splice(1, countItem)
                if (hasNotHour){
                    var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + day)
                    return `${DayList[(count+day)%7]} ${newDate.getDate()}`
                }
            }
        }
    }
    return "Complet"
}

function defineNameLink(name){
    return `/modif/animalmodif?name=${name}`
}

function formatRenderObjects(doc, timetable){
    var ret = []
    for (let index = 0; index < doc.length; index++) {
        var name = doc[index].name
        var nameLink = defineNameLink(name)
        var listTime = getListForAnimal(name, timetable, true)
        var temp = defineState(listTime)
        var element = temp[0]
        var color = temp[1]
        var date = defineDate(listTime)
        ret.push({status1 : element, status2 : color,  nameLink : nameLink, name : name, date : date})
    }
    return ret
}

function returnPages(doc,req, timetable){
    /**
     * @pre : doc : la liste des animaux (triés ou non)
     * @pre : req : la variable permettant de déterminer les requêtes ayant été faites (notamment le numéro de page)
     * @pre : sortpages : l'ordre de tri (par défaut : pas de tri)
     * @post : retourne un objet json pour pouvoir remplir la template associée
     */ 
    num = get_num(doc,length,parseInt(req.query.num))  // retourne la liste des numéros de page avec les bons liens
    num_page = calc_pagenum(doc,length)   // calcule le nombre de numéros de page
    doc = doc.slice((req.query.num-1)*length,(req.query.num-1)*length+length)   //prend les éléments de [numéro_page: numéro_page+length_claims]  => affiche seulement 1 page (nombre incident arbitraire) et pas toute base données
    doc = formatRenderObjects(doc, timetable)
    return {     //retourne l'objet pour remplir la template
        "cat" : req.session.cat,
        "sort" : req.session.sort,
        "list" : doc,
        "numlist" : num,
        "Mode" : req.session.theme,
        "imageMode" : req.session.theme + ".jpg"
    }
}


module.exports = {
    "returnPages" : returnPages,
    "get_num" : get_num,
    "calc_pagenum" : calc_pagenum
}