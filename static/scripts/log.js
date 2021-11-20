function loadError(){
    /**
     * @pre : #error : le message d'erreur envoyé par serveur.js
     * @post : envoie le message d'erreur
     */
    var erreur = $('#error').val()
    console.log(erreur);
    if (erreur){
        alert(erreur)
    }
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
