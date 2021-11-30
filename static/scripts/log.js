function loadError(){
    /**
     * @pre : #error : le message d'erreur envoyé par serveur.js
     * @post : envoie le message d'erreur
     */
    var erreur = $('#error').val()
    console.log(erreur);
    if (erreur){
        setTimeout(()=>{alert(erreur)},400)
        
    }
}

function printheure(){
    var startHour = document.getElementById("startHour").value;
    var endHour = document.getElementById("endHour").value;
    var heureDebut = startHour%1*60;
    startHour-=startHour%1;
    if (startHour < 10){
        startHour = "0" + startHour.toString();
    }
    if (heureDebut == 0){
        heureDebut = heureDebut.toString() + "0";
    }
    var heureFin = endHour%1*60
    endHour-=endHour%1;
    if (endHour < 10){
        endHour = "0" + endHour.toString();
    }
    if (heureFin == 0){
        heureFin = heureFin.toString() + "0";
    }
    document.getElementById("horaire").innerHTML = "&nbsp&nbsp&nbspde&nbsp&nbsp&nbsp" + startHour + ":" + heureDebut + "&nbsp&nbsp&nbspà&nbsp&nbsp&nbsp" + endHour + ":" + heureFin;
}

function checkmdp(){
    /**
     * @pre : inscmdp et confmdp : les deux mots de passe entrés par l'utilisateur
     * @post : vérifie que les deux mots de passe sont identiques
     */
    const inscmdp = document.querySelector('input[name=inscmdp]');
    const confmdp = document.querySelector('input[name=confmdp]');
    if (inscmdp.value === confmdp.value){
        confmdp.setCustomValidity('');
    } 
    else{
        confmdp.setCustomValidity('Mots de passe incorrects');
    }
}

function AfficherMDPInsc(){
    /**
     * @pre : -
     * @post : permet d'afficher le mot de passe quand on clique sur le bouton pour l'afficher (cadre d'inscription)
     */
    var me = document.getElementById("inscmdp");
    var mf = document.getElementById("confmdp");
    if (me.type === "text"){
        me.type = "password";
        mf.type = "password";
    }
    else{
        me.type = "text";
        mf.type = "text";
    }
}

function AfficherMDPConn(){
    var mv = document.getElementById("connmdp");
    if (mv.type === "text"){
        mv.type = "password";
    }
    else{
        mv.type = "text";
    }
}
