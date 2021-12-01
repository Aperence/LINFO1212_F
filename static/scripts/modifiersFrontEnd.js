function loadUpnav(){
  /**
   * @pre : -
   * @post : charge la barre de navigation supérieure dans l'élément ayant l'id "upnav"
   */
   $("#upnav").load("/upnav_site")
}

function displayTable() {  
    /**
   * @pre : -
   * @post : charge le tableau dans l'élément ayant l'id "table" en faisant une requête AJAX.
   * Cette requête varie en fonction de : - si l'utilisateur est un administrateur ou non     => isAdmin
   *                                      - de l'animal ou employé sélectionné                => name
   *                                      - de la date sélectionnée et du jour                => date + day
   *                                      - de si l'individu est un animal ou un employé      => animal
   */
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
       if (!this.responseText){
          window.location = "https://localhost:8080";   //renvoie à la page principale si on ne trouve pas d'animal/employee
       }
       document.getElementById("table").innerHTML = this.responseText + document.getElementById("table").innerHTML;
     }
   };
   var name =  document.getElementById("name").value
   var isAnimal = document.getElementById("isAnimal").value
   var isAdmin = document.getElementById("isAdmin").value === "true" ? "<input type='submit' class='submitButton'></input>" : ""
   document.getElementById("table").innerHTML = `<input type="hidden" id = "nameModif" name = "nameModif" value= ${name}>
                                                 <input type="hidden" id = "isAnimalModif" name = "isAnimalModif" value= ${isAnimal}>
                                                  ${isAdmin}`
   var day = document.getElementById("dateSelection").value.split("/")[3]
   var date = document.getElementById("dateSelection").value.split("/").slice(0,3).reverse().join("/")   // continuer
   xhttp.open("GET", `/modif/loadTimeTable?animal=${isAnimal}&name=${name}&date=${date}&day=${day}`, true);
   xhttp.send();
}


function loadImage(){
  /**
   * @pre : -
   * @post : charge l'image de profil de l'animal ou l'employé en faisant une requête AJAX au serveur
   */
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      document.getElementById("picture").setAttribute("src", this.responseText || "")
      if (!this.responseText){
        document.getElementById("picture").style.margin = "0px"
        $("#picture").hide()
      }
  }
  };
  var name =  document.getElementById("name").value
  var isAnimal = document.getElementById("isAnimal").value
  var tableName = isAnimal === "true" ? "animal" : "employee"
  xhttp.open("GET", `/modif/loadImage?tableName=${tableName}&name=${name}`, true);
  xhttp.send();
}


function loadDescription(){
   /**
   * @pre : -
   * @post : charge la description de l'animal ou l'employé en faisant une requête AJAX au serveur
   */
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
      document.getElementById("description").innerHTML = this.responseText || ""
      if (!this.responseText){
        $("#description").hide()
      }
  }
  };
  var name =  document.getElementById("name").value
  var isAnimal = document.getElementById("isAnimal").value
  var tableName = isAnimal === "true" ? "animal" : "employee"
  xhttp.open("GET", `/modif/loadDescription?tableName=${tableName}&name=${name}`, true);
  xhttp.send();
}

function formatHourString(HourArray){
  /**
   * @pre : HourArray : un array représentant des heures suivant le format [heure, demi-heure] avec heure appartient à [0,23] 
   * et demi-heure appartient à {0, 30}
   * @post : retourne une heure sous le format de string "HH:MM" HH qui est une heure appartenant à [0,23] et MM, 
   * une demi-heure appartienant à {0, 30}
   * exemple : HourArray = [9 , 0]  => "09:00"
   */
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

function checkValidInput(){
  /**
   * @pre : -
   * @post : vérifie que le form voulant être soumis contient toutes les infos nécessaires : 
   *  - avoir un animal ou une personne sélectionnée pour la modification
   *  - si une heure a été remplie, il faut qu'à la fois la tâche et la personne en charge (ou l'animal dont il faut s'occuper)
   *    soit sélectionné
   * Retourne faux si ces deux conditions ne sont pas remplies, vrai sinon
   */
  for (let hour = 0 ; hour<24; hour++){
    for (let halfhour=0; halfhour<2; halfhour++){
      hourStr = formatHourString([hour,halfhour*30])
      employeeAnimalSelection = document.getElementById("nameSelection"+hourStr).value

      var taskSelection = document.getElementById("taskList"+hourStr);
      var taskOption = taskSelection.options[taskSelection.selectedIndex].text;   // prend l'élément sélectionné grâce à son index
      if((employeeAnimalSelection && !taskOption) || (!employeeAnimalSelection && taskOption)){    //un seul champ parmis les deux
        alert("Veuillez renseigner les deux champs pour l'heure suivant : "+hourStr)
        return false
      }
    }
  }
  return true
}