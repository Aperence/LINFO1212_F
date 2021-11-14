function loadUpnav(){
   $("#upnav").load("upnav_site")
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
   document.getElementById("table").innerHTML = `<input type="hidden" id = "nameModif" name = "nameModif" value= ${name}>
                                                 <input type="hidden" id = "isAnimalModif" name = "isAnimalModif" value= ${isAnimal}>
                                                  <input type='submit' class='submitButton'></input>`
   var day = document.getElementById("dateSelection").value.split("/")[3]
   var date = document.getElementById("dateSelection").value.split("/").slice(0,3).reverse().join("/")   // continuer
   console.log(date)
   console.log(day)
   xhttp.open("GET", `/modif/loadTimeTable?animal=${isAnimal}&name=${name}&date=${date}&day=${day}`, true);
   xhttp.send();
}