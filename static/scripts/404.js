function loadPage(){
    /**
     * @pre : -
     * @post : charge le bouton de suppression de la barre de recherche et les 3 points qui avance toutes les secondes
     */
    document.getElementById("search").addEventListener("keyup",()=>{
        if (!this.value){
            document.getElementById("suppress").style.visibility = "visible"
        }else{
            document.getElementById("suppress").style.visibility = "hidden"
        }
    })

    var point1 = document.querySelector("#point1")
    var point2 = document.querySelector("#point2")
    var point3 = document.querySelector("#point3")
    var count = 0

    if (document.getElementById("version").getAttribute("href")==="style/darkVersion.css"){
        document.getElementById("suppress").style.color = "white"
        document.getElementById("loupe").style.color = "white"
    }

    setInterval(()=>{
        if (count%3 === 0){
            point1.style.visibility = "visible"
            point2.style.visibility = "hidden"
            point3.style.visibility = "hidden"
        }else if (count%3 === 1){
            point2.style.visibility = "visible"
        }else{
            point3.style.visibility = "visible"
        }
        count++
    },1000)
}

function suppressValue(){
    document.getElementById("search").value = ""
    document.getElementById("suppress").style.visibility = "hidden"
}

function clickLoupe(){
    document.getElementById("form").submit()
}

