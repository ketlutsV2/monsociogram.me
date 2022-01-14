var app=app || {};

app.createAccount=function(){
  
  var pseudo=document.getElementById("user_pseudo").value;
  var password_1=document.getElementById("user_passe").value;
  var password_2=document.getElementById("user_passe2").value;
  var etablissement=pseudo;
  var etablissement_password_1=password_1
  var etablissement_password_2=password_2
  var error=false;
  if(password_1=="" ||etablissement_password_1==""){
   app.alert({title:'Les mots de passe ne doivent pas être vides.'});
   error=true;
 }
 if(password_1!=password_2){
   app.alert({title:'Les mots de passe utilisateur sont différents.'});
   error=true;
 }
 if(pseudo==""){
   app.alert({title:'Il faut choisir un pseudo.'});
   error=true;
 }  
 if(error){
  $('.connexion-btn').button('reset');
  return;
}

$('.template').css('display','none');
$('#splash-screen').css('display','');

$.post(app.serveur + "index.php?go=users&q=create",{
  pseudo_utilisateur:pseudo,
  pass_utilisateur:password_1,
  nom_etablissement:etablissement,
  pass_etablissement:etablissement_password_1,
  create_account:true
}, function(data) {
  data=app.render(data);
  $('.connexion-btn').button('reset');
  if(data['statut']==true){   
   app.pluginsLauncher('createAccount');
   app.connexion();
 }else{
  $('#splash-screen').css('display','none');
  $(".template_connexion").css('display','block');
 }
}
);
}