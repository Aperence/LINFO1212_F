function loadUpnav(){
   $("#upnav").load("upnav_site")
}

function displayTable() {  
   var xhttp = new XMLHttpRequest();
   document.getElementById("table").innerHTML = "<input type='submit' class='submitButton'></input>"
   xhttp.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
       document.getElementById("table").innerHTML = this.responseText + document.getElementById("table").innerHTML;
     }
   };
   var name =  document.getElementById("name").value
   var isAnimal = document.getElementById("isAnimal").value
   var day = document.getElementById("dateSelection").value.split("/")[3]
   var date = document.getElementById("dateSelection").value.split("/").slice(0,3).reverse().join("/")   // continuer
   console.log(date)
   console.log(day)
   xhttp.open("GET", `/modif/loadTimeTable?animal=${isAnimal}&name=${name}&date=${date}&day=${day}`, true);
   xhttp.send();
}