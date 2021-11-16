function loadUpnav(){
   $("#upnav").load("/upnav_site")
}

function displayTable() {  
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
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
  xhttp.open("GET", `/modif/loadImage?animal=${isAnimal}&name=${name}`, true);
  xhttp.send();
}


function loadDescription(){
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
  xhttp.open("GET", `/modif/loadDescription?animal=${isAnimal}&name=${name}`, true);
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
  var name =  document.getElementById("name").value
  if (!name){   //aucun nom
    alert("Pas d'employé/animal sélectionné")
    return false
  }
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