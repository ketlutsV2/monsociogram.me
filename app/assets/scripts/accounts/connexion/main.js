var app=app || {};

app.connexion=function(){
  app.pseudo_utilisateur=document.getElementById("user_pseudo").value;
  app.nom_etablissement=app.pseudo_utilisateur;

  if(app.nom_etablissement==""){
   app.alert({title:'Il faut indiquer un nom d\'utilisateur.'});
   app.connexionRender();
   return false;
 }

 $('.template').css('display','none');
 $('#splash-screen').css('display','');

 $.post(app.serveur + "index.php?go=users&q=sessionInit",
 {   
  nom_etablissement:app.nom_etablissement,
  pseudo_utilisateur:app.pseudo_utilisateur,
  pass_utilisateur:document.getElementById("user_passe").value
}, function(data) {
  app.render(data);  
  if(app.sessionID==null){
   app.connexionRender();
   $('.connexion-btn').button('reset');
 }
 
}
);
};


app.checkConnection=function() {
 if (!app.isConnected) {
   app.alert({title:'Vous devez être connecté pour effectuer cette action.'});
   return false;
 }
 return true;
}


app.connexionValidForm=function(){
 if(app.connexionFormMode=="connexion"){
  app.connexion();
}else{
  app.createAccount();
}
}