function renderTime(){
 
    // Date
  
    var date = new Date()
    var year = date.getFullYear();
      if (year < 1000){
         year += 1900
      }
    var day = date.getDay();
    var month = date.getMonth();
    var daym = date.getDate();
    var dayarray = new Array("Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi");
    var montharray = new Array("Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Décembre")
  
    // Time
  
    var currentTime = new Date();
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    var s = currentTime.getSeconds();
      if(h == 24){ 
        h = 0;
      } else if(h > 12){
        h = h - 0;
      }
  
      if (h < 10){
        h = "0" + h
      }
  
      if (m < 10){
        m = "0" + m
      }
  
      if (s < 10){
        s = "0" + s
      }
  
      var myClock = document.getElementById("clockDisplay")
      myClock.textContent = "" + dayarray[day] + " " + daym + " " + montharray[month] + " " + year + " | " + h + ":" + m + ":" + s;
      myClock.innerText = "" + dayarray[day] + " " + daym + " " + montharray[month] + " " + year + " | " + h + ":" + m + ":" + s;

    }

function loadTime(){
  renderTime()
  setInterval(()=>renderTime(), 1000)
}

function loadTableAnimalEmployee(){
  var select = document.getElementById("tableSelection")
  var option = select.options[select.selectedIndex].value
  window.location = `/schedule/animalSchedule?isAnimal=${option}&modifIsAnimal=true`
}

function rotate(){
  var cat = document.getElementById("cat").value
  var sort = document.getElementById("sort").value
  $("#"+cat).css('-webkit-transform',`rotate(${90*sort}deg)`); 
  $("#"+cat).css('-moz-transform',`rotate(${90*sort}deg)`);
  $("#"+cat).css('transform',`rotate(${90*sort}deg)`);
}

function changeSort(sort){
  if (document.getElementById("cat").value === sort){
    console.log(document.getElementById("cat").value)
    var sortOrder = parseInt(document.getElementById("sort").value)
    console.log((-sortOrder || 1))
    return window.location = "/schedule/changesort?cat=" + sort + `&sort=${(-sortOrder || 1)}`
  }
  window.location = "/schedule/changesort?cat=" + sort + "&sort=1" 
}
