var app=app || {};

app.userInfosHeaderRender=function(){
  $('.home-pseudo').html(ucfirst(app.pseudo_utilisateur));
  $('.home-pseudo').css("borderColor","#"+app.getColor(ucfirst(app.pseudo_utilisateur)));
}

app.userConfigRenderForm=function(){
 if(!app.userConfig.matiere){
  app.userConfig.matiere=-1;
}
app.titleRender("Mon compte");
document.getElementById('user_mail').value = app.userConfig.mail||"";
document.getElementById('user_prenom').value = app.userConfig.prenom||"";
document.getElementById('user_nom').value = app.userConfig.nom||"";
document.getElementById('user_old_passe').value ="";
document.getElementById('user_new_passe').value ="";
document.getElementById('user_new_passe_bis').value = "";
$('.config_pseudo').html(ucfirst(app.pseudo_utilisateur));
jdenticon.update("#config_avatar", app.pseudo_utilisateur);
jdenticon.update("#user-mobile-toolbar-avatar", app.pseudo_utilisateur);

document.getElementById('config_pseudo').style.borderColor="#"+app.getColor(ucfirst(app.pseudo_utilisateur));
}
